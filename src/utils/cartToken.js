import { storage } from './storage.js';

const CART_TOKEN_KEY = 'bhagvat_prasadam_cart_token';

/**
 * Creates and stores a unique persistent guest cart token
 */
export function createCartToken() {
  let uuid;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    uuid = crypto.randomUUID();
  } else {
    uuid = 'guest_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
  }
  const token = `cart_${uuid}`;
  storage.set(CART_TOKEN_KEY, token);
  return token;
}

/**
 * Returns existing guest cart token or generates and persists a new one
 */
export function getCartToken() {
  let token = storage.get(CART_TOKEN_KEY);
  if (!token || typeof token !== 'string' || !token.startsWith('cart_')) {
    token = createCartToken();
  }
  return token;
}

/**
 * Resets the cart token (e.g. after successful order completion)
 */
export function resetCartToken() {
  storage.remove(CART_TOKEN_KEY);
  return createCartToken();
}
