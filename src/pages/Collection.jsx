import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { SlidersHorizontal, ChevronRight, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { categories } from '../data/categories';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import SafeImage from '../components/SafeImage';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts.js';
import { useCollections } from '../hooks/useCollections.js';
import * as collectionsApi from '../api/collectionsApi.js';

function normalizeWeight(w) {
  if (!w) return '';
  return String(w)
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/gm$/, 'g')
    .replace(/grams?$/, 'g')
    .replace(/liters?$/, 'ltr')
    .replace(/litres?$/, 'ltr')
    .replace(/litre$/, 'ltr')
    .replace(/liter$/, 'ltr');
}

export default function Collection({ isDirectory: isDirectoryProp = false }) {
  const { slug } = useParams();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { products: apiProducts } = useProducts();
  const { collections: apiCollections } = useCollections();

  const allAvailableProducts = Array.isArray(apiProducts) ? apiProducts : [];

  // If path is exactly '/collections' or isDirectoryProp is true, show the collections directory
  const isDirectory = isDirectoryProp || (!slug && location.pathname === '/collections');

  const activeSlug = slug || 'all';

  const [apiCollectionProducts, setApiCollectionProducts] = useState(null);
  const [apiCollectionMeta, setApiCollectionMeta] = useState(null);
  const [isLoadingCollection, setIsLoadingCollection] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(10000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch collection by handle from server if slug is specified
  useEffect(() => {
    let isSubscribed = true;
    async function loadCollection() {
      if (!activeSlug || activeSlug === 'all') {
        setApiCollectionProducts(null);
        setApiCollectionMeta(null);
        setIsLoadingCollection(false);
        return;
      }
      setIsLoadingCollection(true);
      try {
        const colData = await collectionsApi.getCollectionByHandle(activeSlug);
        if (isSubscribed) {
          if (colData) {
            // When server returns collection data, use its products list (even if empty [])
            setApiCollectionProducts(Array.isArray(colData.products) ? colData.products : []);
            setApiCollectionMeta({
              title: colData.title,
              description: colData.description,
              image: colData.imageUrl || colData.image,
              productCount: colData.productCount ?? (Array.isArray(colData.products) ? colData.products.length : 0)
            });
          } else {
            setApiCollectionProducts(null);
            setApiCollectionMeta(null);
          }
        }
      } catch (err) {
        if (isSubscribed) {
          setApiCollectionProducts(null);
          setApiCollectionMeta(null);
        }
      } finally {
        if (isSubscribed) {
          setIsLoadingCollection(false);
        }
      }
    }

    loadCollection();
    return () => { isSubscribed = false; };
  }, [activeSlug]);

  // Reset scroll and filters on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedWeight('');
    setInStockOnly(false);
  }, [activeSlug, isDirectory]);

  // Localized title helper for category
  const getCategoryTitle = (cat) => {
    if (!cat) return '';
    if (language === 'gu' && cat.gujaratiName) return cat.gujaratiName;
    if (language === 'hi' && cat.hindiName) return cat.hindiName;
    return cat.title || cat.name || '';
  };

  const directoryCollections = useMemo(() => {
    const validApi = (apiCollections || []).filter(
      c => c.isActive && c.isDisplay && (c.imageUrl || c.image)
    );
    if (validApi.length > 0) {
      return validApi.map(c => ({
        id: c.id,
        name: c.title,
        title: c.title,
        handle: c.handle,
        slug: c.handle,
        path: `/collections/${c.handle}`,
        image: c.imageUrl || c.image,
        imageUrl: c.imageUrl || c.image,
        description: c.description || 'Authentic temple offering handcrafted with purity and devotion.',
        itemCount: c.productCount || 0,
        productCount: c.productCount || 0
      }));
    }
    const ALLOWED_ORDER = ['natural', 'namkeen', 'farali', 'sweets', 'best-seller'];
    return ALLOWED_ORDER
      .map(id => categories.find(c => c.id === id))
      .filter(Boolean);
  }, [apiCollections]);

  // Metadata for current collection
  const collectionMeta = useMemo(() => {
    const foundCat = categories.find(c => c.slug === activeSlug);

    // If API returned metadata for this collection, use the server's real title & description
    if (apiCollectionMeta && apiCollectionMeta.title) {
      const cleanDesc = apiCollectionMeta.description
        ? apiCollectionMeta.description.replace(/<[^>]+>/g, '').trim()
        : (foundCat?.description || '');

      return {
        title: getCategoryTitle(foundCat) || apiCollectionMeta.title,
        rawTitle: apiCollectionMeta.title,
        hindiTitle: foundCat?.hindiName || '',
        description: cleanDesc,
        image: apiCollectionMeta.image || foundCat?.image || ''
      };
    }

    if (foundCat) {
      return {
        title: getCategoryTitle(foundCat),
        rawTitle: foundCat.name,
        hindiTitle: foundCat.hindiName,
        description: foundCat.description,
        image: foundCat.image
      };
    }
    if (activeSlug === 'best-seller') {
      return {
        title: language === 'gu' ? 'બેસ્ટ સેલર' : language === 'hi' ? 'सर्वाधिक लोकप्रिय' : 'Best Seller Offerings',
        rawTitle: 'Best Seller',
        hindiTitle: 'सर्वाधिक लोकप्रिय',
        description: 'The most revered and ordered prasad items from NilkanthDham temple.'
      };
    }
    if (activeSlug === 'winter-special') {
      return {
        title: language === 'gu' ? 'વિન્ટર સ્પેશિયલ' : language === 'hi' ? 'विंटर स्पेशल' : 'Winter Special Sweets',
        rawTitle: 'Winter Special',
        hindiTitle: 'शीतकालीन विशेष',
        description: 'Nutritious dry fruit chikkis, gud sweets, and energizing winter delicacies.'
      };
    }
    if (activeSlug === 'sugar-free-sweets') {
      return {
        title: language === 'gu' ? 'સુગર ફ્રી મીઠાઈ' : language === 'hi' ? 'शुगर फ्री मिठाई' : 'Sugar Free Sweets',
        rawTitle: 'Sugar Free Sweets',
        hindiTitle: 'बिना चीनी की मिठाई',
        description: 'Naturally sweetened with Arabian dates and pure natural jaggery.'
      };
    }
    return {
      title: language === 'gu' ? 'તમામ પવિત્ર પ્રસાદમ્' : language === 'hi' ? 'સમસ્ત પ્રસાदम' : 'All Prasadam Offerings',
      rawTitle: 'All Offerings',
      hindiTitle: 'समस्त प्रसादम',
      description: 'Browse our complete catalog of pure satvik sweets, namkeen, and natural cow products.'
    };
  }, [activeSlug, language, apiCollectionMeta]);

  // Filter products by collection category
  const collectionProducts = useMemo(() => {
    // If loading from API, don't show stale/fallback products
    if (isLoadingCollection) {
      return [];
    }

    // If server collection products were fetched (even if 0 items []), use them strictly!
    if (apiCollectionProducts !== null) {
      return apiCollectionProducts;
    }

    // Fallback only for non-API collections or 'all'
    return allAvailableProducts.filter((p) => {
      if (activeSlug === 'all') return true;
      const lower = activeSlug.toLowerCase();
      if (lower === 'sweets') return p.category === 'Sweets';
      if (lower === 'namkeen') return p.category === 'Namkeen';
      if (lower === 'natural' || lower === 'natural-product' || lower === 'natural-products') {
        return p.category === 'Natural' || p.category === 'Natural Product';
      }
      if (lower === 'farali') return p.category === 'Farali' || p.title.toLowerCase().includes('farali');
      if (lower === 'ayurvedic' || lower === 'ayurvedic-products' || lower === 'ayurvedic-product') {
        return p.category === 'Ayurvedic' || p.productType === 'Ayurvedic' || (p.tags && p.tags.includes('Ayurvedic'));
      }
      if (lower === 'best-seller' || lower === 'best-sellers') return p.isBestSeller;
      if (lower === 'winter-special') {
        return p.slug.includes('churma') || p.slug.includes('chikki') || p.slug.includes('sukhadi') || (p.tags && p.tags.includes('Winter Special'));
      }
      if (lower === 'sugar-free-sweets' || lower === 'sugar-free') {
        return p.slug.includes('churma') || p.slug.includes('chikki') || p.slug.includes('sukhadi') || (p.tags && (p.tags.includes('Sugar Free') || p.tags.includes('Jaggery Sweet')));
      }

      // Dynamic fallback by category name or tag
      if (p.category && (p.category.toLowerCase() === lower || p.category.toLowerCase().replace(/\s+/g, '-') === lower)) {
        return true;
      }
      if (p.tags && p.tags.some(t => t.toLowerCase() === lower || t.toLowerCase().replace(/\s+/g, '-') === lower)) {
        return true;
      }
      return false;
    });
  }, [activeSlug, apiCollectionProducts, allAvailableProducts, isLoadingCollection]);

  // Dynamic Max Price for filters (ceiling of highest product/variant price, minimum 10000)
  const maxCollectionPrice = useMemo(() => {
    if (!collectionProducts || collectionProducts.length === 0) return 10000;
    const highest = Math.max(
      ...collectionProducts.map((p) => {
        const vPrices = (p.variants || []).map((v) => Number(v.price) || 0);
        return Math.max(Number(p.price) || 0, ...vPrices);
      }),
      0
    );
    return Math.max(10000, Math.ceil(highest / 500) * 500);
  }, [collectionProducts]);

  // Sync priceRange when maxCollectionPrice changes on collection switch
  useEffect(() => {
    setPriceRange(maxCollectionPrice);
  }, [maxCollectionPrice, activeSlug]);

  // Apply user filters and sorting
  const filteredProducts = useMemo(() => {
    let result = [...collectionProducts];

    // Filter: in stock
    if (inStockOnly) {
      result = result.filter(p => p.available);
    }

    // Filter: price range (when user adjusts slider below maximum)
    if (priceRange < maxCollectionPrice) {
      result = result.filter(p => {
        const minVariantPrice = (p.variants && p.variants.length > 0)
          ? Math.min(...p.variants.map(v => Number(v.price) || p.price))
          : p.price;
        return (p.price <= priceRange || minVariantPrice <= priceRange);
      });
    }

    // Filter: weight / pack size with fuzzy normalization
    if (selectedWeight) {
      const normSelected = normalizeWeight(selectedWeight);
      result = result.filter(p => {
        if (normalizeWeight(p.weight) === normSelected) return true;
        if (p.variants && p.variants.some(v => normalizeWeight(v.weight || v.title) === normSelected)) {
          return true;
        }
        return false;
      });
    }

    // Sort
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'best-selling':
        result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      case 'date-asc':
        result.sort((a, b) => a.id - b.id);
        break;
      case 'date-desc':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'relevant':
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [collectionProducts, inStockOnly, priceRange, maxCollectionPrice, selectedWeight, sortOption]);

  const handleResetFilters = () => {
    setSelectedWeight('');
    setInStockOnly(false);
    setPriceRange(maxCollectionPrice);
  };

  // 1. COLLECTIONS DIRECTORY VIEW (When user visits /collections)
  if (isDirectory) {
    return (
      <div className="py-8 bg-stone-50/50 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
            <Link to="/" className="hover:text-brand-maroon transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-bold text-brand-maroon">{t('collections_title', 'Collections')}</span>
          </nav>

          {/* Page Header */}
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon uppercase tracking-wider bg-brand-cream/60 px-3 py-1 rounded-full mb-3 border border-brand-maroon/10">
              <Sparkles className="w-3.5 h-3.5" />
              NilkanthDham Sacred Prasadam
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight font-serif mb-3">
              {t('collections_title', 'Product Collections')}
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {t('collections_subtitle', 'Browse all sanctified categories of NilkanthDham sacred prasad, handcrafted with purity and devotion.')}
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {directoryCollections.map((cat) => {
              const displayTitle = getCategoryTitle(cat);
              const count = cat.productCount || cat.itemCount || 0;

              return (
                <Link
                  key={cat.id || cat.handle}
                  to={cat.path || `/collections/${cat.handle || cat.slug || cat.id}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <SafeImage
                      src={cat.image}
                      alt={displayTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    {/* Item Count Badge */}
                    <div className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-xs text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Layers className="w-3 h-3 text-brand-maroon" />
                      <span>{count} {t('collections_items', 'Offerings')}</span>
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-lg sm:text-xl font-bold font-serif tracking-tight drop-shadow-sm">
                        {displayTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Card Description & CTA */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                    <p className="text-xs sm:text-[13px] text-stone-600 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-brand-maroon group-hover:text-brand-maroon-dark transition-colors">
                      <span>{t('collections_explore', 'Explore Collection')}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    );
  }

  // 2. SPECIFIC COLLECTION PRODUCTS VIEW (e.g. /collections/sweets)
  return (
    <div className="py-8 bg-stone-50/50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-5 flex-wrap">
          <Link to="/" className="hover:text-brand-maroon transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link to="/collections" className="hover:text-brand-maroon transition-colors">
            {t('collections_title', 'Collections')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-bold text-brand-maroon">{collectionMeta.title}</span>
        </nav>

        {/* Collection Quick Switcher Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeSlug === cat.slug;
            const title = getCategoryTitle(cat);

            return (
              <Link
                key={cat.id}
                to={cat.path}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? 'bg-[#700B10] text-white shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                }`}
              >
                {title}
              </Link>
            );
          })}
        </div>

        {/* Collection Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            {collectionMeta.hindiTitle && (
              <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest block mb-1">
                {collectionMeta.hindiTitle}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif">
              {collectionMeta.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xl leading-relaxed">
              {collectionMeta.description}
            </p>
          </div>
          <div className="bg-brand-maroon-subtle border border-brand-maroon/20 px-5 py-2.5 rounded-2xl text-center flex-shrink-0">
            <span className="text-xl sm:text-2xl font-black text-brand-maroon block leading-tight">
              {filteredProducts.length}
            </span>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {t('collections_items', 'Offerings Available')}
            </span>
          </div>
        </div>

        {/* Action Bar (Mobile Filter Button & Sort) */}
        <div className="flex items-center justify-between gap-4 mb-6 bg-white p-3 sm:p-4 rounded-2xl border border-stone-200/80 shadow-sm">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-maroon" />
            <span>{t('collections_filter_btn', 'Filters')}</span>
          </button>

          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            {t('collections_showing', 'Showing')}{' '}
            <strong className="text-stone-800">{filteredProducts.length}</strong>{' '}
            {t('collections_items', 'items')}
          </span>

          <div className="ml-auto">
            <SortDropdown value={sortOption} onChange={setSortOption} />
          </div>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="flex gap-8 items-start">
          {/* Filter Sidebar */}
          <FilterSidebar
            selectedWeight={selectedWeight}
            setSelectedWeight={setSelectedWeight}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPrice={maxCollectionPrice}
            onResetFilters={handleResetFilters}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {isLoadingCollection ? (
              <div className="py-20 text-center text-stone-400 font-medium text-sm animate-pulse bg-white rounded-2xl border border-stone-200/80 p-8">
                Loading offerings...
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
