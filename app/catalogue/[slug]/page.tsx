import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductGallery from '@/components/ProductGallery';
import EnquiryForm from '@/components/EnquiryForm';
import ProductCard from '@/components/ProductCard';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  interface MetadataProduct {
    name: string;
    description: string;
  }
  let product: MetadataProduct | null = null;

  try {
    const { data } = await supabase
      .from('furniture_items')
      .select('name, description')
      .eq('slug', slug)
      .single();

    if (data) {
      product = data as MetadataProduct;
    } else {
      product = fallbackItems.find((item) => item.slug === slug) || null;
    }
  } catch {
    product = fallbackItems.find((item) => item.slug === slug) || null;
  }

  return {
    title: product ? `${product.name} | Maison & Co` : 'Product Details | Maison & Co',
    description: product?.description || 'Luxury furniture item details from Maison & Co showroom, Hyderabad.',
  };
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  material: string;
  price: number;
  dimensions: string;
  images: string[];
  featured: boolean;
  in_stock: boolean;
}

// 20 Fallback items for local routing (same as catalogue/page.tsx)
const fallbackItems: Product[] = [
  {
    id: '1',
    slug: 'venetian-sofa',
    name: 'Venetian Sofa',
    description: 'Indulge in absolute luxury. The Venetian Sofa is upholstered in premium plush velvet, offering deep-cushioned comfort with a hand-burnished solid beech frame. A timeless classic designed for elite living rooms.',
    category: 'living_room',
    material: 'upholstered',
    price: 185000,
    dimensions: '230cm × 100cm × 85cm',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    in_stock: true
  },
  {
    id: '2',
    slug: 'onyx-coffee-table',
    name: 'Onyx Coffee Table',
    description: 'An exquisite center piece crafted from selected dark Nero Marquina marble, supported by a geometric gold-plated metal base. The perfect statement piece to ground your luxury living layout.',
    category: 'living_room',
    material: 'marble',
    price: 78000,
    dimensions: '110cm × 110cm × 40cm',
    images: [
      'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '3',
    slug: 'havana-lounge-chair',
    name: 'Havana Lounge Chair',
    description: 'A masterpiece of Mid-Century Scandinavian design. Features hand-stitched grain leather draped over a seasoned solid teak wood structure. Offers an ergonomically refined tilt for supreme relaxation.',
    category: 'living_room',
    material: 'solid_wood',
    price: 95000,
    dimensions: '85cm × 90cm × 95cm',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '4',
    slug: 'meridian-bookshelf',
    name: 'Meridian Bookshelf',
    description: 'An imposing and architectural shelving system built from solid dark oak. Designed with staggered open compartments to showcase premium books, art pieces, and collectibles with integrated LED channels.',
    category: 'living_room',
    material: 'solid_wood',
    price: 62000,
    dimensions: '120cm × 35cm × 200cm',
    images: [
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '5',
    slug: 'eclipse-tv-unit',
    name: 'Eclipse TV Unit',
    description: 'Sleek modern lines meet premium materials. Features a fluted dark metal chassis, frosted bronze glass doors, and a soft-closing drawer console. A perfect blend of technology housing and luxury design.',
    category: 'living_room',
    material: 'metal',
    price: 88000,
    dimensions: '200cm × 45cm × 50cm',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '6',
    slug: 'palazzo-king-bed',
    name: 'Palazzo King Bed',
    description: 'The ultimate sanctuary anchor. Crafted in solid walnut wood with an imposing high headboard, padded and lined with luxury off-white Italian linen. Promises deep comfort and unmatched bedroom stature.',
    category: 'bedroom',
    material: 'solid_wood',
    price: 220000,
    dimensions: '220cm × 210cm × 140cm',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    in_stock: true
  },
  {
    id: '7',
    slug: 'noir-wardrobe',
    name: 'Noir Wardrobe',
    description: 'A double-door tall wardrobe masterfully detailed in ebonized oak wood. Internally organized with custom leather drawers, solid brass rods, and auto-illuminate micro-LED fixtures.',
    category: 'bedroom',
    material: 'solid_wood',
    price: 175000,
    dimensions: '150cm × 60cm × 220cm',
    images: [
      'https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '8',
    slug: 'marble-dreams-dresser',
    name: 'Marble Dreams Dresser',
    description: 'A stunning bedroom vanity unit featuring a honed Calacatta marble countertop, warm oak frame, and soft-closing circular drawers. Complete with a matching vanity mirror framed in brushed gold.',
    category: 'bedroom',
    material: 'marble',
    price: 110000,
    dimensions: '120cm × 50cm × 75cm',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '9',
    slug: 'velvet-bench',
    name: 'Velvet Bench',
    description: 'A sophisticated addition to place at the foot of your bed. Richly button-tufted upholstery sitting atop sleek, architectural steel legs with a matte-black powder finish.',
    category: 'bedroom',
    material: 'upholstered',
    price: 45000,
    dimensions: '140cm × 45cm × 45cm',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '10',
    slug: 'monarch-dining-table',
    name: 'Monarch Dining Table',
    description: 'Dine like royalty. Features a massive 8-seater polished marble slab top with rounded editorial edges, balanced on a structural pillar base made of ebonized solid ash wood.',
    category: 'dining',
    material: 'marble',
    price: 195000,
    dimensions: '240cm × 100cm × 76cm',
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    in_stock: true
  },
  {
    id: '11',
    slug: 'regal-dining-chair-set-of-6',
    name: 'Regal Dining Chair set of 6',
    description: 'A curated collection of six high-back dining chairs, expertly upholstered in spill-resistant boucle cream fabric, finished with solid walnut tapered legs and subtle gold tips.',
    category: 'dining',
    material: 'upholstered',
    price: 142000,
    dimensions: '50cm × 55cm × 90cm',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '12',
    slug: 'gatsby-bar-cabinet',
    name: 'Gatsby Bar Cabinet',
    description: 'Evoke the glamor of the roaring twenties. Crafted in rich walnut veneer with brass inlay detailing, ribbed glass doors, and mirrored interior backing. Stores up to 24 bottles and glassware.',
    category: 'dining',
    material: 'solid_wood',
    price: 135000,
    dimensions: '100cm × 45cm × 140cm',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '13',
    slug: 'crystal-sideboard',
    name: 'Crystal Sideboard',
    description: 'An elegant storage console for your formal dining room. Incorporates structured reeded glass doors set within a deep stained wooden shell, elevated on a slim carbon steel frame.',
    category: 'dining',
    material: 'glass',
    price: 98000,
    dimensions: '160cm × 45cm × 80cm',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '14',
    slug: 'executive-desk',
    name: 'Executive Desk',
    description: 'The pinnacle of office luxury. Built entirely of seasoned solid oak wood with hand-polished leather writing pad overlay, discrete cable bays, and 4 locking organizer drawers.',
    category: 'office',
    material: 'solid_wood',
    price: 145000,
    dimensions: '180cm × 85cm × 76cm',
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    in_stock: true
  },
  {
    id: '15',
    slug: 'director-chair',
    name: 'Director Chair',
    description: 'Ergonomic perfection meets elite craftsmanship. Upholstered in buttery soft black grain leather, with syncro-tilt mechanisms, pneumatic height adjustments, and polished aluminum armrests.',
    category: 'office',
    material: 'upholstered',
    price: 68000,
    dimensions: '65cm × 65cm × 115cm',
    images: [
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '16',
    slug: 'heritage-bookcase',
    name: 'Heritage Bookcase',
    description: 'A grand, floor-to-ceiling library cabinet crafted from deep-cherry mahogany wood. Detailed with classical frame moldings, adjustable solid shelves, and twin lower cupboard units.',
    category: 'office',
    material: 'solid_wood',
    price: 82000,
    dimensions: '100cm × 40cm × 220cm',
    images: [
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '17',
    slug: 'glass-meeting-table',
    name: 'Glass Meeting Table',
    description: 'A crisp, modern boardroom design. Comprises a 15mm thick tempered glass top spanning across dual architectural geometric stainless steel column supports. Accommodates 6 to 8 people.',
    category: 'office',
    material: 'glass',
    price: 165000,
    dimensions: '220cm × 110cm × 75cm',
    images: [
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '18',
    slug: 'riviera-dining-set',
    name: 'Riviera Dining Set',
    description: 'Enjoy refined outdoor dining. Comprises a round dining table and 4 hand-woven synthetic rattan armchairs equipped with weather-resistant quick-dry seat cushions.',
    category: 'outdoor',
    material: 'rattan',
    price: 125000,
    dimensions: '120cm(dia) × 74cm',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '19',
    slug: 'canopy-day-bed',
    name: 'Canopy Day Bed',
    description: 'The ultimate luxury poolside escape. Made of heavy-duty synthetic rattan weave with an adjustable overhead canopy screen, thick water-repellent mattress padding, and four throw pillows.',
    category: 'outdoor',
    material: 'rattan',
    price: 185000,
    dimensions: '180cm × 180cm × 160cm',
    images: [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '20',
    slug: 'garden-lounger-pair',
    name: 'Garden Lounger Pair',
    description: 'A pair of sleek adjustable sun loungers. Handwoven rattan styling with rustproof aluminum internal frames. Features 5 reclining configurations for customizable comfort.',
    category: 'outdoor',
    material: 'rattan',
    price: 78000,
    dimensions: '200cm × 65cm × 35cm',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  }
];

export async function generateStaticParams() {
  return fallbackItems.map((item) => ({
    slug: item.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let product: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    const { data, error } = await supabase
      .from('furniture_items')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.warn('Could not find product in Supabase by slug, checking fallbackItems:', error);
      product = fallbackItems.find((item) => item.slug === slug) || null;
    } else {
      product = data;
    }
  } catch (err) {
    console.error('Connection error fetching product slug, checking fallbackItems:', err);
    product = fallbackItems.find((item) => item.slug === slug) || null;
  }

  if (!product) {
    notFound();
  }

  // Fetch 3 related items of same category
  try {
    const { data: relatedData, error: relatedErr } = await supabase
      .from('furniture_items')
      .select('*')
      .eq('category', product.category)
      .neq('id', product.id)
      .limit(3);

    if (relatedErr || !relatedData || relatedData.length === 0) {
      relatedProducts = fallbackItems
        .filter((item) => item.category === product!.category && item.slug !== product!.slug)
        .slice(0, 3);
    } else {
      relatedProducts = relatedData;
    }
  } catch {
    relatedProducts = fallbackItems
      .filter((item) => item.category === product.category && item.slug !== product.slug)
      .slice(0, 3);
  }

  // Format currency
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  // Friendly categories mapping
  const categoryNames: Record<string, string> = {
    living_room: 'Living Room',
    bedroom: 'Bedroom',
    dining: 'Dining',
    office: 'Office',
    outdoor: 'Outdoor',
  };

  const materialNames: Record<string, string> = {
    solid_wood: 'Solid Wood',
    metal: 'Metal',
    glass: 'Glass',
    upholstered: 'Upholstered',
    marble: 'Marble',
    rattan: 'Rattan',
  };

  return (
    <div className="bg-bg min-h-screen pt-28 pb-24 text-text">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Dynamic SEO Title simulation & Breadcrumb */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 font-inter text-[10px] tracking-widest uppercase text-muted">
            <Link href="/" className="hover:text-gold transition-colors duration-300">Home</Link>
            <span>/</span>
            <Link href="/catalogue" className="hover:text-gold transition-colors duration-300">Catalogue</Link>
            <span>/</span>
            <Link href={`/catalogue?room=${product.category}`} className="hover:text-gold transition-colors duration-300">
              {categoryNames[product.category] || product.category}
            </Link>
            <span>/</span>
            <span className="text-gold font-medium">{product.name}</span>
          </div>
        </div>

        {/* 60/40 Split Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-16 items-start">
          {/* LEFT SIDE - Gallery */}
          <div className="w-full">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* RIGHT SIDE - Product specs & Quote form */}
          <div className="space-y-8">
            <div>
              <span className="font-inter text-xs tracking-[0.2em] text-muted uppercase">
                {categoryNames[product.category] || product.category}
              </span>
              <h1 className="font-cormorant text-4xl md:text-5xl font-light tracking-wide text-text mt-2 uppercase">
                {product.name}
              </h1>
              <p className="font-inter text-xl font-semibold text-gold mt-4">
                {formattedPrice}
              </p>
            </div>

            <div className="w-full h-px bg-border/40" />

            <p className="font-inter text-sm leading-relaxed text-muted">
              {product.description}
            </p>

            {/* Specifications Box */}
            <div className="space-y-3 pt-2">
              <h3 className="font-inter text-xs font-semibold tracking-wider text-gold uppercase">
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-border/20 pt-3">
                <div className="flex flex-col">
                  <span className="font-inter text-[10px] uppercase tracking-wider text-muted">Material</span>
                  <span className="font-inter text-sm text-text font-medium mt-1">
                    {materialNames[product.material] || product.material}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-inter text-[10px] uppercase tracking-wider text-muted">Dimensions</span>
                  <span className="font-inter text-sm text-text font-medium mt-1">
                    {product.dimensions}
                  </span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="font-inter text-[10px] uppercase tracking-wider text-muted">Availability</span>
                  <span className="font-inter text-sm text-text font-medium mt-1">
                    {product.in_stock ? 'In Stock (Ready for Dispatch)' : 'Made to Order (4-6 weeks)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-border/40" />

            {/* Enquiry Form */}
            <EnquiryForm productName={product.name} productId={product.id} />
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-border/30">
            <h2 className="font-cormorant text-3xl font-light tracking-wider text-text mb-12 uppercase text-center md:text-left">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relProduct) => (
                <div key={relProduct.id} className="transition-all duration-500 hover:-translate-y-1">
                  <ProductCard product={relProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
