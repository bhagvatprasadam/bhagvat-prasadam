import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import SafeImage from './SafeImage';
import WishlistButton from './WishlistButton';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { t, formatTitle, language } = useLanguage();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [isAdding, setIsAdding] = useState(false);
  const productSlug = product?.slug || product?.handle || String(product?.id || '');

  const displayTitle = formatTitle(product);
  const reviewsLabel = language === 'gu' ? 'રિવ્યૂ' : language === 'hi' ? 'समीક્ષાएं' : 'reviews';

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const comparePrice = selectedVariant ? selectedVariant.comparePrice : product.comparePrice;
  const discountPercent = comparePrice && comparePrice > currentPrice
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : product.discount;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, selectedVariant, 1);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  return (
    <div className="group relative bg-white rounded-[5px] border border-stone-200/90 hover:border-stone-300 shadow-none hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full overflow-hidden">
      {/* Top Media Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-50">
        <Link to={`/products/${productSlug}`} className="block w-full h-full relative">
          {/* Primary Image */}
          <SafeImage
            src={product.image}
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Secondary Hover Image (if available and different) */}
          {product.hoverImage && product.hoverImage !== product.image && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <SafeImage
                src={product.hoverImage}
                alt={`${displayTitle} alternative view`}
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
              />
            </div>
          )}
        </Link>

        {/* Wishlist Button - Top Right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <WishlistButton product={product} size="md" />
        </div>

        {/* Variant selector overlay if multiple weights available */}
        {product.variants && product.variants.length > 1 && (
          <div className="absolute bottom-0 inset-x-0 bg-stone-900/40 backdrop-blur-sm p-1.5 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            {product.variants.map((v) => (
              <button
                key={v.weight}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariant(v);
                }}
                className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded transition-all ${
                  selectedVariant?.weight === v.weight
                    ? 'bg-[#700B10] text-white'
                    : 'bg-white text-stone-800 hover:bg-stone-100'
                }`}
              >
                {v.weight.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-1.5">
          {/* Title */}
          <Link to={`/products/${productSlug}`} className="block">
            <h3 className="text-[13px] sm:text-[14px] font-normal text-stone-900 leading-snug line-clamp-2 min-h-[36px] sm:min-h-[40px] hover:text-[#700B10] transition-colors">
              {displayTitle}
            </h3>
          </Link>

          {/* Rating & Reviews Row */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#870709] text-[#870709]"
                />
              ))}
            </div>
            {Number(product.total_reviews || product.reviews_count || 0) > 0 && (
              <span className="text-[11px] sm:text-xs text-stone-600 font-normal">
                {product.total_reviews || product.reviews_count} {reviewsLabel}
              </span>
            )}
          </div>

          {/* Price Row: Sale price, Discount Badge, Compare price */}
          <div className="flex items-center flex-wrap gap-2 pt-0.5">
            <span className="text-sm sm:text-base font-semibold text-stone-900">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {discountPercent > 0 && (
              <span className="bg-[#E5A800] text-black text-[10px] sm:text-[11px] font-extrabold px-1.5 py-0.5 rounded-[2px] leading-none">
                {discountPercent}% {t('off_badge', 'OFF')}
              </span>
            )}
            {comparePrice && comparePrice > currentPrice && (
              <span className="text-xs sm:text-[13px] text-stone-400 line-through">
                ₹{comparePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isAdding}
          className="w-full py-2 px-3 border border-[#700B10] text-[#700B10] bg-white hover:bg-[#700B10] hover:text-white rounded-[3px] font-medium text-xs sm:text-[13px] flex items-center justify-center gap-1.5 transition-colors duration-200 mt-1"
        >
          {isAdding ? (
            <>
              <Check className="w-4 h-4 animate-scale-up" />
              <span>{t('btn_added', 'Added to cart')}</span>
            </>
          ) : (
            <>
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                className="w-4 h-4"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.4"
                  d="M16.608 9.421V6.906H3.392v8.016c0 .567.224 1.112.624 1.513.4.402.941.627 1.506.627H8.63M8.818 3h2.333c.618 0 1.212.247 1.649.686a2.35 2.35 0 0 1 .683 1.658v1.562H6.486V5.344c0-.622.246-1.218.683-1.658A2.33 2.33 0 0 1 8.82 3"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.4"
                  d="M14.608 12.563v5m2.5-2.5h-5"
                />
              </svg>
              <span>{t('btn_add_to_cart', 'Add to cart')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

