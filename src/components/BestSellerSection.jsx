import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts.js';

const FALLBACK_LEFT_ITEMS = [
  {
    id: 'dry-fruits-chikki',
    name: 'Dry Fruits Chikki',
    nameGu: 'ડ્રાય ફ્રૂટ્સ ચીકી',
    nameHi: 'ड्राई फ्रूट्स चिक्की',
    path: '/products/dry-fruits-chikki-dry-fruit-punch-dates-nutritional-punch-premium-gujarati-sweet',
    image: 'https://bhagvatprasadam.com/cdn/shop/files/ChatGPT_Image_Jun_27_2026_11_25_38_AM.webp?v=1786190575&width=300'
  },
  {
    id: 'motaiyya-ladoo',
    name: 'Motaiyya Ladoo',
    nameGu: 'મોટૈયા લાડુ',
    nameHi: 'मोटैया लड्डू',
    path: '/products/besan-ladoo-motaiyya-ladoo-traditional-gujarati-sweet',
    image: 'https://bhagvatprasadam.com/cdn/shop/files/besan_ladu.webp?v=1786191195&width=300'
  },
  {
    id: 'mohanthal',
    name: 'Mohanthal',
    nameGu: 'મોહનથાળ',
    nameHi: 'मोहनथाल',
    path: '/products/pure-traditional-gujarati-sweets-mohanthal',
    image: 'https://bhagvatprasadam.com/cdn/shop/files/mohan_thal.webp?v=1786190296&width=300'
  }
];

const FALLBACK_RIGHT_ITEMS = [
  {
    id: 'kopra-pak',
    name: 'Kopra Pak',
    nameGu: 'કોપરા પાક',
    nameHi: 'कोपरा पाक',
    path: '/products/kopra-pak-coconut-barfi-nariyal-barfi-traditional-indian-sweet',
    image: 'https://bhagvatprasadam.com/cdn/shop/files/ChatGPTImageJun27_2026_12_12_03PM.webp?v=1786190327&width=300'
  },
  {
    id: 'sukhadi',
    name: 'Sukhadi',
    nameGu: 'સુખડી',
    nameHi: 'સુખડી',
    path: '/products/sukhadi-ghee-traditional-indian-barfi-traditional-gud-papdi',
    image: 'https://bhagvatprasadam.com/cdn/shop/files/ChatGPT_Image_Jun_27_2026_11_21_18_AM.webp?v=1786190959&width=300'
  },
  {
    id: 'motichur-laddu',
    name: 'Motichur Laddu',
    nameGu: 'મોતીચૂર લાડુ',
    nameHi: 'मोतीचूर लड्डू',
    path: '/products/motichur-laddu-traditional-indian-festival-sweet',
    image: 'https://bhagvatprasadam.com/cdn/shop/files/motichur_ladu_1.webp?v=1786190302&width=300'
  }
];

export default function BestSellerSection() {
  const { t, language } = useLanguage();
  const { products: apiProducts } = useProducts();

  const { leftItems, rightItems } = useMemo(() => {
    if (apiProducts && apiProducts.length > 0) {
      const bestSellers = apiProducts.filter((p) => p.isBestSeller);
      const source = bestSellers.length >= 6 ? bestSellers : apiProducts;
      const formatted = source.slice(0, 6).map((p) => {
        const rawTitle = (p.title || '').trim();
        // Clean short title for circular badge display
        const shortName = rawTitle.includes('–')
          ? rawTitle.split('–')[0].trim()
          : rawTitle.includes('-')
          ? rawTitle.split('-')[0].trim()
          : rawTitle;

        return {
          id: p.id,
          name: rawTitle,
          title: rawTitle,
          shortName,
          path: `/products/${p.handle || p.slug || p.id}`,
          image: p.image || p.imageUrl
        };
      });

      if (formatted.length >= 6) {
        return {
          leftItems: formatted.slice(0, 3),
          rightItems: formatted.slice(3, 6)
        };
      }
    }

    return {
      leftItems: FALLBACK_LEFT_ITEMS,
      rightItems: FALLBACK_RIGHT_ITEMS
    };
  }, [apiProducts]);

  const characterVideoUrl = 'https://cdn.shopify.com/videos/c/o/v/c379f85e313c48eaa0a0d7648bb0a58c.mp4';

  const getItemName = (item) => {
    if (language === 'gu' && item.nameGu) return item.nameGu;
    if (language === 'hi' && item.nameHi) return item.nameHi;
    return item.shortName || item.name || item.title;
  };

  const renderCategoryItem = (item) => {
    const displayName = getItemName(item);
    const linkPath = item.path || `/products/${item.handle || item.slug || item.id}`;
    return (
      <div key={item.id} className="text-center group transition-transform duration-300 hover:-translate-y-1.5 px-1 sm:px-2">
        <Link to={linkPath} className="flex flex-col items-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 bg-brand-cream/30">
            <SafeImage
              src={item.image || item.imageUrl}
              alt={displayName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              aspectRatio="aspect-square"
              fallbackText={displayName}
            />
          </div>
          <p 
            className="mt-3.5 sm:mt-4 font-bold text-xs sm:text-sm text-stone-800 group-hover:text-brand-maroon transition-colors line-clamp-2 max-w-[130px] mx-auto"
            title={item.name || item.title}
          >
            {displayName}
          </p>
        </Link>
      </div>
    );
  };

  return (
    <section className="py-10 sm:py-16 bg-white" id="best-seller-section">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Authentic Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-[32px] font-normal sm:font-medium text-stone-800 tracking-tight text-center mb-8 sm:mb-12">
          {t('sec_best_seller', 'Best Seller')}
        </h2>

        {/* Desktop Single-Row Layout (min-width: 1025px) with Generous Spacing */}
        <div className="hidden lg:grid grid-cols-[repeat(3,minmax(110px,1fr))_minmax(200px,280px)_repeat(3,minmax(110px,1fr))] gap-6 xl:gap-10 2xl:gap-12 items-center justify-center max-w-7xl mx-auto px-2">
          {/* Left 3 items */}
          {leftItems.map(renderCategoryItem)}

          {/* Center 3D Praying Devotee Character Video */}
          <div className="flex items-center justify-center px-2 xl:px-6">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full max-w-[240px] xl:max-w-[280px] h-auto object-contain mx-auto select-none pointer-events-none"
            >
              <source src={characterVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Right 3 items */}
          {rightItems.map(renderCategoryItem)}
        </div>

        {/* Mobile & Tablet Responsive Layout with Extra Breathing Room */}
        <div className="lg:hidden flex flex-col items-center gap-8 sm:gap-10">
          {/* 3D Praying Devotee Character Video */}
          <div className="w-full flex justify-center">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-48 sm:w-60 h-auto object-contain mx-auto select-none pointer-events-none"
            >
              <source src={characterVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* 6 Circular Items Grid (3 per row) with Enhanced Spacing */}
          <div className="grid grid-cols-3 gap-x-5 gap-y-7 sm:gap-x-8 sm:gap-y-10 w-full max-w-xl mx-auto px-2">
            {leftItems.concat(rightItems).map(renderCategoryItem)}
          </div>
        </div>
      </div>
    </section>
  );
}
