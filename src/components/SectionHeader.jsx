import React from 'react';

export default function SectionHeader({
  title,
  subtitle,
  hindiTitle,
  className = '',
  center = true
}) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : 'text-left'} ${className}`}>
      {hindiTitle && (
        <span className="text-xs sm:text-sm font-semibold text-brand-maroon/80 tracking-widest uppercase block mb-1">
          {hindiTitle}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-stone-500 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className={`mt-3 flex items-center gap-1.5 ${center ? 'justify-center' : 'justify-start'}`}>
        <div className="w-10 h-0.5 bg-brand-maroon rounded-full" />
        <div className="w-2.5 h-2.5 rotate-45 border-2 border-brand-gold bg-white" />
        <div className="w-10 h-0.5 bg-brand-maroon rounded-full" />
      </div>
    </div>
  );
}
