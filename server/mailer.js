// Email notification for new leads, sent through SMTP (Gmail by default).
// Disabled (returns null) until SMTP_USER, SMTP_PASS and NOTIFY_EMAIL are set.
import nodemailer from "nodemailer";

const TZ = "Asia/Jakarta";
const fmt = (d) =>
  new Intl.DateTimeFormat("id-ID", { timeZone: TZ, dateStyle: "medium", timeStyle: "short" }).format(d) + " WIB";
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const oneLine = (s) => String(s ?? "").replace(/[\r\n]+/g, " ").slice(0, 80);

export function waLink(lead) {
  const text =
    `Halo ${lead.name}, terima kasih sudah menghubungi Bantu Tugas lewat website. ` +
    `Kami sudah membaca kebutuhan ${lead.service} kamu, boleh kami jelaskan langkah selanjutnya?`;
  return `https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function buildEmail(lead, adminUrl) {
  const due = new Date(lead.createdAt.getTime() + 12 * 60 * 60 * 1000);
  const rows = [
    ["Nama", esc(lead.name)],
    ["WhatsApp", `<a href="${esc(waLink(lead))}">+${esc(lead.whatsapp)}</a>`],
    ["Email", lead.email ? `<a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a>` : "–"],
    ["Layanan", esc(lead.service)],
    ["Deadline", esc(lead.deadline || "–")],
    ["Masuk", esc(fmt(lead.createdAt))],
    ["Balas sebelum", `<b>${esc(fmt(due))}</b>`],
  ];
  const html = `<!doctype html><html><body style="margin:0;background:#F4F3EF;font-family:Segoe UI,Roboto,Arial,sans-serif;color:#0B0B0F">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
  <div style="background:#0B0B0F;color:#FFC83D;border-radius:16px 16px 0 0;padding:18px 22px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:13px">
    Bantu Tugas · Lead baru #${lead.id}
  </div>
  <div style="background:#fff;border-radius:0 0 16px 16px;padding:22px">
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:7px 0;color:#6b6b73;width:130px;vertical-align:top">${k}</td><td style="padding:7px 0">${v}</td></tr>`
        )
        .join("")}
    </table>
    <div style="margin-top:14px;padding:14px 16px;background:#F4F3EF;border-radius:12px;font-size:15px;line-height:1.5;white-space:pre-wrap">${esc(lead.message)}</div>
    <div style="margin-top:20px">
      <a href="${esc(waLink(lead))}" style="display:inline-block;background:#FFC83D;color:#0B0B0F;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:999px;margin:0 8px 8px 0">Balas via WhatsApp</a>
      <a href="${esc(adminUrl)}" style="display:inline-block;background:#0B0B0F;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:999px;margin:0 0 8px">Buka Admin</a>
    </div>
  </div>
</div></body></html>`;
  const text = [
    `Lead baru #${lead.id}`,
    `Nama: ${lead.name}`,
    `WhatsApp: +${lead.whatsapp}`,
    `Email: ${lead.email || "-"}`,
    `Layanan: ${lead.service}`,
    `Deadline: ${lead.deadline || "-"}`,
    `Masuk: ${fmt(lead.createdAt)}`,
    `Balas sebelum: ${fmt(due)}`,
    "",
    lead.message,
    "",
    `Balas via WhatsApp: ${waLink(lead)}`,
    `Admin: ${adminUrl}`,
  ].join("\n");
  return {
    subject: `Lead baru #${lead.id} · ${oneLine(lead.service)} · ${oneLine(lead.name)}`,
    html,
    text,
  };
}

export function createNotifier(env = process.env) {
  const user = env.SMTP_USER;
  const pass = (env.SMTP_PASS || "").replace(/\s+/g, ""); // Gmail shows app passwords with spaces
  const to = env.NOTIFY_EMAIL;
  if (!user || !pass || !to) {
    console.log("email notification disabled (SMTP_USER / SMTP_PASS / NOTIFY_EMAIL not set)");
    return null;
  }
  const port = Number(env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  const adminUrl = env.ADMIN_URL || "https://bantutugas.site/admin/";
  console.log(`email notification on -> ${to}`);
  return async (lead) => {
    const { subject, html, text } = buildEmail(lead, adminUrl);
    await transport.sendMail({
      from: { name: "Bantu Tugas Web", address: user },
      to,
      replyTo: lead.email || undefined,
      subject,
      html,
      text,
    });
  };
}
