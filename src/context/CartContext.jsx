import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as cartApi from '../api/cartApi.js';
import { siteConfig } from '../data/siteConfig.js';
import { getAuthToken } from '../utils/auth.js';
import { resetCartToken } from '../utils/cartToken.js';
import { trackAddToCart } from '../services/analytics.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // Debounce ref to avoid race conditions when clicking rapidly
  const quantityDebounceTimer = useRef({});

  // Sync cart from server
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setCart(data.items);
      setCartSubtotal(data.subtotal);
      setCartCount(data.totalItems);
      return data;
    } catch (err) {
      console.warn('Failed to fetch cart from API:', err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cart on mount and when auth token changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (product, selectedVariant = null, quantity = 1) => {
    if (!product) return;
    trackAddToCart(product, selectedVariant, quantity);
    const productId = product.id;
    const variantId = selectedVariant?.id || product.variants?.[0]?.id || null;

    try {
      setUpdatingItemId('adding');
      const updated = await cartApi.addToCart({
        productId,
        variantId,
        quantity
      });

      if (updated && Array.isArray(updated.items)) {
        const enrichedItems = updated.items.map(it => {
          if (String(it.productId) === String(productId)) {
            const validPrice = it.price > 0 ? it.price : (selectedVariant?.price || product.price || 0);
            const validImg = (it.image && !it.image.includes('placeholder'))
              ? it.image
              : (selectedVariant?.image || product.image || it.image);
            const validTitle = it.title && it.title !== 'Sacred Offering' ? it.title : (product.title || it.title);
            return {
              ...it,
              title: validTitle,
              price: validPrice,
              totalPrice: validPrice * it.quantity,
              image: validImg
            };
          }
          return it;
        });
        const computedSubtotal = enrichedItems.reduce((acc, it) => acc + (it.totalPrice || 0), 0);
        setCart(enrichedItems);
        setCartSubtotal(computedSubtotal);
        setCartCount(updated.totalItems);
        setIsCartOpen(true);
        return { ...updated, items: enrichedItems, subtotal: computedSubtotal };
      }

      setCart(updated.items);
      setCartSubtotal(updated.subtotal);
      setCartCount(updated.totalItems);
      setIsCartOpen(true);
      return updated;
    } catch (err) {
      console.warn('Backend cart add failed, using resilient cart fallback:', err?.message || err);
      // Fallback: Add to local cart state so the user experience is smooth and uninterrupted
      const price = selectedVariant?.price || product.price || 0;
      const fallbackItem = {
        cartItemId: `local-${Date.now()}`,
        id: String(productId),
        productId: String(productId),
        variantId: variantId ? String(variantId) : null,
        title: product.title || 'Sacred Offering',
        variantTitle: selectedVariant?.title || selectedVariant?.weight || '',
        weight: selectedVariant?.weight || product.weight || 'Standard',
        price: Math.round(price),
        totalPrice: Math.round(price * quantity),
        quantity,
        image: selectedVariant?.image || product.image || '',
        slug: product.slug || product.handle || String(productId)
      };

      setCart(prev => {
        const existingIndex = prev.findIndex(
          it => String(it.productId) === String(productId) && it.variantId === fallbackItem.variantId
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          const exist = updated[existingIndex];
          const newQty = exist.quantity + quantity;
          updated[existingIndex] = {
            ...exist,
            quantity: newQty,
            totalPrice: exist.price * newQty
          };
          return updated;
        }
        return [...prev, fallbackItem];
      });

      setCartSubtotal(prev => prev + fallbackItem.totalPrice);
      setCartCount(prev => prev + quantity);
      setIsCartOpen(true);
      return { items: [fallbackItem] };
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Remove item from cart with instant optimistic update and server sync
  const removeFromCart = async (itemOrId, variantId = null) => {
    let targetItem = null;
    let targetCartItemId = null;
    let resolvedVariantId = variantId;
    let targetProductId = null;

    if (itemOrId && typeof itemOrId === 'object') {
      targetItem = itemOrId;
      targetCartItemId = itemOrId.cart_item_id || itemOrId.cartItemId || itemOrId.id;
      resolvedVariantId = itemOrId.variant_id !== undefined ? itemOrId.variant_id : (itemOrId.variantId || variantId);
      targetProductId = itemOrId.product_id || itemOrId.productId || null;
    } else {
      targetCartItemId = itemOrId;
      targetItem = cart.find(
        (it) => String(it.cart_item_id) === String(itemOrId) || String(it.cartItemId) === String(itemOrId) || String(it.id) === String(itemOrId)
      );
      if (targetItem) {
        resolvedVariantId = resolvedVariantId || targetItem.variant_id || targetItem.variantId;
        targetProductId = targetItem.product_id || targetItem.productId;
      }
    }

    try {
      setUpdatingItemId(targetCartItemId);

      // Instant optimistic UI update
      let snapshot = [];
      setCart(prev => {
        snapshot = prev;
        const filtered = prev.filter(it => {
          const matchCartId = targetCartItemId && (String(it.cart_item_id) === String(targetCartItemId) || String(it.cartItemId) === String(targetCartItemId));
          const matchProductId = targetProductId && (String(it.product_id) === String(targetProductId) || String(it.productId) === String(targetProductId));
          return !(matchCartId || (!targetCartItemId && matchProductId));
        });
        const subtotal = filtered.reduce((acc, it) => acc + (Number(it.totalPrice) || ((Number(it.price) || 0) * (it.quantity || 1))), 0);
        const count = filtered.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
        setCartSubtotal(subtotal);
        setCartCount(count);
        return filtered;
      });

      if (String(targetCartItemId).startsWith('local-')) {
        return;
      }

      const payload = targetItem || {
        cart_item_id: targetCartItemId,
        id: targetCartItemId,
        variant_id: resolvedVariantId,
        product_id: targetProductId
      };

      const updated = await cartApi.removeCartItem(payload);

      if (updated && Array.isArray(updated.items)) {
        // Merge remaining items with snapshot to guarantee no details or prices are lost
        const mergedItems = updated.items.map(serverItem => {
          const exist = snapshot.find(
            it => String(it.cart_item_id) === String(serverItem.cart_item_id) ||
                  String(it.cartItemId) === String(serverItem.cartItemId) ||
                  String(it.productId) === String(serverItem.productId)
          );
          if (exist) {
            const finalPrice = serverItem.price > 0 ? serverItem.price : exist.price;
            const finalQty = serverItem.quantity || exist.quantity || 1;
            return {
              ...exist,
              ...serverItem,
              title: (serverItem.title && serverItem.title !== 'Sacred Offering') ? serverItem.title : exist.title,
              image: (serverItem.image && !serverItem.image.includes('placeholder')) ? serverItem.image : exist.image,
              price: finalPrice,
              totalPrice: finalPrice * finalQty,
              weight: (serverItem.weight && serverItem.weight !== 'Standard') ? serverItem.weight : exist.weight,
              slug: (serverItem.slug && serverItem.slug !== serverItem.productId) ? serverItem.slug : exist.slug
            };
          }
          return serverItem;
        });

        const subtotal = mergedItems.reduce((acc, it) => acc + (it.totalPrice || 0), 0);
        const count = mergedItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

        setCart(mergedItems);
        setCartSubtotal(subtotal);
        setCartCount(count);
        return { ...updated, items: mergedItems, subtotal, totalItems: count };
      }
    } catch (err) {
      console.error('Remove from cart failed:', err);
      await fetchCart();
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Update item quantity with debouncing to prevent race conditions
  const updateQuantity = async (itemOrId, newQty, variantId = null) => {
    let targetItem = null;
    let targetCartItemId = null;
    let resolvedVariantId = variantId;
    let targetProductId = null;

    if (itemOrId && typeof itemOrId === 'object') {
      targetItem = itemOrId;
      targetCartItemId = itemOrId.cart_item_id || itemOrId.cartItemId || itemOrId.id;
      resolvedVariantId = itemOrId.variant_id !== undefined ? itemOrId.variant_id : (itemOrId.variantId || variantId);
      targetProductId = itemOrId.product_id || itemOrId.productId || null;
    } else {
      targetCartItemId = itemOrId;
      targetItem = cart.find(
        (it) => String(it.cart_item_id) === String(itemOrId) || String(it.cartItemId) === String(itemOrId) || String(it.id) === String(itemOrId)
      );
      if (targetItem) {
        resolvedVariantId = resolvedVariantId || targetItem.variant_id || targetItem.variantId;
        targetProductId = targetItem.product_id || targetItem.productId;
      }
    }

    if (newQty <= 0) {
      return await removeFromCart(targetItem || targetCartItemId, resolvedVariantId);
    }

    // Instant optimistic UI update for cart items, subtotal, and total count
    setCart(prev => {
      const updated = prev.map(item => {
        const isMatch =
          (targetCartItemId && (String(item.cart_item_id) === String(targetCartItemId) || String(item.cartItemId) === String(targetCartItemId))) ||
          (targetProductId && (String(item.product_id) === String(targetProductId) || String(item.productId) === String(targetProductId)));

        if (isMatch) {
          const unitPrice = Number(item.price) || 0;
          return {
            ...item,
            quantity: newQty,
            totalPrice: unitPrice * newQty
          };
        }
        return item;
      });

      const newSubtotal = updated.reduce((acc, it) => acc + (Number(it.totalPrice) || ((Number(it.price) || 0) * (it.quantity || 1))), 0);
      const newCount = updated.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
      setCartSubtotal(newSubtotal);
      setCartCount(newCount);
      return updated;
    });

    if (String(targetCartItemId).startsWith('local-')) {
      return;
    }

    // Clear existing debounce timer for this item if user clicks rapidly (+/-)
    const timerKey = String(targetCartItemId || targetProductId);
    if (quantityDebounceTimer.current[timerKey]) {
      clearTimeout(quantityDebounceTimer.current[timerKey]);
    }

    setUpdatingItemId(targetCartItemId);

    return new Promise((resolve) => {
      quantityDebounceTimer.current[timerKey] = setTimeout(async () => {
        try {
          const payload = targetItem || {
            cart_item_id: targetCartItemId,
            id: targetCartItemId,
            variant_id: resolvedVariantId,
            product_id: targetProductId,
            quantity: newQty
          };

          const updated = await cartApi.updateCartItem(payload, newQty);
          if (updated && Array.isArray(updated.items)) {
            // Merge with local cart so enriched titles, images, and non-zero prices are preserved
            setCart(currentCart => {
              const merged = updated.items.map(newItem => {
                const existing = currentCart.find(c =>
                  String(c.cart_item_id) === String(newItem.cart_item_id) ||
                  String(c.cartItemId) === String(newItem.cartItemId) ||
                  String(c.productId) === String(newItem.productId)
                );
                if (!existing) return newItem;
                const price = newItem.price > 0 ? newItem.price : existing.price;
                const image = (newItem.image && !newItem.image.includes('placeholder')) ? newItem.image : existing.image;
                const title = (newItem.title && newItem.title !== 'Sacred Offering') ? newItem.title : existing.title;
                const qty = newItem.quantity || newQty;
                return {
                  ...existing,
                  ...newItem,
                  title,
                  price,
                  quantity: qty,
                  totalPrice: price * qty,
                  image
                };
              });

              const newSubtotal = merged.reduce((acc, it) => acc + (Number(it.totalPrice) || ((Number(it.price) || 0) * (it.quantity || 1))), 0);
              const newCount = merged.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
              setCartSubtotal(newSubtotal);
              setCartCount(newCount);
              return merged;
            });
            resolve(updated);
          } else {
            await fetchCart();
            resolve(null);
          }
        } catch (err) {
          console.error('Update quantity failed:', err);
          await fetchCart();
          resolve(null);
        } finally {
          setUpdatingItemId(null);
          delete quantityDebounceTimer.current[timerKey];
        }
      }, 350);
    });
  };

  // Clear cart (e.g. after order placement)
  const clearCart = async () => {
    setCart([]);
    setCartSubtotal(0);
    setCartCount(0);
    resetCartToken();
    try {
      await fetchCart();
    } catch {
      // ignore
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  // Computations
  const cartSavings = 0; // Can be derived if compareAtPrice is present
  const threshold = siteConfig?.freeShippingThreshold || 999;
  const freeShippingEligible = cartSubtotal >= threshold;
  const amountToFreeShipping = Math.max(0, threshold - cartSubtotal);
  const shippingProgress = Math.min(100, Math.round((cartSubtotal / threshold) * 100));

  // Restore cart items
  const restoreCartItems = (items) => {
    if (!Array.isArray(items)) return;
    setCart(items);
    const subtotal = items.reduce((acc, it) => acc + (Number(it.totalPrice) || (Number(it.price) * (it.quantity || 1)) || 0), 0);
    const count = items.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
    setCartSubtotal(subtotal);
    setCartCount(count);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart,
        loading,
        updatingItemId,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        restoreCartItems,
        refreshCart: fetchCart,
        cartCount,
        cartSubtotal,
        cartTotal: cartSubtotal,
        cartOriginalTotal: cartSubtotal,
        cartSavings,
        freeShippingEligible,
        amountToFreeShipping,
        shippingProgress
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
