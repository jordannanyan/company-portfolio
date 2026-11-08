// Request handler for the Bantu Tugas API. Kept separate from index.js so it can be
// exercised with a fake database in tests.
//
//   POST  /api/leads              public contact form -> MySQL (+ email notification)
//   GET   /api/health             liveness check
//   POST  /api/admin/login        { password } -> HttpOnly session cookie
//   POST  /api/admin/logout
//   GET   /api/admin/me           200 when logged in, 401 otherwise
//   GET   /api/admin/leads        latest leads (admin only)
//   PATCH /api/admin/leads/:id    { status } (admin only)
import crypto from "node:crypto";

export const SERVICES = [
  "Skripsi",
  "Kerja Praktik (KP)",
  "Program Profesional (PP)",
  "Tugas Kuliah",
  "Analisis Data",
  "Web / Mobile / ERP",
  "SEO & Optimasi Website",
  "Lainnya",
];
export const STATUSES = ["baru", "dihubungi", "deal", "batal"];

const MAX_BODY = 16 * 1024;
const COOKIE = "bt_admin";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

// ---------- helpers ----------
function limiter(limit, windowMs) {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [k, ts] of hits) if (ts.every((t) => now - t >= windowMs)) hits.delete(k);
  }, windowMs).unref();
  return {
    // Records a hit and reports whether the key is now over the limit.
    hit(key) {
      const now = Date.now();
      const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
      recent.push(now);
      hits.set(key, recent);
      return recent.length > limit;
    },
    blocked(key) {
      const now = Date.now();
      return (hits.get(key) || []).filter((t) => now - t < windowMs).length >= limit;
    },
    clear(key) {
      hits.delete(key);
    },
  };
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  });
  res.end(JSON.stringify(body));
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd) return fwd.split(",")[0].trim();
  return req.socket.remoteAddress || "";
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error("too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        reject(Object.assign(new Error("bad json"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

const str = (v) => (typeof v === "string" ? v.trim() : "");
const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest();

function parseCookies(header = "") {
  const out = {};
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function validate(input) {
  const errors = {};
  const name = str(input.name);
  const email = str(input.email);
  const service = str(input.service);
  const deadline = str(input.deadline);
  const message = str(input.message);
  // Normalise WhatsApp to digits, 08xx -> 628xx.
  let whatsapp = str(input.whatsapp).replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (whatsapp.startsWith("0")) whatsapp = "62" + whatsapp.slice(1);

  if (name.length < 2 || name.length > 100) errors.name = "Nama wajib diisi (2–100 karakter).";
  if (!/^62\d{8,13}$/.test(whatsapp)) errors.whatsapp = "Nomor WhatsApp tidak valid.";
  if (email && (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
    errors.email = "Format email tidak valid.";
  if (!SERVICES.includes(service)) errors.service = "Pilih jenis layanan.";
  if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) errors.deadline = "Tanggal tidak valid.";
  if (message.length < 10 || message.length > 3000)
    errors.message = "Ceritakan kebutuhanmu (10–3000 karakter).";

  return {
    errors,
    data: { name, whatsapp, email: email || null, service, deadline: deadline || null, message },
  };
}

// ---------- handler ----------
/**
 * @param {object} o
 * @param {{ query: Function, execute: Function }} o.db   mysql2 pool (or a fake)
 * @param {(lead: object) => Promise<void> | null} [o.notify]  called after a lead is stored
 * @param {string} [o.adminPassword]  admin area is disabled when empty
 * @param {string} [o.sessionSecret]  HMAC key for session cookies (derived from the password if empty)
 * @param {boolean} [o.secureCookie]
 */
export function createHandler({ db, notify = null, adminPassword = "", sessionSecret = "", secureCookie = true }) {
  const leadLimit = limiter(5, 10 * 60 * 1000); // 5 submissions / IP / 10 min
  const loginLimit = limiter(10, 15 * 60 * 1000); // 10 failed logins / IP / 15 min
  const secret = sessionSecret || (adminPassword ? sha256("bt-session:" + adminPassword).toString("hex") : "");

  const sign = (exp) => crypto.createHmac("sha256", secret).update(`admin.${exp}`).digest("base64url");
  const makeToken = () => {
    const exp = Date.now() + SESSION_MS;
    return `${exp}.${sign(exp)}`;
  };
  const validToken = (token) => {
    if (!secret || typeof token !== "string") return false;
    const [exp, sig] = token.split(".");
    if (!exp || !sig || !(Number(exp) > Date.now())) return false;
    const a = Buffer.from(sig);
    const b = Buffer.from(sign(exp));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  };
  const cookie = (value, maxAgeSec) =>
    `${COOKIE}=${value}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSec}` +
    (secureCookie ? "; Secure" : "");
  const isAdmin = (req) => validToken(parseCookies(req.headers.cookie)[COOKIE]);

  async function handleLead(req, res) {
    const ip = clientIp(req);
    if (leadLimit.hit(ip)) {
      return send(res, 429, { ok: false, error: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi." });
    }
    let body;
    try {
      body = await readJson(req);
    } catch (err) {
      return send(res, err.status || 400, { ok: false, error: "Permintaan tidak valid." });
    }
    // Honeypot: real users never fill the hidden "website" field.
    if (str(body.website)) return send(res, 200, { ok: true });

    const { errors, data } = validate(body);
    if (Object.keys(errors).length) return send(res, 422, { ok: false, errors });

    let id;
    try {
      const ua = String(req.headers["user-agent"] || "").slice(0, 255);
      const [result] = await db.execute(
        `INSERT INTO leads (name, whatsapp, email, service, deadline, message, ip, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.name, data.whatsapp, data.email, data.service, data.deadline, data.message, ip, ua]
      );
      id = result.insertId;
      console.log(`lead #${id} from ${ip} (${data.service})`);
    } catch (err) {
      console.error("insert failed:", err.message);
      return send(res, 500, { ok: false, error: "Gagal menyimpan. Silakan hubungi kami via WhatsApp." });
    }
    send(res, 201, { ok: true, id });

    // Notify after responding so a slow or failing mail server never affects the visitor.
    if (notify) {
      Promise.resolve()
        .then(() => notify({ id, ...data, createdAt: new Date() }))
        .then(() => console.log(`lead #${id}: email sent`))
        .catch((err) => console.error(`lead #${id}: email failed:`, err.message));
    }
  }

  async function handleAdmin(req, res, path) {
    if (!adminPassword) return send(res, 503, { ok: false, error: "Halaman admin belum dikonfigurasi." });

    if (path === "/api/admin/login") {
      if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });
      const ip = clientIp(req);
      if (loginLimit.blocked(ip)) {
        return send(res, 429, { ok: false, error: "Terlalu banyak percobaan. Coba lagi 15 menit lagi." });
      }
      let body;
      try {
        body = await readJson(req);
      } catch (err) {
        return send(res, err.status || 400, { ok: false, error: "Permintaan tidak valid." });
      }
      const ok = crypto.timingSafeEqual(sha256(str(body.password)), sha256(adminPassword));
      if (!ok) {
        loginLimit.hit(ip);
        console.warn(`admin login failed from ${ip}`);
        return send(res, 401, { ok: false, error: "Password salah." });
      }
      loginLimit.clear(ip);
      return send(res, 200, { ok: true }, { "Set-Cookie": cookie(makeToken(), SESSION_MS / 1000) });
    }

    if (path === "/api/admin/logout") {
      if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });
      return send(res, 200, { ok: true }, { "Set-Cookie": cookie("", 0) });
    }

    if (!isAdmin(req)) return send(res, 401, { ok: false, error: "Silakan login." });

    if (path === "/api/admin/me" && req.method === "GET") return send(res, 200, { ok: true });

    if (path === "/api/admin/leads" && req.method === "GET") {
      const [rows] = await db.query(
        `SELECT id, UNIX_TIMESTAMP(created_at) AS ts, name, whatsapp, email, service,
                DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline, message, status
           FROM leads ORDER BY id DESC LIMIT 1000`
      );
      return send(res, 200, { ok: true, leads: rows.map((r) => ({ ...r, ts: Number(r.ts) })) });
    }

    const m = path.match(/^\/api\/admin\/leads\/(\d+)$/);
    if (m && req.method === "PATCH") {
      let body;
      try {
        body = await readJson(req);
      } catch (err) {
        return send(res, err.status || 400, { ok: false, error: "Permintaan tidak valid." });
      }
      const status = str(body.status);
      if (!STATUSES.includes(status)) return send(res, 422, { ok: false, error: "Status tidak valid." });
      const [result] = await db.execute("UPDATE leads SET status = ? WHERE id = ?", [status, Number(m[1])]);
      if (!result.affectedRows) return send(res, 404, { ok: false, error: "Lead tidak ditemukan." });
      return send(res, 200, { ok: true });
    }

    return send(res, 404, { ok: false, error: "Not found" });
  }

  return async function handler(req, res) {
    const path = new URL(req.url || "/", "http://localhost").pathname;
    try {
      if (req.method === "GET" && path === "/api/health") {
        try {
          await db.query("SELECT 1");
          return send(res, 200, { ok: true });
        } catch {
          return send(res, 503, { ok: false });
        }
      }
      if (path === "/api/leads") {
        if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });
        return await handleLead(req, res);
      }
      if (path.startsWith("/api/admin/")) return await handleAdmin(req, res, path);
      return send(res, 404, { ok: false, error: "Not found" });
    } catch (err) {
      console.error("request failed:", err.message);
      if (!res.headersSent) send(res, 500, { ok: false, error: "Terjadi kesalahan server." });
    }
  };
}
