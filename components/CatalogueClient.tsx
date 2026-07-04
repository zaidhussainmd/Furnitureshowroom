'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import FilterSidebar from '@/components/FilterSidebar';
import FilterDrawer from '@/components/FilterDrawer';
import ProductCard from '@/components/ProductCard';

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

interface FilterState {
  room: string | null;
  material: string | null;
  priceMin: number;
  priceMax: number;
}

const initialFilters: FilterState = {
  room: null,
  material: null,
  priceMin: 0,
  priceMax: 250000,
};

// 20 Fallback items (matches seed script schema.sql)
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

function CatalogueClientContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('furniture_items')
          .select('*')
          .order('name', { ascending: true });

        if (error || !data || data.length === 0) {
          console.warn('Using fallback products list:', error);
          setProducts(fallbackItems);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching catalog, using local fallback:', err);
        setProducts(fallbackItems);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const roomParam = searchParams.get('room');
    if (roomParam) {
      setFilters((prev) => ({ ...prev, room: roomParam }));
    }
    const materialParam = searchParams.get('material');
    if (materialParam) {
      setFilters((prev) => ({ ...prev, material: materialParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];

    if (filters.room) {
      result = result.filter((item) => item.category === filters.room);
    }

    if (filters.material) {
      result = result.filter((item) => item.material === filters.material);
    }

    result = result.filter(
      (item) => item.price >= filters.priceMin && item.price <= filters.priceMax
    );

    setFilteredProducts(result);
  }, [filters, products]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    router.replace('/catalogue');
  };

  return (
    <div className="bg-bg min-h-screen pt-28 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="border-b border-border/40 pb-6 mb-12">
          <span className="font-inter text-xs tracking-[0.2em] text-gold uppercase font-medium">
            Showroom
          </span>
          <h1 className="font-cormorant text-4xl md:text-5xl font-light tracking-wide text-text mt-2 uppercase">
            The Catalogue Collection
          </h1>
          <p className="font-inter text-xs md:text-sm text-muted mt-2 max-w-2xl leading-relaxed">
            Exquisite designs across living spaces, bedrooms, offices, dining rooms, and garden terraces. Custom finishes and bespoke sizes are available upon request.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[260px_1fr] gap-12 items-start">
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/20 pb-4">
              <span className="font-inter text-xs tracking-wider text-muted">
                Showing <strong className="text-gold font-medium">{filteredProducts.length}</strong> of{' '}
                {products.length} pieces
              </span>

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-border py-2.5 px-4 font-inter text-xs tracking-wider uppercase text-text/80 hover:text-gold hover:border-gold transition-colors duration-300 rounded-none"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-surface h-96 border border-border/20 rounded-none" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-surface border border-border p-16 text-center max-w-xl mx-auto space-y-6">
                <p className="font-cormorant text-2xl font-light text-text">
                  No pieces match your selection
                </p>
                <p className="font-inter text-xs text-muted leading-relaxed">
                  Try adjusting your price boundaries, selecting other materials, or clearing all filters to browse our full collection.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="font-inter text-xs tracking-[0.2em] uppercase border border-gold text-gold hover:bg-gold hover:text-bg py-3 px-8 transition-all duration-300 font-medium rounded-none"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="transition-all duration-500 hover:-translate-y-1"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />
    </div>
  );
}

export default function CatalogueClient() {
  return (
    <Suspense fallback={
      <div className="bg-bg min-h-screen pt-28 flex items-center justify-center">
        <span className="font-inter text-xs tracking-widest text-gold uppercase animate-pulse">Loading Collection...</span>
      </div>
    }>
      <CatalogueClientContent />
    </Suspense>
  );
}
