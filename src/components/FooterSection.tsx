export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-black border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* Top Grid */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-3xl tracking-tight">WebDev</h3>
            <p className="mt-4 text-sm text-white/60 max-w-xs leading-relaxed">
              Jasa pengerjaan tugas, skripsi, KP, PP, dan pengembangan
              web/mobile. Dikerjakan rapi, tepat waktu, dan lulus sidang.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-white/50">
              Navigasi
            </p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><a href="#top" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Layanan</a></li>
              <li><a href="#stats" className="hover:text-white transition-colors">Track Record</a></li>
              <li><a href="#discover" className="hover:text-white transition-colors">Portofolio</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-white/50">
              Connect
            </p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>
                <a
                  href="https://wa.me/6282253092438"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp · +62 822-5309-2438
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 border-t border-white/10 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-white/50">
          <p>© {year} WebDev. All rights reserved.</p>
          <p>Skripsi · Tugas · Web &amp; Mobile Development.</p>
        </div>
      </div>
    </footer>
  );
}
