import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import SafeImage from './SafeImage';
import QuantitySelector from './QuantitySelector';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    cartSavings,
    freeShippingEligible,
    amountToFreeShipping,
    shippingProgress
  } = useCart();

  const { t, formatTitle, language } = useLanguage();
  const navigate = useNavigate();

  // Prevent background scrolling while drawer is active
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-maroon" />
              <h2 className="text-lg font-extrabold text-stone-900">
                {t('cart_your_cart', 'Your Cart')}
              </h2>
              <span className="bg-brand-maroon-subtle text-brand-maroon text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-3.5 bg-brand-cream border-b border-stone-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 mb-2">
              <Truck className="w-4 h-4 text-brand-maroon flex-shrink-0" />
              {freeShippingEligible ? (
                <span className="text-emerald-700 font-bold">
                  {language === 'gu'
                    ? '🎉 અભિનંદન! તમે મફત શિપિંગ અનલૉક કર્યું છે!'
                    : language === 'hi'
                    ? '🎉 बधाई हो! आपको मुफ्त शिपिंग मिल गई है!'
                    : '🎉 Congratulations! You unlocked Free Shipping!'}
                </span>
              ) : (
                <span>
                  {language === 'gu'
                    ? `મફત શિપિંગ માટે વધુ ₹${amountToFreeShipping} ઉમેરો`
                    : language === 'hi'
                    ? `मुफ्त शिपिंग के लिए ₹${amountToFreeShipping} और जोड़ें`
                    : `Add ₹${amountToFreeShipping} more for Free Shipping`}
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  freeShippingEligible ? 'bg-emerald-500' : 'bg-brand-maroon'
                }`}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Item List / Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-brand-cream flex items-center justify-center text-brand-maroon">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-stone-800">
                  {t('cart_empty', 'Your cart is empty')}
                </h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  {t('cart_empty_sub', 'Experience the divine sacred prasad of NilkanthDham temple.')}
                </p>
                <Link
                  to="/collections/sweets"
                  onClick={closeCart}
                  className="bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors shadow"
                >
                  {t('cart_continue_shopping', 'Continue Shopping')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const itemTitle = formatTitle(item);
                  return (
                    <div key={item.cartItemId} className="flex gap-4 pt-3 first:pt-0">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                        <SafeImage
                          src={item.image}
                          alt={itemTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <Link
                              to={`/products/${item.slug}`}
                              onClick={closeCart}
                              className="text-xs sm:text-sm font-bold text-stone-900 hover:text-brand-maroon transition-colors line-clamp-1"
                            >
                              {itemTitle}
                            </Link>
                            <button
                              onClick={() => removeFromCart(item.cartItemId, item.variantId)}
                              className="text-stone-400 hover:text-red-500 p-1 transition-colors"
                              aria-label={`Remove ${itemTitle} from cart`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-stone-500 font-medium">{item.weight || item.variantTitle || 'Standard'}</span>
                            <span className="text-xs font-semibold text-stone-800">₹{Number(item.price || 0).toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <QuantitySelector
                            quantity={item.quantity}
                            onChange={(newQty) => updateQuantity(item.cartItemId, newQty, item.variantId)}
                            size="sm"
                          />
                          <div className="text-right">
                            <span className="text-sm font-bold text-brand-maroon">
                              ₹{(Number(item.totalPrice) || (Number(item.price || 0) * (item.quantity || 1))).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{t('cart_subtotal', 'Subtotal')}</span>
                  <span className="font-bold text-stone-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Total Discount Saved</span>
                    <span>-₹{cartSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{freeShippingEligible ? <strong className="text-emerald-600">FREE</strong> : 'Calculated at checkout'}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="text-brand-maroon">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  className="w-full bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold py-3 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <span>{t('cart_checkout', 'Proceed to Checkout')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={closeCart}
                  className="w-full bg-white hover:bg-stone-100 text-stone-700 font-semibold py-2 px-4 rounded-xl border border-stone-200 transition-colors text-xs text-center"
                >
                  {t('cart_continue_shopping', 'Continue Shopping')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
