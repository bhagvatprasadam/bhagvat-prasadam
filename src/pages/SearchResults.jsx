import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import { useProducts } from '../hooks/useProducts.js';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products: apiProducts } = useProducts();
  const allProducts = Array.isArray(apiProducts) ? apiProducts : [];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allProducts.filter((p) =>
      p.title?.toLowerCase().includes(q) ||
      p.subtitle?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      (p.hindiTitle && p.hindiTitle.toLowerCase().includes(q)) ||
      (p.gujaratiTitle && p.gujaratiTitle.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }, [query, allProducts]);

  return (
    <div className="py-10 bg-stone-50/50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        {/* Search Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm mb-8 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest block mb-2">
            Search Prasad Offerings
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-6">
            {query ? (
              <>Results for <span className="text-brand-maroon">&ldquo;{query}&rdquo;</span></>
            ) : (
              'Search Our Offerings'
            )}
          </h1>

          <div className="max-w-xl mx-auto">
            <SearchBar />
          </div>

          {query && (
            <p className="text-xs sm:text-sm text-stone-500 mt-4">
              Found <strong className="text-brand-maroon">{results.length}</strong> sanctified items matching your search
            </p>
          )}
        </div>

        {/* Results Grid or Empty State */}
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto border border-stone-200/80 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-brand-cream text-brand-maroon flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">
              No matching products found
            </h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try checking the spelling or browse our popular categories below.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                to="/collections/sweets"
                className="text-xs font-bold bg-brand-cream text-brand-maroon hover:bg-brand-maroon hover:text-white px-4 py-2 rounded-full transition-colors"
              >
                Sweets
              </Link>
              <Link
                to="/collections/namkeen"
                className="text-xs font-bold bg-brand-cream text-brand-maroon hover:bg-brand-maroon hover:text-white px-4 py-2 rounded-full transition-colors"
              >
                Namkeen
              </Link>
              <Link
                to="/collections/natural"
                className="text-xs font-bold bg-brand-cream text-brand-maroon hover:bg-brand-maroon hover:text-white px-4 py-2 rounded-full transition-colors"
              >
                Gir Cow Ghee
              </Link>
              <Link
                to="/collections/best-seller"
                className="text-xs font-bold bg-brand-cream text-brand-maroon hover:bg-brand-maroon hover:text-white px-4 py-2 rounded-full transition-colors"
              >
                Best Sellers
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
