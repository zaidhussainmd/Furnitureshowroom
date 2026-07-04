-- Maison & Co Database Schema Setup

-- 1. Create furniture_items table
CREATE TABLE IF NOT EXISTS furniture_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('living_room', 'bedroom', 'dining', 'office', 'outdoor')),
  material TEXT NOT NULL CHECK (material IN ('solid_wood', 'metal', 'glass', 'upholstered', 'marble', 'rattan')),
  price NUMERIC NOT NULL CHECK (price >= 0),
  dimensions TEXT NOT NULL,
  images TEXT[] NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_number TEXT UNIQUE NOT NULL,
  product_id UUID REFERENCES furniture_items(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  message TEXT,
  preferred_contact TEXT NOT NULL CHECK (preferred_contact IN ('whatsapp', 'call', 'email')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE furniture_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- 4. Set furniture_items RLS Policies
-- Allow anyone to read furniture items
CREATE POLICY "Allow public select on furniture_items" 
ON furniture_items FOR SELECT 
USING (true);

-- Allow authenticated admin full control on furniture items
CREATE POLICY "Allow admin CRUD on furniture_items" 
ON furniture_items FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Set enquiries RLS Policies
-- Allow anyone to insert an enquiry (public submission)
CREATE POLICY "Allow public insert on enquiries" 
ON enquiries FOR INSERT 
WITH CHECK (true);

-- Allow authenticated admin full control on enquiries
CREATE POLICY "Allow admin CRUD on enquiries" 
ON enquiries FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 6. Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_furniture_items_updated_at BEFORE UPDATE
ON furniture_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE
ON enquiries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 7. Seed 20 items into furniture_items
INSERT INTO furniture_items (slug, name, description, category, material, price, dimensions, images, featured, in_stock)
VALUES
  -- LIVING ROOM (5 items)
  (
    'venetian-sofa',
    'Venetian Sofa',
    'Indulge in absolute luxury. The Venetian Sofa is upholstered in premium plush velvet, offering deep-cushioned comfort with a hand-burnished solid beech frame. A timeless classic designed for elite living rooms.',
    'living_room',
    'upholstered',
    185000,
    '230cm × 100cm × 85cm',
    ARRAY[
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80'
    ],
    true,
    true
  ),
  (
    'onyx-coffee-table',
    'Onyx Coffee Table',
    'An exquisite center piece crafted from selected dark Nero Marquina marble, supported by a geometric gold-plated metal base. The perfect statement piece to ground your luxury living layout.',
    'living_room',
    'marble',
    78000,
    '110cm × 110cm × 40cm',
    ARRAY[
      'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'havana-lounge-chair',
    'Havana Lounge Chair',
    'A masterpiece of Mid-Century Scandinavian design. Features hand-stitched grain leather draped over a seasoned solid teak wood structure. Offers an ergonomically refined tilt for supreme relaxation.',
    'living_room',
    'solid_wood',
    95000,
    '85cm × 90cm × 95cm',
    ARRAY[
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'meridian-bookshelf',
    'Meridian Bookshelf',
    'An imposing and architectural shelving system built from solid dark oak. Designed with staggered open compartments to showcase premium books, art pieces, and collectibles with integrated LED channels.',
    'living_room',
    'solid_wood',
    62000,
    '120cm × 35cm × 200cm',
    ARRAY[
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'eclipse-tv-unit',
    'Eclipse TV Unit',
    'Sleek modern lines meet premium materials. Features a fluted dark metal chassis, frosted bronze glass doors, and a soft-closing drawer console. A perfect blend of technology housing and luxury design.',
    'living_room',
    'metal',
    88000,
    '200cm × 45cm × 50cm',
    ARRAY[
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),

  -- BEDROOM (4 items)
  (
    'palazzo-king-bed',
    'Palazzo King Bed',
    'The ultimate sanctuary anchor. Crafted in solid walnut wood with an imposing high headboard, padded and lined with luxury off-white Italian linen. Promises deep comfort and unmatched bedroom stature.',
    'bedroom',
    'solid_wood',
    220000,
    '220cm × 210cm × 140cm',
    ARRAY[
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'
    ],
    true,
    true
  ),
  (
    'noir-wardrobe',
    'Noir Wardrobe',
    'A double-door tall wardrobe masterfully detailed in ebonized oak wood. Internally organized with custom leather drawers, solid brass rods, and auto-illuminate micro-LED fixtures.',
    'bedroom',
    'solid_wood',
    175000,
    '150cm × 60cm × 220cm',
    ARRAY[
      'https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'marble-dreams-dresser',
    'Marble Dreams Dresser',
    'A stunning bedroom vanity unit featuring a honed Calacatta marble countertop, warm oak frame, and soft-closing circular drawers. Complete with a matching vanity mirror framed in brushed gold.',
    'bedroom',
    'marble',
    110000,
    '120cm × 50cm × 75cm',
    ARRAY[
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'velvet-bench',
    'Velvet Bench',
    'A sophisticated addition to place at the foot of your bed. Richly button-tufted upholstery sitting atop sleek, architectural steel legs with a matte-black powder finish.',
    'bedroom',
    'upholstered',
    45000,
    '140cm × 45cm × 45cm',
    ARRAY[
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),

  -- DINING (4 items)
  (
    'monarch-dining-table',
    'Monarch Dining Table',
    'Dine like royalty. Features a massive 8-seater polished marble slab top with rounded editorial edges, balanced on a structural pillar base made of ebonized solid ash wood.',
    'dining',
    'marble',
    195000,
    '240cm × 100cm × 76cm',
    ARRAY[
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80'
    ],
    true,
    true
  ),
  (
    'regal-dining-chair-set-of-6',
    'Regal Dining Chair set of 6',
    'A curated collection of six high-back dining chairs, expertly upholstered in spill-resistant boucle cream fabric, finished with solid walnut tapered legs and subtle gold tips.',
    'dining',
    'upholstered',
    142000,
    '50cm × 55cm × 90cm',
    ARRAY[
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'gatsby-bar-cabinet',
    'Gatsby Bar Cabinet',
    'Evoke the glamor of the roaring twenties. Crafted in rich walnut veneer with brass inlay detailing, ribbed glass doors, and mirrored interior backing. Stores up to 24 bottles and glassware.',
    'dining',
    'solid_wood',
    135000,
    '100cm × 45cm × 140cm',
    ARRAY[
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'crystal-sideboard',
    'Crystal Sideboard',
    'An elegant storage console for your formal dining room. Incorporates structured reeded glass doors set within a deep stained wooden shell, elevated on a slim carbon steel frame.',
    'dining',
    'glass',
    98000,
    '160cm × 45cm × 80cm',
    ARRAY[
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),

  -- OFFICE (4 items)
  (
    'executive-desk',
    'Executive Desk',
    'The pinnacle of office luxury. Built entirely of seasoned solid oak wood with hand-polished leather writing pad overlay, discrete cable bays, and 4 locking organizer drawers.',
    'office',
    'solid_wood',
    145000,
    '180cm × 85cm × 76cm',
    ARRAY[
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    true,
    true
  ),
  (
    'director-chair',
    'Director Chair',
    'Ergonomic perfection meets elite craftsmanship. Upholstered in buttery soft black grain leather, with syncro-tilt mechanisms, pneumatic height adjustments, and polished aluminum armrests.',
    'office',
    'upholstered',
    68000,
    '65cm × 65cm × 115cm',
    ARRAY[
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'heritage-bookcase',
    'Heritage Bookcase',
    'A grand, floor-to-ceiling library cabinet crafted from deep-cherry mahogany wood. Detailed with classical frame moldings, adjustable solid shelves, and twin lower cupboard units.',
    'office',
    'solid_wood',
    82000,
    '100cm × 40cm × 220cm',
    ARRAY[
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'glass-meeting-table',
    'Glass Meeting Table',
    'A crisp, modern boardroom design. Comprises a 15mm thick tempered glass top spanning across dual architectural geometric stainless steel column supports. Accommodates 6 to 8 people.',
    'office',
    'glass',
    165000,
    '220cm × 110cm × 75cm',
    ARRAY[
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),

  -- OUTDOOR (3 items)
  (
    'riviera-dining-set',
    'Riviera Dining Set',
    'Enjoy refined outdoor dining. Comprises a round dining table and 4 hand-woven synthetic rattan armchairs equipped with weather-resistant quick-dry seat cushions.',
    'outdoor',
    'rattan',
    125000,
    '120cm(dia) × 74cm',
    ARRAY[
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'canopy-day-bed',
    'Canopy Day Bed',
    'The ultimate luxury poolside escape. Made of heavy-duty synthetic rattan weave with an adjustable overhead canopy screen, thick water-repellent mattress padding, and four throw pillows.',
    'outdoor',
    'rattan',
    185000,
    '180cm × 180cm × 160cm',
    ARRAY[
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  ),
  (
    'garden-lounger-pair',
    'Garden Lounger Pair',
    'A pair of sleek adjustable sun loungers. Handwoven rattan styling with rustproof aluminum internal frames. Features 5 reclining configurations for customizable comfort.',
    'outdoor',
    'rattan',
    78000,
    '200cm × 65cm × 35cm',
    ARRAY[
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    true
  );
