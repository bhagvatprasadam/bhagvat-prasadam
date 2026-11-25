import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({
  quantity = 1,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className = ''
}) {
  const handleDecrement = (e) => {
    e?.stopPropagation();
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = (e) => {
    e?.stopPropagation();
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const sizeStyles = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  };

  const btnPadding = {
    sm: 'w-7 px-1',
    md: 'w-9 px-2',
    lg: 'w-11 px-3'
  };

  return (
    <div
      className={`inline-flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white ${sizeStyles[size]} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className={`h-full ${btnPadding[size]} flex items-center justify-center text-stone-600 hover:text-brand-maroon hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="min-w-[2rem] px-2 text-center font-bold text-stone-800 select-none">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={`h-full ${btnPadding[size]} flex items-center justify-center text-stone-600 hover:text-brand-maroon hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors`}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
