import { storage } from './storage.js';

const AUTH_TOKEN_KEY = 'bhagvat_prasadam_customer_jwt';
const CUSTOMER_KEY = 'bhagvat_prasadam_customer_profile';

const unauthorizedListeners = new Set();

/**
 * Get current customer JWT token, returning null if missing or invalid
 */
export function getAuthToken() {
  let token = null;
  try {
    token = localStorage.getItem('customer_token') || storage.get(AUTH_TOKEN_KEY);
  } catch {
    token = storage.get(AUTH_TOKEN_KEY);
  }
  if (!token || typeof token !== 'string' || token.trim() === '' || token === 'undefined' || token === 'null') {
    return null;
  }
  return token.trim();
}

/**
 * Set customer JWT token
 */
export function setAuthToken(token) {
  if (!token) {
    try { localStorage.removeItem('customer_token'); } catch {}
    storage.remove(AUTH_TOKEN_KEY);
  } else {
    try { localStorage.setItem('customer_token', String(token).trim()); } catch {}
    storage.set(AUTH_TOKEN_KEY, String(token).trim());
  }
  try {
    window.dispatchEvent(new Event('auth-changed'));
  } catch {}
}

/**
 * Retrieve cached customer profile
 */
export function getStoredCustomer() {
  try {
    const raw = localStorage.getItem('customer_profile');
    if (raw) return JSON.parse(raw);
  } catch {}
  return storage.get(CUSTOMER_KEY, null);
}

/**
 * Save customer profile
 */
export function setStoredCustomer(customer) {
  if (!customer) {
    try { localStorage.removeItem('customer_profile'); } catch {}
    storage.remove(CUSTOMER_KEY);
  } else {
    try { localStorage.setItem('customer_profile', JSON.stringify(customer)); } catch {}
    storage.set(CUSTOMER_KEY, customer);
  }
}

/**
 * Clear all authentication data
 */
export function clearAuth() {
  try {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_profile');
  } catch {}
  storage.remove(AUTH_TOKEN_KEY);
  storage.remove(CUSTOMER_KEY);
  try {
    window.dispatchEvent(new Event('auth-changed'));
  } catch {}
}

/**
 * Trigger unauthorized event (401 response)
 */
export function notifyUnauthorized() {
  clearAuth();
  unauthorizedListeners.forEach(listener => {
    try {
      listener();
    } catch (e) {
      console.error('Error in unauthorized listener:', e);
    }
  });
}

/**
 * Register unauthorized listener
 */
export function onAuthUnauthorized(callback) {
  unauthorizedListeners.add(callback);
  return () => unauthorizedListeners.delete(callback);
}
