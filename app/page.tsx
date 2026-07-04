import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

// Fallback featured items if Supabase is not configured or fails
const fallbackFeatured = [
  {
    id: '1',
    slug: 'venetian-sofa',
    name: 'Venetian Sofa',
    category: 'living_room',
    material: 'upholstered',
    price: 185000,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '2',
    slug: 'palazzo-king-bed',
    name: 'Palazzo King Bed',
    category: 'bedroom',
    material: 'solid_wood',
    price: 220000,
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '3',
    slug: 'monarch-dining-table',
    name: 'Monarch Dining Table',
    category: 'dining',
    material: 'marble',
    price: 195000,
    images: ['https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '4',
    slug: 'executive-desk',
    name: 'Executive Desk',
    category: 'office',
    material: 'solid_wood',
    price: 145000,
    images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80']
  }
];

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  let featuredProducts = [];

  try {
    const { data, error } = await supabase
      .from('furniture_items')
      .select('*')
      .eq('featured', true)
      .limit(4);

    if (error || !data || data.length === 0) {
      console.warn('Supabase fetch failed or returned empty, using fallback featured items:', error);
      featuredProducts = fallbackFeatured;
    } else {
      featuredProducts = data;
    }
  } catch (err) {
    console.error('Error connecting to Supabase, using fallback featured items:', err);
    featuredProducts = fallbackFeatured;
  }

  // Room categories
  const categories = [
    { name: 'Living Room', code: 'living_room', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80' },
    { name: 'Bedroom', code: 'bedroom', img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80' },
    { name: 'Dining', code: 'dining', img: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80' },
    { name: 'Office', code: 'office', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80' },
    { name: 'Outdoor', code: 'outdoor', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="bg-bg text-text">
      {/* SECTION 1 — Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80"
            alt="Maison & Co Luxury Showroom"
            fill
            priority={true}
            className="object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 text-center animate-fade-in flex flex-col items-center">
          <h1 className="font-cormorant text-5xl md:text-8xl text-gold font-light tracking-[0.4em] uppercase leading-none gold-glow select-none">
            MAISON & CO
          </h1>
          <p className="font-inter text-xs md:text-lg tracking-[0.25em] text-text/80 uppercase mt-8 max-w-2xl">
            Luxury Furniture for the Discerning Home
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 w-full sm:w-auto">
            <Link
              href="/catalogue"
              className="w-full sm:w-auto font-inter text-xs tracking-[0.2em] uppercase border border-gold text-gold hover:bg-gold hover:text-bg py-4 px-10 transition-all duration-300 font-medium rounded-none text-center"
            >
              Explore Collection
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto font-inter text-xs tracking-[0.2em] uppercase text-text hover:text-gold py-4 px-10 transition-all duration-300 font-medium text-center"
            >
              Request Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Featured Collection */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 border-b border-border pb-6">
          <h2 className="font-cormorant text-4xl md:text-5xl font-light tracking-wide text-text">
            Featured Pieces
          </h2>
          <Link
            href="/catalogue"
            className="font-inter text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-all duration-300 mt-4 md:mt-0 pb-1 border-b border-gold/30 hover:border-gold-light"
          >
            View All Pieces
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 3 — Categories */}
      <section className="py-24 bg-surface/50 border-y border-border/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h2 className="font-cormorant text-4xl md:text-5xl font-light tracking-wide text-text mb-16 text-center">
            Browse by Room
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.code}
                href={`/catalogue?room=${cat.code}`}
                className="group relative aspect-[3/4] overflow-hidden bg-bg border border-border/50 hover:border-gold transition-all duration-500"
              >
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-col">
                  <span className="font-cormorant text-xl md:text-2xl text-gold group-hover:text-gold-light transition-colors duration-300 font-light tracking-wider">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — About Strip */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column Image */}
          <div className="relative aspect-[4/3] lg:aspect-square w-full overflow-hidden border border-border/50">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
              alt="Maison & Co Craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </div>

          {/* Right Column Text */}
          <div className="space-y-8">
            <span className="font-inter text-xs tracking-[0.2em] text-gold uppercase font-semibold">
              Our Legacy
            </span>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light tracking-wide text-text leading-tight">
              Crafted for Generations
            </h2>
            <p className="font-inter text-sm md:text-base leading-relaxed text-muted">
              Since our founding in Hyderabad, Maison & Co has set the benchmark for high-end furniture. We coordinate with elite local woodworkers and metalsmiths to design bespoke models. Each piece combines natural textures of premium teak, walnut, and Italian marble, with structural sleekness and geometric restraint.
            </p>
            <p className="font-inter text-sm md:text-base leading-relaxed text-muted">
              Every detail is meticulously scrutinized, from structural stability to custom grain matching, producing furniture that functions as heirloom artwork.
            </p>
            <div className="pt-4">
              <Link
                href="/about"
                className="font-inter text-xs tracking-[0.2em] uppercase border border-gold text-gold hover:bg-gold hover:text-bg py-4 px-10 transition-all duration-300 font-medium rounded-none inline-block text-center"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Enquiry CTA */}
      <section className="py-24 bg-surface border-t border-border/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
          <h2 className="font-cormorant text-4xl md:text-5xl font-light tracking-wide text-text mb-4">
            Interested in a piece?
          </h2>
          <p className="font-inter text-sm md:text-base text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Our luxury space consultants will help you select, customize, and deliver the perfect furniture configurations for your estate.
          </p>
          <Link
            href="/contact"
            className="font-inter text-xs tracking-[0.2em] uppercase border border-gold text-gold hover:bg-gold hover:text-bg py-4 px-10 transition-all duration-300 font-medium rounded-none inline-block text-center"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
