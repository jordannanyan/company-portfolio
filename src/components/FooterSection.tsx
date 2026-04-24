export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-black/10">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* Top Grid */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-black text-white text-xs font-bold">
                W
              </span>
              <h3 className="font-serif text-3xl tracking-tight text-black">
                WebDev
              </h3>
            </div>
            <p className="mt-4 text-sm text-black/60 max-w-xs leading-relaxed">
              Jasa pengerjaan skripsi, tugas, KP, PP, serta pengembangan web,
              mobile, dan sistem ERP untuk perusahaan.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-black/45">
              Navigasi
            </p>
            <ul className="mt-5 space-y-3 text-sm text-black/70">
              <li><a href="#top" className="hover:text-black transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-black transition-colors">Layanan</a></li>
              <li><a href="#pricing" className="hover:text-black transition-colors">Harga</a></li>
              <li><a href="#stats" className="hover:text-black transition-colors">Track Record</a></li>
              <li><a href="#discover" className="hover:text-black transition-colors">Portofolio</a></li>
              <li><a href="#contact" className="hover:text-black transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-black/45">
              Connect
            </p>
            <ul className="mt-5 space-y-3 text-sm text-black/70">
              <li>
                <a
                  href="https://wa.me/6282253092438"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black transition-colors"
                >
                  WhatsApp · +62 822-5309-2438
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/webdevpky"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black transition-colors"
                >
                  Instagram · @webdevpky
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 border-t border-black/10 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-black/50">
          <p>© {year} WebDev. All rights reserved.</p>
          <p>Skripsi · Tugas · Web, Mobile &amp; Sistem ERP.</p>
        </div>
      </div>
    </footer>
  );
}
