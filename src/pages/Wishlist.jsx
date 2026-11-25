import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, User } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SafeImage from '../components/SafeImage';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated, loading, openLoginModal } = useAuth();

  const handleMoveToCart = (product) => {
    addToCart(product, null, 1);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    if (!isAuthenticated && !loading) {
      return (
        <div className="py-20 bg-stone-50 min-h-[70vh] flex items-center justify-center">
          <div className="text-center p-8 max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-stone-200">
            <div className="w-20 h-20 rounded-full bg-brand-cream text-brand-maroon flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-stone-900 mb-2">Sacred Wishlist Access</h1>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              Sign in to view and synchronize your saved sacred offerings across all your devices.
            </p>
            <button
              onClick={openLoginModal}
              className="w-full bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-colors"
            >
              Sign In with Email / OTP
            </button>
            <div className="mt-4">
              <Link to="/collections/all" className="text-xs font-semibold text-stone-500 hover:text-brand-maroon">
                Or browse all prasadam offerings
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="py-20 bg-stone-50 min-h-[70vh] flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-stone-200">
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-2">Your Wishlist is Empty</h1>
          <p className="text-sm text-stone-500 mb-6 leading-relaxed">
            Save your favorite sanctified sweets, namkeen, and cow products to order them anytime.
          </p>
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-colors"
          >
            <span>Browse All Prasadam</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        {/* Guest Device Sync Banner */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-brand-cream border border-amber-200/70 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <span className="text-stone-700">
              💡 These offerings are saved locally on this browser. <strong>Sign in</strong> to sync your wishlist across all your phones and computers.
            </span>
            <button
              onClick={openLoginModal}
              className="px-4 py-2 bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold rounded-full text-xs transition-colors shadow-xs whitespace-nowrap"
            >
              Sign In to Sync
            </button>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            My Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            You have saved <strong className="text-brand-maroon">{wishlist.length}</strong> items to your sacred wish list
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm p-3.5 flex flex-col justify-between overflow-hidden relative group"
            >
              <div>
                <div className="aspect-square rounded-xl overflow-hidden bg-stone-50 mb-3 relative">
                  <SafeImage src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-stone-400 hover:text-red-500 flex items-center justify-center shadow transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Link to={`/products/${product.slug}`} className="block group-hover:text-brand-maroon transition-colors">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2">
                    {product.title}
                  </h3>
                </Link>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-black text-brand-maroon">₹{product.price}</span>
                  {product.comparePrice > product.price && (
                    <span className="text-xs text-stone-400 line-through">₹{product.comparePrice}</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleMoveToCart(product)}
                className="mt-4 w-full bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
