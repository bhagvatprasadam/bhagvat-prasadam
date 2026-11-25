import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Award,
  Copy,
  Mail,
  X,
  MessageSquare,
  ClipboardList,
  Clipboard,
  Timer,
  Leaf
} from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts.js';
import { getProductById, getProductByHandle } from '../api/productsApi.js';
import { trackProductView, removeProductSchema } from '../services/analytics';
import { media } from '../data/media';
import SafeImage from '../components/SafeImage';
import ProductCard from '../components/ProductCard';
import CustomerReviews from '../components/CustomerReviews';
async function copyToClipboard(text) {
  if (typeof window === 'undefined') return false;
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn('navigator.clipboard.writeText failed, using fallback:', e);
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
}

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t, formatTitle, language } = useLanguage();
  const { products: allApiProducts } = useProducts();

  // Pure live API catalog
  const allProducts = useMemo(() => {
    return (Array.isArray(allApiProducts) && allApiProducts.length > 0)
      ? allApiProducts
      : [];
  }, [allApiProducts]);

  // Find initial optimistic product from live products
  const foundInitial = useMemo(() => {
    if (!slug) return null;
    const clean = String(slug).trim().toLowerCase();
    return allProducts.find(
      p => p.slug?.toLowerCase() === clean ||
        p.handle?.toLowerCase() === clean ||
        String(p.id) === clean
    ) || null;
  }, [slug, allProducts]);

  const [product, setProduct] = useState(foundInitial || null);
  const [loading, setLoading] = useState(!foundInitial);
  const [notFound, setNotFound] = useState(false);

  // Track product view in GA4 & Meta Pixel and inject Product JSON-LD schema
  useEffect(() => {
    if (product) {
      trackProductView(product);
    }
    return () => {
      removeProductSchema();
    };
  }, [product?.id]);

  // Always fetch full, live product details from the API
  useEffect(() => {
    let isSubscribed = true;

    async function fetchLiveProduct() {
      if (!slug) return;

      if (!product && foundInitial) {
        setProduct(foundInitial);
      }

      setNotFound(false);

      try {
        const isNumeric = /^\d+$/.test(slug);
        const liveProd = isNumeric
          ? await getProductById(slug)
          : await getProductByHandle(slug);

        if (isSubscribed) {
          if (liveProd) {
            setProduct(liveProd);
            setNotFound(false);
          } else if (!foundInitial && !product) {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch product from live API:', err);
        if (isSubscribed && !foundInitial && !product) {
          setNotFound(true);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    fetchLiveProduct();
    return () => { isSubscribed = false; };
  }, [slug]);

  const displayTitle = product ? (product.title || formatTitle(product)) : '';
  const reviewsLabel = language === 'gu' ? 'રિવ્યૂ' : language === 'hi' ? 'समीक्षाएं' : 'reviews';

  const [activeImage, setActiveImage] = useState(product?.image);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants && product?.variants.length > 0 ? product.variants[0] : null
  );

  // Sync image & variant when live product arrives
  useEffect(() => {
    if (product) {
      if (product.image) setActiveImage(product.image);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(prev => {
          if (!prev) return product.variants[0];
          const matched = product.variants.find(v => v.id === prev.id || v.title === prev.title);
          return matched || product.variants[0];
        });
      }
    }
  }, [product]);
  const [quantity, setQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareDropdownRef = useRef(null);

  // Close share menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(e.target)) {
        setIsShareOpen(false);
      }
    }
    if (isShareOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isShareOpen]);

  // Accordions open/close state matching bhagvatprasadam.com
  const [openAccordions, setOpenAccordions] = useState({
    about: false,
    details: false,
    shelfLife: false,
    packing: false,
    shipping: false,
    ingredients: false,
    benefits: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Sync state when product or variants change
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedVariant(
        product.variants && product.variants.length > 0 ? product.variants[0] : null
      );
      setQuantity(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product?.id, product?.slug]);

  // Clean, decode, and format HTML description so raw tags are NEVER shown to the user
  const formattedDescription = useMemo(() => {
    const raw = product?.description || '';
    if (!raw || typeof raw !== 'string') return '';

    let html = raw.trim();

    // 1. Unescape HTML entities if it was entity-encoded (e.g. &lt;p&gt; -> <p>)
    if (html.includes('&lt;') || html.includes('&gt;')) {
      html = html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    }

    // 2. Decode &amp; safely
    html = html.replace(/&amp;/g, '&');

    // 3. Format section title paragraphs: <p>Key Features:</p>, <p>How to Use:</p>, <p>Safety & Care:</p>
    html = html.replace(
      /<p>\s*(?:<strong>)?\s*(Key Features|How to Use|Safety\s*&?\s*Care|Product Description|Benefits|Usage Instructions):?\s*(?:<\/strong>)?\s*<\/p>/gi,
      '<h4 class="text-sm font-bold text-stone-900 mt-4 mb-2">$1</h4>'
    );

    // 4. Format dash/bullet points: <p>- ...</p> or <p>• ...</p> into clean list items with styled dots
    html = html.replace(
      /<p>\s*[-•]\s*(.*?)<\/p>/gi,
      '<div class="flex items-start gap-2 text-stone-600 text-xs sm:text-[13px] my-1.5"><span class="text-[#700B10] font-bold text-sm leading-none mt-0.5">•</span><span>$1</span></div>'
    );

    return html;
  }, [product?.description]);

  // Dynamic About Product directly from API metafields
  const dynamicAboutProduct = useMemo(() => {
    let rawVal = product?.aboutProduct;
    if (!rawVal && product?.metafields) {
      const metaMatch = product.metafields.find(
        m => m && (m.key === 'about_product' || m.key === 'about' || (m.definition_name && m.definition_name.toLowerCase().includes('about')))
      );
      if (metaMatch?.value) rawVal = metaMatch.value;
    }
    if (!rawVal) return '';
    const val = String(rawVal).trim();
    if (val === '' || val === '-' || val.toLowerCase() === 'n/a' || val.toLowerCase() === 'null') {
      return '';
    }
    return val;
  }, [product?.aboutProduct, product?.metafields]);

  // Dynamic Shelf Life directly from API metafields (strictly NO display if not in metafields)
  const dynamicShelfLife = useMemo(() => {
    let rawVal = product?.shelfLife;
    if (!rawVal && product?.metafields) {
      const metaMatch = product.metafields.find(
        m => m && (m.key === 'self_life' || m.key === 'shelf_life' || m.key === 'shelf' || (m.definition_name && m.definition_name.toLowerCase().includes('shelf')))
      );
      if (metaMatch?.value) rawVal = metaMatch.value;
    }
    if (!rawVal) return '';
    const val = String(rawVal).trim();
    if (val === '' || val === '-' || val.toLowerCase() === 'n/a' || val.toLowerCase() === 'null') {
      return '';
    }
    return /^\d+$/.test(val) ? `${val} days shelf life` : val;
  }, [product?.shelfLife, product?.metafields]);

  // Dynamic Packing Information directly from API metafields
  const dynamicPackingInfo = useMemo(() => {
    let rawVal = product?.packingInfo;
    if (!rawVal && product?.metafields) {
      const metaMatch = product.metafields.find(
        m => m && (m.key === 'packing_info' || m.key === 'packing' || (m.definition_name && m.definition_name.toLowerCase().includes('packing')))
      );
      if (metaMatch?.value) rawVal = metaMatch.value;
    }
    if (!rawVal) return '';
    const val = String(rawVal).trim();
    if (val === '' || val === '-' || val.toLowerCase() === 'n/a' || val.toLowerCase() === 'null') {
      return '';
    }
    return val;
  }, [product?.packingInfo, product?.metafields]);

  // Dynamic Ingredients directly from API metafields (strictly NO display if not in metafields)
  const dynamicIngredients = useMemo(() => {
    let rawVal = product?.ingredients;
    if (!rawVal && product?.metafields) {
      const metaMatch = product.metafields.find(
        m => m && (m.key === 'ingredients' || (m.definition_name && m.definition_name.toLowerCase().includes('ingredient')))
      );
      if (metaMatch?.value) rawVal = metaMatch.value;
    }
    if (!rawVal) return '';
    const val = String(rawVal).trim();
    if (val === '' || val === '-' || val.toLowerCase() === 'n/a' || val.toLowerCase() === 'null') {
      return '';
    }
    return val;
  }, [product?.ingredients, product?.metafields]);

  // Dynamic Benefits directly from API metafields
  const dynamicBenefits = useMemo(() => {
    let rawVal = product?.benefits;
    if (!rawVal && product?.metafields) {
      const metaMatch = product.metafields.find(
        m => m && (m.key === 'benifits' || m.key === 'benefits' || (m.definition_name && m.definition_name.toLowerCase().includes('benefit')))
      );
      if (metaMatch?.value) rawVal = metaMatch.value;
    }
    if (!rawVal) return '';
    const val = String(rawVal).trim();
    if (val === '' || val === '-' || val.toLowerCase() === 'n/a' || val.toLowerCase() === 'null') {
      return '';
    }
    return val;
  }, [product?.benefits, product?.metafields]);

  // Gallery and touch swipe hooks must be called before any conditional early returns
  const galleryImages = useMemo(() => {
    if (!product) return [];
    return (product.gallery && product.gallery.length > 0)
      ? product.gallery
      : [product.image || product.imageUrl].filter(Boolean);
  }, [product?.gallery, product?.image, product?.imageUrl]);

  const currentImageIndex = useMemo(() => {
    if (!galleryImages || galleryImages.length === 0) return 0;
    const currentSrc = activeImage || product?.image || product?.imageUrl;
    const idx = galleryImages.findIndex((img) => img === currentSrc);
    return idx >= 0 ? idx : 0;
  }, [galleryImages, activeImage, product?.image, product?.imageUrl]);

  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const touchEndXRef = useRef(null);
  const touchEndYRef = useRef(null);
  const isSwipingRef = useRef(false);
  const thumbnailContainerRef = useRef(null);

  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeEl = thumbnailContainerRef.current.children[currentImageIndex];
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentImageIndex]);

  if (loading && !product) {
    return (
      <div className="py-24 bg-white min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-brand-maroon rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-stone-600">Loading sacred prasad offering...</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="py-20 bg-stone-50 min-h-[70vh] flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-3xl border border-stone-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-brand-cream text-brand-maroon flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Prasadam Not Found</h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            The prasad item you are looking for is currently unavailable or has been moved.
          </p>
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs px-6 py-3 rounded-full transition-colors"
          >
            <span>Browse All Collections</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const comparePrice = selectedVariant ? selectedVariant.comparePrice : product.comparePrice;
  const discountPercent = comparePrice && comparePrice > currentPrice
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : product.discount;

  const isAvailable = (selectedVariant?.available !== false) && (product.available !== false);

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
    if (variant.image) {
      setActiveImage(variant.image);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/cart');
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = displayTitle || product?.title || 'Bhagvat Prasadam';
    const shareText = `Check out ${shareTitle} at Bhagvat Prasadam - Divine Prasad & Sacred Offerings!`;

    // 1. Try Native Web Share API first (on mobile devices and supported browsers)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // User dismissed share sheet
      }
    }

    // 2. Fallback to interactive share menu popover
    setIsShareOpen(prev => !prev);
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const isWishlisted = isInWishlist(product.id);

  // Dynamic related products from the live catalog
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (
      (product.category && p.category && p.category.toLowerCase() === product.category.toLowerCase()) ||
      (product.productType && p.productType && p.productType.toLowerCase() === product.productType.toLowerCase()) ||
      (p.tags && product.tags && p.tags.some(t => product.tags.includes(t)))
    ))
    .slice(0, 4);

  const fallbackRelated = relatedProducts.length >= 2
    ? relatedProducts
    : allProducts.filter(p => p.id !== product.id).slice(0, 4);

  const handlePrevImage = () => {
    if (galleryImages.length <= 1) return;
    const nextIdx = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setActiveImage(galleryImages[nextIdx]);
  };

  const handleNextImage = () => {
    if (galleryImages.length <= 1) return;
    const nextIdx = (currentImageIndex + 1) % galleryImages.length;
    setActiveImage(galleryImages[nextIdx]);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      touchEndXRef.current = e.touches[0].clientX;
      touchEndYRef.current = e.touches[0].clientY;
      isSwipingRef.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isSwipingRef.current || !e.touches || e.touches.length !== 1) return;
    touchEndXRef.current = e.touches[0].clientX;
    touchEndYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!isSwipingRef.current) return;
    isSwipingRef.current = false;
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;

    const deltaX = touchEndXRef.current - touchStartXRef.current;
    const deltaY = touchEndYRef.current - touchStartYRef.current;

    // Minimum swipe threshold of 40px, and horizontal distance must exceed vertical distance
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swiped Left -> Next Image
        handleNextImage();
      } else {
        // Swiped Right -> Previous Image
        handlePrevImage();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchEndXRef.current = null;
    touchEndYRef.current = null;
  };

  return (
    <div className="py-6 sm:py-8 bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-brand-maroon transition-colors">
            {language === 'gu' ? 'હોમ' : language === 'hi' ? 'होम' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
          <Link
            to={`/collections/${(product.category || 'all').toLowerCase()}`}
            className="hover:text-brand-maroon transition-colors capitalize"
          >
            {product.category || product.productType || 'Prasadam'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
          <span className="font-semibold text-stone-800 truncate max-w-sm">{displayTitle}</span>
        </nav>

        {/* Product Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start mb-16">

          {/* Left: Product Media Gallery */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-3.5 items-start static lg:sticky lg:top-24">

            {/* Vertical Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div
                ref={thumbnailContainerRef}
                className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto w-full md:w-[72px] xl:w-20 max-h-[560px] flex-shrink-0 scrollbar-none py-1"
              >
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 sm:w-18 sm:h-18 md:w-[72px] md:h-[72px] xl:w-20 xl:h-20 rounded-[4px] overflow-hidden border transition-all flex-shrink-0 bg-stone-50 ${activeImage === img
                      ? 'border-stone-900 ring-1 ring-stone-900 shadow-sm'
                      : 'border-stone-200 opacity-70 hover:opacity-100 hover:border-stone-400'
                      }`}
                  >
                    <SafeImage src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image with Touch / Swipe Left & Right support */}
            <div
              className="relative aspect-square w-full rounded-[4px] overflow-hidden bg-stone-50 border border-stone-200/90 shadow-none flex-1 group select-none"
              style={{ touchAction: 'pan-y' }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              <SafeImage
                src={activeImage || product.image || product.imageUrl}
                alt={displayTitle}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              />

              {/* Mobile Swipe Navigation Arrows & Badge */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    aria-label="Previous image"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-stone-700 shadow-md flex items-center justify-center transition-all opacity-90 md:opacity-0 md:group-hover:opacity-100 hover:scale-105 z-10 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    aria-label="Next image"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-stone-700 shadow-md flex items-center justify-center transition-all opacity-90 md:opacity-0 md:group-hover:opacity-100 hover:scale-105 z-10 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Mobile index badge */}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full z-10 pointer-events-none md:hidden tracking-wider">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </div>
                </>
              )}

              {/* Discount Badge */}
              {discountPercent > 0 && (
                <span className="absolute top-3.5 left-3.5 bg-[#FACC15] text-stone-950 text-[11px] font-extrabold px-2 py-0.5 rounded-[2px] shadow-sm uppercase tracking-wider z-10 pointer-events-none">
                  {discountPercent}% {t('off_badge', 'OFF')}
                </span>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle Wishlist"
                className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-stone-600 hover:text-red-600 transition-colors z-10 cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right: Product Information Column */}
          <div className="lg:col-span-6 space-y-5">

            {/* Title & Share Button Row */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-[26px] font-normal text-stone-900 leading-snug">
                  {displayTitle}
                </h1>
              </div>

              {/* Official Share Button & Menu */}
              <div className="relative flex-shrink-0 pt-1" ref={shareDropdownRef}>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#700B10] hover:bg-stone-100 transition-colors border border-stone-200/80 shadow-2xs"
                  title={t('share_product', 'Share Product')}
                  aria-label={t('share_product', 'Share Product')}
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>

                {/* Copied Notification Badge */}
                {isCopied && (
                  <span className="absolute right-0 -top-8 bg-stone-900 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-md whitespace-nowrap animate-fade-in z-30">
                    {t('link_copied', 'Link Copied to Clipboard!')}
                  </span>
                )}

                {/* Interactive Share Menu Dropdown */}
                {isShareOpen && (
                  <div className="absolute right-0 top-11 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-40 animate-fade-in text-xs">
                    <div className="px-3 py-1.5 border-b border-stone-100 font-semibold text-stone-900 flex items-center justify-between">
                      <span>Share this Offering</span>
                      <button
                        type="button"
                        onClick={() => setIsShareOpen(false)}
                        className="text-stone-400 hover:text-stone-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${displayTitle || 'Bhagvat Prasadam'}\n${window.location.href}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsShareOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
                    >
                      <WhatsAppIcon variant="branded" className="w-6 h-6 flex-shrink-0 transition-transform group-hover:scale-105" />
                      <span className="font-medium">Share on WhatsApp</span>
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsShareOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        f
                      </span>
                      <span className="font-medium">Share on Facebook</span>
                    </a>

                    {/* Twitter / X */}
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${displayTitle || 'Bhagvat Prasadam'}!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsShareOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                        𝕏
                      </span>
                      <span className="font-medium">Share on X (Twitter)</span>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:?subject=${encodeURIComponent(displayTitle || 'Sacred Offering')}&body=${encodeURIComponent(`Check out ${displayTitle || 'Bhagvat Prasadam'}:\n\n${window.location.href}`)}`}
                      onClick={() => setIsShareOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-stone-600 text-white flex items-center justify-center text-xs">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-medium">Share via Email</span>
                    </a>

                    {/* Copy Link */}
                    <button
                      type="button"
                      onClick={() => {
                        handleCopyLink();
                        setIsShareOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-stone-700 hover:bg-stone-100 transition-colors border-t border-stone-100 text-left cursor-pointer"
                    >
                      <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-xs">
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </span>
                      <span className="font-medium">{isCopied ? 'Link Copied!' : 'Copy Product Link'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Stars & Reviews */}
            <a
              href="#customer-reviews-section"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('customer-reviews-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group w-fit"
            >
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              {Number(product.total_reviews || product.reviews_count || 0) > 0 ? (
                <>
                  <span className="text-xs font-semibold text-stone-700">
                    {product.rating || '5.0'}
                  </span>
                  <span className="text-xs text-stone-400 underline decoration-dotted group-hover:text-stone-700">
                    ({product.total_reviews || product.reviews_count} {reviewsLabel})
                  </span>
                </>
              ) : (
                <span className="text-xs text-stone-400 underline decoration-dotted group-hover:text-stone-700">
                  ({reviewsLabel})
                </span>
              )}
            </a>

            {/* Price Row */}
            <div className="pt-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-2xl lg:text-3xl font-bold text-stone-950">
                  ₹{Number(currentPrice || 0).toLocaleString('en-IN')}
                </span>

                {discountPercent > 0 && (
                  <span className="bg-[#FACC15] text-stone-950 text-xs font-black px-2 py-0.5 rounded-[2px] leading-tight uppercase">
                    {discountPercent}% {t('off_badge', 'OFF')}
                  </span>
                )}

                {comparePrice && comparePrice > currentPrice && (
                  <span className="text-base text-stone-400 line-through font-normal">
                    ₹{Number(comparePrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {t('tax_shipping_note', 'Tax included. Shipping calculated at checkout.')}
              </p>
            </div>

            {/* Free Shipping Offer Banner Card */}
            {media.banners?.freeShippingBanner && (
              <div className="pt-1.5 pb-0.5">
                <div className="w-full rounded-[3px] overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow">
                  <img
                    src={media.banners.freeShippingBanner}
                    alt="Bhagvat Prasadam Free Shipping On Order Above 999 - Order Now"
                    className="w-full h-auto object-contain block select-none"
                    loading="eager"
                  />
                </div>
              </div>
            )}

            {/* Dynamic Variant Picker (Options / Weight / Size) */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-stone-900">
                    {t('label_select_options', 'Select Option / Packaging:')}
                  </span>
                  {selectedVariant && (
                    <span className="text-xs font-medium text-stone-500">
                      Selected: <strong className="text-stone-900">{selectedVariant.weight || selectedVariant.title}</strong>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id || selectedVariant?.title === v.title;
                    return (
                      <button
                        key={v.id || v.title || v.weight}
                        type="button"
                        onClick={() => handleSelectVariant(v)}
                        className={`text-xs font-semibold px-4 py-2.5 rounded-[2px] border transition-all ${isSelected
                          ? 'border-[#700B10] bg-[#700B10] text-white shadow-xs'
                          : 'border-stone-300 text-stone-800 bg-white hover:border-stone-400 hover:bg-stone-50'
                          }`}
                      >
                        <span>{v.weight || v.title}</span>
                        {v.price > 0 && (
                          <span className={`ml-1.5 text-[11px] font-normal ${isSelected ? 'text-white/90' : 'text-stone-500'}`}>
                            (₹{v.price})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector + Add to Cart & Buy It Now Buttons */}
            <div className="pt-3 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Box */}
                <div className="inline-flex items-center border border-stone-300 rounded-[3px] bg-white h-11">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center text-stone-600 hover:text-stone-950 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-stone-900 select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-full flex items-center justify-center text-stone-600 hover:text-stone-950 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add To Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`flex-1 h-11 font-bold text-xs sm:text-sm rounded-[3px] shadow-sm transition-colors flex items-center justify-center gap-2 uppercase tracking-wider ${isAvailable
                    ? 'bg-[#700B10] hover:bg-[#52060A] text-white cursor-pointer'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {!isAvailable
                      ? 'Out of Stock'
                      : isAdded
                        ? t('btn_added', 'Added to Cart!')
                        : t('btn_add_to_cart', 'Add to cart')}
                  </span>
                </button>
              </div>

              {/* Buy It Now Button */}
              {isAvailable && (
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full h-11 bg-[#700B10] hover:bg-[#52060A] text-white font-bold text-xs sm:text-sm rounded-[3px] shadow-sm transition-colors uppercase tracking-wider"
                >
                  {t('btn_buy_it_now', 'Buy it now')}
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#700B10] flex-shrink-0" />
                <span>{t('trust_pure_ghee', '100% Satvik & Natural Purity')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#700B10] flex-shrink-0" />
                <span>{t('trust_temple_prasad', 'Sanctified Temple Offering')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#700B10] flex-shrink-0" />
                <span>{t('trust_fast_delivery', 'Safe All India Fast Delivery')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#700B10] flex-shrink-0" />
                <span>{t('trust_vedic_method', 'Authentic Vedic Preparation')}</span>
              </div>
            </div>

            {/* Accordion Drawers Matching Bhagvat Prasadam Store */}
            <div className="pt-2 divide-y divide-stone-200 border-t border-b border-stone-200">

              {/* 1. About Product (Only displayed if present in metafields) */}
              {Boolean(dynamicAboutProduct) && (
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('about')}
                    className="w-full flex items-center justify-between text-left py-0.5 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-stone-800 stroke-[1.6]" />
                      <span className="text-sm sm:text-[15px] font-normal text-stone-900 group-hover:text-brand-maroon transition-colors tracking-tight">
                        {t('acc_about_product', 'About Product')}
                      </span>
                    </div>
                    {openAccordions.about ? (
                      <Minus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                    )}
                  </button>
                  {openAccordions.about && (
                    <div className="pt-2 pb-1 pl-8 text-xs sm:text-[13px] text-stone-700 leading-relaxed whitespace-pre-line animate-fade-in">
                      <p>{dynamicAboutProduct}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Product Details (Clean Formatted HTML - NO visible raw tags) */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between text-left py-0.5 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-5 h-5 text-stone-800 stroke-[1.6]" />
                    <span className="text-sm sm:text-[15px] font-normal text-stone-900 group-hover:text-brand-maroon transition-colors tracking-tight">
                      {t('acc_product_details', 'Product Details')}
                    </span>
                  </div>
                  {openAccordions.details ? (
                    <Minus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                  )}
                </button>
                {openAccordions.details && (
                  <div className="pt-2 pb-1 pl-8 text-xs sm:text-[13px] text-stone-600 leading-relaxed animate-fade-in">
                    {formattedDescription ? (
                      <div
                        className="product-description-clean text-stone-700 leading-relaxed space-y-2.5 [&>p]:mb-2.5 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-2.5 [&>ul>li]:mb-1 [&>h3]:text-sm [&>h3]:font-bold [&>h3]:text-stone-900 [&>h3]:mt-3.5 [&>h3]:mb-1.5 [&>h4]:text-sm [&>h4]:font-bold [&>h4]:text-stone-900 [&>h4]:mt-3.5 [&>h4]:mb-1.5 [&>strong]:font-semibold [&>strong]:text-stone-900"
                        dangerouslySetInnerHTML={{ __html: formattedDescription }}
                      />
                    ) : (
                      <p className="whitespace-pre-line leading-relaxed">
                        {product.description || 'Experience the authentic purity and spiritual essence of this sacred offering, prepared according to ancient traditional standards.'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Shelf Life (Only displayed if present in metafields) */}
              {Boolean(dynamicShelfLife) && (
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('shelfLife')}
                    className="w-full flex items-center justify-between text-left py-0.5 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-stone-800 stroke-[1.6]" />
                      <span className="text-sm sm:text-[15px] font-normal text-stone-900 group-hover:text-brand-maroon transition-colors tracking-tight">
                        {t('acc_shelf_life', 'Shelf Life')}
                      </span>
                    </div>
                    {openAccordions.shelfLife ? (
                      <Minus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                    )}
                  </button>
                  {openAccordions.shelfLife && (
                    <div className="pt-2 pb-1 pl-8 text-xs sm:text-[13px] text-stone-700 leading-relaxed whitespace-pre-line animate-fade-in">
                      <p>{dynamicShelfLife}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Packing Information (Only displayed if present in metafields - styled in brand maroon matching store) */}
              {Boolean(dynamicPackingInfo) && (
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('packing')}
                    className="w-full flex items-center justify-between text-left py-0.5 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Clipboard className="w-5 h-5 text-[#700B10] stroke-[1.6]" />
                      <span className="text-sm sm:text-[15px] font-normal text-[#700B10] tracking-tight">
                        {t('acc_packing_info', 'Packing Information')}
                      </span>
                    </div>
                    {openAccordions.packing ? (
                      <Minus className="w-4 h-4 text-[#700B10] flex-shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#700B10] flex-shrink-0" />
                    )}
                  </button>
                  {openAccordions.packing && (
                    <div className="pt-2 pb-1 pl-8 text-xs sm:text-[13px] text-stone-700 leading-relaxed whitespace-pre-line animate-fade-in">
                      <p>{dynamicPackingInfo}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Shipping & Returns */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-left py-0.5 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-stone-800 stroke-[1.6]" />
                    <span className="text-sm sm:text-[15px] font-normal text-stone-900 group-hover:text-brand-maroon transition-colors tracking-tight">
                      {t('acc_shipping_returns', 'Shipping & Returns')}
                    </span>
                  </div>
                  {openAccordions.shipping ? (
                    <Minus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                  )}
                </button>
                {openAccordions.shipping && (
                  <div className="pt-2 pb-1 pl-8 text-xs sm:text-[13px] text-stone-600 leading-relaxed animate-fade-in space-y-1">
                    <p>{t('acc_shipping_text', 'Safe, tamper-evident dispatch across India within 24 to 48 hours. Free shipping on all orders above ₹999.')}</p>
                  </div>
                )}
              </div>

              {/* 6. Ingredients (Only displayed if present in metafields) */}
              {Boolean(dynamicIngredients) && (
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('ingredients')}
                    className="w-full flex items-center justify-between text-left py-0.5 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Leaf className="w-5 h-5 text-stone-800 stroke-[1.6]" />
                      <span className="text-sm sm:text-[15px] font-normal text-stone-900 group-hover:text-brand-maroon transition-colors tracking-tight">
                        {t('acc_ingredients', 'Ingredients')}
                      </span>
                    </div>
                    {openAccordions.ingredients ? (
                      <Minus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                    )}
                  </button>
                  {openAccordions.ingredients && (
                    <div className="pt-2 pb-1 pl-8 text-xs sm:text-[13px] text-stone-700 leading-relaxed whitespace-pre-line animate-fade-in">
                      <p>{dynamicIngredients}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 7. Benefits (Only displayed if present in metafields) */}
              {Boolean(dynamicBenefits) && (
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('benefits')}
                    className="w-full flex items-center justify-between text-left py-0.5 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-stone-800 stroke-[1.6]" />
                      <span className="text-sm sm:text-[15px] font-normal text-stone-900 group-hover:text-brand-maroon transition-colors tracking-tight">
                        {t('acc_benefits', 'Benefits')}
                      </span>
                    </div>
                    {openAccordions.benefits ? (
                      <Minus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-stone-800 flex-shrink-0" />
                    )}
                  </button>
                  {openAccordions.benefits && (
                    <div className="pt-2 pb-1 pl-8 text-xs sm:text-[13px] text-stone-700 leading-relaxed whitespace-pre-line animate-fade-in">
                      <p>{dynamicBenefits}</p>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Customer Reviews Section */}
        <CustomerReviews product={product} />

        {/* You May Also Like Section (Dynamic from Store) */}
        {fallbackRelated.length > 0 && (
          <div className="pt-10 border-t border-stone-200">
            <h3 className="text-xl sm:text-2xl font-normal text-stone-900 text-center mb-8">
              {t('sec_you_may_like', 'You May Also Like')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {fallbackRelated.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
