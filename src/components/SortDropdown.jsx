import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'title-asc', label: 'Alphabetically, A-Z' },
  { value: 'title-desc', label: 'Alphabetically, Z-A' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'date-asc', label: 'Date, old to new' },
  { value: 'date-desc', label: 'Date, new to old' }
];

export default function SortDropdown({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-stone-400 hidden sm:block" />
      <span className="text-xs font-semibold text-stone-500 hidden sm:inline">Sort by:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs sm:text-sm font-semibold text-stone-800 bg-white border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon shadow-sm cursor-pointer"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
