export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-black border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* Top Grid */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-3xl tracking-tight">LOGO</h3>
            <p className="mt-4 text-sm text-white/60 max-w-xs leading-relaxed">
              Crafted with precision. Designed with intention.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-white/50">
              Navigation
            </p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><a href="#content" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#discover" className="hover:text-white transition-colors">Discover</a></li>
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
                <a href="https://instagram.com/your_username" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 border-t border-white/10 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-white/50">
          <p>© {year} Your Brand. All rights reserved.</p>
          <p>Designed & Developed with precision.</p>
        </div>
      </div>
    </footer>
  );
}