import Link from 'next/link';

export default function Footer() {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="bg-bg border-t border-gold/30 pt-16 pb-8 text-text/80">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-border/30">
        
        {/* Left Column - Branding */}
        <div className="flex flex-col space-y-4">
          <h2 className="font-cormorant text-2xl font-medium tracking-[0.2em] text-gold">
            MAISON & CO
          </h2>
          <p className="font-cormorant italic text-lg text-muted">
            Where Craftsmanship Meets Luxury
          </p>
          <p className="font-inter text-xs text-muted/80 max-w-sm leading-relaxed">
            Curated furniture collections crafted for the discerning homeowner, marrying generations of woodcraft tradition with clean, contemporary design lines.
          </p>
        </div>

        {/* Center Column - Nav Links */}
        <div className="flex flex-col md:items-center space-y-4">
          <h3 className="font-inter text-xs uppercase tracking-[0.2em] text-gold font-medium">
            Navigation
          </h3>
          <div className="flex flex-col space-y-3 md:items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-inter text-xs tracking-[0.15em] uppercase hover:text-gold transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column - Contact & Showroom Info */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-inter text-xs uppercase tracking-[0.2em] text-gold font-medium">
            Showroom
          </h3>
          <p className="font-inter text-xs leading-relaxed max-w-xs text-muted">
            Road No. 12, Banjara Hills,<br />
            Hyderabad, Telangana 500034
          </p>
          <div className="flex flex-col space-y-2 pt-2">
            <a
              href="https://wa.me/9100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-xs text-gold hover:text-gold-light transition-colors duration-300 w-fit"
            >
              WhatsApp Enquiry
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-xs text-gold hover:text-gold-light transition-colors duration-300 w-fit"
            >
              Instagram Profile
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-inter text-[10px] tracking-widest text-muted/60 uppercase">
          &copy; {new Date().getFullYear()} Maison & Co. All rights reserved.
        </p>
        <p className="font-inter text-[10px] tracking-widest text-muted/40 uppercase">
          Hyderabad, India
        </p>
      </div>
    </footer>
  );
}
