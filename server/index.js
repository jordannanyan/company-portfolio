// Bantu Tugas lead-capture API.
// POST /api/leads  -> validates the contact form and stores it in MySQL.
// GET  /api/health -> liveness check.
// Runs behind Apache (ProxyPass /api/ -> 127.0.0.1:PORT/api/).
import http from "node:http";
import mysql from "mysql2/promise";

const PORT = Number(process.env.PORT || 4200);
const MAX_BODY = 16 * 1024;

export const SERVICES = [
  "Skripsi",
  "Kerja Praktik (KP)",
  "Program Profesional (PP)",
  "Tugas Kuliah",
  "Analisis Data",
  "Web / Mobile / ERP",
  "Lainnya",
];

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
  dateStrings: true,
});

// Simple in-memory rate limit: 5 submissions per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, ts] of hits) {
    if (ts.every((t) => now - t >= WINDOW_MS)) hits.delete(ip);
  }
}, WINDOW_MS).unref();

function send(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");

  if (req.method === "GET" && url.pathname === "/api/health") {
    try {
      await pool.query("SELECT 1");
      return send(res, 200, { ok: true });
    } catch {
      return send(res, 503, { ok: false });
    }
  }

  if (url.pathname !== "/api/leads") return send(res, 404, { ok: false, error: "Not found" });
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });

  const ip = clientIp(req);
  if (rateLimited(ip)) {
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

  try {
    const ua = String(req.headers["user-agent"] || "").slice(0, 255);
    const [result] = await pool.execute(
      `INSERT INTO leads (name, whatsapp, email, service, deadline, message, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.name, data.whatsapp, data.email, data.service, data.deadline, data.message, ip, ua]
    );
    console.log(`lead #${result.insertId} from ${ip} (${data.service})`);
    return send(res, 201, { ok: true, id: result.insertId });
  } catch (err) {
    console.error("insert failed:", err.message);
    return send(res, 500, { ok: false, error: "Gagal menyimpan. Silakan hubungi kami via WhatsApp." });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`bantutugas-api listening on 127.0.0.1:${PORT}`);
});
