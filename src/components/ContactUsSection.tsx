import { useInViewToggle } from "./hooks/useInViewToggle";
import ArrowUpRightIcon from "./ArrowUpRightIcon";

export default function ContactUsSection() {
  const { ref, inView } = useInViewToggle<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <section ref={ref} className="bg-black">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div
          className={[
            "grid gap-10 lg:grid-cols-2 lg:items-end",
            "transition-all duration-700 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          ].join(" ")}
        >
          {/* Left copy */}
          <div className="max-w-xl">
            <p className="text-sm tracking-[0.45em] uppercase text-white/60">Contact</p>
            <h2 className="mt-5 font-serif text-6xl sm:text-7xl leading-[0.95] tracking-tight">
              Konsultasi dulu?
            </h2>
            <p className="mt-7 text-lg sm:text-xl leading-relaxed text-white/75">
              Cerita dulu soal tugas, skripsi, atau project webmu — konsultasi
              gratis, harga menyesuaikan scope. Balas cepat lewat WhatsApp.
            </p>
          </div>

          {/* Right card — WhatsApp only */}
          <div className="grid gap-4">
            <a
              href="https://wa.me/6282253092438"
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 transition-all duration-300 hover:border-white/35 hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.35em] uppercase text-white/60">WhatsApp</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    +62 822-5309-2438
                  </p>
                  <p className="mt-3 text-sm text-white/70">
                    Chat langsung buat konsultasi &amp; booking pengerjaan.
                    Biasanya dibalas dalam hari yang sama.
                  </p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-white/40">
                  <ArrowUpRightIcon className="h-5 w-5 text-white/90 transition-transform duration-300 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" />
                </span>
              </div>

              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.10),rgba(255,255,255,0.00))]" />
            </a>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-14 border-t border-white/10" />
        <p className="mt-6 text-xs tracking-[0.25em] uppercase text-white/50">
          Konsultasi via WhatsApp
        </p>
      </div>
    </section>
  );
}
