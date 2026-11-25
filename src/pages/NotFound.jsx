import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-24 bg-stone-50 min-h-[75vh] flex items-center justify-center">
      <div className="text-center p-8 max-w-lg mx-auto bg-white rounded-3xl shadow-sm border border-stone-200">
        <span className="text-5xl sm:text-6xl font-black text-brand-maroon block mb-2">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-stone-500 mb-8 leading-relaxed">
          The page or prasadam offering you are looking for may have moved or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-sm px-6 py-3 rounded-full transition-colors shadow"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/collections/all"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm px-6 py-3 rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Collections</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
