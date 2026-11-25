import React, { useState } from 'react';

/**
 * SafeImage Component
 * - Attempts to load the external image URL.
 * - If loading fails (due to network, CORS, or hotlink restrictions), gracefully renders a stylish brand placeholder.
 * - Supports loading skeleton and smooth opacity transition.
 */
export default function SafeImage({
  src,
  alt = 'Bhagvat Prasadam Product',
  className = '',
  imgClassName = '',
  aspectRatio = 'aspect-square',
  fallbackIcon = null,
  fallbackText = 'Bhagvat Prasadam',
  ...props
}) {
  const [hasError, setHasError] = useState(!src);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = React.useRef(null);

  // Reset state when src changes and check if already cached
  React.useEffect(() => {
    setHasError(!src);
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  // Normalize protocol-relative, cross-origin hostnames or root-relative URLs
  let normalizedSrc = src;
  if (normalizedSrc && typeof normalizedSrc === 'string') {
    if (normalizedSrc.includes('ecommerce-annapurna.megascale.co.in')) {
      normalizedSrc = normalizedSrc.replace('ecommerce-annapurna.megascale.co.in', 'megaecomm.megascale.co.in');
    }
    if (normalizedSrc.startsWith('//')) {
      normalizedSrc = `https:${normalizedSrc}`;
    } else if (normalizedSrc.startsWith('/backend/media/')) {
      normalizedSrc = `https://megaecomm.megascale.co.in${normalizedSrc}`;
    } else if (normalizedSrc.startsWith('/media/')) {
      normalizedSrc = `https://megaecomm.megascale.co.in/backend${normalizedSrc}`;
    } else if (normalizedSrc.startsWith('/') && !normalizedSrc.startsWith('/assets') && !normalizedSrc.startsWith('/favicon')) {
      normalizedSrc = `https://megaecomm.megascale.co.in/backend${normalizedSrc}`;
    }
  }

  if (hasError || !normalizedSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-stone-100 text-brand-maroon/70 border border-stone-200 p-4 text-center select-none ${aspectRatio} ${className}`}
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full bg-brand-maroon/10 flex items-center justify-center text-brand-maroon mb-2">
          {fallbackIcon || (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          )}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 line-clamp-1">
          {fallbackText}
        </span>
        <span className="text-[10px] text-stone-400 mt-0.5">NilkanthDham Offering</span>
      </div>
    );
  }

  const isContain = className.includes('object-contain');
  const defaultImgClass = imgClassName || `w-full h-full ${isContain ? 'object-contain' : 'object-cover'}`;
  const bgClass = className.includes('bg-') ? '' : 'bg-stone-50';
  const showSkeleton = !className.includes('bg-transparent') && !isLoaded;

  return (
    <div className={`relative overflow-hidden ${bgClass} ${className}`}>
      {showSkeleton && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={normalizedSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${defaultImgClass} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
