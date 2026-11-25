import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Truck, ShieldCheck, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SafeImage from '../components/SafeImage';
import QuantitySelector from '../components/QuantitySelector';
import { fetchCheckoutDiscounts, validateCoupon } from '../services/api';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    cartSavings,
    freeShippingEligible,
    amountToFreeShipping,
    shippingProgress
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isAutoDiscount, setIsAutoDiscount] = useState(false);
  const [manualCouponCode, setManualCouponCode] = useState('');
  const [dismissedAutoCode, setDismissedAutoCode] = useState(false);
  const cartCouponRuleRef = useRef(null);

  // Auto-fetch discounts from GET /checkout/discounts and apply if condition met, dynamically re-calculate on subtotal change
  useEffect(() => {
    let isSubscribed = true;

    async function checkCartDiscounts() {
      if (cartSubtotal <= 0) {
        setCouponCode('');
        setCouponApplied(false);
        setCouponDiscount(0);
        setIsAutoDiscount(false);
        setManualCouponCode('');
        cartCouponRuleRef.current = null;
        setCouponMessage('');
        return;
      }

      // If manual coupon is applied, dynamically re-calculate and re-validate against cartSubtotal!
      if (manualCouponCode) {
        const rule = cartCouponRuleRef.current;
        if (rule) {
          const minOrder = Number(rule.min_order_amount || 0);
          if (minOrder > 0 && cartSubtotal < minOrder) {
            setCouponCode('');
            setCouponApplied(false);
            setCouponDiscount(0);
            setIsAutoDiscount(false);
            setManualCouponCode('');
            cartCouponRuleRef.current = null;
            setCouponMessage('');
            setCouponError(`Coupon ${manualCouponCode} removed: Minimum order of ₹${minOrder} required.`);
            return;
          }

          let calculated = 0;
          if (rule.discount_type === 'percentage') {
            calculated = (cartSubtotal * Number(rule.value || 0)) / 100;
            if (rule.max_discount_amount) {
              calculated = Math.min(calculated, Number(rule.max_discount_amount));
            }
          } else {
            calculated = Number(rule.value || 0);
          }
          setCouponDiscount(Number(calculated.toFixed(2)));
          setCouponMessage(`✓ Coupon ${manualCouponCode} applied! (-₹${Number(calculated.toFixed(2))})`);
        }

        try {
          const vRes = await validateCoupon({
            code: manualCouponCode,
            order_amount: cartSubtotal,
          });
          if (!isSubscribed) return;

          if (vRes.success) {
            const disc = Number(vRes.discount_amount || 0);
            setCouponDiscount(disc);
            setCouponMessage(vRes.message || `✓ Coupon ${manualCouponCode} applied! (-₹${disc.toFixed(2)})`);
            if (vRes.data) {
              cartCouponRuleRef.current = { ...cartCouponRuleRef.current, ...vRes.data };
            }
          } else {
            setCouponCode('');
            setCouponApplied(false);
            setCouponDiscount(0);
            setIsAutoDiscount(false);
            setManualCouponCode('');
            cartCouponRuleRef.current = null;
            setCouponMessage('');
            setCouponError(vRes.message || 'Coupon condition no longer met.');
          }
        } catch (err) {
          console.warn('Failed to re-validate manual coupon on cart change:', err);
        }
        return;
      }

      try {
        const res = await fetchCheckoutDiscounts(cartSubtotal);
        if (!isSubscribed) return;

        if (res.success) {
          const auto = res.automaticDiscount;
          if (auto && auto.code && !dismissedAutoCode) {
            setCouponCode(auto.code);
            setCouponApplied(true);
            setCouponDiscount(Number(auto.discount_amount || 0));
            setCouponMessage(`✓ Auto discount ${auto.code} applied! (-₹${Number(auto.discount_amount || 0).toFixed(2)})`);
            setIsAutoDiscount(true);
            cartCouponRuleRef.current = auto;
            setCouponError('');
          } else if (!auto) {
            const autoRule = (res.discounts || []).find(
              (d) => d.is_automatic && (d.is_eligible || cartSubtotal >= (Number(d.min_order_amount) || 0))
            );

            if (autoRule && !dismissedAutoCode) {
              let calculated = 0;
              if (autoRule.discount_type === 'percentage') {
                calculated = (cartSubtotal * Number(autoRule.value || 0)) / 100;
                if (autoRule.max_discount_amount) {
                  calculated = Math.min(calculated, Number(autoRule.max_discount_amount));
                }
              } else {
                calculated = Number(autoRule.value || 0);
              }
              setCouponCode(autoRule.code);
              setCouponApplied(true);
              setCouponDiscount(Number(calculated.toFixed(2)));
              setCouponMessage(`✓ Auto discount ${autoRule.code} applied! (-₹${Number(calculated.toFixed(2))})`);
              setIsAutoDiscount(true);
              cartCouponRuleRef.current = autoRule;
              setCouponError('');
            } else if (isAutoDiscount) {
              setCouponCode('');
              setCouponApplied(false);
              setCouponDiscount(0);
              setIsAutoDiscount(false);
              cartCouponRuleRef.current = null;
              setCouponMessage('');
            }
          }
        }
      } catch (err) {
        console.warn('Failed to check cart discounts:', err);
      }
    }

    checkCartDiscounts();
    return () => { isSubscribed = false; };
  }, [cartSubtotal, manualCouponCode, isAutoDiscount, dismissedAutoCode]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');

    try {
      const res = await validateCoupon({
        code: couponCode.trim().toUpperCase(),
        order_amount: cartSubtotal,
      });

      if (res.success) {
        const disc = Number(res.discount_amount || 0);
        const upper = couponCode.trim().toUpperCase();
        const ruleData = res.data || {};
        const rule = {
          code: upper,
          discount_type: ruleData.discount_type || (res.discount_type || 'percentage'),
          value: Number(ruleData.value ?? res.value ?? 0),
          min_order_amount: Number(ruleData.min_order_amount ?? res.min_order_amount ?? 0),
          max_discount_amount: ruleData.max_discount_amount ?? res.max_discount_amount ?? null,
          ...ruleData,
        };
        cartCouponRuleRef.current = rule;
        setManualCouponCode(upper);
        setCouponCode(upper);
        setCouponApplied(true);
        setCouponDiscount(disc);
        setCouponMessage(res.message || `✓ Coupon ${upper} applied! (-₹${disc.toFixed(2)})`);
        setIsAutoDiscount(false);
        setDismissedAutoCode(false);
        setCouponError('');
      } else {
        setCouponError(res.message || 'Invalid or expired coupon code.');
      }
    } catch (err) {
      setCouponError(err.message || 'Failed to validate coupon code.');
    }
  };

  const handleRemoveCoupon = () => {
    if (isAutoDiscount) {
      setDismissedAutoCode(true);
    }
    cartCouponRuleRef.current = null;
    setManualCouponCode('');
    setCouponCode('');
    setCouponApplied(false);
    setCouponDiscount(0);
    setIsAutoDiscount(false);
    setCouponMessage('');
    setCouponError('');
  };

  const finalTotal = Math.max(0, cartSubtotal - couponDiscount);

  if (cart.length === 0) {
    return (
      <div className="py-20 bg-stone-50 min-h-[70vh] flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-stone-200">
          <div className="w-20 h-20 rounded-full bg-brand-cream text-brand-maroon flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-2">Your Prasad Basket is Empty</h1>
          <p className="text-sm text-stone-500 mb-6 leading-relaxed">
            Fill your home with the sanctity and authentic taste of temple prasad from Neelkanthdham.
          </p>
          <Link
            to="/collections/sweets"
            className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-colors"
          >
            <span>Explore Divine Sweets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Shopping Cart & Basket
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              You have <strong className="text-stone-800">{cartCount}</strong> divine prasad items
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-stone-500 hover:text-red-600 transition-colors"
          >
            Clear Entire Basket
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 mb-2">
            <Truck className="w-5 h-5 text-brand-maroon flex-shrink-0" />
            {freeShippingEligible ? (
              <span className="text-emerald-700 font-bold">
                🎉 Congratulations! Your order qualifies for Free Express Delivery across India!
              </span>
            ) : (
              <span>
                Add <strong className="text-brand-maroon">₹{amountToFreeShipping}</strong> more to your order to unlock Free Delivery!
              </span>
            )}
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                freeShippingEligible ? 'bg-emerald-500' : 'bg-brand-maroon'
              }`}
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm divide-y divide-stone-100">
            {cart.map((item) => (
              <div key={item.cartItemId} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                  <SafeImage src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.slug}`}
                    className="text-sm font-bold text-stone-900 hover:text-brand-maroon transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-stone-500 mt-0.5">Pack Size: <span className="font-semibold text-stone-700">{item.weight}</span></p>
                  <p className="text-xs font-bold text-brand-maroon mt-1">₹{Number(item.price || 0).toLocaleString('en-IN')} each</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(newQty) => updateQuantity(item.cartItemId, newQty, item.variantId)}
                    size="md"
                  />

                  {/* Subtotal */}
                  <span className="text-base font-black text-stone-900 min-w-[5rem] text-right">
                    ₹{(Number(item.totalPrice) || (Number(item.price || 0) * (item.quantity || 1))).toLocaleString('en-IN')}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId, item.variantId)}
                    className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar (Sticky on desktop only) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 static lg:sticky lg:top-28">
            <h3 className="text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Discount Coupon
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon (e.g. SAVE5)"
                    className="w-full pl-9 pr-3 py-2 text-xs uppercase border border-stone-200 rounded-xl focus:outline-none focus:border-brand-maroon font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-brand-maroon text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{couponMessage || `✓ Coupon ${couponCode} applied!`}</span>
                    {isAutoDiscount && (
                      <span className="bg-emerald-200 text-emerald-900 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                        Auto
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-emerald-700 hover:text-rose-600 p-1 rounded-md hover:bg-emerald-100 transition-colors cursor-pointer"
                    title="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-xs text-red-500 font-medium">{couponError}</p>
              )}
            </form>

            {/* Calculations */}
            <div className="space-y-3 pt-3 border-t border-stone-100 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">₹{cartSubtotal}</span>
              </div>

              {cartSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Product Savings</span>
                  <span>-₹{cartSavings}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({couponCode})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {freeShippingEligible ? (
                    <strong className="text-emerald-600 font-bold">FREE</strong>
                  ) : (
                    <span className="text-stone-500">₹99</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between text-lg font-black text-stone-900 pt-3 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="text-brand-maroon">
                  ₹{finalTotal + (freeShippingEligible ? 0 : 99)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand-maroon hover:bg-brand-maroon-dark text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              <span>Place Sacred Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="pt-2 text-center text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-stone-600 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Guaranteed Sacred Delivery</span>
              </div>
              <p>Safe & Encrypted 256-Bit SSL Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
