import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { media } from '../data/media';

export default function OurGauDham() {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50/50 pb-16 font-sans">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-stone-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-stone-500 font-medium">
            <Link to="/" className="hover:text-[#700B10] transition-colors">
              Home
            </Link>
            <span className="text-stone-400">/</span>
            <span className="text-[#700B10] font-semibold">
              {t('farms_hero_title', 'Our Gau Dham')}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Section 1: Hero Emblem & Title */}
        <section className="text-center mb-14 sm:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#700B10] tracking-tight mb-8">
            {t('farms_hero_title', 'Our Gau Dham')}
          </h1>
          <div className="flex justify-center items-center">
            <img
              src={media.farms.logo}
              alt="Shree Nilkanthdham Gau Dham Emblem"
              className="max-w-[280px] sm:max-w-[340px] md:max-w-[380px] w-full h-auto object-contain transition-transform duration-500 hover:scale-105 drop-shadow-sm"
              loading="eager"
            />
          </div>
        </section>

        {/* Section 2: Our Inspiration */}
        <section className="mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            {/* Left Image: Padma Shri Subhash Palekar & Gir Cows */}
            <div className="relative group overflow-hidden rounded-2xl shadow-md border border-stone-200/80 bg-white">
              <img
                src={media.farms.inspiration}
                alt="Padma Shri Subhash Palekar Ji and Gir Cows"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-102"
                loading="lazy"
              />
            </div>

            {/* Right Content */}
            <div className="space-y-5 lg:pl-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#700B10]">
                {t('farms_inspiration_title', 'Our Inspiration')}
              </h2>
              <div className="w-16 h-1 bg-[#700B10] rounded-full"></div>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed text-justify sm:text-left">
                {t('farms_inspiration_p1', 'At Bhagvat Prasadam, we are inspired by the principles of Subhash Palekar Natural Farming (SPNF) – a farming method that respects nature and avoids the use of chemicals, pesticides, or synthetic fertilizers. It is based on traditional Indian wisdom where soil, crops, animals, and humans live in harmony.')}
              </p>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed text-justify sm:text-left">
                {t('farms_inspiration_p2', 'To ensure purity, we source grains, nuts, and ingredients only from farmers practicing this natural method of cultivation. In making our sweets, we use Pure Amul Ghee, while the Gir Cow Ghee we sell comes directly from our own Gir cows, cared for with love and devotion.')}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Our Ingredients */}
        <section className="mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1 space-y-6 lg:pr-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#700B10]">
                {t('farms_ingredients_title', 'Our Ingredients')}
              </h2>
              <div className="w-16 h-1 bg-[#700B10] rounded-full"></div>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed text-justify sm:text-left">
                {t('farms_ingredients_p1', 'Every ingredient that goes into our products has its roots in Natural Farming. From the groundnuts used in our oil to the flour and spices used in our sweets and namkeen, everything is sourced from farms that follow Subhash Palekar’s natural method. This makes every bite of Bhagvat Prasadam wholesome, safe, and satvik.')}
              </p>

              {/* Product Highlights Card */}
              <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif">
                  {t('farms_products_heading', 'Our Products')}
                </h3>
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#700B10]/10 text-[#700B10] text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div className="text-stone-700 text-sm sm:text-base leading-snug">
                      <strong className="text-stone-900 font-semibold">{t('farms_prod1_title', 'Gir Cow Ghee')}: </strong>
                      {t('farms_prod1_desc', 'made from the milk of our own Gir cows, following traditional methods.')}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#700B10]/10 text-[#700B10] text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div className="text-stone-700 text-sm sm:text-base leading-snug">
                      <strong className="text-stone-900 font-semibold">{t('farms_prod2_title', 'Groundnut Oil')}: </strong>
                      {t('farms_prod2_desc', 'extracted from groundnuts cultivated using SPNF practices.')}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#700B10]/10 text-[#700B10] text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div className="text-stone-700 text-sm sm:text-base leading-snug">
                      <strong className="text-stone-900 font-semibold">{t('farms_prod3_title', 'Sweets & Namkeen')}: </strong>
                      {t('farms_prod3_desc', 'prepared using natural ingredients and pure Amul ghee, without chemicals or preservatives.')}
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Image: Pure Ingredients & Vedic Pot */}
            <div className="order-1 lg:order-2 relative group overflow-hidden rounded-2xl shadow-md border border-stone-200/80 bg-white">
              <img
                src={media.farms.ingredients}
                alt="Natural Farming Ingredients & Pure Vedic Ghee Process"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-102"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Section 4: Our Mission (Full-width deep temple maroon banner) */}
      <section className="bg-[#700B10] text-white py-14 sm:py-20 my-12 sm:my-16 shadow-inner relative overflow-hidden">
        {/* Subtle decorative radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 sm:mb-8 text-amber-200 tracking-wide">
            {t('farms_mission_title', 'Our Mission')}
          </h2>
          <div className="space-y-5 sm:space-y-6 text-stone-100 text-base sm:text-lg md:text-xl font-light leading-relaxed">
            <p className="text-justify sm:text-center">
              {t('farms_mission_p1', 'At Bhagvat Prasadam, our mission is to bring back the purity of traditional food by choosing ingredients grown through Subhash Palekar Natural Farming. We are committed to offering products that are free from chemicals and preservatives, prepared only with natural and wholesome ingredients.')}
            </p>
            <p className="text-justify sm:text-center">
              {t('farms_mission_p2', 'Every sweet, namkeen, ghee, and oil we make reflects our belief in healthy living, respect for nature, and devotion to tradition. Through this, we aim to serve not just food, but trust, health, and happiness to every home.')}
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Video Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="rounded-2xl overflow-hidden shadow-2xl border border-stone-200/90 bg-black relative">
          <div className="relative aspect-video w-full">
            {!isPlaying ? (
              <div
                onClick={() => setIsPlaying(true)}
                className="relative w-full h-full cursor-pointer group"
                role="button"
                tabIndex={0}
                aria-label={t('farms_video_play', 'Play Video')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setIsPlaying(true);
                  }
                }}
              >
                {/* Poster Image */}
                <img
                  src={media.farms.videoPoster}
                  alt="Our Gau Dham Video Preview"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Animated Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-110 ring-4 ring-white/50">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 ml-1 text-white fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${media.farms.youtubeId}?autoplay=1&playlist=${media.farms.youtubeId}&loop=1`}
                title="Our Gau Dham Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
