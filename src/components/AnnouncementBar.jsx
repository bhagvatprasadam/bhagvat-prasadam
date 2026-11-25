import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const announcements = [
    {
      id: 1,
      text: "✨Get Free Shipping on Orders Above ₹999 🚚✨",
      link: "/collections/all"
    },
    {
      id: 2,
      text: "✨Shop for ₹599 and get Free Shipping on First Order 🚚✨",
      link: "/collections/all"
    }
  ];

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [announcements.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const current = announcements[currentIndex];

  return (
    <div className="bg-[#6B0B11] text-white text-xs select-none border-b border-[#52060A]">
      {/* Top Banner Row with Chevrons */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-1.5 flex items-center justify-between">
        <button
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 text-center font-medium tracking-wide px-1.5 sm:px-2 overflow-hidden">
          <Link
            to={current.link}
            className="inline-flex items-center justify-center gap-1 hover:text-brand-gold transition-colors duration-200 text-[11px] sm:text-xs md:text-[13px] line-clamp-1"
          >
            <span>{current.text}</span>
          </Link>
        </div>

        <button
          onClick={handleNext}
          aria-label="Next announcement"
          className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Second Row: App Install 2% Discount with Store Pills */}
      <div className="bg-[#5C080E] py-1 px-2.5 sm:px-6 border-t border-black/15 text-[10px] sm:text-xs text-white/90">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
          <span>
            Install Bhagvat Prasadam App &amp; Get <strong className="text-white font-black">Extra 2% Discount</strong> on App! <span className="text-white/70">Available on:</span>
          </span>

          <div className="inline-flex items-center gap-1.5">
            {/* Play Store Pill */}
            <a
              href={siteConfig.appLinks.playStore}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold transition-colors"
            >
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.5 1.5 0 0 1-.61-.318V2.132a1.5 1.5 0 0 1 .609-.318zm11.242 11.245l2.428-2.428-11.75-6.784 9.322 9.212zm0 1.882L5.529 24.153l11.75-6.784-2.428-2.428zm3.567-2.022l3.076-1.776a1.2 1.2 0 0 0 0-2.086l-3.076-1.776-2.127 2.819 2.127 2.819z"/>
              </svg>
              <span>Play Store</span>
            </a>

            {/* App Store Pill */}
            <a
              href={siteConfig.appLinks.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold transition-colors"
            >
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.14.65-2.82 1.46-.59.69-1.12 1.83-.98 2.94 1.08.08 2.16-.54 2.81-1.3"/>
              </svg>
              <span>App Store</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
