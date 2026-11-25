import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
  emptyMessage = "No products found in this category."
}) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-stone-50 rounded-2xl border border-stone-200/80 p-8 my-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-stone-800 mb-1">{emptyMessage}</h3>
        <p className="text-sm text-stone-500 max-w-sm mx-auto">
          Please check another category or adjust your filter selection to discover divine prasad items.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
