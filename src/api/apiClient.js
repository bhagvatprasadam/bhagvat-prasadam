import { getAuthToken, notifyUnauthorized } from '../utils/auth.js';
import { getCartToken } from '../utils/cartToken.js';



const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env ? process.env : {});
export const API_BASE_URL = (env.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
export const SHOPFRONT_TOKEN = (env.VITE_API_SHOPFRONT_TOKEN || env.VITE_SHOPFRONT_TOKEN || DEFAULT_TOKEN).trim();

// Timeout threshold in milliseconds
const REQUEST_TIMEOUT = 25000;

// Endpoints that are strictly public catalog/content and must never send Authorization Bearer header
const PUBLIC_ENDPOINTS = [
  /^\/?products(\/|\?|$)/i,
  /^\/?collections(\/|\?|$)/i,
  /^\/?banners(\/|\?|$)/i,
  /^\/?checkout\/discounts(\?|$)/i,
  /^\/?cms(\/|\?|$)/i,
  /^\/?info(\/|\?|$)/i,
  /^\/?pincode(\/|\?|$)/i,
  /^\/?auth(\/|\?|$)/i,
  /^\/?reviews\/product(\/|\?|$)/i,
  /^\/?reviews(\?|$)/i,
  /^\/?enquiries(\/|\?|$)/i,
];

export function isPublicCatalogEndpoint(endpoint) {
  if (!endpoint || typeof endpoint !== 'string') return false;
  const clean = endpoint.replace(/^\/+/, '');
  return PUBLIC_ENDPOINTS.some(pattern => pattern.test(clean));
}

/**
 * Builds standard request headers with storefront token, optional customer JWT, and guest cart token
 */
export function buildHeaders(customHeaders = {}, includeCartToken = true, includeAuth = true) {
  const headers = {
    'Accept': 'application/json',
    'X-Shopfront-Token': SHOPFRONT_TOKEN,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    ...customHeaders
  };

  if (includeAuth) {
    const authToken = getAuthToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
  }

  if (includeCartToken) {
    const cartToken = getCartToken();
    if (cartToken) {
      headers['X-Cart-Token'] = cartToken;
    }
  }

  return headers;
}

/**
 * Normalizes error responses into a consistent UI-friendly error format
 */
export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Core HTTP fetch request handler
 */
export async function apiRequest(endpoint, {
  method = 'GET',
  body = null,
  headers = {},
  includeCartToken = true,
  includeAuth = true,
  signal = null,
  isAbsoluteUrl = false,
  _retryCount = 0
} = {}) {
  let url = isAbsoluteUrl ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // For strictly public catalog endpoints, never send Authorization Bearer header
  // Sending an expired or invalid token to public endpoints triggers backend 401 errors
  const isPublic = isPublicCatalogEndpoint(endpoint);
  const shouldIncludeAuth = includeAuth && !isPublic;

  const requestHeaders = buildHeaders(headers, includeCartToken, shouldIncludeAuth);

  const fetchOptions = {
    method,
    headers: requestHeaders,
    cache: 'no-store',
    signal
  };

  if (body !== null && body !== undefined) {
    if (typeof body === 'string') {
      fetchOptions.body = body;
    } else if (body instanceof FormData) {
      fetchOptions.body = body;
      delete requestHeaders['Content-Type'];
    } else {
      requestHeaders['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify(body);
    }
  }

  const timeoutId = setTimeout(() => {
    // Timeout handler if not aborted
  }, REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      notifyUnauthorized();

      // If this request had an Authorization header and can work without it (e.g. /cart),
      // auto-retry once anonymously so guest user experience does not break
      const isStrictlyPrivate = /^\/?(customer|orders|wishlist)(\/|\?|$)/i.test(endpoint.replace(/^\/+/, ''));
      if (!isStrictlyPrivate && shouldIncludeAuth && _retryCount === 0) {
        return await apiRequest(endpoint, {
          method,
          body,
          headers,
          includeCartToken,
          includeAuth: false,
          signal,
          isAbsoluteUrl,
          _retryCount: 1
        });
      }
    }

    const contentType = response.headers.get('content-type') || '';
    let resultData = null;

    if (contentType.includes('application/json')) {
      try {
        resultData = await response.json();
      } catch {
        resultData = null;
      }
    } else {
      const text = await response.text();
      try {
        resultData = JSON.parse(text);
      } catch {
        resultData = { rawText: text };
      }
    }

    if (!response.ok) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (resultData) {
        if (typeof resultData.message === 'string') {
          errorMessage = resultData.message;
        } else if (typeof resultData.error === 'string') {
          errorMessage = resultData.error;
        } else if (resultData.error?.message) {
          errorMessage = resultData.error.message;
        } else if (resultData.errors) {
          if (Array.isArray(resultData.errors)) {
            errorMessage = resultData.errors.map(e => (typeof e === 'string' ? e : e.message)).join(', ');
          } else if (typeof resultData.errors === 'object') {
            errorMessage = Object.values(resultData.errors).flat().join(', ');
          }
        }
      }

      throw new ApiError(errorMessage, response.status, resultData);
    }

    return resultData;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) {
      throw err;
    }
    if (err.name === 'AbortError') {
      throw new ApiError('Request was aborted.', 0);
    }
    throw new ApiError(
      err.message || 'Network unavailable. Please check your internet connection.',
      0,
      null
    );
  }
}

// Convenience wrapper functions
export const apiGet = (endpoint, options = {}) =>
  apiRequest(endpoint, { ...options, method: 'GET' });

export const apiPost = (endpoint, body = null, options = {}) =>
  apiRequest(endpoint, { ...options, method: 'POST', body });

export const apiPut = (endpoint, body = null, options = {}) =>
  apiRequest(endpoint, { ...options, method: 'PUT', body });

export const apiPatch = (endpoint, body = null, options = {}) =>
  apiRequest(endpoint, { ...options, method: 'PATCH', body });

export const apiDelete = (endpoint, options = {}) =>
  apiRequest(endpoint, { ...options, method: 'DELETE' });
