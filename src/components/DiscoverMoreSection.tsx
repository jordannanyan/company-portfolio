import { useState } from "react";
import { useInViewToggle } from "./hooks/useInViewToggle";

import OJKWeb from "../assets/OJK-web.png";
import PemiraWeb from "../assets/pemira-web.png";
import FairventureWeb from "../assets/fairventure-web.png";
import FairventureApp from "../assets/fairventure-app.png";

type Card = {
  client: string;
  title: string;
  tag: string;
  img: string;
  secondaryImg?: string;
};

export default function DiscoverMoreSection() {
  const { ref, inView } = useInViewToggle<HTMLDivElement>({
    threshold: 0.25,
    rootMargin: "0px 0px -10% 0px",
  });

  const cards: Card[] = [
    {
      client: "OJK",
      title: "Website untuk Otoritas Jasa Keuangan",
      tag: "Web Development",
      img: OJKWeb,
    },
    {
      client: "Pemira UPR",
      title: "Platform Pemilu Raya Universitas Palangka Raya",
      tag: "Web Development",
      img: PemiraWeb,
    },
    {
      client: "Fairventure Agroforestry",
      title: "Website + Aplikasi Mobile",
      tag: "Web & Mobile",
      img: FairventureWeb,
      secondaryImg: FairventureApp,
    },
  ];

  const [activeIdx, setActiveIdx] = useState<number>(0);

  return (
    <section ref={ref} className="relative w-full min-h-screen overflow-hidden bg-black">
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

      {/* Softer gradients so text always readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/85" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-16 sm:px-10 lg:px-16">
        <div
          className={[
            "max-w-3xl transition-all duration-700 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
        >
          <p className="text-sm tracking-[0.45em] uppercase text-white/70">
            Portofolio
          </p>
          <h2 className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            Pernah dipercaya oleh.
          </h2>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-white/80 max-w-2xl">
            Beberapa klien dan project yang pernah kami tangani — dari instansi
            keuangan sampai platform kampus dan startup agroforestry.
          </p>
        </div>

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
              href="#contact"
              onMouseEnter={() => setActiveIdx(idx)}
              onFocus={() => setActiveIdx(idx)}
              className="group relative flex flex-col justify-between gap-5 rounded-2xl border border-white/25 bg-black/50 backdrop-blur-md p-5 transition-all duration-300 hover:border-white/60 hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              {/* thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                <img
                  src={c.img}
                  alt={`${c.client} ${c.tag}`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  draggable={false}
                />
                {c.secondaryImg ? (
                  <img
                    src={c.secondaryImg}
                    alt={`${c.client} mobile app`}
                    className="absolute bottom-2 right-2 h-[70%] w-auto rounded-md border border-white/20 shadow-lg"
                    loading="lazy"
                    draggable={false}
                  />
                ) : null}
              </div>

              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-white/60">
                  {c.tag}
                </p>
                <p className="mt-2 font-serif text-2xl leading-tight text-white">
                  {c.client}
                </p>
                <p className="mt-2 text-sm text-white/70">{c.title}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[0.25em] uppercase text-white/55">
                  Project
                </span>
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
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
