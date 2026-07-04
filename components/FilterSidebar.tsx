'use client';

import { ChangeEvent } from 'react';

interface FilterState {
  room: string | null;
  material: string | null;
  priceMin: number;
  priceMax: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onClear: () => void;
}

export default function FilterSidebar({ filters, onChange, onClear }: FilterSidebarProps) {
  const rooms = [
    { name: 'All Rooms', value: null },
    { name: 'Living Room', value: 'living_room' },
    { name: 'Bedroom', value: 'bedroom' },
    { name: 'Dining', value: 'dining' },
    { name: 'Office', value: 'office' },
    { name: 'Outdoor', value: 'outdoor' },
  ];

  const materials = [
    { name: 'All Materials', value: null },
    { name: 'Solid Wood', value: 'solid_wood' },
    { name: 'Metal', value: 'metal' },
    { name: 'Glass', value: 'glass' },
    { name: 'Upholstered', value: 'upholstered' },
    { name: 'Marble', value: 'marble' },
    { name: 'Rattan', value: 'rattan' },
  ];

  const handleRoomSelect = (val: string | null) => {
    onChange({ ...filters, room: val });
  };

  const handleMaterialSelect = (val: string | null) => {
    onChange({ ...filters, material: val });
  };

  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), filters.priceMax - 10000);
    onChange({ ...filters, priceMin: val });
  };

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), filters.priceMin + 10000);
    onChange({ ...filters, priceMax: val });
  };

  const hasActiveFilters =
    filters.room !== null ||
    filters.material !== null ||
    filters.priceMin > 0 ||
    filters.priceMax < 250000;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <aside className="w-full space-y-10">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="font-cormorant text-xl font-medium tracking-wider text-text uppercase">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="font-inter text-[10px] tracking-widest uppercase text-gold hover:text-gold-light transition-colors duration-300"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Room Category Filter */}
      <div className="space-y-4">
        <h4 className="font-inter text-xs font-semibold tracking-wider text-gold uppercase">
          Room
        </h4>
        <div className="flex flex-col space-y-2">
          {rooms.map((room) => {
            const isActive = filters.room === room.value;
            return (
              <button
                key={room.name}
                onClick={() => handleRoomSelect(room.value)}
                className={`w-full text-left font-inter text-xs tracking-wider uppercase py-2 px-3 border transition-all duration-300 rounded-none ${
                  isActive
                    ? 'border-gold bg-gold text-bg font-semibold'
                    : 'border-border/40 hover:border-gold/50 text-text/80'
                }`}
              >
                {room.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Material Filter */}
      <div className="space-y-4">
        <h4 className="font-inter text-xs font-semibold tracking-wider text-gold uppercase">
          Material
        </h4>
        <div className="flex flex-col space-y-2">
          {materials.map((mat) => {
            const isActive = filters.material === mat.value;
            return (
              <button
                key={mat.name}
                onClick={() => handleMaterialSelect(mat.value)}
                className={`w-full text-left font-inter text-xs tracking-wider uppercase py-2 px-3 border transition-all duration-300 rounded-none ${
                  isActive
                    ? 'border-gold bg-gold text-bg font-semibold'
                    : 'border-border/40 hover:border-gold/50 text-text/80'
                }`}
              >
                {mat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Dual Range Slider */}
      <div className="space-y-6">
        <h4 className="font-inter text-xs font-semibold tracking-wider text-gold uppercase">
          Price Range
        </h4>
        <div className="relative pt-2 pb-6">
          {/* Dual Range input overlap */}
          <div className="relative h-1 w-full bg-border rounded-none">
            {/* Highlighted track bar */}
            <div
              className="absolute h-full bg-gold"
              style={{
                left: `${(filters.priceMin / 250000) * 100}%`,
                right: `${100 - (filters.priceMax / 250000) * 100}%`,
              }}
            />
            {/* Range min slider */}
            <input
              type="range"
              min="0"
              max="250000"
              step="5000"
              value={filters.priceMin}
              onChange={handleMinPriceChange}
              className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-transparent appearance-none pointer-events-none focus:outline-none"
              style={{ WebkitAppearance: 'none' }}
            />
            {/* Range max slider */}
            <input
              type="range"
              min="0"
              max="250000"
              step="5000"
              value={filters.priceMax}
              onChange={handleMaxPriceChange}
              className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-transparent appearance-none pointer-events-none focus:outline-none"
              style={{ WebkitAppearance: 'none' }}
            />
          </div>
          {/* Min Max text readouts */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex flex-col">
              <span className="font-inter text-[9px] uppercase tracking-wider text-muted">Min</span>
              <span className="font-inter text-xs font-medium text-gold">{formatCurrency(filters.priceMin)}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-inter text-[9px] uppercase tracking-wider text-muted">Max</span>
              <span className="font-inter text-xs font-medium text-gold">{formatCurrency(filters.priceMax)}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
