import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

export default function FilterSidebar({
  selectedWeight,
  setSelectedWeight,
  inStockOnly,
  setInStockOnly,
  priceRange,
  setPriceRange,
  maxPrice = 10000,
  onResetFilters,
  isOpen = false,
  onClose = () => {}
}) {
  const weights = ['250g', '500g', '1kg', '1 Liter', '5 Liter', '15 Liter'];

  const filterContent = (
    <div className="space-y-6">
      {/* Availability Filter */}
      <div>
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
          Availability
        </h4>
        <label className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-brand-maroon focus:ring-brand-maroon/20 border-stone-300"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Max Price
          </h4>
          <span className="text-xs font-bold text-brand-maroon">
            Up to ₹{priceRange}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max={maxPrice}
          step="50"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-maroon"
        />
        <div className="flex justify-between text-[11px] text-stone-400 mt-1">
          <span>₹100</span>
          <span>₹{maxPrice}</span>
        </div>
      </div>

      {/* Weight / Pack Size Filter */}
      <div className="pt-4 border-t border-stone-200">
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
          Weight / Pack Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {weights.map((w) => {
            const isSelected = selectedWeight === w;
            return (
              <button
                key={w}
                type="button"
                onClick={() => setSelectedWeight(isSelected ? '' : w)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-maroon text-white border-brand-maroon shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-brand-maroon'
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Filter Button */}
      <div className="pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full text-xs font-bold text-stone-600 hover:text-brand-maroon py-2 px-3 rounded-lg border border-stone-200 hover:border-brand-maroon transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm h-fit sticky top-28">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-stone-100">
          <SlidersHorizontal className="w-4 h-4 text-brand-maroon" />
          <h3 className="text-sm font-extrabold text-stone-900">Filters</h3>
        </div>
        {filterContent}
      </div>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col z-10 animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <h3 className="text-base font-extrabold text-stone-900">Filters</h3>
              <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
