import FeatureBlock, { type FeatureItem } from "./FeatureBlock";
import { shot } from "../portfolioData";

/** Carousel slides per service, taken from real portfolio screens. */
const pics = (...list: [string, string][]) => list.map(([id, alt]) => ({ src: shot(id), alt }));

export default function FeatureTriptych() {
  const items: FeatureItem[] = [
    {
      id: "skripsi",
      kicker: "Skripsi",
      title: "Skripsi yang lolos sidang.",
      body:
        "Berpengalaman mengerjakan skripsi lintas jurusan — Teknik, Ekonomi & Bisnis, dan FKIP. Lebih dari 20 mahasiswa yang kami dampingi sudah lulus, dengan 5+ di antaranya cumlaude. Dari bab 1 sampai revisi dosen, kami bantu rapikan.",
      imageSrc: shot("p09-01"),
      imageAlt: "Skripsi berbasis sistem: deteksi Alzheimer dengan CNN",
      images: pics(
        ["p09-01", "Skripsi berbasis sistem — deteksi dini Alzheimer dengan CNN"],
        ["p08-01", "Skripsi sistem pendukung keputusan metode AHP"],
        ["p09-03", "Skripsi data mining — clustering PCA dan K-Means"],
      ),
    },
    {
      id: "tugas",
      kicker: "Tugas • KP • PP",
      title: "Tugas kuliah, selesai tepat waktu.",
      body:
        "30+ Kerja Praktik, 40+ Program Profesional, dan banyak tugas harian sudah kami rampungkan. Laporan, analisis, presentasi — dikerjakan rapi sesuai format kampus dan deadline yang realistis.",
      imageSrc: shot("p06-03"),
      imageAlt: "Project tugas dan KP: portal keanekaragaman hayati",
      images: pics(
        ["p06-03", "Project KP — portal keanekaragaman hayati"],
        ["p06-09", "Project tugas — website sekolah dan e-learning"],
        ["p06-02", "Project tugas — website edukasi konservasi laut"],
      ),
    },
    {
      id: "analisis",
      kicker: "Analisis Data & Statistika",
      title: "Data yang rapi, hasil yang bisa dipercaya.",
      body:
        "Olah data kuantitatif dan kualitatif untuk skripsi, tesis, atau laporan: uji validitas-reliabilitas, regresi, ANOVA, SEM, uji non-parametrik, sampai visualisasi. Dikerjakan dengan SPSS, Excel, MATLAB, Minitab, Python (pandas/numpy), dan R — dipilih sesuai kebutuhan metodologi.",
      imageSrc: shot("p09-03"),
      imageAlt: "Analisis data: visualisasi clustering",
      images: pics(
        ["p09-03", "Analisis data — PCA, Elbow Method dan Silhouette Score"],
        ["p08-03", "Perhitungan multi-kriteria ROC dan CPI"],
        ["p06-04", "Visualisasi data anggaran pada portal data terbuka"],
      ),
    },
    {
      id: "webdev",
      kicker: "Web · SEO · Mobile · ERP",
      title: "Dari website kampus sampai sistem perusahaan.",
      body:
        "Kami juga membangun produk nyata. Pernah mengerjakan sistem untuk instansi pemerintah, lembaga keuangan, kampus, dan perusahaan agroforestri (web + mobile). Untuk perusahaan, kami kembangkan sistem ERP, POS, inventory, CRM, dan aplikasi bisnis custom — mulai dari Rp 5 juta. Website juga kami optimasi SEO — riset keyword, on-page, kecepatan, dan Google Search Console — supaya bisnismu mudah ditemukan di Google. Butuh skripsi berbasis sistem/aplikasi? Bisa sekaligus kami build.",
      imageSrc: shot("p02-01"),
      imageAlt: "Portofolio sistem bisnis: executive dashboard",
      images: pics(
        ["p02-01", "Executive dashboard sistem traceability"],
        ["p04-02", "Peta lahan WebGIS dengan polygon plot"],
        ["p05-05", "Website ERP produksi dan rantai pasok"],
        ["p05-03", "Sistem penyaluran bantuan sosial berbasis blockchain"],
      ),
    },
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
      <FeatureBlock item={items[0]} side="left" carouselImages={items[0].images} />
      <FeatureBlock item={items[1]} side="right" carouselImages={items[1].images} />
      <FeatureBlock item={items[2]} side="left" carouselImages={items[2].images} />
      <FeatureBlock item={items[3]} side="right" carouselImages={items[3].images} />

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
