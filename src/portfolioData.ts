/**
 * Portfolio screenshots live in public/portfolio/<id>.webp (1400 px, mobile shots 540 px)
 * and <id>-sm.webp (720 px / 300 px), converted from brand/portfolio/img — exported by
 * brand/portfolio/web_export.py: the PDF's redacted screenshots with every client name removed.
 */
export const shot = (id: string) => `/portfolio/${id}.webp`;
export const shotSm = (id: string) => `/portfolio/${id}-sm.webp`;
/** srcSet for a desktop screenshot (720w / 1400w). */
export const shotSet = (id: string) => `${shotSm(id)} 720w, ${shot(id)} 1400w`;

export type Category = "instansi" | "bisnis" | "data" | "edukasi";

export const CATEGORIES: { id: Category | "semua"; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "instansi", label: "Instansi & Pemerintah" },
  { id: "bisnis", label: "Bisnis & UMKM" },
  { id: "data", label: "Data & AI" },
  { id: "edukasi", label: "Edukasi & Lingkungan" },
];

export type Project = {
  id: string; // screenshot id
  title: string;
  client: string;
  stack: string;
  desc: string;
  cat: Category;
};

export const PROJECTS: Project[] = [
  { id: "p05-05", cat: "bisnis", title: "ERP Produksi & Rantai Pasok", client: "Perusahaan komoditas", stack: "PHP · MySQL · ERP",
    desc: "Inventory, procurement, produksi, dan distribusi dalam satu sistem terpadu." },
  { id: "p05-01", cat: "data", title: "AI Chatbot Berbasis Dokumen (RAG)", client: "Riset & layanan pelanggan", stack: "PHP · Python · LLM",
    desc: "Chatbot yang menjawab dari referensi PDF, dengan mode produksi dan mode uji akurasi jawaban." },
  { id: "p05-03", cat: "instansi", title: "Penyaluran Bantuan Sosial", client: "Sistem informasi publik", stack: "PHP · Blockchain · MySQL",
    desc: "Pencatatan penyaluran bantuan berbasis blockchain untuk transparansi dan akuntabilitas." },
  { id: "p09-01", cat: "data", title: "Deteksi Dini Alzheimer dari Citra MRI", client: "Deep learning · CNN", stack: "Python · CNN · ONNX",
    desc: "Klasifikasi citra MRI otak secara real-time lengkap dengan confidence score." },
  { id: "p05-07", cat: "instansi", title: "Sistem Perjalanan Dinas", client: "Dinas Kesehatan Provinsi", stack: "PHP · MySQL",
    desc: "Pengajuan, persetujuan, dan pelaporan perjalanan dinas secara digital." },
  { id: "p08-01", cat: "data", title: "SPK Seleksi Peserta — Metode AHP", client: "Instansi pemerintah daerah", stack: "PHP · MySQL · AHP",
    desc: "Pembobotan kriteria dengan uji konsistensi (CR) dan perangkingan peserta otomatis." },
  { id: "p06-04", cat: "instansi", title: "Portal Data Terbuka Kabupaten", client: "Pemerintah kabupaten", stack: "PHP · MySQL · Chart",
    desc: "Open data dan visualisasi anggaran daerah yang bisa diakses publik." },
  { id: "p07-01", cat: "bisnis", title: "Pengaduan & Feedback Pelanggan", client: "Kafe", stack: "PHP · MySQL",
    desc: "Formulir keluhan dan saran pelanggan dengan kategori dan pelacakan status." },
  { id: "p09-03", cat: "data", title: "Clustering Data — PCA & K-Means", client: "Data mining", stack: "Python · scikit-learn",
    desc: "Reduksi dimensi, penentuan jumlah cluster optimal, dan visualisasi interaktif." },
  { id: "p06-06", cat: "instansi", title: "Pendaftaran Merek UMKM", client: "Layanan pelaku UMKM", stack: "PHP · MySQL",
    desc: "Portal pengajuan dan pemantauan pendaftaran merek dagang." },
  { id: "p05-09", cat: "data", title: "Sistem Pakar Diagnosa Penyakit", client: "Kesehatan", stack: "PHP · Backward Chaining",
    desc: "Diagnosa berbasis aturan dengan inferensi backward chaining." },
  { id: "p08-03", cat: "data", title: "SPK Seleksi Mentor — ROC & CPI", client: "Lembaga pendidikan", stack: "PHP · MySQL",
    desc: "Impor data pendaftar dari Excel, penilaian multi-kriteria, dan publikasi hasil." },
  { id: "p07-03", cat: "bisnis", title: "Bank Sampah Digital", client: "Program lingkungan", stack: "PHP · MySQL",
    desc: "Landing page dan sistem tukar sampah dengan poin untuk warga." },
  { id: "p06-02", cat: "edukasi", title: "Edukasi Konservasi Laut", client: "Organisasi lingkungan", stack: "PHP · MySQL",
    desc: "Website edukasi keanekaragaman hayati laut Indonesia." },
  { id: "p06-03", cat: "edukasi", title: "Portal Keanekaragaman Hayati", client: "Pusat data & informasi", stack: "PHP · MySQL",
    desc: "Katalog spesies dan statistik keanekaragaman hayati." },
  { id: "p06-09", cat: "edukasi", title: "Website Sekolah & E-Learning", client: "Sekolah menengah", stack: "PHP · MySQL",
    desc: "Profil sekolah dengan modul akademik dan pembelajaran online." },
];

/** Featured case study — one backend, three client apps. */
export const CASE_SCREENS: { id: string; label: string }[] = [
  { id: "p02-01", label: "Executive Dashboard" },
  { id: "p04-02", label: "Peta Lahan (WebGIS)" },
  { id: "p04-01", label: "Dashboard Lahan & Pohon" },
  { id: "p03-03", label: "Procurement" },
  { id: "p03-06", label: "Gudang" },
  { id: "p03-02", label: "Profit & Loss per Lahan" },
];
export const CASE_PHONES = ["p04-07", "p04-12", "p04-08"];
