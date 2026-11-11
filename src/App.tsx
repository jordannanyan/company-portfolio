import { useEffect, useRef, useState, type CSSProperties } from "react";

import FeatureTriptych from "./components/FeatureTriptych";
import DiscoverMoreSection from "./components/DiscoverMoreSection";
import ContactUsSection from "./components/ContactUsSection";
import FooterSection from "./components/FooterSection";
import TopLogo from "./components/TopLogo";
import StatsSection from "./components/StatsSection";
import HeroIllustration from "./components/HeroIllustration";
import PricingSection from "./components/PricingSection";

/* ----------------------------- utils ----------------------------- */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
/** Per-element offset for the page-load intro (see index.css). */
function d(ms: number) {
  return { "--d": `${ms}ms` } as CSSProperties;
}
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Every animated value of the scroll intro for a given progress (0..1).
 * Used for the initial (server-rendered) styles and, on every animation frame,
 * written straight to the DOM — so the intro never re-renders the React tree.
 */
function introStyles(progress: number) {
  const e = easeInOutCubic(clamp(progress, 0, 1));
  const nav = clamp((e - 0.1) / 0.55, 0, 1);
  const title = clamp((e - 0.05) / 0.35, 0, 1);
  const inset = Math.round(lerp(56, 0, e));
  const navOpacity = lerp(1, 0, nav);
  return {
    // HERO frame -> full bleed
    frame: {
      top: inset, right: inset, bottom: inset, left: inset,
      borderRadius: Math.round(lerp(28, 0, e)),
      boxShadow: `0 30px 80px rgba(0,0,0,${lerp(0.35, 0, e)})`,
    },
    overlay: { opacity: lerp(0.45, 0.2, e) * 0.4 },
    // NAVBAR exit
    nav: {
      height: Math.round(lerp(64, 0, clamp((e - 0.12) / 0.55, 0, 1))),
      opacity: navOpacity,
      transform: `translateY(${lerp(0, -32, nav)}px)`,
      pointerEvents: (navOpacity < 0.1 ? "none" : "auto") as "none" | "auto",
    },
    // Title exit
    title: { opacity: lerp(1, 0, title), transform: `translateY(${lerp(0, -22, title)}px)` },
  };
}
const INTRO_START = introStyles(0);

/** Copies a style object onto an element, adding "px" to bare numbers. */
function applyStyle(el: HTMLElement | null, style: Record<string, string | number>) {
  if (!el) return;
  for (const [k, v] of Object.entries(style)) {
    (el.style as unknown as Record<string, string>)[k] = typeof v === "number" && k !== "opacity" ? `${v}px` : String(v);
  }
}

export default function App() {
  // progress 0..1, reversible — kept in a ref; visuals are written directly to these elements
  const [scrollUnlocked, setScrollUnlocked] = useState(false);
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const progressRef = useRef(0);
  const unlockedRef = useRef(false);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const mobileOpenRef = useRef(false);

  // programmatic scroll guard + pending nav target
  const programmaticScrollRef = useRef(false);
  const pendingScrollIdRef = useRef<string | null>(null);

  // mobile detection (coarse pointer / touch device)
  const isMobileRef = useRef(false);

  const setUnlocked = (v: boolean) => {
    unlockedRef.current = v;
    setScrollUnlocked(v);
  };

  // keep ref in sync so handlers in useEffect see latest value
  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  // body scroll lock + Esc to close mobile menu
  useEffect(() => {
    if (!mobileOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onEsc);
    };
  }, [mobileOpen]);

  const renderIntro = (progress: number) => {
    const s = introStyles(progress);
    applyStyle(heroFrameRef.current, s.frame);
    applyStyle(heroOverlayRef.current, s.overlay);
    applyStyle(heroTitleRef.current, s.title);
    applyStyle(navRef.current, s.nav);
  };

  // smoother (lebih enak di HP, tidak lompat)
  const animateToTarget = () => {
    if (rafRef.current) return;

    rafRef.current = window.requestAnimationFrame(function tick() {
      rafRef.current = null;

      const current = progressRef.current;
      const target = targetRef.current;

      // smoothing: lebih kecil = lebih lembut
      const smoothing = isMobileRef.current ? 0.14 : 0.11;
      const next = current + (target - current) * smoothing;

      progressRef.current = next;
      renderIntro(next);

      const near = Math.abs(target - next) < 0.002;
      if (!near) {
        rafRef.current = window.requestAnimationFrame(tick);
        return;
      }

      progressRef.current = target;
      renderIntro(target);

      if (target >= 1 && !unlockedRef.current) setUnlocked(true);
      if (target <= 0 && unlockedRef.current) setUnlocked(false);
    });
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return false;

    const offset = 96;
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);

    programmaticScrollRef.current = true;
    window.scrollTo({ top, behavior: "smooth" });

    window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 900);

    return true;
  };

  // lock/unlock scroll (apply to html + body)
  useEffect(() => {
    const html = document.documentElement;

    if (scrollUnlocked) {
      document.body.style.overflow = "";
      html.style.overflow = "";
      document.body.style.height = "";
      html.style.height = "";
    } else {
      document.body.style.overflow = "hidden";
      html.style.overflow = "hidden";
      document.body.style.height = "100%";
      html.style.height = "100%";
    }

    return () => {
      document.body.style.overflow = "";
      html.style.overflow = "";
      document.body.style.height = "";
      html.style.height = "";
    };
  }, [scrollUnlocked]);

  // detect mobile once
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => {
      isMobileRef.current =
        mq.matches || "ontouchstart" in window || navigator.maxTouchPoints > 0;
    };
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // after unlock: only scroll if user clicked nav while locked (pending target exists)
  useEffect(() => {
    if (!scrollUnlocked) return;
    if (!pendingScrollIdRef.current) return;

    const targetId = pendingScrollIdRef.current;
    pendingScrollIdRef.current = null;

    let tries = 0;
    const run = () => {
      tries += 1;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const ok = scrollToId(targetId);
          if (!ok && tries < 10) window.setTimeout(run, 80);
        });
      });
    };

    window.setTimeout(run, 60);
  }, [scrollUnlocked]);

  // input driving intro + reverse when at top and scrolling up
  useEffect(() => {
    const ensureAtTop = () => {
      if (window.scrollY !== 0) window.scrollTo({ top: 0 });
    };

    // One gesture plays the whole intro: scroll input only decides the DIRECTION.
    // Small deltas (trackpad, short swipes) are summed until they clearly mean
    // "down" or "up"; then the intro animates all the way to the end (or back),
    // with the same easing as before, instead of needing several scrolls.
    let intent = 0;
    let intentTimer: number | undefined;
    const addDelta = (deltaY: number) => {
      intent += deltaY;
      window.clearTimeout(intentTimer);
      intentTimer = window.setTimeout(() => (intent = 0), 220);

      const threshold = isMobileRef.current ? 24 : 12; // touch deltas are px x2 (see onTouchMove)
      if (intent >= threshold) {
        targetRef.current = 1;
        intent = 0;
      } else if (intent <= -threshold) {
        targetRef.current = 0;
        intent = 0;
      }
      animateToTarget();
    };

    const maybeStartReverse = (deltaY: number) => {
      if (!unlockedRef.current) return false;
      if (programmaticScrollRef.current) return false;

      const atTop = (window.scrollY || 0) <= 0;
      const scrollingUp = deltaY < 0;
      if (!atTop || !scrollingUp) return false;

      setUnlocked(false);
      ensureAtTop();

      targetRef.current = clamp(progressRef.current, 0, 1);
      addDelta(deltaY);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (programmaticScrollRef.current) return;
      if (mobileOpenRef.current) return;

      if (unlockedRef.current) {
        const reversed = maybeStartReverse(e.deltaY);
        if (reversed) e.preventDefault();
        return;
      }

      e.preventDefault();
      addDelta(e.deltaY);
    };

    // MOBILE TOUCH: gunakan total swipe distance biar sekali swipe kecil tetap maju
    let touchStartY = 0;
    let touchAccum = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
      touchAccum = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (programmaticScrollRef.current) return;
      if (mobileOpenRef.current) return;

      const y = e.touches[0]?.clientY ?? touchStartY;
      const dy = touchStartY - y;
      touchStartY = y;

      // akumulasi swipe (lebih stabil dari move per-pixel)
      touchAccum += dy;

      if (unlockedRef.current) {
        const reversed = maybeStartReverse(dy);
        if (reversed) e.preventDefault();
        return;
      }

      // locked: prevent native
      e.preventDefault();

      // Convert swipe px -> deltaY virtual
      // 220px swipe = progress naik besar (enak buat hp)
      const virtualDelta = touchAccum * 2.0;

      // apply in chunks supaya smooth dan ga “nendang”
      addDelta(virtualDelta);
      touchAccum = 0;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (programmaticScrollRef.current) return;
      if (mobileOpenRef.current) return;

      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"];
      if (!keys.includes(e.key)) return;

      const forward = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " || e.key === "End";
      const backward = e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Home";
      const deltaY = forward ? 220 : backward ? -220 : 0;

      if (unlockedRef.current) {
        if (deltaY < 0 && (window.scrollY || 0) <= 0) {
          e.preventDefault();
          setUnlocked(false);
          ensureAtTop();
          addDelta(deltaY);
        }
        return;
      }

      e.preventDefault();
      addDelta(deltaY);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(intentTimer);
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("keydown", onKeyDown as any);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  // `href` items are real links (opened in a new tab) instead of in-page scroll targets.
  const PORTFOLIO_PDF = "/portofolio-bantu-tugas.pdf";
  const navItems: { label: string; id: string; href?: string }[] = [
    { label: "Home", id: "top" },
    { label: "Layanan", id: "features" },
    { label: "Harga", id: "pricing" },
    { label: "Track Record", id: "stats" },
    { label: "Portofolio", id: "portfolio", href: PORTFOLIO_PDF },
    { label: "Contact", id: "contact" },
  ];

  const handleNavClick = (id: string) => {
    setMobileOpen(false);

    if (!unlockedRef.current) {
      pendingScrollIdRef.current = id;
      targetRef.current = 1;
      animateToTarget();
      return;
    }

    scrollToId(id);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Logo fixed stays */}
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
        <div className="intro-drop" style={d(100)}>
          <TopLogo />
        </div>
      </div>

      {/* Mobile hamburger (fixed top-right, hidden on lg+) */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Buka menu navigasi"
        aria-expanded={mobileOpen}
        style={d(150)}
        className="intro-drop fixed top-4 right-4 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-black/40 text-white backdrop-blur transition hover:bg-black/60 lg:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {/* HEADER BLOCK */}
      <header className="relative z-10 bg-black pt-4">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative flex h-16 items-center">
            <div className="absolute left-1/2 -translate-x-1/2 text-white/0 select-none">LOGO</div>
          </div>
        </div>

        {/* Navbar area: height collapses to 0 (desktop only — mobile uses hamburger overlay) */}
        <div className="hidden border-t border-white/10 overflow-hidden lg:block">
          <div ref={navRef} className="mx-auto max-w-6xl px-4" style={INTRO_START.nav}>
            <nav className="flex h-full items-center justify-between text-sm tracking-[0.25em] uppercase text-white/90">
              {navItems.map((item, idx) => (
                <a
                  key={item.id}
                  href={item.href ?? `#${item.id}`}
                  {...(item.href ? { target: "_blank", rel: "noopener" } : {})}
                  className="intro-fade hover:text-white"
                  style={d(200 + idx * 60)}
                  onClick={(ev) => {
                    if (item.href) return;
                    ev.preventDefault();
                    handleNavClick(item.id);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-white/10" />
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={[
          "fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-xl transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        {/* close button row */}
        <div className="flex items-center justify-end p-4">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
            className="grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* nav items */}
        <nav className="flex flex-1 flex-col items-center justify-center gap-7 px-6 text-base tracking-[0.3em] uppercase text-white/85">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href ?? `#${item.id}`}
              {...(item.href ? { target: "_blank", rel: "noopener" } : {})}
              className="transition hover:text-white"
              onClick={(ev) => {
                if (item.href) {
                  setMobileOpen(false);
                  return;
                }
                ev.preventDefault();
                handleNavClick(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* contact CTA */}
        <div className="px-6 pb-10 pt-4 text-center">
          <a
            href="https://wa.me/6281775285513"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-3 text-sm tracking-wider text-white transition hover:border-white/55 hover:bg-white/10"
            onClick={() => setMobileOpen(false)}
          >
            Chat WhatsApp
            <span aria-hidden="true">→</span>
          </a>
          <p className="mt-3 text-xs tracking-[0.25em] uppercase text-white/45">
            +62 817-7528-5513
          </p>
        </div>
      </div>

      {/* HERO */}
      <section id="top" className="relative h-[100vh] w-full bg-black overflow-hidden">
        <div className="absolute inset-0 bg-black" />

        <div
          ref={heroFrameRef}
          className="absolute overflow-hidden will-change-[inset,border-radius]"
          style={INTRO_START.frame}
        >
          <div className="intro-zoom h-full w-full">
            <HeroIllustration />
          </div>
          <div ref={heroOverlayRef} className="absolute inset-0 bg-black pointer-events-none" style={INTRO_START.overlay} />
        </div>

        <div
          ref={heroTitleRef}
          className="relative z-10 flex h-full flex-col items-center px-6 pt-[14vh] text-center will-change-[opacity,transform] sm:pt-[16vh]"
          style={INTRO_START.title}
        >
          <div className="max-w-4xl">
            <p className="intro-rise text-xs sm:text-sm tracking-[0.45em] uppercase text-white/70" style={d(250)}>
              Bantu Tugas — Skripsi · Tugas · Web, SEO &amp; Sistem Bisnis
            </p>
            <h1 style={d(360)} className="intro-rise mt-5 font-serif text-4xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight">
              Tugasmu, kami yang selesaikan.
            </h1>
            <p className="intro-rise mt-6 text-base sm:text-lg text-white/75" style={d(500)}>
              Skripsi, KP, PP, tugas kuliah, sampai website, SEO, dan sistem ERP perusahaan —
              dikerjakan rapi, tepat waktu, dan sudah dipercaya puluhan
              mahasiswa &amp; klien bisnis.
            </p>
          </div>
        </div>

        {!scrollUnlocked ? (
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-xs tracking-[0.3em] uppercase text-white/70">
            <span className="intro-hint inline-block">Swipe / scroll untuk masuk</span>
          </div>
        ) : null}
      </section>

      {/* CONTENT */}
      <main className="relative z-10 bg-black">
        <section id="features" className="scroll-mt-24">
          <FeatureTriptych />
        </section>

        <section id="pricing" className="scroll-mt-24">
          <PricingSection />
        </section>

        <section id="stats" className="scroll-mt-24">
          <StatsSection />
        </section>

        <section id="discover" className="scroll-mt-24">
          <DiscoverMoreSection />
        </section>

        <section id="contact" className="scroll-mt-24">
          <ContactUsSection />
        </section>

        <section id="footer" className="scroll-mt-24">
          <FooterSection />
        </section>

        <div className="h-24" />
      </main>
    </div>
  );
}