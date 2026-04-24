import { useInViewToggle } from "./hooks/useInViewToggle";

type Tier = {
  name: string;
  note?: string;
  price: string;
  unit: string;
};

export default function PricingSection() {
  const { ref, inView } = useInViewToggle<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  });

  const mahasiswa: Tier[] = [
    { name: "Tugas", note: "tugas kuliah / assignment", price: "150", unit: "rb" },
    { name: "PP", note: "Program Profesional", price: "500", unit: "rb" },
    { name: "KP", note: "Kerja Praktik + laporan", price: "750", unit: "rb" },
    { name: "Skripsi", note: "bab 1 sampai sidang", price: "1", unit: "jt" },
  ];

  return (
    <section ref={ref} className="bg-black">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
        {/* Header */}
        <div
          className={[
            "max-w-3xl transition-all duration-700 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
        >
          <p className="text-sm tracking-[0.45em] uppercase text-white/60">
            Harga
          </p>
          <h2 className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            Transparan, menyesuaikan scope.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/75">
            Starting point di bawah. Harga final menyesuaikan kompleksitas,
            deadline, dan jumlah revisi — semua dikonfirmasi dulu lewat WA
            sebelum dikerjakan.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Mahasiswa — takes 2 columns */}
          <div
            className={[
              "rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-8 lg:col-span-2",
              "transition-all duration-700 ease-out",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            ].join(" ")}
            style={{ transitionDelay: inView ? "120ms" : "0ms" }}
          >
            <p className="text-xs tracking-[0.35em] uppercase text-white/60">
              Untuk Mahasiswa
            </p>
            <h3 className="mt-3 font-serif text-3xl tracking-tight">
              Skripsi · Tugas · KP · PP
            </h3>

            <ul className="mt-7 divide-y divide-white/10">
              {mahasiswa.map((t) => (
                <li
                  key={t.name}
                  className="flex items-baseline justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-base font-semibold text-white">
                      {t.name}
                    </p>
                    {t.note ? (
                      <p className="mt-1 text-sm text-white/55">{t.note}</p>
                    ) : null}
                  </div>
                  <p className="whitespace-nowrap text-sm text-white/55">
                    mulai{" "}
                    <span className="font-serif text-3xl text-white">
                      {t.price}
                    </span>
                    <span className="ml-0.5 text-sm text-white/80">
                      {t.unit}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan — highlighted */}
          <div
            className={[
              "relative flex flex-col rounded-2xl border border-white/25 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-7 sm:p-8",
              "transition-all duration-700 ease-out",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            ].join(" ")}
            style={{ transitionDelay: inView ? "240ms" : "0ms" }}
          >
            {/* Enterprise badge */}
            <span className="absolute -top-3 left-7 rounded-full border border-white/40 bg-black px-3 py-1 text-[10px] tracking-[0.25em] uppercase text-white">
              Enterprise
            </span>

            <p className="text-xs tracking-[0.35em] uppercase text-white/75">
              Untuk Perusahaan
            </p>
            <h3 className="mt-3 font-serif text-3xl tracking-tight">
              ERP &amp; Sistem Bisnis
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Website, aplikasi mobile, POS, inventory, CRM, dan sistem custom
              untuk operasional perusahaan.
            </p>

            <div className="mt-8">
              <p className="text-xs tracking-[0.25em] uppercase text-white/55">
                Mulai dari
              </p>
              <p className="mt-2 font-serif leading-none">
                <span className="text-6xl tracking-tight text-white">5</span>
                <span className="ml-1 text-2xl text-white/85">jt</span>
              </p>
            </div>

            <a
              href="https://wa.me/6282253092438"
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:border-white/60 hover:bg-white/10"
              style={{ marginTop: "2rem" }}
            >
              Diskusi project
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <p
          className={[
            "mt-10 text-sm text-white/50 transition-all duration-700 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
          style={{ transitionDelay: inView ? "360ms" : "0ms" }}
        >
          * Harga di atas adalah starting point. Final price akan disesuaikan
          dengan scope, timeline, dan revisi masing-masing project.
        </p>
      </div>
    </section>
  );
}
