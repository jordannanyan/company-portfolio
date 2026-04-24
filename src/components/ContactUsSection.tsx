import { useInViewToggle } from "./hooks/useInViewToggle";
import ArrowUpRightIcon from "./ArrowUpRightIcon";

export default function ContactUsSection() {
  const { ref, inView } = useInViewToggle<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <section ref={ref} className="bg-white">
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
            <p className="text-sm tracking-[0.45em] uppercase text-black/55">Contact</p>
            <h2 className="mt-5 font-serif text-6xl sm:text-7xl leading-[0.95] tracking-tight text-black">
              Konsultasi dulu?
            </h2>
            <p className="mt-7 text-lg sm:text-xl leading-relaxed text-black/70">
              Cerita dulu soal tugas, skripsi, atau project webmu — konsultasi
              gratis, harga menyesuaikan scope. Balas cepat lewat WhatsApp,
              portofolio &amp; update bisa dicek di Instagram.
            </p>
          </div>

          {/* Right cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* WhatsApp — black accent card */}
            <a
              href="https://wa.me/6282253092438"
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-black bg-black p-6 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.35em] uppercase text-white/70">WhatsApp</p>
                  <p className="mt-3 text-xl font-semibold text-white">
                    +62 822-5309-2438
                  </p>
                  <p className="mt-3 text-sm text-white/70">
                    Chat langsung buat konsultasi &amp; booking pengerjaan.
                  </p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 transition-all duration-300 group-hover:border-white/60 group-hover:bg-white">
                  <ArrowUpRightIcon className="h-5 w-5 text-white transition-all duration-300 group-hover:text-black group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" />
                </span>
              </div>
            </a>

            {/* Instagram — light card */}
            <a
              href="https://instagram.com/webdevpky"
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-black/15 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-black/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.35em] uppercase text-black/55">Instagram</p>
                  <p className="mt-3 text-xl font-semibold text-black">
                    @webdevpky
                  </p>
                  <p className="mt-3 text-sm text-black/70">
                    DM buat lihat portofolio, testimoni, dan update project.
                  </p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/20 transition-all duration-300 group-hover:border-black/50 group-hover:bg-black">
                  <ArrowUpRightIcon className="h-5 w-5 text-black transition-all duration-300 group-hover:text-white group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" />
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-14 border-t border-black/10" />
        <p className="mt-6 text-xs tracking-[0.25em] uppercase text-black/45">
          Konsultasi via WhatsApp &amp; Instagram
        </p>
      </div>
    </section>
  );
}
