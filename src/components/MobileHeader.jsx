import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, Search, ChevronDown, PhoneCall, User, Check, LogIn, Volume2, VolumeX } from 'lucide-react';
import { media } from '../data/media';
import { navigationLinks } from '../data/navigation';
import { siteConfig } from '../data/siteConfig';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getAuthToken } from '../utils/auth.js';
import { getTempleAudio, playTempleAudio, pauseTempleAudio, isTempleAudioPlaying } from '../utils/audio.js';
import SearchBar from './SearchBar';
import SafeImage from './SafeImage';

export default function MobileHeader() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isMuted, setIsMuted] = useState(() => !isTempleAudioPlaying());

  useEffect(() => {
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

  const toggleSound = () => {
    if (isMuted) {
      playTempleAudio();
    } else {
      pauseTempleAudio();
    }
  };

  const { openCart, cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { language, setLanguage, t, languages } = useLanguage();
  const { isAuthenticated, customer, openLoginModal } = useAuth();

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleSubMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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

  return (
    <div className="lg:hidden bg-white border-b border-stone-100">
      {/* Top Mobile Bar with Logo on the Left Side */}
      <div className="relative px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between min-h-[54px] sm:min-h-[58px]">
        {/* Left: Hamburger Button + Left-aligned Logo */}
        <div className="flex items-center gap-1.5 xs:gap-2.5 z-10">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-1.5 -ml-1 rounded-md text-stone-800 hover:text-brand-maroon hover:bg-stone-50 transition-colors flex-shrink-0"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-6 h-6 stroke-[1.8]" />
          </button>

          <Link to="/" onClick={closeMenu} className="flex items-center py-0.5">
            <img
              src={media.logo}
              alt="Bhagvat Prasadam"
              className="h-8 xs:h-9 sm:h-11 w-auto max-h-[44px] max-w-[125px] xs:max-w-[145px] sm:max-w-[160px] object-contain transition-transform active:scale-95"
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
        </div>

        {/* Right: Actions (Sound, Search, Wishlist, Cart) */}
        <div className="flex items-center gap-0.5 sm:gap-1 z-10 ml-auto">
          {/* Ambient Temple Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 text-stone-700 hover:text-brand-maroon rounded-full transition-colors cursor-pointer"
            aria-label={isMuted ? t('temple_sound_off') : t('temple_sound_on')}
            title={isMuted ? t('temple_sound_off') : t('temple_sound_on')}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 stroke-[1.7]" />
            ) : (
              <Volume2 className="w-5 h-5 stroke-[1.7] text-brand-maroon animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setIsSearchOpen(prev => !prev)}
            className="p-1.5 text-stone-700 hover:text-brand-maroon rounded-full transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5 stroke-[1.7]" />
          </button>

          {/* User / Login Icon - Visible on all mobile screens */}
          <button
            type="button"
            onClick={() => {
              if (isAuthenticated || Boolean(getAuthToken())) {
                navigate('/account');
              } else {
                openLoginModal();
              }
            }}
            className="p-1.5 text-stone-700 hover:text-brand-maroon rounded-full transition-colors flex items-center"
            aria-label={(isAuthenticated || Boolean(getAuthToken())) ? t('account') : 'Sign In'}
            title={(isAuthenticated || Boolean(getAuthToken())) ? t('account') : 'Sign In'}
          >
            <User className="w-5 h-5 stroke-[1.7]" />
          </button>

          <Link
            to="/wishlist"
            className="p-1.5 text-stone-700 hover:text-brand-maroon relative rounded-full transition-colors"
            aria-label={t('wishlist')}
          >
            <Heart className="w-5 h-5 stroke-[1.7]" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-brand-maroon text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={openCart}
            className="p-1.5 text-brand-maroon relative rounded-full hover:bg-stone-50 transition-colors"
            aria-label={t('cart')}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-brand-gold text-brand-maroon text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search */}
      {isSearchOpen && (
        <div className="px-4 pb-3 border-t border-stone-100 bg-stone-50 animate-fade-in pt-3">
          <SearchBar isMobile onClose={() => setIsSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Navigation Sidebar Drawer (Left-aligned, Instant Open without animation) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-start">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMenu}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header with Clean Logo Box */}
            <div className="p-3.5 bg-brand-maroon text-white flex items-center justify-between border-b border-brand-maroon-dark">
              <Link to="/" onClick={closeMenu} className="bg-white rounded-lg px-2.5 py-1 flex items-center shadow-xs">
                <img
                  src={media.logo}
                  alt="Bhagvat Prasadam"
                  className="h-8 w-auto object-contain"
                  width="137"
                  height="86"
                />
              </Link>
              <button
                onClick={closeMenu}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Language Switcher Row */}
            <div className="p-3 bg-stone-100 border-b border-stone-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 px-1">
                Select Language / ભાષા પસંદ કરો
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLanguage(l.code)}
                    className={`py-1.5 text-xs font-semibold rounded-md border transition-all ${
                      language === l.code
                        ? 'bg-brand-maroon text-white border-brand-maroon shadow-sm'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {l.nativeLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Devotee Account / Login Banner */}
            <div className="p-3.5 bg-stone-50 border-b border-stone-200">
              {(isAuthenticated || Boolean(getAuthToken())) ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {(customer?.first_name?.[0] || customer?.name?.[0] || 'D').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {customer?.first_name ? `${customer.first_name} ${customer.last_name || ''}`.trim() : (customer?.name || 'Devotee')}
                      </p>
                      <Link
                        to="/account"
                        onClick={closeMenu}
                        className="text-[11px] text-brand-maroon font-semibold hover:underline block"
                      >
                        View Account & Orders →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    openLoginModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#700B10] hover:bg-[#52060A] text-white py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide uppercase transition-colors shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Login with OTP</span>
                </button>
              )}
            </div>

            {/* Menu Items Accordion */}
            <div className="flex-1 py-4 px-4 overflow-y-auto divide-y divide-stone-100">
              <nav className="space-y-1">
                {navigationLinks.map((item) => {
                  const hasSub = (item.hasMegaMenu || item.isSimpleDropdown) && item.subItems && item.subItems.length > 0;
                  const isExpanded = !!expandedMenus[item.name];

                  return (
                    <div key={item.name} className="py-1">
                      <div className="flex items-center justify-between">
                        <NavLink
                          to={item.path}
                          onClick={() => {
                            if (!hasSub) closeMenu();
                          }}
                          className={({ isActive }) =>
                            `flex-1 text-sm font-semibold py-2 px-2 rounded-lg transition-colors ${
                              isActive
                                ? 'text-brand-maroon bg-brand-maroon-subtle'
                                : 'text-stone-800 hover:text-brand-maroon'
                            }`
                          }
                        >
                          <span className="flex items-center gap-2">
                            {getNavLabel(item)}
                            {item.badge && (
                              <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
                                {item.badge}
                              </span>
                            )}
                          </span>
                        </NavLink>

                        {hasSub && (
                          <button
                            onClick={() => toggleSubMenu(item.name)}
                            className="p-2 text-stone-400 hover:text-brand-maroon transition-colors"
                            aria-label={`Toggle ${item.name} submenu`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-brand-maroon' : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Sub-items accordion */}
                      {hasSub && isExpanded && (
                        <div className="pl-4 pr-2 py-2 mt-1 bg-stone-50 rounded-xl space-y-1">
                          {item.subItems.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={sub.path}
                              onClick={closeMenu}
                              className={`block py-1.5 px-2 text-xs rounded transition-colors ${
                                sub.isHighlight
                                  ? 'font-bold text-brand-maroon'
                                  : 'text-stone-600 hover:text-brand-maroon'
                              }`}
                            >
                              {getSubItemLabel(sub)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Extra links in drawer */}
              <div className="pt-4 mt-3 space-y-2 text-xs font-medium text-stone-600">
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    if (isAuthenticated || Boolean(getAuthToken())) {
                      navigate('/account');
                    } else {
                      openLoginModal();
                    }
                  }}
                  className="w-full text-left py-2 px-2 hover:text-brand-maroon font-bold text-stone-900 flex items-center justify-between border-b border-stone-100"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-maroon" />
                    <span>{(isAuthenticated || Boolean(getAuthToken())) ? t('account') : 'Sign In / Account'}</span>
                  </span>
                  <span className="text-[11px] text-brand-maroon font-semibold bg-brand-maroon-subtle px-2 py-0.5 rounded-full">
                    {(isAuthenticated || Boolean(getAuthToken())) ? 'My Orders' : 'Login'}
                  </span>
                </button>
                <Link
                  to="/pages/about"
                  onClick={closeMenu}
                  className="block py-1.5 px-2 hover:text-brand-maroon"
                >
                  About NilkanthDham & Prasadam
                </Link>
                <Link
                  to="/pages/contact"
                  onClick={closeMenu}
                  className="block py-1.5 px-2 hover:text-brand-maroon"
                >
                  Contact Support
                </Link>
                <Link
                  to="/pages/faq"
                  onClick={closeMenu}
                  className="block py-1.5 px-2 hover:text-brand-maroon"
                >
                  Frequently Asked Questions (FAQ)
                </Link>
                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className="block py-1.5 px-2 hover:text-brand-maroon"
                >
                  {t('wishlist')} ({wishlistCount})
                </Link>
              </div>
            </div>

            {/* Drawer Footer Contact */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-600">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-2 font-bold text-brand-maroon mb-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Us: {siteConfig.phone}</span>
              </a>
              <p className="text-[11px] text-stone-400">{siteConfig.supportHours}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
