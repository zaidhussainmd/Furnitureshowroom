import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Sparkles, Anchor } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story | Maison & Co',
  description: 'Learn about our two decades of woodcraft tradition, high-end furniture heritage, and Banjara Hills showroom in Hyderabad.',
};

export default function AboutPage() {
  const values = [
    {
      title: 'Craftsmanship',
      description: 'We collaborate exclusively with master carpenters and artisans who pass down woodcraft secrets through generations.',
      icon: Sparkles,
    },
    {
      title: 'Exclusivity',
      description: 'Every design is produced in strictly limited numbers, ensuring your home remains distinctively individual.',
      icon: Shield,
    },
    {
      title: 'Heritage',
      description: 'Inspired by editorial classical aesthetics and refined using sleek contemporary geometry for a timeless look.',
      icon: Anchor,
    },
  ];

  return (
    <div className="bg-bg text-text min-h-screen pb-24">
      {/* Hero section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1920&q=80"
            alt="About Maison & Co"
            fill
            priority={true}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 text-center animate-fade-in px-6">
          <h1 className="font-cormorant text-4xl md:text-6xl text-gold font-light tracking-[0.3em] uppercase leading-none">
            Our Story
          </h1>
          <p className="font-inter text-[10px] md:text-xs tracking-[0.2em] text-text/80 uppercase mt-4">
            Maison & Co — Luxury Furniture Showroom Hyderabad
          </p>
        </div>
      </section>

      {/* Section 1: The Narrative */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <span className="font-inter text-xs tracking-[0.2em] text-gold uppercase font-semibold">
            Establishment
          </span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light tracking-wide text-text leading-tight uppercase">
            Two Decades of Craft
          </h2>
          <p className="font-inter text-sm md:text-base leading-relaxed text-muted">
            Founded with a vision to redefine luxury living in South India, Maison & Co has stood as the premier design showroom in Banjara Hills, Hyderabad for over twenty years. We select only the highest grade of seasoned teakwood, mahogany, and white Carrara marble.
          </p>
          <p className="font-inter text-sm md:text-base leading-relaxed text-muted">
            Our furniture pieces represent more than simple utilities—they are sculptures designed to outline space, catch natural lighting, and endure for generations. We bypass rapid mass manufacturing to focus on deliberate, white-glove, bespoke service.
          </p>
        </div>
      </section>

      {/* Section 2: Values Cards */}
      <section className="py-20 bg-surface/50 border-y border-border/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val) => {
              const IconComponent = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-surface border border-border/60 hover:border-gold p-8 space-y-6 transition-all duration-500 rounded-none group"
                >
                  <IconComponent className="h-8 w-8 text-gold group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-cormorant text-2xl font-light text-text tracking-wide uppercase">
                    {val.title}
                  </h3>
                  <p className="font-inter text-xs md:text-sm leading-relaxed text-muted">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Showroom details */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Showroom image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-border/50">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
              alt="Maison & Co Showroom Banjara Hills"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </div>

          {/* Right Showroom specs */}
          <div className="space-y-8">
            <span className="font-inter text-xs tracking-[0.2em] text-gold uppercase font-semibold">
              Visit Us
            </span>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light tracking-wide text-text uppercase">
              Our Showroom
            </h2>
            
            <div className="space-y-4">
              <p className="font-inter text-sm text-muted">
                Experience our curated collections firsthand. Located in the heart of Banjara Hills, our gallery showcases complete room arrangements designed to inspire.
              </p>
              <div className="text-sm font-inter text-text space-y-2 border-t border-border/40 pt-4">
                <p>
                  <strong className="text-gold font-medium">Address:</strong> Road No. 12, Banjara Hills, Hyderabad, Telangana 500034
                </p>
                <p>
                  <strong className="text-gold font-medium">Opening Hours:</strong>
                </p>
                <div className="grid grid-cols-2 max-w-xs text-xs text-muted pt-1 pl-4 gap-y-1">
                  <span>Mon–Sat:</span>
                  <span>10:00 AM – 8:00 PM</span>
                  <span>Sunday:</span>
                  <span>11:00 AM – 6:00 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="https://wa.me/9100000000"
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter text-xs tracking-[0.2em] uppercase border border-gold text-gold hover:bg-gold hover:text-bg py-4 px-10 transition-all duration-300 font-medium rounded-none inline-block text-center"
              >
                Connect on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Collection CTA */}
      <section className="py-16 text-center border-t border-border/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-6">
          <h2 className="font-cormorant text-3xl font-light tracking-wide text-text uppercase">
            Ready to redesign your space?
          </h2>
          <p className="font-inter text-xs text-muted max-w-md mx-auto">
            Browse our catalog collection or reach out to coordinate a space consultation with our senior designers.
          </p>
          <Link
            href="/catalogue"
            className="font-inter text-xs tracking-[0.2em] uppercase border border-gold text-gold hover:bg-gold hover:text-bg py-4 px-10 transition-all duration-300 font-medium rounded-none inline-block text-center"
          >
            Explore the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
