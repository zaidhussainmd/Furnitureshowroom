import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    category: string;
    material: string;
    price: number;
    images: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // Format price as Indian Rupees (INR) without decimals
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  // Map database categories to nice display names
  const categoryLabels: Record<string, string> = {
    living_room: 'Living Room',
    bedroom: 'Bedroom',
    dining: 'Dining',
    office: 'Office',
    outdoor: 'Outdoor',
  };

  return (
    <Link
      href={`/catalogue/${product.slug}`}
      className="group block bg-surface border border-border/40 hover:border-gold transition-all duration-500 overflow-hidden h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
      </div>

      {/* Info Container */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div>
          <span className="font-inter text-[10px] tracking-[0.2em] text-muted uppercase font-medium">
            {categoryLabels[product.category] || product.category}
          </span>
          <h3 className="font-cormorant text-xl md:text-2xl font-light text-text mt-1 tracking-wide leading-tight group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="font-inter text-sm md:text-base font-semibold text-gold">
            {formattedPrice}
          </span>
          <span className="font-inter text-xs tracking-widest text-gold uppercase border-b border-transparent group-hover:border-gold pb-0.5 transition-all duration-300">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
