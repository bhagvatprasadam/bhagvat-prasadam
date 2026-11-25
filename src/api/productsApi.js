import { apiGet } from './apiClient.js';

/**
 * Extracts custom product metadata from API metafields (e.g. self_life, ingredients, etc.)
 * Strictly skips review/rating widgets to keep the review flow untouched.
 */
export function extractMetafields(metafields) {
  const result = {
    shelfLife: '',
    ingredients: '',
    benefits: '',
    aboutProduct: '',
    packingInfo: '',
    allergenInfo: ''
  };

  if (!Array.isArray(metafields) || metafields.length === 0) {
    return result;
  }

  for (const m of metafields) {
    if (!m || !m.key || m.value === null || m.value === undefined) continue;
    const key = String(m.key).trim().toLowerCase();
    const namespace = String(m.namespace || '').trim().toLowerCase();
    const defName = String(m.definition_name || '').trim().toLowerCase();
    const val = String(m.value).trim();
    if (!val || val === '-' || val.toLowerCase() === 'n/a' || val.toLowerCase() === 'null') continue;

    // Skip judgeme and review widgets as requested
    if (namespace === 'judgeme' || namespace === 'reviews' || defName.includes('review') || defName.includes('badge')) {
      continue;
    }

    // Shelf life / Self life
    if (key === 'self_life' || key === 'shelf_life' || key === 'shelf' || defName.includes('shelf') || defName.includes('self life')) {
      if (!result.shelfLife || key === 'self_life' || key === 'shelf_life') {
        result.shelfLife = /^\d+$/.test(val) ? `${val} days shelf life` : val;
      }
    }

    // Ingredients
    if (key === 'ingredients' || defName.includes('ingredient')) {
      if (!result.ingredients || namespace === 'custom') {
        result.ingredients = val;
      }
    }

    // Benefits
    if (key === 'benifits' || key === 'benefits' || defName.includes('benefit')) {
      result.benefits = val;
    }

    // About product
    if (key === 'about_product' || key === 'about' || defName.includes('about')) {
      result.aboutProduct = val;
    }

    // Packing info
    if (key === 'packing_info' || key === 'packing' || defName.includes('packing')) {
      result.packingInfo = val;
    }

    // Allergen info
    if (key === 'allergen-information' || key === 'allergen' || defName.includes('allergen')) {
      result.allergenInfo = val;
    }
  }

  return result;
}

/**
 * Normalizes an API product to match the shape expected by React components
 */
export function normalizeProduct(raw) {
  if (!raw) return null;

  const id = String(raw.id || raw.product_id || raw._id || '');
  const title = (raw.title || raw.product_title || raw.name || '').trim();
  const handle = raw.handle || raw.product_handle || raw.slug || String(id);
  const slug = handle;

  // Extract metadata from live metafields
  const {
    shelfLife: metaShelfLife,
    ingredients: metaIngredients,
    benefits: metaBenefits,
    aboutProduct: metaAbout,
    packingInfo: metaPackingInfo,
    allergenInfo: metaAllergenInfo
  } = extractMetafields(raw.metafields);

  // Images mapping
  const cleanImgUrl = (u) => {
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
    } else if (url.startsWith('/') && !url.startsWith('/assets') && !url.startsWith('/favicon')) {
      url = `https://megaecomm.megascale.co.in/backend${url}`;
    }
    return url;
  };

  const images = [];
  if (Array.isArray(raw.images) && raw.images.length > 0) {
    raw.images.forEach(img => {
      if (typeof img === 'string') {
        const cleaned = cleanImgUrl(img);
        if (cleaned) images.push(cleaned);
      } else if (img && typeof img.url === 'string') {
        const cleaned = cleanImgUrl(img.url);
        if (cleaned) images.push(cleaned);
      } else if (img && typeof img.src === 'string') {
        const cleaned = cleanImgUrl(img.src);
        if (cleaned) images.push(cleaned);
      }
    });
  }
  if (images.length === 0 && raw.image_url) {
    const cleaned = cleanImgUrl(raw.image_url);
    if (cleaned) images.push(cleaned);
  }
  if (images.length === 0 && raw.image) {
    const cleaned = cleanImgUrl(typeof raw.image === 'string' ? raw.image : (raw.image.url || ''));
    if (cleaned) images.push(cleaned);
  }

  const primaryImage = images[0] || 'https://via.placeholder.com/600x600?text=Product+Image';
  const secondaryImage = images[1] || primaryImage;

  // Variants mapping
  const rawVariants = Array.isArray(raw.variants) ? raw.variants : [];
  const variants = rawVariants.map((v) => {
    const rawVId = v.id || v.variant_id;
    const vId = (rawVId !== null && rawVId !== undefined && /^\d+$/.test(String(rawVId).trim()))
      ? parseInt(String(rawVId).trim(), 10)
      : (rawVId ? String(rawVId) : null);
    const vTitle = v.title || v.name || 'Standard';
    const vWeight = v.weight
      ? `${v.weight}${v.weightUnit || v.weight_unit || 'g'}`
      : (v.selectedOptions?.[0]?.value || vTitle);

    let price = 0;
    if (typeof v.price === 'number') {
      price = v.price;
    } else if (v.price && typeof v.price.amount !== 'undefined') {
      price = parseFloat(v.price.amount) || 0;
    } else if (typeof v.price === 'string') {
      price = parseFloat(v.price) || 0;
    }

    let comparePrice = null;
    if (typeof v.compareAtPrice === 'number') {
      comparePrice = v.compareAtPrice;
    } else if (v.compareAtPrice && typeof v.compareAtPrice.amount !== 'undefined') {
      comparePrice = parseFloat(v.compareAtPrice.amount) || null;
    } else if (typeof v.compareAtPrice === 'string') {
      comparePrice = parseFloat(v.compareAtPrice) || null;
    } else if (typeof v.compare_price === 'number') {
      comparePrice = v.compare_price;
    } else if (typeof v.compare_at_price === 'string' || typeof v.compare_at_price === 'number') {
      comparePrice = parseFloat(v.compare_at_price) || null;
    }

    const vImage = cleanImgUrl(v.image?.url || v.image_url) || primaryImage;

    return {
      id: vId,
      title: vTitle,
      weight: vWeight,
      price: Math.round(price),
      comparePrice: comparePrice ? Math.round(comparePrice) : null,
      available: v.availableForSale !== false,
      sku: v.sku || null,
      image: vImage,
      selectedOptions: v.selectedOptions || []
    };
  });

  // Calculate default price & compare price from variants or product fields
  let basePrice = 0;
  let baseComparePrice = null;

  if (variants.length > 0 && variants[0].price > 0) {
    basePrice = variants[0].price;
    baseComparePrice = variants[0].comparePrice;
  } else if (typeof raw.price === 'number') {
    basePrice = raw.price;
  } else if (typeof raw.price === 'string') {
    basePrice = parseFloat(raw.price) || 0;
  } else if (raw.priceRange?.minVariantPrice?.amount) {
    basePrice = parseFloat(raw.priceRange.minVariantPrice.amount) || 0;
  }

  if (!baseComparePrice && raw.compare_at_price) {
    baseComparePrice = parseFloat(raw.compare_at_price) || null;
  } else if (!baseComparePrice && raw.compareAtPrice?.amount) {
    baseComparePrice = parseFloat(raw.compareAtPrice.amount) || null;
  } else if (!baseComparePrice && raw.compare_price) {
    baseComparePrice = parseFloat(raw.compare_price) || null;
  }

  const roundedPrice = Math.round(basePrice);
  const roundedComparePrice = baseComparePrice ? Math.round(baseComparePrice) : null;
  const discount = (roundedComparePrice && roundedComparePrice > roundedPrice)
    ? Math.round(((roundedComparePrice - roundedPrice) / roundedComparePrice) * 100)
    : 0;

  const defaultWeight = variants[0]?.weight || (raw.weight ? `${raw.weight}${raw.weight_unit || 'g'}` : 'Standard');

  return {
    id,
    title,
    handle,
    slug,
    category: raw.category || raw.product_type || 'Sacred Offerings',
    productType: raw.product_type || raw.category || 'Pooja & Prasadam',
    vendor: raw.vendor || 'Bhagvat Prasadam',
    sku: raw.sku || variants[0]?.sku || (id ? `BP-${id}` : ''),
    options: Array.isArray(raw.options) ? raw.options : [],
    inventoryQuantity: typeof raw.inventory_quantity === 'number'
      ? raw.inventory_quantity
      : (typeof raw.inventoryQuantity === 'number' ? raw.inventoryQuantity : 100),
    originCountry: raw.origin_country || 'India',
    shelfLife: metaShelfLife || raw.shelf_life || raw.shelfLife || '',
    ingredients: metaIngredients || raw.ingredients || '',
    benefits: metaBenefits || '',
    aboutProduct: metaAbout || '',
    packingInfo: metaPackingInfo || raw.packing_info || '',
    allergenInfo: metaAllergenInfo || '',
    image: primaryImage,
    hoverImage: secondaryImage,
    gallery: images.length > 0 ? images : [primaryImage],
    price: roundedPrice,
    comparePrice: roundedComparePrice,
    discount,
    rating: parseFloat(raw.avg_rating) || 5.0,
    reviews: parseInt(raw.total_reviews, 10) || 0,
    total_reviews: parseInt(raw.total_reviews, 10) || 0,
    reviews_count: parseInt(raw.total_reviews, 10) || 0,
    weight: defaultWeight,
    available: raw.availableForSale !== false,
    isBestSeller: Boolean(raw.is_bestseller || (raw.tags && raw.tags.includes('Best Seller'))),
    isFeatured: true,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    description: raw.description || raw.body_html || '',
    metafields: Array.isArray(raw.metafields) ? raw.metafields : [],
    variants: variants.length > 0 ? variants : [
      {
        id: null,
        title: 'Standard',
        weight: defaultWeight,
        price: roundedPrice,
        comparePrice: roundedComparePrice,
        available: true,
        image: primaryImage
      }
    ],
    raw
  };
}

/**
 * Fetch all products from live API
 */
export async function getProducts(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page);
  if (params.limit) queryParams.set('limit', params.limit || 100);
  if (params.search) queryParams.set('search', params.search);

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  const response = await apiGet(endpoint);
  const items = Array.isArray(response.data) ? response.data : [];
  const normalized = items.map(normalizeProduct).filter(Boolean);

  return {
    products: normalized,
    pagination: response.pagination || {
      total: normalized.length,
      page: params.page || 1,
      limit: params.limit || 100,
      totalPages: 1
    }
  };
}

/**
 * Fetch single product by numeric ID from live API
 */
export async function getProductById(id) {
  try {
    const response = await apiGet(`/products/${id}`);
    if (response && (response.data || response.success)) {
      return normalizeProduct(response.data || response);
    }
  } catch (err) {
    console.warn(`Live product fetch failed for id ${id}:`, err.message);
  }
  return null;
}

/**
 * Fetch single product by handle from live API
 */
export async function getProductByHandle(handle) {
  if (!handle) return null;
  const clean = String(handle).trim().toLowerCase();

  try {
    const response = await apiGet(`/products/${encodeURIComponent(handle)}`);
    if (response && (response.data || response.success)) {
      return normalizeProduct(response.data || response);
    }
  } catch (err) {
    console.warn(`Live product fetch failed for handle ${handle}:`, err.message);
  }

  // Fallback: search in live API product list by exact handle, slug, id, or partial handle match
  try {
    const all = await getProducts({ limit: 100 });
    const matched = all.products.find(
      p => p.handle?.toLowerCase() === clean ||
        p.slug?.toLowerCase() === clean ||
        String(p.id) === clean ||
        p.handle?.toLowerCase().includes(clean) ||
        clean.includes(p.handle?.toLowerCase())
    );
    if (matched) return matched;
  } catch (e) {
    console.warn('Fallback list lookup failed:', e);
  }

  return null;
}
