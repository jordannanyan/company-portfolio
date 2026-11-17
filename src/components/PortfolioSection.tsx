import { useEffect, useMemo, useState } from "react";
import { useInViewToggle } from "./hooks/useInViewToggle";
import {
  CASE_PHONES,
  CASE_SCREENS,
  CATEGORIES,
  PROJECTS,
  shot,
  shotSet,
  shotSm,
  type Category,
  type Project,
} from "../portfolioData";

const PORTFOLIO_PDF = "/portofolio-bantu-tugas.pdf";
const INITIAL = 6;

function Arrow({ dir = "right" }: { dir?: "left" | "right" | "up" }) {
  const d = dir === "left" ? "M15 18l-6-6 6-6" : dir === "right" ? "M9 6l6 6-6 6" : "M7 17L17 7M10 7h7v7";
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ----------------------------- featured case study ----------------------------- */
function CaseStudy() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  // rotate the screens until the visitor picks one
  useEffect(() => {
    if (touched) return;
    const t = window.setInterval(() => setActive((v) => (v + 1) % CASE_SCREENS.length), 4200);
    return () => window.clearInterval(t);
  }, [touched]);

  const metrics = [
    ["1 → 3", "Satu backend, tiga aplikasi"],
    ["49", "Tabel database"],
    ["487", "Lahan terpetakan"],
    ["17.399", "Pohon terdata"],
  ];

  return (
    <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02]">
      <div className="grid gap-0 lg:grid-cols-[7fr_5fr]">
        {/* screens */}
        <div className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="overflow-hidden rounded-xl border border-white/15 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              <span className="ml-3 truncate text-[11px] tracking-wider text-white/45">{CASE_SCREENS[active].label}</span>
            </div>
            <div className="relative aspect-[16/10] bg-white">
              {CASE_SCREENS.map((s, i) => (
                <img
                  key={s.id}
                  src={shot(s.id)}
                  srcSet={shotSet(s.id)}
                  sizes="(min-width: 1024px) 640px, 100vw"
                  alt={`Sistem traceability — ${s.label}`}
                  width={1400}
                  height={875}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className={[
                    "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700",
                    i === active ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label="Tampilan sistem">
            {CASE_SCREENS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => {
                  setActive(i);
                  setTouched(true);
                }}
                className={[
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-xs tracking-wide transition",
                  i === active
                    ? "border-amber-300/70 bg-amber-300/15 text-amber-200"
                    : "border-white/15 bg-white/[0.03] text-white/65 hover:border-white/35 hover:text-white",
                ].join(" ")}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* story */}
        <div className="flex min-w-0 flex-col border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <p className="text-xs tracking-[0.35em] uppercase text-amber-200/80">Studi kasus · Web + Mobile</p>
          <h3 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">Traceability rantai pasok agroforestri</h3>
          <p className="mt-2 text-sm text-white/50">Perusahaan agroforestri</p>
          <p className="mt-5 text-base leading-relaxed text-white/75">
            Dari pendataan petani di lapangan sampai rekonsiliasi pembayaran: procurement berjenjang, gudang,
            tiga skema kemitraan, bagi hasil, dan peta lahan — dipakai harian oleh tim operasional, admin
            lahan, dan petugas lapangan.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            {metrics.map(([v, k]) => (
              <div key={k} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <dt className="sr-only">{k}</dt>
                <dd className="font-serif text-2xl text-white">{v}</dd>
                <dd className="mt-0.5 text-xs text-white/55">{k}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex items-end gap-3">
            {CASE_PHONES.map((id, i) => (
              <div
                key={id}
                className={[
                  "w-1/3 overflow-hidden rounded-[18px] border-[3px] border-white/15 bg-black p-[3px] shadow-[0_14px_40px_rgba(0,0,0,0.5)]",
                  i === 1 ? "-translate-y-3" : "",
                ].join(" ")}
              >
                <img
                  src={shotSm(id)}
                  alt="Aplikasi mobile lapangan (offline-first)"
                  width={300}
                  height={633}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="block w-full rounded-[14px]"
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/45">Aplikasi mobile lapangan — tetap jalan tanpa sinyal, sinkron otomatis.</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Express + TypeScript", "React", "Flutter", "MySQL", "Leaflet GIS"].map((t) => (
              <span key={t} className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- lightbox ----------------------------- */
function Lightbox({ list, index, onClose, onMove }: { list: Project[]; index: number; onClose: () => void; onMove: (d: number) => void }) {
  const p = list[index];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onMove(1);
      else if (e.key === "ArrowLeft") onMove(-1);
      else return;
      e.stopPropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [onClose, onMove]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
    >
      <figure className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden rounded-xl border border-white/15 bg-white shadow-2xl">
          <img
            src={shot(p.id)}
            alt={`${p.title} — ${p.client}`}
            width={1400}
            height={875}
            className="block max-h-[70vh] w-full object-contain object-top"
          />
        </div>
        <figcaption className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-serif text-2xl text-white">{p.title}</p>
            <p className="mt-1 text-sm text-white/55">
              {p.client} · {p.stack}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">{p.desc}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-2 text-xs tracking-widest text-white/45">
              {index + 1} / {list.length}
            </span>
            <button type="button" onClick={() => onMove(-1)} aria-label="Project sebelumnya" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition hover:border-white/60">
              <Arrow dir="left" />
            </button>
            <button type="button" onClick={() => onMove(1)} aria-label="Project berikutnya" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition hover:border-white/60">
              <Arrow dir="right" />
            </button>
          </div>
        </figcaption>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute -top-3 -right-3 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black text-white transition hover:border-white/70 sm:-top-4 sm:-right-4"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </figure>
    </div>
  );
}

/* ----------------------------- section ----------------------------- */
export default function PortfolioSection() {
  const { ref, inView } = useInViewToggle<HTMLDivElement>({ threshold: 0.15 });
  const [cat, setCat] = useState<Category | "semua">("semua");
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  const list = useMemo(() => (cat === "semua" ? PROJECTS : PROJECTS.filter((p) => p.cat === cat)), [cat]);
  const visible = cat === "semua" && !showAll ? list.slice(0, INITIAL) : list;
  const catLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)?.label ?? "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
      {/* header */}
      <div
        ref={ref}
        className={[
          "grid gap-8 transition-all duration-700 ease-out lg:grid-cols-[1fr_auto] lg:items-end",
          inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        ].join(" ")}
      >
        <div className="max-w-3xl">
          <p className="text-sm tracking-[0.45em] uppercase text-white/60">Portofolio</p>
          <h2 className="mt-5 font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Sistem yang berjalan nyata.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            30+ aplikasi untuk instansi pemerintah, kampus, UMKM, dan perusahaan — dari website dan sistem
            informasi sampai ERP, aplikasi mobile, dan AI. Semua tangkapan layar diambil dari aplikasi yang
            benar-benar dipakai; data pribadi sudah disamarkan.
          </p>
        </div>
        <a
          href={PORTFOLIO_PDF}
          target="_blank"
          rel="noopener"
          className="inline-flex w-fit items-center gap-3 self-start justify-self-start rounded-full border border-white/25 bg-white/[0.04] px-5 py-3 text-sm tracking-wide text-white transition hover:border-white/60 hover:bg-white/10 lg:self-end lg:justify-self-end"
        >
          Portofolio lengkap (PDF)
          <Arrow dir="up" />
        </a>
      </div>

      <CaseStudy />

      {/* filters */}
      <div className="mt-16 flex flex-wrap gap-2" role="group" aria-label="Filter kategori project">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={cat === c.id}
            onClick={() => {
              setCat(c.id);
              setShowAll(false);
            }}
            className={[
              "rounded-full border px-4 py-2 text-sm transition",
              cat === c.id ? "border-white bg-white text-black" : "border-white/15 bg-white/[0.03] text-white/75 hover:border-white/40 hover:text-white",
            ].join(" ")}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* grid */}
      <div data-gallery className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpen(i)}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-white">
              <img
                src={shotSm(p.id)}
                srcSet={shotSet(p.id)}
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                alt={`${p.title} — ${p.client}`}
                width={720}
                height={450}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
            </div>
            <div className="p-5">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/50">{catLabel(p.cat)}</p>
              <p className="mt-2 font-serif text-xl leading-snug text-white">{p.title}</p>
              <p className="mt-1 text-sm text-white/55">{p.client}</p>
              <p className="mt-3 text-xs tracking-wide text-white/40">{p.stack}</p>
            </div>
          </button>
        ))}
      </div>

      {cat === "semua" && !showAll && list.length > INITIAL ? (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="rounded-full border border-white/25 px-6 py-3 text-sm tracking-wide text-white transition hover:border-white/60 hover:bg-white/5"
          >
            Lihat semua project ({list.length})
          </button>
        </div>
      ) : null}

      {open !== null ? (
        <Lightbox
          list={visible}
          index={open}
          onClose={() => setOpen(null)}
          onMove={(d) => setOpen((v) => (v === null ? v : (v + d + visible.length) % visible.length))}
        />
      ) : null}
    </div>
  );
}
