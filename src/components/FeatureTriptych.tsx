import OJKWeb from "../assets/OJK-web.png";
import PemiraWeb from "../assets/pemira-web.png";
import FairventureWeb from "../assets/fairventure-web.png";
import WebJoki1 from "../assets/web-joki1.png";
import WebJoki2 from "../assets/web-joki2.png";
import WebJoki3 from "../assets/web-joki3.png";

import FeatureBlock, { type FeatureItem } from "./FeatureBlock";

export default function FeatureTriptych() {
  const items: FeatureItem[] = [
    {
      id: "skripsi",
      kicker: "Skripsi",
      title: "Skripsi yang lolos sidang.",
      body:
        "Berpengalaman mengerjakan skripsi lintas jurusan — Teknik, Ekonomi & Bisnis, dan FKIP. Lebih dari 20 mahasiswa yang kami dampingi sudah lulus, dengan 5+ di antaranya cumlaude. Dari bab 1 sampai revisi dosen, kami bantu rapikan.",
      imageSrc: WebJoki1,
      imageAlt: "Skripsi",
    },
    {
      id: "tugas",
      kicker: "Tugas • KP • PP",
      title: "Tugas kuliah, selesai tepat waktu.",
      body:
        "30+ Kerja Praktik, 40+ Proyek Perancangan, dan banyak tugas harian sudah kami rampungkan. Laporan, analisis, presentasi — dikerjakan rapi sesuai format kampus dan deadline yang realistis.",
      imageSrc: WebJoki2,
      imageAlt: "Tugas",
    },
    {
      id: "analisis",
      kicker: "Analisis Data & Statistika",
      title: "Data yang rapi, hasil yang bisa dipertanggungjawabkan.",
      body:
        "Olah data kuantitatif dan kualitatif untuk skripsi, tesis, atau laporan: uji validitas-reliabilitas, regresi, ANOVA, SEM, uji non-parametrik, sampai visualisasi. Dikerjakan dengan SPSS, Excel, MATLAB, Minitab, Python (pandas/numpy), dan R — dipilih sesuai kebutuhan metodologi.",
      imageSrc: WebJoki3,
      imageAlt: "Analisis Data",
    },
    {
      id: "webdev",
      kicker: "Web & Mobile Development",
      title: "Bukan cuma jasa tugas.",
      body:
        "Kami juga membangun produk nyata. Pernah mengerjakan website untuk OJK, Pemira UPR, dan Fairventure Agroforestry (web + mobile). Kalau kamu butuh skripsi berbasis sistem/aplikasi, kami bisa bantu sekaligus buildnya.",
      imageSrc: FairventureWeb,
      imageAlt: "Web & Mobile",
    },
  ];

  const carouselImages = [
    { src: OJKWeb, alt: "OJK" },
    { src: PemiraWeb, alt: "Pemira UPR" },
    { src: FairventureWeb, alt: "Fairventure" },
    { src: WebJoki1, alt: "Portofolio web 1" },
    { src: WebJoki2, alt: "Portofolio web 2" },
    { src: WebJoki3, alt: "Portofolio web 3" },
  ];

  const tools = [
    "SPSS",
    "Microsoft Excel",
    "MATLAB",
    "Minitab",
    "Python · pandas / numpy",
    "R",
    "STATA",
    "EViews",
  ];

  return (
    <div className="bg-black">
      <FeatureBlock item={items[0]} side="left" carouselImages={carouselImages} />
      <FeatureBlock item={items[1]} side="right" carouselImages={carouselImages} />
      <FeatureBlock item={items[2]} side="left" carouselImages={carouselImages} />
      <FeatureBlock item={items[3]} side="right" carouselImages={carouselImages} />

      {/* Tools & software strip */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:pb-24">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-xs tracking-[0.35em] uppercase text-white/60">
            Tools &amp; Software
          </p>
          <p className="mt-3 text-base text-white/75 max-w-2xl">
            Software yang kami pakai untuk analisis, pengolahan data, dan
            penulisan — dipilih menyesuaikan metodologi dan kebutuhan dosen.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {tools.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85"
              >
                {t}
              </span>
            ))}
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white/50">
              dan lainnya
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
