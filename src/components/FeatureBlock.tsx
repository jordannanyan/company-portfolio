import { useInViewToggle } from "./hooks/useInViewToggle";

export type FeatureItem = {
  id: string;
  kicker?: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

export default function FeatureBlock({
  item,
  side = "left",
}: {
  item: FeatureItem;
  side?: "left" | "right";
}) {
  const { ref, inView } = useInViewToggle<HTMLDivElement>({
    threshold: 0.35,
    rootMargin: "0px 0px -15% 0px",
  });

  const isLeft = side === "left";

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div
        className={[
          "grid items-start gap-10 lg:gap-16",
          "lg:grid-cols-2",
          isLeft ? "" : "lg:[&>*:first-child]:order-2",
        ].join(" ")}
      >
        {/* TEXT */}
        <div
          className={[
            "max-w-2xl",
            "transition-all duration-700 ease-out will-change-transform",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          ].join(" ")}
        >
          {item.kicker ? (
            <p className="text-sm tracking-[0.45em] uppercase text-white/60">
              {item.kicker}
            </p>
          ) : null}

          <h3 className="mt-6 font-serif text-6xl sm:text-7xl lg:text-8xl xl:text-[5.5rem] leading-[0.95] tracking-tight">
            {item.title}
          </h3>

          <p className="mt-8 text-lg sm:text-xl leading-relaxed text-white/75 max-w-xl">
            {item.body}
          </p>
        </div>

        {/* IMAGE */}
        <div
          className={[
            "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5",
            "transition-all duration-700 ease-out will-change-transform",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
          ].join(" ")}
          style={{ transitionDelay: inView ? "120ms" : "0ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />
          <img
            src={item.imageSrc}
            alt={item.imageAlt}
            className="h-[380px] w-full object-cover sm:h-[480px] lg:h-[580px]"
            draggable={false}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}