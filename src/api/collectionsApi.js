import { apiGet } from './apiClient.js';
import { normalizeProduct } from './productsApi.js';

function cleanColImg(u) {
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

let cachedCollections = null;
let pendingCollectionsPromise = null;

/**
 * Fetch all collections (with in-memory caching)
 */
export async function getCollections(force = false) {
  if (!force && cachedCollections) {
    return cachedCollections;
  }

  if (pendingCollectionsPromise) {
    return await pendingCollectionsPromise;
  }

  pendingCollectionsPromise = apiGet('/collections')
    .then(response => {
      const list = Array.isArray(response.data) ? response.data : [];
      const mapped = list.map(col => {
        const cleanedImg = cleanColImg(col.image_url);
        return {
          id: String(col.id),
          title: col.title || '',
          name: col.title || '',
          handle: col.handle || '',
          slug: col.handle || '',
          path: `/collections/${col.handle || col.id}`,
          description: col.description || '',
          imageUrl: cleanedImg,
          image: cleanedImg,
          isActive: Boolean(col.is_active),
          isDisplay: Boolean(col.is_display),
          productCount: parseInt(col.product_count, 10) || 0,
          raw: col
        };
      });
      cachedCollections = mapped;
      return mapped;
    })
    .catch(err => {
      console.warn('Failed to load collections from API:', err.message);
      return cachedCollections || [];
    })
    .finally(() => {
      pendingCollectionsPromise = null;
    });

  return await pendingCollectionsPromise;
}

/**
 * Fetch collection by handle with its products
 */
export async function getCollectionByHandle(handle) {
  if (!handle) return null;
  const cleanHandle = String(handle).trim();

  // 1. Try fetching directly from the backend API first
  try {
    const response = await apiGet(`/collections/${encodeURIComponent(cleanHandle)}`);
    if (response && response.data) {
      const data = response.data;
      const rawProducts = Array.isArray(data.products) ? data.products : [];
      const normalizedProducts = rawProducts.map(normalizeProduct).filter(Boolean);
      const colHandle = data.handle || cleanHandle;
      const colImage = cleanColImg(data.image_url) || '';
      const count = Number.isFinite(parseInt(data.product_count, 10))
        ? parseInt(data.product_count, 10)
        : normalizedProducts.length;

      return {
        id: String(data.id || ''),
        title: data.title || cleanHandle,
        name: data.title || cleanHandle,
        handle: colHandle,
        slug: colHandle,
        path: `/collections/${colHandle}`,
        description: data.description || '',
        imageUrl: colImage,
        image: colImage,
        productCount: count,
        products: normalizedProducts,
        raw: data
      };
    }
  } catch (err) {
    // If direct call fails, check whether the handle matches an existing collection's slug or id
  }

  // 2. Fallback: Search the collections catalog if the given handle differs from server handle
  try {
    const collections = await getCollections();
    const lower = cleanHandle.toLowerCase();
    const exists = collections.find(c =>
      c.handle?.toLowerCase() === lower ||
      c.slug?.toLowerCase() === lower ||
      c.title?.toLowerCase() === lower ||
      String(c.id) === lower
    );

    if (exists && exists.handle && exists.handle.toLowerCase() !== lower) {
      const response = await apiGet(`/collections/${encodeURIComponent(exists.handle)}`);
      const data = response.data || {};
      const rawProducts = Array.isArray(data.products) ? data.products : [];
      const normalizedProducts = rawProducts.map(normalizeProduct).filter(Boolean);
      const colHandle = data.handle || exists.handle || cleanHandle;
      const colImage = cleanColImg(data.image_url || exists.imageUrl || exists.image || '');
      const count = Number.isFinite(parseInt(data.product_count, 10))
        ? parseInt(data.product_count, 10)
        : normalizedProducts.length;

      return {
        id: String(data.id || exists.id || ''),
        title: data.title || exists.title || cleanHandle,
        name: data.title || exists.title || cleanHandle,
        handle: colHandle,
        slug: colHandle,
        path: `/collections/${colHandle}`,
        description: data.description || exists.description || '',
        imageUrl: colImage,
        image: colImage,
        productCount: count,
        products: normalizedProducts,
        raw: data
      };
    }
  } catch (err) {
    console.warn('Failed to load collection by handle:', handle, err.message);
  }

  return null;
}
