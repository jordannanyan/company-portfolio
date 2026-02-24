import { useEffect, useMemo, useRef, useState } from "react";

type HeroCarouselProps = {
  images: { src: string; alt?: string }[];
  intervalMs?: number;
  className?: string;
};

export default function HeroCarousel({
  images,
  intervalMs = 3500,
  className = "",
}: HeroCarouselProps) {
  const slides = useMemo(() => images.filter(Boolean), [images]);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    dx: 0,
    pointerId: -1,
  });

  const clampIndex = (i: number) => {
    const n = slides.length;
    if (n === 0) return 0;
    return (i % n + n) % n;
  };

  const go = (next: number) => setIndex((prev) => clampIndex(prev + next));
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

  // pointer drag
  const onPointerDown = (e: React.PointerEvent) => {
    if (slides.length <= 1) return;
    const el = trackRef.current;
    if (!el) return;

    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.lastX = e.clientX;
    drag.current.dx = 0;
    drag.current.pointerId = e.pointerId;

    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;

    const dx = e.clientX - drag.current.startX;
    drag.current.lastX = e.clientX;
    drag.current.dx = dx;

    const el = trackRef.current;
    if (!el) return;

    // translate with drag (no transition)
    el.style.transition = "none";
    el.style.transform = `translateX(calc(${-index * 100}% + ${dx}px))`;
  };

  const onPointerUp = () => {
    const el = trackRef.current;
    if (el && drag.current.pointerId !== -1) {
      try {
        el.releasePointerCapture(drag.current.pointerId);
      } catch {}
    }

    if (!drag.current.active) return;
    drag.current.active = false;

    const dx = drag.current.dx;
    const threshold = 60; // px

    // restore transition
    if (el) {
      el.style.transition = "";
      el.style.transform = "";
    }

    if (dx > threshold) {
      go(-1);
    } else if (dx < -threshold) {
      go(1);
    } else {
      // snap back
      setIndex((v) => v);
    }
  };

  if (slides.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Track */}
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
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      {slides.length > 1 ? (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-white/90" : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      ) : null}

      {/* subtle overlay (optional) */}
      <div className="pointer-events-none absolute inset-0 bg-black/10" />
    </div>
  );
}