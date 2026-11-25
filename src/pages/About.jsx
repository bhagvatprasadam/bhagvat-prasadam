import React from 'react';
import { Sparkles, Heart, Award, ShieldCheck } from 'lucide-react';
import { media } from '../data/media';
import SafeImage from '../components/SafeImage';

export default function About() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-maroon bg-brand-maroon-subtle px-3 py-1 rounded-full">
            Our Sacred Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            About Bhagvat Prasadam & NilkanthDham
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Bringing the sanctified, pure essence of Neelkanthdham Swaminarayan Temple offerings directly to devotees worldwide.
          </p>
        </div>

        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden shadow-xl aspect-[21/9] border border-stone-200">
          <SafeImage
            src={media.banners.gauDhamBanner}
            alt="NilkanthDham Swaminarayan Temple"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Story Section */}
        <div className="prose prose-stone max-w-none space-y-6 text-sm sm:text-base text-stone-700 leading-relaxed">
          <h2 className="text-2xl font-extrabold text-stone-900">
            The Divine Essence of Prasadam
          </h2>
          <p>
            At <strong>Neelkanthdham Swaminarayan Temple</strong> in Poicha (Rajpipla, Gujarat), food is never merely cooked—it is lovingly prepared as a sacred devotional offering (<em>Bhog</em>) for Supreme Lord Swaminarayan. Prepared in an environment resonant with Vedic chants and devotional hymns, every grain, sweet, and farsan absorbs divine spiritual vibrations.
          </p>
          <p>
            Once consecrated before the divine deity, the offering becomes <strong>Prasadam</strong>—imbued with spiritual peace, purity, and life-nourishing benevolence. Bhagvat Prasadam was established to fulfill the yearning of thousands of devotees who wish to receive this authentic, sanctified blessing at their doorsteps anywhere in India and across the globe.
          </p>

          {/* Core Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
            <div className="bg-brand-cream/60 p-6 rounded-2xl border border-stone-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-brand-maroon text-white flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">100% Satvik Tradition</h3>
              <p className="text-xs text-stone-600">
                Prepared strictly without onion, garlic, gelatin, or artificial flavorings according to ancient Vedic scriptures.
              </p>
            </div>

            <div className="bg-brand-cream/60 p-6 rounded-2xl border border-stone-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-brand-maroon text-white flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Our Gir Cow Gau Shala</h3>
              <p className="text-xs text-stone-600">
                Sweets and ghee crafted using whole milk from indigenous, grass-fed Gir cows nurtured with divine reverence.
              </p>
            </div>

            <div className="bg-brand-cream/60 p-6 rounded-2xl border border-stone-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-brand-maroon text-white flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Uncompromising Purity</h3>
              <p className="text-xs text-stone-600">
                Zero chemical preservatives, cooked in cold-pressed peanut oil and pure Vedic bilona cow ghee.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-stone-900">
            Our Holy Gau Shala & Gau Dham
          </h2>
          <p>
            In Indian culture, the cow is revered as <em>Gau Mata</em>—the embodiment of universal motherhood and purity. At our Gau Shala in Poicha, hundreds of indigenous Gir cows roam freely in lush pastures. Their milk is churned using the ancient two-way wooden <em>Bilona</em> method to extract pure golden A2 Ghee, packed with nourishing vitamins and divine aroma.
          </p>
        </div>
      </div>
    </div>
  );
}
