import { useState, type FormEvent } from "react";

const SERVICES = [
  "Skripsi",
  "Kerja Praktik (KP)",
  "Program Profesional (PP)",
  "Tugas Kuliah",
  "Analisis Data",
  "Web / Mobile / ERP",
  "SEO & Optimasi Website",
  "Lainnya",
] as const;

type Field = "name" | "whatsapp" | "email" | "service" | "deadline" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const inputCls =
  "mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-white/50 focus:bg-black/60";
const labelCls = "block text-xs tracking-[0.25em] uppercase text-white/60";

function validate(f: FormData): Errors {
  const e: Errors = {};
  const get = (k: string) => String(f.get(k) ?? "").trim();
  if (get("name").length < 2) e.name = "Nama wajib diisi.";
  const wa = get("whatsapp").replace(/[^\d]/g, "");
  if (wa.length < 9 || wa.length > 15) e.whatsapp = "Nomor WhatsApp tidak valid.";
  const email = get("email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Format email tidak valid.";
  if (!get("service")) e.service = "Pilih jenis layanan.";
  if (get("message").length < 10) e.message = "Ceritakan kebutuhanmu (min. 10 karakter).";
  return e;
}

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);
    const clientErrors = validate(data);
    setErrors(clientErrors);
    setServerError("");
    if (Object.keys(clientErrors).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        form.reset();
        setStatus("sent");
        return;
      }
      if (json.errors) setErrors(json.errors);
      setServerError(json.error || "Gagal mengirim. Coba lagi atau hubungi kami via WhatsApp.");
      setStatus("error");
    } catch {
      setServerError("Koneksi bermasalah. Coba lagi atau hubungi kami via WhatsApp.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/5 p-8 sm:p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FFC83D] text-black">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h3 className="mt-6 font-serif text-3xl sm:text-4xl tracking-tight">Terima kasih!</h3>
        <p className="mt-4 text-white/75 leading-relaxed">
          Pesanmu sudah kami terima. Tim kami akan membalas lewat WhatsApp
          dalam <span className="font-semibold text-white">1x12 jam</span>.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm tracking-[0.2em] uppercase text-white/60 underline-offset-4 hover:text-white hover:underline"
        >
          Kirim pesan lain
        </button>
      </div>
    );
  }

  const err = (k: Field) =>
    errors[k] ? <p className="mt-2 text-sm text-red-400">{errors[k]}</p> : null;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.35em] uppercase text-white/60">Form Konsultasi</p>
          <h3 className="mt-3 font-serif text-3xl sm:text-4xl tracking-tight">
            Ceritakan kebutuhanmu
          </h3>
        </div>
        <p className="inline-flex items-center gap-2 self-start rounded-full border border-[#FFC83D]/40 bg-[#FFC83D]/10 px-4 py-2 text-sm text-[#FFC83D] sm:self-auto">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          Dibalas dalam 1x12 jam
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Nama *</span>
          <input name="name" autoComplete="name" maxLength={100} placeholder="Nama lengkap" className={inputCls} aria-invalid={!!errors.name} />
          {err("name")}
        </label>

        <label className="block">
          <span className={labelCls}>No. WhatsApp *</span>
          <input name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="08xx-xxxx-xxxx" className={inputCls} aria-invalid={!!errors.whatsapp} />
          {err("whatsapp")}
        </label>

        <label className="block">
          <span className={labelCls}>Email (opsional)</span>
          <input name="email" type="email" autoComplete="email" maxLength={150} placeholder="nama@email.com" className={inputCls} aria-invalid={!!errors.email} />
          {err("email")}
        </label>

        <label className="block">
          <span className={labelCls}>Layanan *</span>
          <select name="service" required defaultValue="" className={inputCls + " appearance-none invalid:text-white/35"} aria-invalid={!!errors.service}>
            <option value="" disabled>Pilih layanan</option>
            {SERVICES.map((s) => (
              <option key={s} value={s} className="bg-neutral-900 text-white">{s}</option>
            ))}
          </select>
          {err("service")}
        </label>

        <label className="block sm:col-span-2">
          <span className={labelCls}>Deadline (opsional)</span>
          <input name="deadline" type="date" className={inputCls + " [color-scheme:dark] sm:max-w-xs"} aria-invalid={!!errors.deadline} />
          {err("deadline")}
        </label>

        <label className="block sm:col-span-2">
          <span className={labelCls}>Detail kebutuhan *</span>
          <textarea
            name="message"
            rows={5}
            maxLength={3000}
            placeholder="Contoh: Skripsi Manajemen bab 4–5, olah data SPSS, kampus UPR, target sidang bulan depan."
            className={inputCls + " resize-y"}
            aria-invalid={!!errors.message}
          />
          {err("message")}
        </label>

        {/* Honeypot — hidden from humans, bots tend to fill it. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      </div>

      {serverError && (
        <p role="alert" className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/55">
          Data hanya dipakai untuk menghubungimu soal konsultasi ini.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold tracking-[0.15em] uppercase text-black transition hover:bg-[#FFC83D] disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? "Mengirim…" : "Kirim"}
        </button>
      </div>
    </form>
  );
}
