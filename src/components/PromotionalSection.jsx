import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { media } from '../data/media';
import SafeImage from './SafeImage';

export default function PromotionalSection() {
  const twoColBanners = media.banners.promotionalTwoColumn;

  return (
    <section className="py-4 sm:py-6 bg-white" id="promotional-banners">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        {/* Two-Column Promotional Grid (Annakut Prasad & Pooja Samagri) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {twoColBanners.map((banner) => (
            <Link
              key={banner.id}
              to={banner.link}
              className="group block transition-transform duration-300 hover:scale-[1.01]"
              aria-label={banner.alt}
            >
              <SafeImage
                src={banner.url}
                alt={banner.alt}
                className="w-full h-auto bg-transparent"
                imgClassName="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
                aspectRatio="aspect-auto"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
