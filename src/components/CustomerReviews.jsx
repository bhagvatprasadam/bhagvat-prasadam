import React, { useState, useMemo, useEffect } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquare, Edit3, X, ChevronDown, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext.jsx';
import * as reviewsApi from '../api/reviewsApi.js';

function getStoredUserReviews(productId) {
  if (typeof window === 'undefined' || !window.localStorage || !productId) return [];
  try {
    const raw = window.localStorage.getItem(`bp_user_reviews_${productId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUserReview(productId, review) {
  if (typeof window === 'undefined' || !window.localStorage || !productId || !review) return;
  try {
    const existing = getStoredUserReviews(productId);
    const updated = [review, ...existing.filter(r => r.id !== review.id)];
    window.localStorage.setItem(`bp_user_reviews_${productId}`, JSON.stringify(updated));
  } catch {
    // Quota
  }
}

export default function CustomerReviews({ product }) {
  const { t, language } = useLanguage();
  const { isAuthenticated, customer } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterRating, setFilterRating] = useState('all'); // 'all' or '5', '4', '3', etc.
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'highest', 'lowest'
  const [visibleCount, setVisibleCount] = useState(6);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiTotalReviews, setApiTotalReviews] = useState(0);

  // Persistent likes state from localStorage
  const [likedReviews, setLikedReviews] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = window.localStorage.getItem('bp_liked_reviews');
        return stored ? JSON.parse(stored) : {};
      } catch { }
    }
    return {};
  });

  // Resolve numeric ID for the backend API
  const numericProductId = useMemo(() => {
    if (!product) return null;
    const directId = String(product.id || '').trim();
    if (/^\d+$/.test(directId)) return directId;
    if (product.raw?.id && /^\d+$/.test(String(product.raw.id))) return String(product.raw.id);
    return null;
  }, [product]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    content: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Pre-fill name and email if logged in
  useEffect(() => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.name || prev.name,
        email: customer.email || prev.email
      }));
    }
  }, [customer]);

  // Load live reviews on product change
  useEffect(() => {
    let isSubscribed = true;

    async function loadReviews() {
      if (!product) return;
      setIsFormOpen(false);
      setSuccessMessage('');
      setFilterRating('all');
      setVisibleCount(6);
      setLoadingReviews(true);

      const targetId = numericProductId;

      // 1. Fetch live customer reviews from the API
      if (targetId) {
        try {
          const res = await reviewsApi.getProductReviews(targetId, { page: 1, limit: 50 });
          if (isSubscribed) {
            const localSaved = getStoredUserReviews(targetId);

            const liveMapped = (res.reviews || []).map(r => {
              const rawDate = r.review_date || r.created_at;
              const formattedDate = rawDate
                ? new Date(rawDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Verified Devotee';

              return {
                id: String(r.id),
                author: r.customer_name || 'Sacred Devotee',
                rating: parseInt(r.rating, 10) || 5,
                date: formattedDate,
                title: r.title || (r.description && r.description.length > 35 ? r.description.slice(0, 35) + '...' : 'Divine Offering'),
                content: r.description || r.content || '',
                verified: true,
                helpful: 1 + (r.id ? (parseInt(String(r.id).slice(-1), 10) % 5) : 0),
                rawDate: rawDate ? new Date(rawDate).getTime() : 0
              };
            });

            const combined = [...localSaved, ...liveMapped];
            setReviews(combined);
            setApiTotalReviews(res.pagination?.total ? res.pagination.total + localSaved.length : combined.length);
            setLoadingReviews(false);
            return;
          }
        } catch (err) {
          console.warn('API reviews fetch notice:', err);
        }
      }

      // 2. If no reviews returned or fetch failed, only show saved user reviews or empty list
      if (isSubscribed) {
        const localSaved = targetId ? getStoredUserReviews(targetId) : [];
        setReviews(localSaved);
        setApiTotalReviews(localSaved.length);
        setLoadingReviews(false);
      }
    }

    loadReviews();
    return () => { isSubscribed = false; };
  }, [product?.id, product?.slug, numericProductId]);

  // Compute live review stats
  const displayTotal = apiTotalReviews > 0 ? apiTotalReviews : reviews.length;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return product?.rating && Number(product.rating) > 0 ? Number(product.rating).toFixed(1) : '0.0';
    }
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews, product?.rating]);

  // Rating breakdown percentages calculated dynamically
  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });

    const total = reviews.length;
    if (total === 0) {
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, counts };
    }

    return {
      5: Math.round(((counts[5] || 0) / total) * 100),
      4: Math.round(((counts[4] || 0) / total) * 100),
      3: Math.round(((counts[3] || 0) / total) * 100),
      2: Math.round(((counts[2] || 0) / total) * 100),
      1: Math.round(((counts[1] || 0) / total) * 100),
      counts
    };
  }, [reviews]);

  // Filter & Sort dynamically
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    if (filterRating !== 'all') {
      result = result.filter(r => Math.round(Number(r.rating)) === Number(filterRating));
    }

    if (sortBy === 'recent') {
      result.sort((a, b) => {
        if (a.id?.startsWith('user-rev-') && !b.id?.startsWith('user-rev-')) return -1;
        if (!a.id?.startsWith('user-rev-') && b.id?.startsWith('user-rev-')) return 1;
        return (b.rawDate || 0) - (a.rawDate || 0);
      });
    } else if (sortBy === 'highest') {
      result.sort((a, b) => (Number(b.rating) || 5) - (Number(a.rating) || 5));
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => (Number(a.rating) || 5) - (Number(b.rating) || 5));
    }

    return result;
  }, [reviews, filterRating, sortBy]);

  const displayedReviews = filteredAndSortedReviews.slice(0, visibleCount);

  // Helpful thumbs up button
  const handleLike = (reviewId) => {
    if (likedReviews[reviewId]) return;
    const updated = { ...likedReviews, [reviewId]: true };
    setLikedReviews(updated);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('bp_liked_reviews', JSON.stringify(updated));
      } catch { }
    }
    setReviews(prev =>
      prev.map(r => (r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r))
    );
  };

  // Submit user review dynamically to the backend API & local cache
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      return;
    }

    setSubmittingReview(true);
    const targetId = numericProductId;
    const now = new Date();
    const newRevId = `user-rev-${Date.now()}`;

    const newReview = {
      id: newRevId,
      author: formData.name.trim(),
      rating: Number(formData.rating) || 5,
      date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      title: formData.title.trim() || 'Sacred Offering Experience',
      content: formData.content.trim(),
      verified: true,
      helpful: 0,
      rawDate: now.getTime()
    };

    // Save to localStorage so it persists on this browser
    if (targetId) {
      saveStoredUserReview(targetId, newReview);
    }

    // Optimistically update live reviews state
    setReviews(prev => [newReview, ...prev]);
    setApiTotalReviews(prev => prev + 1);
    setIsFormOpen(false);
    setSuccessMessage(t('reviews_success_alert', 'Thank you! Your review has been submitted successfully.'));

    // Post to live backend API
    if (targetId) {
      try {
        if (isAuthenticated) {
          await reviewsApi.submitCustomerReview({
            productId: targetId,
            rating: formData.rating,
            title: formData.title.trim() || 'Devotee Review',
            description: formData.content.trim()
          });
        } else {
          await reviewsApi.submitGuestReview({
            productId: targetId,
            customerName: formData.name.trim(),
            rating: formData.rating,
            title: formData.title.trim() || 'Devotee Review',
            description: formData.content.trim()
          });
        }
      } catch (err) {
        console.warn('API review submission note:', err.message);
      }
    }

    setFormData({
      name: '',
      email: '',
      rating: 5,
      title: '',
      content: ''
    });
    setSubmittingReview(false);

    setTimeout(() => {
      setSuccessMessage('');
    }, 6000);
  };

  return (
    <div className="py-12 border-t border-stone-200" id="customer-reviews-section">
      <div className="max-w-6xl mx-auto px-4">

        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight">
            {t('reviews_title', 'Customer Reviews')}
          </h2>
          <div className="w-16 h-0.5 bg-brand-maroon/60 mx-auto mt-2"></div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage('')}
              className="text-emerald-700 hover:text-emerald-900 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Review Summary Header Card */}
        <div className="bg-stone-50/80 rounded-2xl border border-stone-200/80 p-5 sm:p-8 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

            {/* Left: Overall Score & Write Review CTA */}
            <div className="md:col-span-4 flex flex-col items-center justify-center md:border-r border-stone-200/80 md:pr-6 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-stone-900 font-serif mb-1">
                {averageRating}
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(Number(averageRating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-stone-300'
                      }`}
                  />
                ))}
              </div>

              <div className="text-xs sm:text-sm text-stone-500 mb-4">
                {t('reviews_based_on', 'Based on')} {displayTotal} {t('reviews_count_suffix', 'reviews')}
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-maroon text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-brand-maroon-dark transition-all duration-200 shadow-sm hover:shadow"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isFormOpen ? t('reviews_cancel_btn', 'Cancel') : t('reviews_write_btn', 'Write a Review')}</span>
              </button>
            </div>

            {/* Right: Star Breakdown Progress Bars */}
            <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const pct = ratingDistribution[stars] || 0;
                const count = ratingDistribution.counts?.[stars] || 0;
                const isSelected = filterRating === String(stars);

                return (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setFilterRating(isSelected ? 'all' : String(stars))}
                    className={`w-full flex items-center gap-3 text-left py-1 px-2 rounded-lg transition-colors group ${isSelected ? 'bg-amber-100/50 ring-1 ring-amber-300' : 'hover:bg-stone-100'
                      }`}
                  >
                    <div className="flex items-center gap-1 w-14 text-xs font-semibold text-stone-700">
                      <span>{stars}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>

                    {/* Progress Bar Container */}
                    <div className="flex-1 h-3 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    {/* Percentage & Count */}
                    <div className="w-16 text-right text-xs font-medium text-stone-500 group-hover:text-stone-900">
                      {pct}% ({count})
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Expandable "Write a Review" Form */}
        {isFormOpen && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 mb-8 shadow-md transition-all duration-300 animate-fade-in">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
              <h3 className="text-lg sm:text-xl font-semibold text-stone-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-brand-maroon" />
                {t('reviews_form_title', 'Write Your Review')}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1.5">
                  {t('reviews_rating_label', 'Your Rating')} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${star <= (hoverRating || formData.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                          }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-semibold text-stone-600">
                    {hoverRating || formData.rating} / 5
                  </span>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">
                    {t('reviews_name_label', 'Your Name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('reviews_name_placeholder', 'e.g. Ramesh Patel')}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:ring-1 focus:ring-brand-maroon focus:border-brand-maroon outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">
                    {t('reviews_email_label', 'Your Email')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={t('reviews_email_placeholder', 'ramesh@example.com')}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:ring-1 focus:ring-brand-maroon focus:border-brand-maroon outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Review Headline / Title */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">
                  {t('reviews_headline_label', 'Review Title')}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('reviews_headline_placeholder', 'e.g. Divine fragrance and pure quality!')}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:ring-1 focus:ring-brand-maroon focus:border-brand-maroon outline-none transition-colors"
                />
              </div>

              {/* Review Content */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">
                  {t('reviews_body_label', 'Review Content')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={t('reviews_body_placeholder', 'Share your devotional experience with this sacred offering...')}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:ring-1 focus:ring-brand-maroon focus:border-brand-maroon outline-none transition-colors resize-y"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg transition-colors"
                >
                  {t('reviews_cancel_btn', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2 bg-brand-maroon hover:bg-brand-maroon-dark text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  {submittingReview && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{t('reviews_submit_btn', 'Submit Review')}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter and Sorting Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-stone-200">
          {/* Rating filter pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setFilterRating('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${filterRating === 'all'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
            >
              {t('reviews_filter_all', 'All Reviews')} ({reviews.length})
            </button>
            {[5, 4, 3].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFilterRating(filterRating === String(star) ? 'all' : String(star))}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${filterRating === String(star)
                  ? 'bg-brand-maroon text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
              >
                <span>{star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] opacity-80">({ratingDistribution.counts?.[star] || 0})</span>
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <span>{t('reviews_sort_label', 'Sort By')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-stone-300 rounded-md px-2.5 py-1 text-xs font-medium text-stone-800 outline-none focus:border-brand-maroon"
            >
              <option value="recent">{t('reviews_sort_recent', 'Most Recent')}</option>
              <option value="highest">{t('reviews_sort_highest', 'Highest Rating')}</option>
              <option value="lowest">{t('reviews_sort_lowest', 'Lowest Rating')}</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loadingReviews && reviews.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-brand-maroon animate-spin mx-auto mb-2" />
            <p className="text-xs text-stone-500">Loading verified customer reviews...</p>
          </div>
        ) : filteredAndSortedReviews.length === 0 ? (
          /* Empty Reviews State */
          <div className="text-center py-12 text-stone-500 text-sm bg-stone-50/50 rounded-2xl border border-stone-100 p-8">
            <p className="mb-3 text-stone-700 font-medium">
              {filterRating !== 'all'
                ? `No reviews found with ${filterRating} stars.`
                : t('reviews_be_first', 'Be the first to review this sacred offering!')}
            </p>
            <button
              onClick={() => {
                setFilterRating('all');
                setIsFormOpen(true);
              }}
              className="px-5 py-2.5 bg-brand-maroon text-white text-xs font-semibold rounded-lg hover:bg-brand-maroon-dark transition-colors inline-flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t('reviews_write_btn', 'Write a Review')}</span>
            </button>
          </div>
        ) : (
          /* Reviews List */
          <div className="space-y-6">
            {displayedReviews.map((rev) => {
              const firstLetter = (rev.author || 'D').trim().charAt(0).toUpperCase();

              return (
                <div
                  key={rev.id}
                  className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:shadow-sm transition-shadow"
                >
                  {/* Top line: Author Info & Rating */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar initial */}
                      <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-brand-maroon font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                        {firstLetter}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-stone-900 text-sm">
                            {rev.author}
                          </span>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                              <Check className="w-3 h-3 stroke-[3]" />
                              {t('reviews_verified_buyer', 'Verified Buyer')}
                            </span>
                          )}
                        </div>

                        {/* Stars & Date */}
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${star <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-stone-400">
                            {rev.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Helpful Button */}
                    <button
                      type="button"
                      onClick={() => handleLike(rev.id)}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${likedReviews[rev.id]
                        ? 'border-brand-maroon/30 text-brand-maroon bg-brand-cream/30'
                        : 'border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                        }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${likedReviews[rev.id] ? 'fill-brand-maroon text-brand-maroon' : ''}`} />
                      <span>{t('reviews_helpful', 'Helpful')}</span>
                      {(rev.helpful || 0) > 0 && <span>({rev.helpful})</span>}
                    </button>
                  </div>

                  {/* Review Content */}
                  <div className="pl-0 sm:pl-13 space-y-1.5">
                    {rev.title && (
                      <h4 className="text-sm sm:text-base font-semibold text-stone-900">
                        {rev.title}
                      </h4>
                    )}
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {rev.content}
                    </p>

                    {/* Temple Reply if present */}
                    {rev.reply && (
                      <div className="mt-3 p-3.5 bg-stone-50 rounded-lg border-l-4 border-brand-maroon text-xs text-stone-700 space-y-1">
                        <div className="font-semibold text-brand-maroon flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{t('reviews_temple_response', 'Temple Response')}</span>
                        </div>
                        <p className="text-stone-600 italic">
                          "{rev.reply}"
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}

            {/* Load More Reviews Button */}
            {filteredAndSortedReviews.length > visibleCount && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="px-6 py-2.5 border border-stone-300 hover:border-brand-maroon text-stone-700 hover:text-brand-maroon text-xs sm:text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Show More Reviews ({filteredAndSortedReviews.length - visibleCount} remaining)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
