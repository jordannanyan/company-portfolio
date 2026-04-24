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

  return (
    <section ref={ref} className="relative w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28 lg:px-8">
        {/* Header */}
        <div
          className={[
            "max-w-3xl transition-all duration-700 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
        >
          <p className="text-sm tracking-[0.45em] uppercase text-black/55">
            Portofolio
          </p>
          <h2 className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-black">
            Pernah dipercaya oleh.
          </h2>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-black/70 max-w-2xl">
            Beberapa klien dan project yang pernah kami tangani — dari instansi
            keuangan sampai platform kampus dan startup agroforestry.
          </p>
        </div>

        {/* Portfolio cards */}
        <div
          className={[
            "mt-12 grid gap-6 md:grid-cols-3",
            "transition-all duration-700 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          ].join(" ")}
          style={{ transitionDelay: inView ? "200ms" : "0ms" }}
        >
          {cards.map((c, idx) => (
            <a
              key={idx}
              href="#contact"
              className="group relative flex flex-col gap-5 rounded-2xl border border-black/10 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-black/25 hover:shadow-[0_28px_80px_rgba(0,0,0,0.10)] focus:outline-none focus:ring-2 focus:ring-black/40"
              style={{ transitionDelay: inView ? `${260 + idx * 90}ms` : "0ms" }}
            >
              {/* thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-black/10 bg-black/5">
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
                    className="absolute bottom-2 right-2 h-[70%] w-auto rounded-md border border-black/15 bg-white shadow-lg"
                    loading="lazy"
                    draggable={false}
                  />
                ) : null}
              </div>

              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-black/55">
                  {c.tag}
                </p>
                <p className="mt-2 font-serif text-2xl leading-tight text-black">
                  {c.client}
                </p>
                <p className="mt-2 text-sm text-black/70">{c.title}</p>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs tracking-[0.25em] uppercase text-black/45">
                  Project
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full border border-black/20 transition-all duration-300 group-hover:border-black/50 group-hover:bg-black group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
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
