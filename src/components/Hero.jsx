
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { media } from '../data/media';
import { useBanners } from '../hooks/useBanners.js';

export default function Hero() {
  const { banners: apiBanners } = useBanners();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Derive slides from live API banners, falling back to media.banners if needed
  const slides = useMemo(() => {
    if (Array.isArray(apiBanners) && apiBanners.length > 0) {
      return apiBanners.map((b) => ({
        id: b.id,
        url: b.imageUrl,
        mobileUrl: b.mobileImageUrl || b.imageUrl,
        alt: b.title || 'Bhagvat Prasadam Banner',
        title: b.title || '',
        subtitle: b.subtitle || '',
        ctaLink: b.link || '/collections/all'
      }));
    }

    return media.banners.heroDesktop.map((slide, index) => ({
      ...slide,
      mobileUrl: media.banners.heroMobile?.[index] || slide.url
    }));
  }, [apiBanners]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden bg-brand-cream select-none">
      {/* Slider Carousel Container (Responsive Aspect Ratio: 1080/1500 for portrait mobile, 1920/644 for desktop) */}
      <div className="relative w-full aspect-[1080/1500] sm:aspect-[16/7] md:aspect-[1920/644] max-h-[92vh]">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const mobileUrl = slide.mobileUrl || slide.url;
          const isExternal = slide.ctaLink?.startsWith('http') || slide.ctaLink?.startsWith('//');

          const LinkWrapper = ({ children }) => {
            if (isExternal) {
              return (
                <a href={slide.ctaLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                  {children}
                </a>
              );
            }
            return (
              <Link to={slide.ctaLink || '/collections/all'} className="block w-full h-full relative">
                {children}
              </Link>
            );
          };

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <LinkWrapper>
                {/* Desktop & Mobile Responsive Hero Banner with dedicated mobile size */}
                <picture className="w-full h-full block">
                  <source media="(max-width: 639px)" srcSet={mobileUrl} />
                  <source media="(min-width: 640px)" srcSet={slide.url} />
                  <img
                    src={slide.url}
                    alt={slide.alt || 'Bhagvat Prasadam Sacred Offerings Banner'}
                    className="w-full h-full object-cover object-center"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </picture>
              </LinkWrapper>
            </div>
          );
        })}

        {/* Carousel Navigation Buttons */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-stone-800 hover:text-brand-maroon shadow-md flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-stone-800 hover:text-brand-maroon shadow-md flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dots Indicators */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentSlide ? 'w-8 bg-brand-gold' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
