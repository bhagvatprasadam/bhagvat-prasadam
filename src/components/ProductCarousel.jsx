import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductCarousel({ products = [] }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="relative group/carousel">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-stone-200 text-stone-700 hover:text-brand-maroon hover:border-brand-maroon flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 focus:opacity-100 hidden sm:flex"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Products Horizontal Slider */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x scroll-smooth no-scrollbar"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[260px] sm:w-[280px] flex-shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-stone-200 text-stone-700 hover:text-brand-maroon hover:border-brand-maroon flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 focus:opacity-100 hidden sm:flex"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
