import { apiGet, apiPost, apiDelete } from './apiClient.js';
import { getAuthToken } from '../utils/auth.js';

/**
 * Fetch authenticated customer wishlist
 */
export async function getWishlist() {
  if (!getAuthToken()) {
    return [];
  }
  const response = await apiGet('/wishlist');
  return Array.isArray(response.data) ? response.data : (response.data?.items || []);
}

/**
 * Toggle an item in wishlist (Add/Remove)
 */
export async function toggleWishlist(productId, variantId = null) {
  const response = await apiPost('/wishlist/toggle', {
    product_id: parseInt(productId, 10) || productId,
    variant_id: variantId ? (parseInt(variantId, 10) || variantId) : null
  });
  return response;
}

/**
 * Delete item from wishlist by wishlist ID
 */
export async function deleteWishlistItem(wishlistId) {
  const response = await apiDelete(`/wishlist/${wishlistId}`);
  return response;
}
