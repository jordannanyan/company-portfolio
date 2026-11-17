import { useInViewToggle } from "./hooks/useInViewToggle";

const STEPS = [
  {
    title: "Konsultasi gratis",
    body: "Ceritakan kebutuhanmu lewat form atau WhatsApp — tugas, skripsi, atau sistem untuk bisnis. Dibalas dalam 1x12 jam.",
  },
  {
    title: "Scope & harga jelas",
    body: "Kami jelaskan apa yang dikerjakan, estimasi harga, dan timeline. Pekerjaan dimulai setelah semuanya disepakati.",
  },
  {
    title: "Dikerjakan & dipantau",
    body: "Progres dikabarkan berkala, jadi kamu tahu posisinya kapan saja — bukan cuma di akhir.",
  },
  {
    title: "Selesai & serah terima",
    body: "Hasil rapi sesuai format kampus atau kebutuhan bisnismu, plus pendampingan sampai kamu siap memakainya.",
  },
];

export default function ProcessSection() {
  const { ref, inView } = useInViewToggle<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
      <div className={["transition-all duration-700 ease-out", inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"].join(" ")}>
        <p className="text-sm tracking-[0.45em] uppercase text-white/60">Cara kerja</p>
        <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          Jelas dari awal, tenang sampai selesai.
        </h2>
      </div>

      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={[
              "relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-700 ease-out",
              inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            ].join(" ")}
            style={{ transitionDelay: inView ? `${120 + i * 90}ms` : "0ms" }}
          >
            <span className="font-serif text-4xl text-amber-200/90">0{i + 1}</span>
            <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
