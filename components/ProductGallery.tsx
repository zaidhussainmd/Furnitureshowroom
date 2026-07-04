'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc');

  return (
    <div className="space-y-4">
      {/* Primary Display Viewport */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface border border-border/40">
        <Image
          src={activeImage}
          alt={`${name} detail view`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-all duration-500"
          priority={true}
        />
      </div>

      {/* Thumbnail Matrix (scrollable horizontally if many) */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {images.map((img, index) => {
            const isActive = img === activeImage;
            return (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`relative h-20 w-24 flex-shrink-0 bg-surface border overflow-hidden rounded-none transition-all duration-300 ${
                  isActive ? 'border-gold scale-[0.98]' : 'border-border/40 hover:border-gold/50'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={img}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
