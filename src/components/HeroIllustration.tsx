import { useEffect, useState } from "react";

import WebJoki1 from "../assets/web-joki1.png";
import WebJoki2 from "../assets/web-joki2.png";
import WebJoki3 from "../assets/web-joki3.png";
import AppJoki1 from "../assets/app-joki1.png";

export default function HeroIllustration() {
  const slides = [WebJoki1, WebJoki2, WebJoki3];
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

      {/* browser mockup */}
      <div
        className="absolute left-1/2 w-[min(96%,1080px)] -translate-x-1/2 rounded-2xl border border-white/15 bg-black/60 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-md"
        style={{ bottom: "-6%" }}
      >
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="ml-4 flex-1 truncate rounded-md bg-white/8 px-3 py-1 text-[11px] tracking-wider text-white/50 sm:text-xs">
            https://webdev.id
          </span>
        </div>

        {/* screen: cycling project shots */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-b-2xl">
          {slides.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt=""
              aria-hidden="true"
              className={[
                "absolute inset-0 h-full w-full object-cover",
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
        className="absolute right-[4%] w-[120px] rotate-[8deg] rounded-[26px] border-[3px] border-white/20 bg-black/80 p-1 shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:w-[150px] md:w-[180px]"
        style={{ bottom: "4%" }}
      >
        <div className="aspect-[9/19] overflow-hidden rounded-[18px]">
          <img
            src={AppJoki1}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </div>

      {/* top fade so the hero title is always readable over the illustration */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-black/80 via-black/35 to-transparent" />
    </div>
  );
}
