import React, { useMemo } from 'react';
import { categories as fallbackCategories } from '../data/categories';
import CategoryCard from './CategoryCard';
import { useLanguage } from '../context/LanguageContext';
import { useCollections } from '../hooks/useCollections';

// Predefined translations for API collection handles to match brand localization
const COLLECTION_TRANSLATIONS = {
  'perfume': { hi: 'इत्र व परफ्यूम', gu: 'પરફ્યુમ' },
  'attar': { hi: 'प्राकृतिक अत्तर', gu: 'શુદ્ધ અત્તર' },
  'agarbatti': { hi: 'धूप व अगरबत्ती', gu: 'સુગંધિત અગરબત્તી' },
  'dhoop': { hi: 'पवित्र धूप', gu: 'પવિત્ર ધૂપ' },
  'air-freshner': { hi: 'रूम फ्रेशनर', gu: 'એર ફ્રેશનર' },
  'pooja-saman': { hi: 'पूजा सामग्री', gu: 'પૂજા સામગ્રી' },
  'pital-&-copper': { hi: 'पीतल व तांबा बर्तन', gu: 'પીત્તળ અને તાંબુ' },
  'aarti': { hi: 'आरती व दीप संग्रह', gu: 'આરતી સંગ્રહ' },
  'murti': { hi: 'पवित्र मूर्तियां', gu: 'પવિત્ર મૂર્તિઓ' },
  'chandan-powder': { hi: 'चंदन पाउडर व तिलक', gu: 'ચંદન પાઉડર' },
  'aushadhi': { hi: 'आयुर्वेदिक व हर्बल', gu: 'આયુર્વેદિક ઔષધિ' },
  'aushadhi-&-cosemetic-items': { hi: 'आयुर्वेदिक व कॉस्मेटिक', gu: 'આયુર્વેદિક અને પ્રસાધન' },
  'sweets': { hi: 'पारंपरिक मिठाई', gu: 'શુદ્ધ ઘીની મીઠાઈ' },
  'natural': { hi: 'प्राकृतिक वैदिक उत्पाद', gu: 'પ્રાકૃતિક વૈદિક ઉત્પાદનો' },
  'namkeen': { hi: 'काठियावाड़ी नमकीन', gu: 'સ્વાદિષ્ટ નમકીન' },
  'farali': { hi: 'फराली उपवास नमकीन', gu: 'ફરાળી વાનગીઓ' },
  'ayurvedic': { hi: 'आयुर्वेदिक उत्पाद', gu: 'આયુર્વેદિક ઉત્પાદનો' }
};

export default function CategorySection() {
  const { t } = useLanguage();
  const { collections: apiCollections, loading } = useCollections();

  // Display ONLY collections marked is_display === true from the API (or fallback to active 5 displayable categories)
  const displayCategories = useMemo(() => {
    const validApi = (apiCollections || []).filter(
      (c) => c.isActive && c.isDisplay && (c.imageUrl || c.image)
    );

    if (validApi.length > 0) {
      return validApi.map((c) => {
        const trans = COLLECTION_TRANSLATIONS[c.handle] || {};
        return {
          id: c.id,
          name: c.title,
          title: c.title,
          handle: c.handle,
          slug: c.handle,
          path: `/collections/${c.handle}`,
          image: c.imageUrl || c.image,
          imageUrl: c.imageUrl || c.image,
          hindiName: trans.hi || c.hindiName,
          gujaratiName: trans.gu || c.gujaratiName,
          itemCount: c.productCount || 0
        };
      });
    }

    // Fallback: Only categories with is_display === true
    const CATEGORY_ORDER = ['natural', 'namkeen', 'farali', 'sweets', 'best-seller'];
    return CATEGORY_ORDER
      .map((id) => fallbackCategories.find((c) => c.id === id))
      .filter(Boolean);
  }, [apiCollections]);

  return (
    <section className="py-6 sm:py-10 bg-white" id="shop-by-category">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        {/* Authentic Header Matching Reference Website */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-normal sm:font-medium text-stone-900 tracking-tight font-heading">
            {t('sec_shop_by_category', 'Shop By Category')}
          </h2>
        </div>

        {/* Dynamic Category Items Centered based on count */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 ${displayCategories.length <= 5 ? 'md:grid-cols-5' : 'md:grid-cols-6'} gap-3 sm:gap-4 md:gap-6 justify-items-center max-w-6xl mx-auto`}>
          {displayCategories.map((category) => (
            <CategoryCard key={category.id || category.handle} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
