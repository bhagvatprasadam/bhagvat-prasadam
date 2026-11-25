// Authentic reviews data store for Bhagvat Prasadam products (static reviews removed)
export const sampleReviews = {};

// Helper to retrieve reviews for a specific product - strictly returns live / user-submitted reviews
export function getReviewsForProduct(product) {
  if (!product) return [];

  const slug = product.slug || product.handle || '';
  try {
    const storageKey = `bp_user_reviews_${product.id || slug}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore storage errors in SSR or restricted environments
  }

  return [];
}

// Helper to save a new review
export function saveUserReview(product, newReview) {
  if (!product || !newReview) return;
  const slug = product.slug || product.handle || '';
  const storageKey = `bp_user_reviews_${product.id || slug}`;
  try {
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = [newReview, ...existing];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save review:', e);
    return [newReview];
  }
}
