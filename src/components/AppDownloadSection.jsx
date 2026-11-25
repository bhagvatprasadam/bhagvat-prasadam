import React from 'react';
import { media } from '../data/media';
import { siteConfig } from '../data/siteConfig';
import SafeImage from './SafeImage';

export default function AppDownloadSection() {
  return (
    <section className="py-8 sm:py-12 lg:py-14 overflow-hidden w-full" id="app-download">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div className="flex-1 max-w-xl text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-bold text-[#d61e21] leading-tight mb-3 sm:mb-4 tracking-tight font-heading">
              Bhagvat Prasadam App Download
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-5 sm:mb-6 max-w-lg mx-auto lg:mx-0">
              Get the Bhagvat Prasadam app for divine offerings delivered directly
              to your doorstep. Order Prasad, Sweets, and Namkeen with ease and
              begin your spiritual journey with us today.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              {/* Google Play */}
              <a
                href={siteConfig.appLinks.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:-translate-y-0.5 transition-transform"
              >
                <img
                  src={media.appDownload.playStore}
                  alt="Download from Google Play"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </a>

              {/* Apple App Store */}
              <a
                href={siteConfig.appLinks.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:-translate-y-0.5 transition-transform"
              >
                <img
                  src={media.appDownload.appStore}
                  alt="Download from App Store"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </a>
            </div>
          </div>

          {/* Right Phone Preview Image */}
          <div className="flex justify-center items-center w-full lg:w-auto">
            <a
              href={siteConfig.appLinks.playStore}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="w-[220px] sm:w-[260px] md:w-[280px] lg:w-[300px] max-h-[440px] flex items-center justify-center">
                <SafeImage
                  src={media.appDownload.appPreview}
                  alt="Bhagvat Prasadam App Preview"
                  className="w-full h-auto object-contain bg-transparent"
                  imgClassName="w-full max-h-[400px] sm:max-h-[440px] object-contain mx-auto drop-shadow-md"
                  aspectRatio="aspect-auto"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
