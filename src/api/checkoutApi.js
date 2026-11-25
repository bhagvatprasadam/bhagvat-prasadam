import { apiGet, apiPost } from './apiClient.js';

/**
 * Pincode auto-lookup (city, state, country, district)
 */
export async function getPincodeInfo(pincode) {
  if (!pincode || String(pincode).trim().length < 6) return null;
  const cleanPincode = String(pincode).trim();
  const response = await apiGet(`/pincode/${cleanPincode}`);
  return response.data || null;
}

/**
 * Calculate dynamic shipping rates
 */
export async function getShippingRates({ address, orderAmount, items }) {
  const payload = {
    address: {
      country: address.country || 'India',
      state: address.state || '',
      pincode: address.pincode || '',
      city: address.city || ''
    },
    order_amount: parseFloat(orderAmount) || 0,
    items: items.map(item => ({
      variant_id: parseInt(item.variantId || item.variant_id, 10) || 0,
      quantity: parseInt(item.quantity, 10) || 1
    }))
  };

  const response = await apiPost('/shipping/rates', payload);
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Validate discount promo coupon
 */
export async function validateCoupon({ code, orderAmount }) {
  const response = await apiPost('/checkout/validate-coupon', {
    code: String(code).trim(),
    order_amount: parseFloat(orderAmount) || 0
  });
  return response;
}

/**
 * Fetch available store discounts & automatic discounts
 */
export async function getCheckoutDiscounts(subtotal = 0) {
  try {
    const url = `/checkout/discounts${Number(subtotal) > 0 ? `?subtotal=${encodeURIComponent(subtotal)}` : ''}`;
    const response = await apiGet(url);
    const data = response.data || [];
    const autoDiscount = response.automatic_discount || null;
    return {
      success: true,
      discounts: Array.isArray(data) ? data : [],
      automaticDiscount: autoDiscount
    };
  } catch (err) {
    console.warn('Failed to fetch checkout discounts:', err.message);
    return {
      success: false,
      discounts: [],
      automaticDiscount: null
    };
  }
}

/**
 * Fetch available payment gateways configured on store
 */
export async function getPaymentGateways() {
  const response = await apiGet('/checkout/payment-gateways');
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Sync abandoned checkout session (creates session / returns order_id)
 */
export async function syncAbandonedCheckout(payload) {
  const response = await apiPost('/checkout/abandoned/sync', payload);
  return response.data || response;
}

/**
 * Initiate payment gateway transaction (Razorpay, ICICI, Easebuzz, COD)
 */
export async function initiatePayment(payload) {
  const response = await apiPost('/checkout/initiate-payment', payload);
  return response.data || response;
}

/**
 * Verify online payment gateway HMAC signature and capture order
 */
export async function verifyPayment(payload) {
  const response = await apiPost('/checkout/verify-payment', payload);
  return response.data || response;
}
