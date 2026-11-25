import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts.js';
import SafeImage from './SafeImage';

export default function SearchBar({ isMobile = false, onClose = () => {} }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const { products: apiProducts } = useProducts();
  const productsList = Array.isArray(apiProducts) ? apiProducts : [];

  // Filter matching products from live API
  const matchingProducts = query.trim().length >= 1
    ? productsList.filter(p => {
        const q = query.toLowerCase();
        return (
          p.title?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.handle?.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(q)))
        );
      }).slice(0, 8)
    : [];

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      onClose();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (slug) => {
    setIsOpen(false);
    setQuery('');
    onClose();
    navigate(`/products/${slug}`);
  };

  return (
    <div ref={searchContainerRef} className={`relative w-full ${isMobile ? '' : 'max-w-xl'}`}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for Sweets, Namkeen, Ghee, Powders..."
          className="w-full pl-10 pr-10 py-2 sm:py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:border-brand-maroon focus:bg-white focus:ring-2 focus:ring-brand-maroon/10 transition-all duration-200 shadow-sm"
        />
        <SearchIcon className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 absolute right-3"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Instant Suggestions Dropdown */}
      {isOpen && query.trim().length >= 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-fade-in">
          {matchingProducts.length > 0 ? (
            <div className="p-3">
              <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2 pb-2 border-b border-stone-100 flex items-center justify-between">
                <span>Products ({matchingProducts.length})</span>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setIsOpen(false);
                  }}
                  className="text-stone-400 hover:text-stone-700 font-medium normal-case"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2 max-h-[420px] overflow-y-auto p-1">
                {matchingProducts.map((item) => {
                  const price = Number(item.price) || 0;
                  const comparePrice = Number(item.compareAtPrice || item.compare_at_price || item.comparePrice) || 0;
                  const discount = comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
                  const img = item.image || item.featured_image || (Array.isArray(item.images) ? item.images[0] : '') || '';
                  const slug = item.slug || item.handle || item.id;

                  return (
                    <div
                      key={item.id || slug}
                      onClick={() => handleSelectProduct(slug)}
                      className="group cursor-pointer flex flex-col p-1.5 rounded-xl hover:bg-stone-50 transition-colors"
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 mb-2">
                        <SafeImage
                          src={img}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="text-xs font-semibold text-stone-900 group-hover:text-brand-maroon transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {comparePrice > price && (
                          <span className="text-[11px] text-stone-400 line-through">₹{comparePrice}</span>
                        )}
                        <span className="text-xs font-extrabold text-stone-900">₹{price}</span>
                        {discount > 0 && (
                          <span className="bg-[#EAB308] text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full mt-2 py-2 text-center text-xs font-semibold text-brand-maroon bg-stone-50 hover:bg-brand-maroon hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View all results for &ldquo;{query}&rdquo;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-stone-500 text-sm">
              <p className="font-medium text-stone-700">No products found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-stone-400 mt-1">Try searching for &quot;Mohanthal&quot;, &quot;Ghee&quot;, or &quot;Namkeen&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
