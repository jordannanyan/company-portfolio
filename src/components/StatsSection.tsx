import { useEffect, useRef, useState } from "react";
import { useInViewToggle } from "./hooks/useInViewToggle";

type Stat = {
  value: string;
  numeric?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  caption: string;
};

function AnimatedNumber({
  target,
  inView,
  prefix = "",
  suffix = "",
  duration = 1400,
}: {
  target: number;
  inView: boolean;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const { ref, inView } = useInViewToggle<HTMLDivElement>({
    threshold: 0.25,
    rootMargin: "0px 0px -10% 0px",
  });

  const stats: Stat[] = [
    {
      value: "20+",
      numeric: 20,
      suffix: "+",
      label: "Mahasiswa lulus",
      caption: "Sudah lebih dari 20 mahasiswa yang dibantu sampai sidang.",
    },
    {
      value: "5+",
      numeric: 5,
      suffix: "+",
      label: "Lulus Cumlaude",
      caption: "Dari yang lulus, lebih dari 5 di antaranya dengan predikat cumlaude.",
    },
    {
      value: "30",
      numeric: 30,
      label: "Kerja Praktik",
      caption: "30 laporan KP dari berbagai jurusan sudah rampung.",
    },
    {
      value: "40",
      numeric: 40,
      label: "Program Profesional",
      caption: "40 PP dikerjakan sesuai format dan deadline kampus.",
    },
  ];

  const majors = ["Teknik", "Ekonomi & Bisnis", "FKIP"];

  return (
    <section ref={ref} className="relative bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
        {/* Header */}
        <div
          className={[
            "max-w-3xl transition-all duration-700 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
        >
          <p className="text-sm tracking-[0.45em] uppercase text-black/55">
            Track Record
          </p>
          <h2 className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-black">
            Angka yang bicara sendiri.
          </h2>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-black/70">
            Pengalaman lintas jurusan, hasil yang terbukti, dan ratusan revisi
            yang sudah dilalui bareng mahasiswa-mahasiswa ini.
          </p>
        </div>

        {/* Major pills */}
        <div
          className={[
            "mt-10 flex flex-wrap gap-3 transition-all duration-700 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
          style={{ transitionDelay: inView ? "120ms" : "0ms" }}
        >
          {majors.map((m) => (
            <span
              key={m}
              className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-black/80"
            >
              {m}
            </span>
          ))}
          <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/45">
            dan lainnya
          </span>
        </div>

        {/* Stats grid (black surface — bold secondary block) */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-black/15 bg-black/15 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, idx) => (
            <div
              key={s.label}
              className={[
                "group relative bg-black p-8 transition-all duration-700 ease-out",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
              ].join(" ")}
              style={{ transitionDelay: inView ? `${180 + idx * 90}ms` : "0ms" }}
            >
              <p className="font-serif text-6xl sm:text-7xl leading-none tracking-tight text-white">
                {s.numeric !== undefined ? (
                  <AnimatedNumber
                    target={s.numeric}
                    inView={inView}
                    prefix={s.prefix}
                    suffix={s.suffix}
                  />
                ) : (
                  s.value
                )}
              </p>
              <p className="mt-5 text-sm tracking-[0.3em] uppercase text-white/75">
                {s.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {s.caption}
              </p>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <p
          className={[
            "mt-10 text-sm text-black/55 transition-all duration-700 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
          style={{ transitionDelay: inView ? "540ms" : "0ms" }}
        >
          …dan masih lebih banyak lagi di tugas harian, quiz, serta project
          kuliah lainnya.
        </p>
      </div>
    </section>
  );
}
