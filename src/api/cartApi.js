import { apiGet, apiPost } from './apiClient.js';

/**
 * Normalizes backend cart response and guarantees accurate pricing and metadata
 */
export function normalizeCart(raw) {
  if (!raw) {
    return { items: [], subtotal: 0, totalItems: 0 };
  }

  const data = raw.data || raw;
  const rawItems = Array.isArray(data.items) ? data.items : [];

  const items = rawItems.map((item, index) => {
    const cartItemId = String(item.cart_item_id || item.id || `item-${index}`);
    const productId = String(item.product_id || item.productId || '');
    const variantId = item.variant_id ? String(item.variant_id) : null;
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

    const title = item.product_title || item.title || 'Sacred Offering';

    let price = typeof item.price === 'number'
      ? item.price
      : (item.price !== null && item.price !== undefined ? parseFloat(item.price) : 0);
    if (isNaN(price)) price = 0;

    let totalPrice = typeof item.total_price === 'number'
      ? item.total_price
      : (item.total_price !== null && item.total_price !== undefined ? parseFloat(item.total_price) : 0);
    if (isNaN(totalPrice) || totalPrice <= 0) {
      totalPrice = price * quantity;
    }

    let rawImg = item.variant_image || item.product_image || item.image || '';
    if (typeof rawImg === 'string') {
      if (rawImg.includes('ecommerce-annapurna.megascale.co.in')) {
        rawImg = rawImg.replace('ecommerce-annapurna.megascale.co.in', 'megaecomm.megascale.co.in');
      }
      if (rawImg.startsWith('//')) {
        rawImg = `https:${rawImg}`;
      } else if (rawImg.startsWith('/backend/media/')) {
        rawImg = `https://megaecomm.megascale.co.in${rawImg}`;
      } else if (rawImg.startsWith('/media/')) {
        rawImg = `https://megaecomm.megascale.co.in/backend${rawImg}`;
      } else if (rawImg.startsWith('/') && !rawImg.startsWith('/assets')) {
        rawImg = `https://megaecomm.megascale.co.in/backend${rawImg}`;
      }
    }
    const image = rawImg || 'https://via.placeholder.com/300';
    const slug = item.product_handle || item.slug || productId;
    const variantTitle = item.variant_title || item.weight || 'Standard';

    return {
      cartItemId,
      cart_item_id: cartItemId,
      id: productId,
      product_id: productId,
      productId,
      variantId,
      variant_id: variantId,
      title,
      product_title: title,
      variantTitle,
      weight: variantTitle,
      price: Math.round(price),
      totalPrice: Math.round(totalPrice),
      quantity,
      image,
      featured_image: image,
      slug
    };
  });

  const computedSubtotal = items.reduce((acc, it) => acc + (it.totalPrice || 0), 0);
  const rawTotal = parseFloat(data.total_amount);
  const subtotal = (!isNaN(rawTotal) && rawTotal > 0 && rawTotal >= computedSubtotal)
    ? Math.round(rawTotal)
    : computedSubtotal;

  const totalItems = typeof data.item_count === 'number' && data.item_count > 0
    ? data.item_count
    : items.reduce((acc, it) => acc + (it.quantity || 1), 0);

  return {
    items,
    subtotal,
    totalItems,
    raw: data
  };
}

/**
 * Fetch current cart (uses X-Cart-Token for guests or Authorization for logged in)
 */
export async function getCart() {
  const response = await apiGet('/cart');
  return normalizeCart(response);
}

/**
 * Add item to cart
 */
export async function addToCart({ productId, variantId = null, quantity = 1 }) {
  const pId = parseInt(productId, 10);
  const payload = {
    product_id: !isNaN(pId) ? pId : productId,
    quantity: Math.max(1, parseInt(quantity, 10) || 1)
  };

  // Only attach variant_id if it is a strictly positive integer/digits string (Postgres bigint)
  // Non-numeric or synthetic strings like "v-2887" MUST be omitted to avoid 500 Internal Server Error
  if (variantId !== null && variantId !== undefined) {
    const vStr = String(variantId).trim();
    if (/^\d+$/.test(vStr)) {
      payload.variant_id = parseInt(vStr, 10);
    }
  }

  const response = await apiPost('/cart/add', payload);
  return normalizeCart(response);
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(itemOrPayload, quantityOverride = null) {
  let cartItemId = null;
  let variantId = null;
  let productId = null;
  let quantity = 1;

  if (typeof itemOrPayload === 'object' && itemOrPayload !== null) {
    cartItemId = itemOrPayload.cart_item_id || itemOrPayload.cartItemId || itemOrPayload.id;
    variantId = itemOrPayload.variant_id !== undefined ? itemOrPayload.variant_id : (itemOrPayload.variantId || null);
    productId = itemOrPayload.product_id || itemOrPayload.productId || null;
    quantity = quantityOverride !== null && quantityOverride !== undefined
      ? quantityOverride
      : (itemOrPayload.quantity !== undefined ? itemOrPayload.quantity : 1);
  } else {
    cartItemId = String(itemOrPayload);
    quantity = quantityOverride !== null && quantityOverride !== undefined ? quantityOverride : 1;
  }

  const payload = {
    cart_item_id: String(cartItemId),
    id: String(cartItemId),
    quantity: Math.max(1, parseInt(quantity, 10) || 1)
  };

  if (productId) {
    const pNum = Number(productId);
    payload.product_id = !isNaN(pNum) ? pNum : productId;
  }

  if (variantId !== null && variantId !== undefined && variantId !== '') {
    const vStr = String(variantId).trim();
    if (/^\d+$/.test(vStr)) {
      payload.variant_id = parseInt(vStr, 10);
    }
  }

  const response = await apiPost('/cart/update', payload);
  return normalizeCart(response);
}

/**
 * Remove item from cart
 */
export async function removeCartItem(itemOrPayload, variantIdOverride = null) {
  let cartItemId = null;
  let variantId = null;
  let productId = null;

  if (typeof itemOrPayload === 'object' && itemOrPayload !== null) {
    cartItemId = itemOrPayload.cart_item_id || itemOrPayload.cartItemId || itemOrPayload.id;
    variantId = itemOrPayload.variant_id !== undefined ? itemOrPayload.variant_id : (itemOrPayload.variantId || variantIdOverride);
    productId = itemOrPayload.product_id || itemOrPayload.productId || null;
  } else {
    cartItemId = String(itemOrPayload);
    variantId = variantIdOverride;
  }

  const payload = {
    cart_item_id: String(cartItemId),
    id: String(cartItemId)
  };

  if (productId) {
    const pNum = Number(productId);
    payload.product_id = !isNaN(pNum) ? pNum : productId;
  }

  if (variantId !== null && variantId !== undefined && variantId !== '') {
    const vStr = String(variantId).trim();
    if (/^\d+$/.test(vStr)) {
      payload.variant_id = parseInt(vStr, 10);
    }
  }

  const response = await apiPost('/cart/remove', payload);
  return normalizeCart(response);
}
