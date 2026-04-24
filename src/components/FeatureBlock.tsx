import { useEffect, useMemo, useRef, useState } from "react";
import { useInViewToggle } from "./hooks/useInViewToggle";

export type FeatureItem = {
  id: string;
  kicker?: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

type CarouselImage = { src: string; alt?: string };

function HeroCarousel({
  images,
  intervalMs = 3500,
  heightClassName,
}: {
  images: CarouselImage[];
  intervalMs?: number;
  heightClassName: string;
}) {
  const slides = useMemo(() => images.filter(Boolean), [images]);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    dx: 0,
    pointerId: -1,
  });

  const clampIndex = (i: number) => {
    const n = slides.length;
    if (n === 0) return 0;
    return (i % n + n) % n;
  };

  const go = (delta: number) => setIndex((prev) => clampIndex(prev + delta));
  const goTo = (i: number) => setIndex(clampIndex(i));

  // autoplay
  useEffect(() => {
    if (slides.length <= 1) return;
    if (hovered) return;

    const t = window.setInterval(() => {
      setIndex((prev) => clampIndex(prev + 1));
    }, intervalMs);

    return () => window.clearInterval(t);
  }, [slides.length, hovered, intervalMs]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (slides.length <= 1) return;
    const el = trackRef.current;
    if (!el) return;

    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.dx = 0;
    drag.current.pointerId = e.pointerId;

    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (!el) return;

    const dx = e.clientX - drag.current.startX;
    drag.current.dx = dx;

    // translate while dragging (disable transition)
    el.style.transition = "none";
    el.style.transform = `translateX(calc(${-index * 100}% + ${dx}px))`;
  };

  const endDrag = () => {
    const el = trackRef.current;
    const dx = drag.current.dx;

    drag.current.active = false;
    drag.current.dx = 0;
    drag.current.pointerId = -1;

    if (el) {
      el.style.transition = "";
      el.style.transform = "";
    }

    const threshold = 60;
    if (dx > threshold) go(-1);
    else if (dx < -threshold) go(1);
    else setIndex((v) => v);
  };

  const onPointerUp = () => {
    const el = trackRef.current;
    if (el && drag.current.pointerId !== -1) {
      try {
        el.releasePointerCapture(drag.current.pointerId);
      } catch {}
    }
    if (!drag.current.active) return;
    endDrag();
  };

  if (slides.length === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${heightClassName}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={trackRef}
        className="flex h-full w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(${-index * 100}%)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {slides.map((img, i) => (
          <div key={i} className="min-w-full h-full">
            <img
              src={img.src}
              alt={img.alt ?? `Slide ${i + 1}`}
              className="h-full w-full object-cover"
              draggable={false}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      {slides.length > 1 ? (
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-white/90" : "bg-white/30 hover:bg-white/55"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function FeatureBlock({
  item,
  side = "left",
  carouselImages,
}: {
  item: FeatureItem;
  side?: "left" | "right";
  carouselImages?: CarouselImage[];
}) {
  const { ref, inView } = useInViewToggle<HTMLDivElement>({
    threshold: 0.35,
    rootMargin: "0px 0px -15% 0px",
  });

  const isLeft = side === "left";

  const heightClassName = "h-[420px] sm:h-[520px] lg:h-[620px]";

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div
        className={[
          "grid items-start gap-10 lg:gap-14",
          "lg:grid-cols-[5fr_7fr]",
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
            <p className="text-sm tracking-[0.45em] uppercase text-black/55">
              {item.kicker}
            </p>
          ) : null}

          <h3 className="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[4.75rem] leading-[0.95] tracking-tight text-black">
            {item.title}
          </h3>

          <p className="mt-8 text-lg sm:text-xl leading-relaxed text-black/70 max-w-xl">
            {item.body}
          </p>
        </div>

        {/* IMAGE / CAROUSEL */}
        <div
          className={[
            "relative overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]",
            "transition-all duration-700 ease-out will-change-transform",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
          ].join(" ")}
          style={{ transitionDelay: inView ? "120ms" : "0ms" }}
        >
          {carouselImages && carouselImages.length > 0 ? (
            <HeroCarousel
              images={carouselImages}
              intervalMs={3500}
              heightClassName={heightClassName}
            />
          ) : (
            <img
              src={item.imageSrc}
              alt={item.imageAlt}
              className={`w-full object-cover ${heightClassName}`}
              draggable={false}
              loading="lazy"
            />
          )}
        </div>
      </div>
    </section>
  );
}