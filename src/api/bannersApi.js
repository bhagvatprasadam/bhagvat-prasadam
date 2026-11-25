import { apiGet } from './apiClient.js';

function cleanBannerImg(u) {
  if (!u || typeof u !== 'string') return '';
  let url = u.trim();
  if (url.includes('ecommerce-annapurna.megascale.co.in')) {
    url = url.replace('ecommerce-annapurna.megascale.co.in', 'megaecomm.megascale.co.in');
  }
  if (url.startsWith('//')) {
    url = `https:${url}`;
  } else if (url.startsWith('/backend/media/')) {
    url = `https://megaecomm.megascale.co.in${url}`;
  } else if (url.startsWith('/media/')) {
    url = `https://megaecomm.megascale.co.in/backend${url}`;
  }
  return url;
}

export function normalizeBanner(b) {
  if (!b) return null;
  const desktopImg = cleanBannerImg(b.imageUrl || b.image_url || b.image);
  const mobileImg = cleanBannerImg(b.mobileImageUrl || b.mobile_image_url || b.mobileImage) || desktopImg;
  const link = (b.linkValue || b.link_value || b.link || '').trim();

  return {
    id: String(b.id || ''),
    title: b.title || 'Bhagvat Prasadam',
    subtitle: b.subtitle || '',
    description: b.description || '',
    placement: b.placement || 'home',
    image: desktopImg,
    imageUrl: desktopImg,
    mobileImage: mobileImg,
    mobileImageUrl: mobileImg,
    link: link || '/collections/all',
    position: typeof b.position === 'number' ? b.position : 0,
    isActive: b.isActive !== false && b.is_active !== false,
    raw: b
  };
}

let cachedBanners = null;
let pendingBannersPromise = null;

/**
 * Fetch banners from live backend API
 */
export async function getBanners(force = false) {
  if (!force && cachedBanners && cachedBanners.length > 0) {
    return cachedBanners;
  }

  if (pendingBannersPromise) {
    return await pendingBannersPromise;
  }

  pendingBannersPromise = apiGet('/banners')
    .then(response => {
      const items = Array.isArray(response.data) ? response.data : [];
      const normalized = items
        .map(normalizeBanner)
        .filter(b => b && b.isActive && b.imageUrl)
        .sort((a, b) => a.position - b.position);

      cachedBanners = normalized;
      return normalized;
    })
    .catch(err => {
      console.warn('Failed to load banners from API:', err.message);
      return cachedBanners || [];
    })
    .finally(() => {
      pendingBannersPromise = null;
    });

  return await pendingBannersPromise;
}
