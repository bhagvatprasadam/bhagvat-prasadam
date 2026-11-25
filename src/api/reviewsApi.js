import { apiGet, apiPost } from './apiClient.js';

/**
 * Get customer reviews for a product with pagination
 */
export async function getProductReviews(productId, { page = 1, limit = 50 } = {}) {
  try {
    const cleanId = String(productId).trim();
    if (!/^\d+$/.test(cleanId)) {
      return { reviews: [], pagination: { total: 0, page: 1, limit, total_pages: 0 } };
    }
    const response = await apiGet(`/reviews/product/${cleanId}?page=${page}&limit=${limit}`);
    return {
      reviews: Array.isArray(response?.data?.reviews) ? response.data.reviews : [],
      pagination: response?.data?.pagination || {
        total: Array.isArray(response?.data?.reviews) ? response.data.reviews.length : 0,
        page,
        limit,
        total_pages: 1
      }
    };
  } catch (err) {
    console.warn(`Failed to fetch reviews for product ${productId}:`, err.message);
    return {
      reviews: [],
      pagination: { total: 0, page: 1, limit, total_pages: 0 }
    };
  }
}

/**
 * Add review as a logged-in customer
 */
export async function submitCustomerReview({ productId, rating, title, description, images = [] }) {
  const payload = {
    product_id: parseInt(productId, 10) || productId,
    rating: parseInt(rating, 10) || 5,
    title: title || '',
    description: description || '',
    images: Array.isArray(images) ? images : []
  };
  const response = await apiPost('/reviews/customer', payload);
  return response.data || response;
}

/**
 * Add review as guest / public user
 */
export async function submitGuestReview({ productId, customerName, rating, title, description, images = [] }) {
  const payload = {
    product_id: parseInt(productId, 10) || productId,
    customer_name: customerName || 'Sacred Devotee',
    rating: parseInt(rating, 10) || 5,
    title: title || '',
    description: description || '',
    images: Array.isArray(images) ? images : []
  };
  const response = await apiPost('/reviews', payload);
  return response.data || response;
}
