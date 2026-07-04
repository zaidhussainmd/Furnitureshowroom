'use client';

import { ChangeEvent } from 'react';
import { X } from 'lucide-react';

interface FilterState {
  room: string | null;
  material: string | null;
  priceMin: number;
  priceMax: number;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onClear: () => void;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onChange,
  onClear,
}: FilterDrawerProps) {
  if (!isOpen) return null;

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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const hasActiveFilters =
    filters.room !== null ||
    filters.material !== null ||
    filters.priceMin > 0 ||
    filters.priceMax < 250000;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end">
      {/* Tap outside area */}
      <div className="flex-grow" onClick={onClose} />

      {/* Drawer content */}
      <div className="bg-surface border-t border-gold/40 w-full max-h-[85vh] overflow-y-auto flex flex-col p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
          <h3 className="font-cormorant text-2xl font-light tracking-wide text-gold">
            Filter Collection
          </h3>
          <div className="flex items-center space-x-6">
            {hasActiveFilters && (
              <button
                onClick={onClear}
                className="font-inter text-[10px] tracking-widest uppercase text-muted hover:text-gold transition-colors duration-300"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="text-text/80 hover:text-gold transition-colors p-1"
              aria-label="Close filters"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Scrollable controls */}
        <div className="space-y-8 pb-8 flex-grow">
          {/* Room Filter */}
          <div className="space-y-4">
            <h4 className="font-inter text-xs font-semibold tracking-wider text-gold uppercase">
              Room Category
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {rooms.map((room) => {
                const isActive = filters.room === room.value;
                return (
                  <button
                    key={room.name}
                    onClick={() => handleRoomSelect(room.value)}
                    className={`w-full text-center font-inter text-xs tracking-wider uppercase py-3 px-2 border transition-all duration-300 rounded-none ${
                      isActive
                        ? 'border-gold bg-gold text-bg font-semibold'
                        : 'border-border/40 text-text/80'
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
              Material Choice
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {materials.map((mat) => {
                const isActive = filters.material === mat.value;
                return (
                  <button
                    key={mat.name}
                    onClick={() => handleMaterialSelect(mat.value)}
                    className={`w-full text-center font-inter text-xs tracking-wider uppercase py-3 px-2 border transition-all duration-300 rounded-none ${
                      isActive
                        ? 'border-gold bg-gold text-bg font-semibold'
                        : 'border-border/40 text-text/80'
                    }`}
                  >
                    {mat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-6">
            <h4 className="font-inter text-xs font-semibold tracking-wider text-gold uppercase">
              Price Boundary
            </h4>
            <div className="relative pt-2 pb-6">
              <div className="relative h-1 w-full bg-border rounded-none">
                <div
                  className="absolute h-full bg-gold"
                  style={{
                    left: `${(filters.priceMin / 250000) * 100}%`,
                    right: `${100 - (filters.priceMax / 250000) * 100}%`,
                  }}
                />
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
        </div>

        {/* View Results CTA */}
        <button
          onClick={onClose}
          className="w-full bg-gold text-bg py-4 font-inter text-xs tracking-widest uppercase font-semibold transition-all duration-300 hover:bg-gold-light border border-gold hover:border-gold-light rounded-none mt-auto"
        >
          Apply & View Results
        </button>
      </div>
    </div>
  );
}
