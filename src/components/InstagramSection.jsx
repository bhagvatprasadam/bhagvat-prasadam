import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const REEL_VIDEOS = [
  {
    id: 1,
    video: 'https://cdn.shopify.com/videos/c/o/v/7b31b0c5f4c942409ce3fd5725fd8e74.mp4',
    title: 'Divine Mohanthal Offering',
    link: '/collections/sweets',
    btnText: 'SHOP NOW'
  },
  {
    id: 2,
    video: 'https://cdn.shopify.com/videos/c/o/v/a4455a33464d4186963c8c4016471c2a.mp4',
    title: 'Pure Desi Ghee Sweets',
    link: '/collections/sweets',
    btnText: 'SHOP NOW'
  },
  {
    id: 3,
    video: 'https://cdn.shopify.com/videos/c/o/v/802bcd099e904617860dba5eac6f9196.mp4',
    title: 'Kathiyawadi Crunchy Namkeen',
    link: '/collections/namkeen',
    btnText: 'SHOP NOW'
  },
  {
    id: 4,
    video: 'https://cdn.shopify.com/videos/c/o/v/e782a6a96a7841ae88632f67c53c67d2.mp4',
    title: 'NilkanthDham Prasad Kitchen',
    link: '/collections/all',
    btnText: 'SHOP NOW'
  },
  {
    id: 5,
    video: 'https://cdn.shopify.com/videos/c/o/v/a4455a33464d4186963c8c4016471c2a.mp4',
    title: 'Temple Blessed Offerings',
    link: '/collections/sweets',
    btnText: 'SHOP NOW'
  }
];

export default function InstagramSection() {
  const [activeIndex, setActiveIndex] = useState(2); // Center slide by default
  const [isMobile, setIsMobile] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const autoPlayTimerRef = useRef(null);
  const videoRefs = useRef([]);

  const total = REEL_VIDEOS.length;

  // Responsive dimensions
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const spacing = isMobile ? 130 : 200;
  const scaleStep = isMobile ? 0.09 : 0.14;

  // Play/pause videos based on active index
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => { });
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  // Shortest distance in carousel ring
  const shortest = useCallback((from, to) => {
    let d = to - from;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }, [total]);

  // Autoplay handler
  const startAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3000);
  }, [total]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  // Mouse / Touch Drag Handlers
  const handleTouchStart = (e) => {
    stopAutoPlay();
    setIsDragging(true);
    startXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    setDragOffset(currentX - startXRef.current);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 40) {
      setActiveIndex((prev) => (prev - 1 + total) % total);
    } else if (dragOffset < -40) {
      setActiveIndex((prev) => (prev + 1) % total);
    }
    setDragOffset(0);
    startAutoPlay();
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    stopAutoPlay();
    setActiveIndex((prev) => (prev - 1 + total) % total);
    startAutoPlay();
  };

  const handleNext = (e) => {
    e.stopPropagation();
    stopAutoPlay();
    setActiveIndex((prev) => (prev + 1) % total);
    startAutoPlay();
  };

  return (
    <section className="py-8 sm:py-12 bg-white relative overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">

          <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight font-heading">
            Instagram
          </h2>
        </div>

        {/* 3D Coverflow Container */}
        <div className="relative max-w-[1300px] mx-auto px-4">
          <div
            className="relative h-[380px] sm:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {REEL_VIDEOS.map((item, i) => {
              const dist = shortest(activeIndex, i) + dragOffset / spacing;
              const abs = Math.abs(dist);
              const isActive = abs < 0.35;
              const scale = Math.max(0.65, 1 - abs * scaleStep);
              const zIndex = Math.round(10 - abs * 2);
              const opacity = abs > 2.5 ? 0 : (abs > 1.5 ? 1 - (abs - 1.5) : 1);
              const translateX = dist * spacing;

              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    if (Math.abs(dragOffset) > 10) {
                      e.preventDefault();
                      return;
                    }
                    if (i !== activeIndex) {
                      e.preventDefault();
                      stopAutoPlay();
                      setActiveIndex(i);
                      startAutoPlay();
                    }
                  }}
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition: isDragging
                      ? 'none'
                      : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease'
                  }}
                  className={`absolute w-[220px] sm:w-[310px] h-[370px] sm:h-[510px] rounded-[22px] sm:rounded-[26px] overflow-hidden bg-black shadow-xl border ${isActive
                    ? 'border-white/40 shadow-2xl ring-1 ring-white/20'
                    : 'border-stone-800/20'
                    }`}
                >
                  {/* Video */}
                  <video
                    ref={(el) => (videoRefs.current[i] = el)}
                    src={item.video}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

                  {/* Slide Content */}
                  <div
                    className={`absolute bottom-5 sm:bottom-6 inset-x-4 flex flex-col items-center text-center transition-all duration-300 ${isActive
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3 pointer-events-none'
                      }`}
                  >
                    <Link
                      to={item.link}
                      onClick={(e) => e.stopPropagation()}
                      className="w-[90%] py-2.5 sm:py-3 px-6 bg-white hover:bg-stone-950 text-stone-900 hover:text-white rounded-full font-bold text-xs sm:text-[13px] tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      {item.btnText}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous reel"
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-[#700B10] shadow-lg border border-stone-200/80 flex items-center justify-center z-20 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next reel"
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-[#700B10] shadow-lg border border-stone-200/80 flex items-center justify-center z-20 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </button>

          {/* Bottom Instruction */}
          <p className="text-center text-[11px] sm:text-xs font-semibold text-stone-400 uppercase tracking-widest mt-6">
            Drag or click to explore
          </p>
        </div>
      </div>
    </section>
  );
}
