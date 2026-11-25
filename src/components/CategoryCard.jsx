import React from 'react';
import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';
import { useLanguage } from '../context/LanguageContext';

export default function CategoryCard({ category }) {
  const { language } = useLanguage();

  const displayName = 
    language === 'gu'
      ? (category.gujaratiName || category.name || category.title)
      : language === 'hi'
      ? (category.hindiName || category.name || category.title)
      : (category.title || category.name || 'Category');

  const imageUrl = category.imageUrl || category.image || category.image_url;
  const linkPath = category.path || `/collections/${category.handle || category.slug || category.id}`;

  return (
    <Link
      to={linkPath}
      className="group flex flex-col items-center text-center focus:outline-none w-full"
    >
      {/* Temple Arch Image Container */}
      <div className="relative w-full max-w-[160px] aspect-square flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <SafeImage
          src={imageUrl}
          alt={displayName}
          className="w-full h-full bg-transparent"
          imgClassName="w-full h-full object-contain block group-hover:scale-105 transition-transform duration-500"
          aspectRatio="aspect-square"
          fallbackText={displayName}
        />
      </div>

      {/* Category Name */}
      <h3 className="mt-3 text-xs sm:text-sm font-bold text-stone-900 group-hover:text-brand-maroon transition-colors tracking-tight line-clamp-2">
        {displayName}
      </h3>
    </Link>
  );
}
