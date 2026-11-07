import BrandMark from "./BrandMark";

export default function TopLogo() {
  return (
    <div className="flex h-12 items-center gap-2 rounded-full border border-white/35 bg-black/40 px-4 backdrop-blur">
      <BrandMark className="h-7 w-7" />
      <span className="text-white text-sm font-semibold tracking-[0.2em]">
        Bantu Tugas
      </span>
    </div>
  );
}
