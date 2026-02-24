import { useEffect, useMemo, useRef, useState } from "react";
import HeroImg from "./assets/hero.jpg";

import FeatureTriptych from "./components/FeatureTriptych";
import DiscoverMoreSection from "./components/DiscoverMoreSection";
import ContactUsSection from "./components/ContactUsSection";
import FooterSection from "./components/FooterSection";
import TopLogo from "./components/TopLogo";

/* ----------------------------- utils ----------------------------- */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function App() {
  // progress 0..1, reversible
  const [progress, setProgress] = useState(0);
  const [scrollUnlocked, setScrollUnlocked] = useState(false);

  const progressRef = useRef(0);
  const unlockedRef = useRef(false);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // programmatic scroll guard + pending nav target
  const programmaticScrollRef = useRef(false);
  const pendingScrollIdRef = useRef<string | null>(null);

  const setUnlocked = (v: boolean) => {
    unlockedRef.current = v;
    setScrollUnlocked(v);
  };

  const animateToTarget = () => {
    if (rafRef.current) return;

    rafRef.current = window.requestAnimationFrame(function tick() {
      rafRef.current = null;

      const current = progressRef.current;
      const target = targetRef.current;

      const next = current + (target - current) * 0.35;

      progressRef.current = next;
      setProgress(next);

      const near = Math.abs(target - next) < 0.002;
      if (!near) {
        rafRef.current = window.requestAnimationFrame(tick);
        return;
      }

      progressRef.current = target;
      setProgress(target);

      if (target >= 1 && !unlockedRef.current) setUnlocked(true);
      if (target <= 0 && unlockedRef.current) setUnlocked(false);
    });
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return false;

    // offset untuk fixed logo + spacing
    const offset = 96;
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);

    programmaticScrollRef.current = true;
    window.scrollTo({ top, behavior: "smooth" });

    // lepas guard setelah smooth scroll cukup selesai
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

    const addDelta = (deltaY: number) => {
      const step = clamp(deltaY / 2600, -0.04, 0.04);
      targetRef.current = clamp(targetRef.current + step, 0, 1);
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

      // mulai reverse dari posisi sekarang
      targetRef.current = clamp(progressRef.current, 0, 1);
      addDelta(deltaY);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (programmaticScrollRef.current) return;

      // unlocked: native scroll normal, kecuali reverse di top
      if (unlockedRef.current) {
        const reversed = maybeStartReverse(e.deltaY);
        if (reversed) e.preventDefault();
        return;
      }

      // locked: kita ambil alih untuk menggerakkan intro
      e.preventDefault();
      addDelta(e.deltaY);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (programmaticScrollRef.current) return;

      const y = e.touches[0]?.clientY ?? touchStartY;
      const deltaY = (touchStartY - y) * 1.4;
      touchStartY = y;

      if (unlockedRef.current) {
        const reversed = maybeStartReverse(deltaY);
        if (reversed) e.preventDefault();
        return;
      }

      e.preventDefault();
      addDelta(deltaY);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (programmaticScrollRef.current) return;

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

  // eased progress for visuals
  const p = useMemo(() => clamp(progress, 0, 1), [progress]);
  const e = useMemo(() => easeInOutCubic(p), [p]);

  // HERO frame -> full bleed
  const inset = useMemo(() => Math.round(lerp(56, 0, e)), [e]);
  const corner = useMemo(() => Math.round(lerp(28, 0, e)), [e]);
  const shadowOpacity = useMemo(() => lerp(0.35, 0, e), [e]);
  const overlayOpacity = useMemo(() => lerp(0.45, 0.2, e), [e]);

  // NAVBAR exit
  const navOpacity = useMemo(() => lerp(1, 0, clamp((e - 0.1) / 0.55, 0, 1)), [e]);
  const navTranslateY = useMemo(() => lerp(0, -32, clamp((e - 0.1) / 0.55, 0, 1)), [e]);
  const navHeight = useMemo(() => Math.round(lerp(64, 0, clamp((e - 0.12) / 0.55, 0, 1))), [e]);

  // Title exit
  const titleOpacity = useMemo(() => lerp(1, 0, clamp((e - 0.05) / 0.35, 0, 1)), [e]);
  const titleTranslateY = useMemo(() => lerp(0, -22, clamp((e - 0.05) / 0.35, 0, 1)), [e]);

  const navItems = [
    { label: "Home", id: "top" },
    { label: "Features", id: "features" },
    { label: "Discover", id: "discover" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Logo fixed stays */}
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
        <TopLogo />
      </div>

      {/* HEADER BLOCK */}
      <header className="relative z-10 bg-black pt-4">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative flex h-16 items-center">
            <div className="absolute left-1/2 -translate-x-1/2 text-white/0 select-none">LOGO</div>
          </div>
        </div>

        {/* Navbar area: height collapses to 0 */}
        <div className="border-t border-white/10 overflow-hidden">
          <div
            className="mx-auto max-w-6xl px-4"
            style={{
              height: navHeight,
              opacity: navOpacity,
              transform: `translateY(${navTranslateY}px)`,
              pointerEvents: navOpacity < 0.1 ? "none" : "auto",
            }}
          >
            <nav className="flex h-full items-center justify-between text-sm tracking-[0.25em] uppercase text-white/90">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="hover:text-white"
                  onClick={(ev) => {
                    ev.preventDefault();

                    // locked: simpan target, lalu biarkan user scroll untuk menyelesaikan intro
                    // tapi kalau mau langsung selesai intro ketika klik, aktifkan 2 baris di bawah:
                    if (!unlockedRef.current) {
                      pendingScrollIdRef.current = item.id;
                      targetRef.current = 1; // finish intro via animasi
                      animateToTarget();
                      return;
                    }

                    scrollToId(item.id);
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

      {/* HERO */}
      <section id="top" className="relative h-[100vh] w-full bg-black overflow-hidden">
        <div className="absolute inset-0 bg-black" />

        <div
          className="absolute overflow-hidden will-change-[inset,border-radius]"
          style={{
            top: inset,
            right: inset,
            bottom: inset,
            left: inset,
            borderRadius: corner,
            boxShadow: `0 30px 80px rgba(0,0,0,${shadowOpacity})`,
          }}
        >
          <img src={HeroImg} alt="Hero" className="h-full w-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />
        </div>

        <div
          className="relative z-10 grid h-full place-items-center px-6 text-center"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
          }}
        >
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-tight">The new S-Class Saloon.</h1>
        </div>

        {!scrollUnlocked ? (
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-xs tracking-[0.3em] uppercase text-white/70">
            Scroll to enter
          </div>
        ) : null}
      </section>

      {/* CONTENT */}
      <main className="relative z-10 bg-black">
        <section id="features" className="scroll-mt-24">
          <FeatureTriptych />
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