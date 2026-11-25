import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SafeImage from './SafeImage';

export default function MegaMenu({ item, onClose = () => {} }) {
  if (!item || !item.subItems) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-stone-100 z-50 animate-fade-in">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Main Sublinks Column */}
          <div className="col-span-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-brand-maroon tracking-wide">
                {item.name} Collection
              </h3>
              <Link
                to={item.path}
                onClick={onClose}
                className="text-xs font-semibold text-stone-500 hover:text-brand-maroon flex items-center gap-1 transition-colors"
              >
                <span>View Full Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
              {item.subItems.map((sub, idx) => (
                <Link
                  key={idx}
                  to={sub.path}
                  onClick={onClose}
                  className={`text-sm py-1.5 transition-colors duration-150 flex items-center justify-between group ${
                    sub.isHighlight
                      ? 'font-bold text-brand-maroon hover:underline'
                      : 'text-stone-700 hover:text-brand-maroon hover:translate-x-1 transition-transform'
                  }`}
                >
                  <span className="truncate">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Image & Banner Card */}
          {item.featuredImage && (
            <div className="col-span-4 bg-brand-maroon-subtle rounded-2xl p-5 border border-brand-maroon/10">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3.5 shadow-sm bg-white">
                <SafeImage
                  src={item.featuredImage}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-brand-maroon bg-white px-2.5 py-0.5 rounded-full border border-brand-maroon/20 mb-1.5">
                {item.featuredTag || 'NilkanthDham Special'}
              </span>
              <h4 className="text-sm font-bold text-stone-900 mb-1">
                Sacred & Pure {item.name}
              </h4>
              <p className="text-xs text-stone-600 mb-3 line-clamp-2">
                Prepared with highest standards of devotion, traditional recipes, and authentic ingredients.
              </p>
              <Link
                to={item.path}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:text-brand-maroon-dark transition-colors"
              >
                <span>Explore All Offerings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
