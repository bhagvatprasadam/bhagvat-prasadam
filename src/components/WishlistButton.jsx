import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistButton({
  product,
  className = '',
  size = 'md'
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product.id);

  const sizeClasses = {
    sm: 'w-7 h-7 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      aria-label={active ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
      className={`rounded-full bg-white shadow-sm border border-stone-100/80 transition-all duration-200 flex items-center justify-center ${sizeClasses[size]} ${
        active
          ? 'text-[#700B10] scale-105'
          : 'text-stone-700 hover:text-[#700B10]'
      } ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform duration-150 stroke-[1.6] ${active ? 'fill-[#700B10]' : ''}`}
      />
    </button>
  );
}
