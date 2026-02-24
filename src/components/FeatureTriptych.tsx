import Hero1 from "../assets/hero.jpg";
import Hero2 from "../assets/hero-2.jpg";
import Hero3 from "../assets/hero-3.jpg";

import FeatureBlock, { type FeatureItem } from "./FeatureBlock";

export default function FeatureTriptych() {
  const items: FeatureItem[] = [
    {
      id: "one",
      kicker: "S-Class Saloon",
      title: "Where vision becomes presence.",
      body:
        "More than a vehicle. The new S-Class redefines what it means to arrive, with design that commands attention, intelligence that anticipates your needs, and comfort that transcends expectation.",
      imageSrc: Hero1,
      imageAlt: "Exterior",
    },
    {
      id: "two",
      kicker: "Design",
      title: "Designed to be unmistakable.",
      body:
        "Every line, every contour speaks a language of distinction. The statement resonates from every angle, moving the idea of a flagship forward.",
      imageSrc: Hero1,
      imageAlt: "Detail",
    },
    {
      id: "three",
      kicker: "Craftsmanship",
      title: "The art of arrival.",
      body:
        "Step into a world where surfaces tell a story of uncompromising craft. Meticulously selected materials, hand-finished details, and intuitive elegance from the first touch.",
      imageSrc: Hero1,
      imageAlt: "Interior",
    },
  ];

  // carousel images
  const heroSlides = [
    { src: Hero1, alt: "Hero 1" },
    { src: Hero2, alt: "Hero 2" },
    { src: Hero3, alt: "Hero 3" },
  ];

  return (
    <div className="bg-black">
      <FeatureBlock item={items[0]} side="left" carouselImages={heroSlides} />
      <FeatureBlock item={items[1]} side="right" carouselImages={heroSlides} />
      <FeatureBlock item={items[2]} side="left" carouselImages={heroSlides} />
    </div>
  );
}