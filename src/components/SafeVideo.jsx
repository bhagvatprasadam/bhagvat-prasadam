import React, { useState } from 'react';
import SafeImage from './SafeImage';

/**
 * SafeVideo Component
 * - Attempts to render HTML5 video or fallback to the poster image.
 * - Handles playback errors gracefully.
 */
export default function SafeVideo({
  src,
  poster,
  title = 'Bhagvat Prasadam Video',
  className = '',
  autoPlay = false,
  muted = true,
  loop = true,
  controls = true
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`relative overflow-hidden bg-stone-900 ${className}`}>
        <SafeImage
          src={poster}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
          <div className="max-w-md text-white">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-brand-gold/90 text-brand-maroon flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
            <p className="text-xs text-white/80">Experience the divine temple ambiance & prasadam preparations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      title={title}
      className={`w-full h-full object-cover ${className}`}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      playsInline
      onError={() => setHasError(true)}
    />
  );
}
