import React, { useState, useRef, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Volume2, VolumeX, User, Heart, ShoppingBag, ChevronDown, Check } from 'lucide-react';
import { media } from '../data/media';
import { navigationLinks } from '../data/navigation';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getAuthToken } from '../utils/auth.js';
import { useProducts } from '../hooks/useProducts.js';
import { getTempleAudio, playTempleAudio, pauseTempleAudio, isTempleAudioPlaying } from '../utils/audio.js';
import SafeImage from './SafeImage';

export default function DesktopHeader() {
  const navigate = useNavigate();
  const { openCart, cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { language, setLanguage, t, languages } = useLanguage();
  const { isAuthenticated, openLoginModal } = useAuth();
  const { products: apiProducts } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => !isTempleAudioPlaying());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const closeTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Close search suggestions on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products live as user types without needing to press enter or click search
  const matchingProducts = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 1) return [];
    const q = searchQuery.toLowerCase().trim();
    const list = Array.isArray(apiProducts) ? apiProducts : [];
    return list.filter(p => {
      const titleMatch = p.title?.toLowerCase().includes(q);
      const handleMatch = p.handle?.toLowerCase().includes(q);
      const tagMatch = p.tags && Array.isArray(p.tags) && p.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(q));
      const descMatch = p.description?.toLowerCase().includes(q);
      const catMatch = p.category?.toLowerCase().includes(q);
      return titleMatch || handleMatch || tagMatch || descMatch || catMatch;
    }).slice(0, 12);
  }, [searchQuery, apiProducts]);

  // Sync isMuted state with audio play/pause events
  React.useEffect(() => {
    const audio = getTempleAudio();
    if (!audio) return;

    const handlePlay = () => setIsMuted(false);
    const handlePause = () => setIsMuted(true);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleCloseDropdown();
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleSound = () => {
    if (isMuted) {
      playTempleAudio();
    } else {
      pauseTempleAudio();
    }
  };

  const handleMouseEnter = (item) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (item.hasMegaMenu || (item.subItems && item.subItems.length > 0)) {
      setActiveDropdown(item.name);
    } else {
      setActiveDropdown(null);
    }
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleCloseDropdown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(null);
    setIsLangOpen(false);
  };

  const getNavLabel = (item) => {
    switch (item.name) {
      case 'Sweets': return t('nav_sweets');
      case 'Namkeen': return t('nav_namkeen');
      case 'Natural Products': return t('nav_natural');
      case 'Sugar Free Sweets': return t('nav_sugar_free');
      case 'Our Gau Dham': return t('nav_gau_dham');
      case 'Others': return t('nav_others');
      case 'Offers': return t('nav_offers');
      case 'More': return t('nav_more');
      default: return item.name;
    }
  };

  const getSubItemLabel = (sub) => {
    if (sub.name === 'Winter Special') return t('sub_winter_special');
    if (sub.name === 'Kaju Katli') return t('sub_kaju_katli');
    if (sub.name === 'Mohanthal') return t('sub_mohanthal');
    if (sub.name === 'Dry Fruits Chikki') return t('sub_dry_fruits_chikki');
    if (sub.name === 'Kesar Peda') return t('sub_kesar_peda');
    if (sub.name === 'Motichur Laddu') return t('sub_motichur_laddu');
    if (sub.name === 'Boondi Laddu') return t('sub_boondi_laddu');
    if (sub.name === 'Churma Ladoo in Jaggery') return t('sub_churma_ladoo');
    if (sub.name === 'More..' || sub.name === 'More...') return t('sub_more');
    if (sub.name === 'Banana Mari Wafer') return t('sub_banana_mari_wafer');
    if (sub.name === 'Aaloo Sev') return t('sub_aaloo_sev');
    if (sub.name === 'Banana Masala Wafer') return t('sub_banana_masala_wafer');
    if (sub.name === 'Bhavnagari Gathiya') return t('sub_bhavnagari_gathiya');
    if (sub.name === 'Kela Farali Chivda Meetha') return t('sub_kela_farali_chivda');
    if (sub.name === 'Mix Chavanu') return t('sub_mix_chavanu');
    if (sub.name === 'Traditional Desi Cow Ghee') return t('sub_desi_cow_ghee');
    if (sub.name === 'Cow Ghee (Gir Cow Ghee)') return t('sub_gir_cow_ghee');
    if (sub.name === 'Groundnut Oil') return t('sub_groundnut_oil');
    if (sub.name === 'Jaggery (Desi Gud)') return t('sub_desi_gud');
    if (sub.name === 'Khichdi Rice') return t('sub_khichdi_rice');
    if (sub.name === 'Red Rice') return t('sub_red_rice');
    if (sub.name === 'Sindhav Salt') return t('sub_sindhav_salt');
    if (sub.name === 'Farali') return t('sub_farali');
    if (sub.name === 'Ayurvedic Product') return t('sub_ayurvedic');
    if (sub.name === 'Our Cows') return t('sub_our_cows');
    return sub.name;
  };

  // Current active mega menu item (full-width)
  const activeMegaMenuItem = navigationLinks.find(
    item => item.name === activeDropdown && item.hasMegaMenu && !item.isSimpleDropdown
  );

  // Dynamically resolve featured products for the active mega menu dropdown
  const dynamicFeaturedProducts = useMemo(() => {
    if (!activeMegaMenuItem) return [];

    const catName = (activeMegaMenuItem.name || '').toLowerCase();
    const allProducts = Array.isArray(apiProducts) ? apiProducts : [];

    let candidates = [];

    if (catName.includes('sweet')) {
      candidates = allProducts.filter(p =>
        p.category === 'Sweets' ||
        p.productType?.toLowerCase().includes('sweet') ||
        ['sweet', 'mithai', 'ladoo', 'chikki', 'barfi', 'mohanthal', 'halwa', 'peda', 'sukhadi', 'katli', 'pak', 'jalebi']
          .some(k => p.title?.toLowerCase().includes(k) || p.slug?.toLowerCase().includes(k))
      );
    } else if (catName.includes('namkeen')) {
      candidates = allProducts.filter(p =>
        p.category === 'Namkeen' ||
        p.productType?.toLowerCase().includes('namkeen') ||
        ['namkeen', 'wafer', 'chips', 'chavanu', 'sev', 'gathiya', 'farsan', 'chivda', 'kachri']
          .some(k => p.title?.toLowerCase().includes(k) || p.slug?.toLowerCase().includes(k))
      );
    } else if (catName.includes('natural') || catName.includes('gau dham')) {
      candidates = allProducts.filter(p =>
        p.category === 'Natural' ||
        p.category === 'Natural Product' ||
        ['ghee', 'oil', 'rice', 'jaggery', 'gud', 'salt', 'honey', 'natural', 'organic', 'agarbatti', 'dhoop', 'attar', 'perfume']
          .some(k => p.title?.toLowerCase().includes(k) || p.slug?.toLowerCase().includes(k))
      );
    } else if (catName.includes('sugar free')) {
      candidates = allProducts.filter(p =>
        p.tags?.some(t => t.toLowerCase().includes('sugar free')) ||
        ['sugar free', 'date', 'khajur', 'jaggery']
          .some(k => p.title?.toLowerCase().includes(k) || p.slug?.toLowerCase().includes(k))
      );
    } else {
      candidates = allProducts.filter(p => 
        p.isBestSeller || 
        p.isFeatured || 
        (p.discount && p.discount > 0) ||
        p.title?.toLowerCase().includes(catName)
      );
    }

    // Deduplicate
    const unique = [];
    const seen = new Set();
    for (const p of candidates) {
      const key = String(p.id || p.handle || p.slug);
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(p);
      }
    }

    if (unique.length >= 3) {
      return unique.slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        path: `/products/${p.handle || p.slug || p.id}`,
        image: p.image || p.imageUrl,
        price: p.price,
        comparePrice: p.comparePrice,
        discount: p.discount || (p.comparePrice && p.comparePrice > p.price ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) : null)
      }));
    }

    return activeMegaMenuItem.featuredProducts || [];
  }, [activeMegaMenuItem, apiProducts]);

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="hidden lg:block bg-white border-b border-stone-200 relative">
      {/* Main Top Header Bar */}
      <div className="max-w-[1480px] mx-auto px-2 xl:px-8 flex items-center justify-between gap-2 xl:gap-4">
        
        {/* Left: Official Logo */}
        <Link to="/" onClick={handleCloseDropdown} className="flex-shrink-0 flex items-center py-2">
          <img
            src={media.logo}
            alt="Bhagvat Prasadam"
            className="h-11 xl:h-14 w-auto object-contain transition-transform duration-200 hover:scale-105"
            width="137"
            height="86"
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = media.logoLarge || 'https://bhagvatprasadam.com/cdn/shop/files/098.png?v=1785329567';
            }}
          />
        </Link>

        {/* Center: Navigation Links */}
        <nav className="flex items-center space-x-2 xl:space-x-6 text-[12.5px] 2xl:text-[14.5px] font-normal text-stone-800 whitespace-nowrap h-full">
          {navigationLinks.map((item) => {
            const isOpen = activeDropdown === item.name;

            return (
              <div
                key={item.name}
                className={item.isSimpleDropdown ? "relative py-3.5" : "py-3.5"}
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
              >
                <NavLink
                  to={item.path}
                  onClick={handleCloseDropdown}
                  className={({ isActive }) =>
                    `relative transition-colors duration-150 inline-block pb-1 ${
                      isActive || isOpen
                        ? 'text-stone-950 font-medium border-b-2 border-stone-900'
                        : 'text-stone-700 hover:text-stone-950 border-b-2 border-transparent'
                    }`
                  }
                >
                  <span>{getNavLabel(item)}</span>
                </NavLink>

                {/* Simple Dropdown for "More" */}
                {isOpen && item.isSimpleDropdown && item.subItems && (
                  <div
                    className="absolute top-full left-0 mt-0 w-60 bg-white rounded-xl shadow-xl border border-stone-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseEnter={() => {
                      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.subItems.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        to={sub.path}
                        onClick={handleCloseDropdown}
                        className="group flex flex-col px-4 py-2 hover:bg-stone-50 transition-colors"
                      >
                        <span className="text-xs font-semibold text-stone-800 group-hover:text-brand-maroon transition-colors">
                          {getSubItemLabel(sub)}
                        </span>
                        {sub.description && (
                          <span className="text-[11px] text-stone-400 group-hover:text-stone-500 transition-colors mt-0.5">
                            {sub.description}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Language Selector Dropdown */}
          <div
            className="relative border-l border-stone-200 pl-2 xl:pl-4 py-3.5"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 text-stone-700 hover:text-stone-950 transition-colors text-[13px] xl:text-[13.5px] font-medium"
            >
              <span>{currentLangObj.nativeLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangOpen ? 'rotate-180 text-stone-900' : 'text-stone-500'}`} />
            </button>

            {isLangOpen && (
              <div className="absolute top-full left-0 mt-0 w-44 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center justify-between w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      language === lang.code
                        ? 'text-brand-maroon font-bold bg-brand-maroon-subtle'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-brand-maroon'
                    }`}
                  >
                    <span>{lang.nativeLabel} ({lang.label})</span>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-brand-maroon" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Search Input + Action Icons */}
        <div className="flex items-center gap-2 xl:gap-4">
          <div ref={searchContainerRef} className="relative">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center rounded-lg overflow-hidden border border-stone-300/80 bg-[#F4F4F4] focus-within:ring-1 focus-within:ring-brand-maroon focus-within:border-brand-maroon transition-all shadow-inner"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setIsSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsSearchOpen(false);
                }}
                placeholder={t('search_placeholder')}
                className="bg-transparent text-xs xl:text-sm px-2.5 xl:px-3.5 py-1.5 w-32 xl:w-56 focus:w-44 xl:focus:w-64 transition-all focus:outline-none text-stone-800 placeholder-stone-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="text-stone-400 hover:text-stone-700 text-xs px-2 font-medium transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="bg-[#700B10] hover:bg-[#52060A] text-white px-2.5 xl:px-3 py-2 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Search"
              >
                <SearchIcon className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Floating Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-[460px] xl:w-[520px] bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden animate-fadeIn">
                <div className="max-h-[500px] overflow-y-auto p-4 scrollbar-thin">
                  {matchingProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {matchingProducts.map((product) => {
                        const price = Number(product.price) || 0;
                        const comparePrice = Number(product.compareAtPrice || product.compare_at_price || product.comparePrice) || 0;
                        const discount = comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
                        const img = product.image || product.featured_image || (Array.isArray(product.images) ? product.images[0] : '') || '';
                        const slug = product.slug || product.handle || product.id;

                        return (
                          <div
                            key={product.id || slug}
                            onClick={() => {
                              handleCloseDropdown();
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              navigate(`/products/${slug}`);
                            }}
                            className="group cursor-pointer flex flex-col p-1.5 rounded-xl hover:bg-stone-50 transition-colors"
                          >
                            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 mb-2">
                              <SafeImage
                                src={img}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <h4 className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-brand-maroon transition-colors line-clamp-2 leading-snug">
                              {product.title}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              {comparePrice > price && (
                                <span className="text-xs text-stone-400 line-through">₹{comparePrice}</span>
                              )}
                              <span className="text-xs sm:text-sm font-extrabold text-stone-900">₹{price}</span>
                              {discount > 0 && (
                                <span className="bg-[#EAB308] text-stone-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase">
                                  {discount}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-10 text-center text-xs text-stone-500">
                      No products found for &ldquo;<span className="font-semibold text-stone-800">{searchQuery}</span>&rdquo;
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Icons Row: Sound, User, Wishlist, Cart */}
          <div className="flex items-center space-x-2 xl:space-x-3.5 text-stone-800 flex-shrink-0">
            {/* Ambient Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="text-stone-700 hover:text-brand-maroon transition-colors"
              aria-label={isMuted ? t('temple_sound_off') : t('temple_sound_on')}
              title={isMuted ? t('temple_sound_off') : t('temple_sound_on')}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 stroke-[1.6]" />
              ) : (
                <Volume2 className="w-5 h-5 stroke-[1.6] text-brand-maroon animate-pulse" />
              )}
            </button>

            {/* User Account */}
            <button
              type="button"
              onClick={() => {
                handleCloseDropdown();
                const isLogged = isAuthenticated || Boolean(getAuthToken());
                if (isLogged) {
                  navigate('/account');
                } else {
                  openLoginModal();
                }
              }}
              className="text-stone-700 hover:text-brand-maroon transition-colors flex items-center cursor-pointer"
              aria-label={(isAuthenticated || Boolean(getAuthToken())) ? t('account') : 'Sign In'}
              title={(isAuthenticated || Boolean(getAuthToken())) ? t('account') : 'Sign In'}
            >
              <User className="w-5 h-5 stroke-[1.6]" />
            </button>

            {/* Wishlist Heart */}
            <Link
              to="/wishlist"
              onClick={handleCloseDropdown}
              className="text-stone-700 hover:text-brand-maroon transition-colors relative"
              aria-label={t('wishlist')}
              title={t('wishlist')}
            >
              <Heart className="w-5 h-5 stroke-[1.6]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-maroon text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Bag */}
            <button
              type="button"
              onClick={() => {
                handleCloseDropdown();
                openCart();
              }}
              className="text-stone-700 hover:text-brand-maroon transition-colors relative"
              aria-label={t('cart')}
              title={t('cart')}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-maroon text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Full-Width Dropdown Menu Matching Exactly Bhagvat Prasadam Store */}
      {activeMegaMenuItem && (
        <div
          className="absolute top-full left-0 right-0 w-full bg-white border-t border-stone-200 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={() => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Invisible hit-test bridge preventing accidental hover loss */}
          <div className="absolute -top-2 inset-x-0 h-2 bg-transparent pointer-events-auto" />

          <div className="max-w-[1480px] mx-auto px-6 xl:px-8 pt-5 pb-8 flex items-start justify-between gap-8 xl:gap-14">
            
            {/* Left Column: Clean Category/Product Text Links List */}
            <div className="w-60 xl:w-64 flex-shrink-0 flex flex-col space-y-2.5">
              {activeMegaMenuItem.subItems && activeMegaMenuItem.subItems.map((sub, sIdx) => (
                <Link
                  key={sIdx}
                  to={sub.path}
                  onClick={handleCloseDropdown}
                  className="text-[14px] xl:text-[14.5px] text-stone-800 hover:text-brand-maroon transition-colors font-normal block leading-tight"
                >
                  {getSubItemLabel(sub)}
                </Link>
              ))}
            </div>

            {/* Right Column: 3 Dynamic Product Cards with Real Image, Title, Strikethrough Price, Sale Price & % OFF Badge */}
            {dynamicFeaturedProducts && dynamicFeaturedProducts.length > 0 && (
              <div className="flex-1 grid grid-cols-3 gap-5 xl:gap-8">
                {dynamicFeaturedProducts.map((prod, pIdx) => (
                  <Link
                    key={pIdx}
                    to={prod.path || `/products/${prod.handle || prod.slug || prod.id}`}
                    onClick={handleCloseDropdown}
                    className="group/card flex flex-col"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square w-full rounded-none overflow-hidden bg-stone-100">
                      <SafeImage
                        src={prod.image || prod.imageUrl}
                        alt={prod.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                        fallbackText={prod.title}
                      />
                    </div>

                    {/* Product Title */}
                    <h4 className="text-[13px] xl:text-[13.5px] font-normal text-stone-800 line-clamp-2 mt-2 leading-snug group-hover/card:text-brand-maroon transition-colors" title={prod.title}>
                      {prod.title}
                    </h4>

                    {/* Pricing Row: Strikethrough Regular Price, Current Sale Price, Yellow OFF Badge */}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {prod.comparePrice && (
                        <span className="text-[12px] text-stone-400 line-through font-normal">
                          ₹{prod.comparePrice}
                        </span>
                      )}
                      <span className="text-[13px] font-bold text-stone-900">
                        ₹{prod.price}
                      </span>
                      {prod.discount && prod.discount > 0 && (
                        <span className="bg-[#FACC15] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] leading-tight uppercase">
                          {prod.discount}% {t('off_badge', 'OFF')}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
