import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import SectionHeader from '../components/SectionHeader';
import ProductGrid from '../components/ProductGrid';
import PromotionalSection from '../components/PromotionalSection';
import BestSellerSection from '../components/BestSellerSection';
import VideoSection from '../components/VideoSection';
import AppDownloadSection from '../components/AppDownloadSection';
import InstagramSection from '../components/InstagramSection';
import DivinePrasadamGlobalSection from '../components/DivinePrasadamGlobalSection';
import WhatsAppCommunitySection from '../components/WhatsAppCommunitySection';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts.js';

export default function Home() {
  const { t } = useLanguage();
  const { products: apiProducts } = useProducts();
  const prods = Array.isArray(apiProducts) ? apiProducts : [];

  const featuredProducts = prods.filter(p => p.isFeatured || p.isBestSeller);
  const bestSellers = prods.filter(p => p.isBestSeller);
  const sweetsAndPrasad = prods.filter(p =>
    (p.category && p.category.toLowerCase().includes('sweet')) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes('sweet')))
  );

  const finalNewArrivals = prods.slice(0, 4);
  const finalServedToGod = prods.slice(4, 8);

  return (
    <div className="space-y-4">
      {/* 1. Hero Banner Slideshow */}
      <Hero />

      {/* 2. Shop By Category Circular Grid */}
      <CategorySection />

      {/* 3. Promotional Two-Column Banners (Annakut Prasadam & Pooja Samagri) */}
      <PromotionalSection />

      {/* 4. New Arrivals Product Grid (product_list_EDUBdR on reference site) */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight font-heading">
              {t('sec_new_arrivals', 'New Arrivals')}
            </h2>
          </div>

          <ProductGrid products={finalNewArrivals} />
        </div>
      </section>

      {/* 5. Bhagwan Ka Prasad - Global Devotee Offering Banner (hero_KLjfmK on reference site) */}
      <DivinePrasadamGlobalSection />

      {/* 6. Best Seller Section with Animated Praying Devotee (sweets_xLbrMc on bhagvatprasadam.com) */}
      <BestSellerSection />

      {/* 7. Served to God, Perfected for you (product_list_UkRyXe on reference site) */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight font-heading">
              {t('sec_served_to_god', 'Served to God, Perfected for you')}
            </h2>
          </div>

          <ProductGrid products={finalServedToGod} />
        </div>
      </section>

      {/* 8. App Download Section (custom_liquid_Ckf7mH on reference site) */}
      <AppDownloadSection />

      {/* 9. Instagram Reels 3D Section (reels_section_czGGdW on bhagvatprasadam.com) */}
      <InstagramSection />

      {/* 10. Temple Darshan & Video Section (reels and videoframe_4196) */}
      <VideoSection />

      {/* 11. WhatsApp Community Section */}
      <WhatsAppCommunitySection />
    </div>
  );
}
