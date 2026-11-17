import { useEffect, useState, type Ref } from "react";

import { shot, shotSet, shotSm } from "../portfolioData";

// real project screens from the portfolio (redacted)
const SLIDES = ["p02-01", "p04-02", "p03-06", "p05-05"];
const PHONE = "p04-12";

/** `stageRef` wraps the device mockups; App moves it up as the scroll intro plays. */
export default function HeroIllustration({ stageRef, fadeRef }: { stageRef?: Ref<HTMLDivElement>; fadeRef?: Ref<HTMLDivElement> }) {
  const slides = SLIDES;
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setI((v) => (v + 1) % slides.length);
    }, 3800);
    return () => window.clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#0a1030] via-[#0b0a1c] to-black">
      {/* soft grid */}
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse_at_center,black 40%,transparent 85%)",
        }}
      />

      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-[62%] h-[80%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(120,150,255,0.22),transparent_65%)]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-[40%] w-[40%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(180,110,255,0.18),transparent_70%)]" />

      <div ref={stageRef} className="absolute inset-0 will-change-transform">
      {/* browser mockup */}
      <div
        className="absolute left-1/2 top-[64%] w-[min(94%,1040px)] -translate-x-1/2 rounded-2xl border border-white/15 bg-black/60 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-md sm:top-[62%]"
      >
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="ml-4 flex-1 truncate rounded-md bg-white/8 px-3 py-1 text-[11px] tracking-wider text-white/50 sm:text-xs">
            https://bantutugas.site
          </span>
        </div>

        {/* screen: cycling project shots */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-b-2xl">
          {slides.map((id, idx) => (
            <img
              key={id}
              src={shot(id)}
              srcSet={shotSet(id)}
              sizes="(min-width: 1100px) 1080px, 96vw"
              width={1400}
              height={875}
              loading={idx === 0 ? "eager" : "lazy"}
              fetchPriority={idx === 0 ? "high" : "auto"}
              alt=""
              aria-hidden="true"
              className={[
                "absolute inset-0 h-full w-full object-cover object-top brightness-[0.88]",
                "transition-opacity duration-700 ease-out",
                idx === i ? "opacity-100" : "opacity-0",
              ].join(" ")}
              draggable={false}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </div>

      {/* phone mockup */}
      <div
        className="absolute right-[4%] hidden w-[120px] rotate-[8deg] sm:block rounded-[26px] border-[3px] border-white/20 bg-black/80 p-1 shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:w-[150px] md:w-[180px]"
        style={{ bottom: "-6%" }}
      >
        <div className="aspect-[9/19] overflow-hidden rounded-[18px]">
          <img
            src={shotSm(PHONE)}
            width={300}
            height={633}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-top"
            draggable={false}
          />
        </div>
      </div>

      </div>

      {/* top fade so the hero title is always readable over the illustration */}
      <div ref={fadeRef} className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-black/80 via-black/35 to-transparent" />
    </div>
  );
}
