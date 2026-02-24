import { useState } from "react";
import { useInViewToggle } from "./hooks/useInViewToggle";

import HeroImg from "../assets/hero.jpg";
import Hero2Img from "../assets/hero-2.jpg";
import Hero3Img from "../assets/hero-3.jpg";

export default function DiscoverMoreSection() {
  const { ref, inView } = useInViewToggle<HTMLDivElement>({
    threshold: 0.25,
    rootMargin: "0px 0px -10% 0px",
  });

  const cards = [
    { title: "Discover S-Class Saloon, long version", img: HeroImg },
    { title: "Discover S-Class Saloon", img: Hero2Img },
    { title: "Discover MANUFAKTUR", img: Hero3Img },
  ] as const;

  const [activeIdx, setActiveIdx] = useState<number>(0);

  return (
    <section ref={ref} className="relative w-full min-h-screen overflow-hidden">
      {/* Background image stack (crossfade) */}
      {cards.map((c, idx) => (
        <img
          key={idx}
          src={c.img}
          alt=""
          aria-hidden="true"
          className={[
            "absolute inset-0 h-full w-full object-cover",
            "transition-opacity duration-500 ease-out",
            idx === activeIdx ? "opacity-100" : "opacity-0",
          ].join(" ")}
          draggable={false}
          loading="lazy"
        />
      ))}

      {/* Softer gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-12 sm:px-10 lg:px-16">
        <h2
          className={[
            "font-serif text-6xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight",
            "transition-all duration-700 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
        >
          Discover more S-Class.
        </h2>

        <div
          className={[
            "grid gap-4 md:grid-cols-3",
            "transition-all duration-700 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          ].join(" ")}
          style={{ transitionDelay: inView ? "200ms" : "0ms" }}
          onMouseLeave={() => setActiveIdx(0)}
        >
          {cards.map((c, idx) => (
            <a
              key={idx}
              href="#"
              onMouseEnter={() => setActiveIdx(idx)}
              onFocus={() => setActiveIdx(idx)}
              className="group relative flex items-center justify-between rounded-2xl border border-white/30 bg-black/30 backdrop-blur-md px-6 py-6 transition-all duration-300 hover:border-white/60 hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <span className="text-sm sm:text-base text-white/90">{c.title}</span>

              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/30 transition-all duration-300 group-hover:border-white/60">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7" />
                  <path d="M10 7h7v7" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}