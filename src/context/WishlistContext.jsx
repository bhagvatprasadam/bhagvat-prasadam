import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as wishlistApi from '../api/wishlistApi.js';
import { getAuthToken } from '../utils/auth.js';
import { useAuth } from './AuthContext.jsx';
import { normalizeProduct } from '../api/productsApi.js';

const WishlistContext = createContext(null);
const GUEST_WISHLIST_KEY = 'bp_guest_wishlist';

function getLocalGuestWishlist() {
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalGuestWishlist(items) {
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
  } catch (e) {
    // ignore
  }
}

export function WishlistProvider({ children }) {
  const { isAuthenticated, openLoginModal } = useAuth();
  const [wishlist, setWishlist] = useState(() => getLocalGuestWishlist());
  const [loading, setLoading] = useState(false);

  // Sync wishlist from server for authenticated customers or localStorage for guests
  const fetchWishlist = useCallback(async () => {
    if (!getAuthToken()) {
      setWishlist(getLocalGuestWishlist());
      return;
    }

    setLoading(true);
    try {
      // First sync any guest items if present in localStorage
      const guestItems = getLocalGuestWishlist();
      if (guestItems && guestItems.length > 0) {
        for (const it of guestItems) {
          try {
            await wishlistApi.toggleWishlist(it.id, it.variants?.[0]?.id || null);
          } catch (e) {
            // continue
          }
        }
        try {
          localStorage.removeItem(GUEST_WISHLIST_KEY);
        } catch (e) {}
      }

      const items = await wishlistApi.getWishlist();
      // Items may be direct product objects or wrapper objects with wishlist_item_id
      const normalizedItems = (items || []).map(item => {
        const raw = item.product || item;
        const norm = normalizeProduct(raw);
        const wishlistId = item.wishlist_item_id || item.wishlistId || item.wishlist_id || item.id;
        return {
          ...norm,
          wishlistId,
          wishlist_item_id: wishlistId
        };
      });
      setWishlist(normalizedItems);
    } catch (err) {
      console.warn('Failed to load wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist, isAuthenticated]);

  // Set of product IDs for quick lookup
  const wishlistProductIds = useMemo(() => {
    const ids = new Set();
    wishlist.forEach(item => {
      if (item.id) ids.add(String(item.id));
      if (item.productId) ids.add(String(item.productId));
      if (item.slug) ids.add(String(item.slug));
    });
    return ids;
  }, [wishlist]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistProductIds.has(String(productId));
  };

  const toggleWishlist = async (product) => {
    if (!product) return;

    const productId = product.id;
    const variantId = product.variants?.[0]?.id || null;
    const isCurrentlyWishlisted = isInWishlist(productId);

    if (!getAuthToken()) {
      // Guest mode: save to state & localStorage
      let updated;
      if (isCurrentlyWishlisted) {
        updated = wishlist.filter(item => String(item.id) !== String(productId) && String(item.productId) !== String(productId));
      } else {
        updated = [...wishlist, product];
      }
      setWishlist(updated);
      saveLocalGuestWishlist(updated);
      return;
    }

    // Authenticated mode: Optimistic UI update
    const previousWishlist = [...wishlist];
    if (isCurrentlyWishlisted) {
      setWishlist(prev => prev.filter(item => String(item.id) !== String(productId) && String(item.productId) !== String(productId)));
    } else {
      setWishlist(prev => [...prev, product]);
    }

    try {
      await wishlistApi.toggleWishlist(productId, variantId);
      // Refresh to get server confirmed IDs
      await fetchWishlist();
    } catch (err) {
      console.error('Failed to toggle wishlist on server, rolling back:', err);
      setWishlist(previousWishlist);
    }
  };

  const removeFromWishlist = async (productId) => {
    let snapshot = [];
    setWishlist(prev => {
      snapshot = prev;
      return prev.filter(i => String(i.id) !== String(productId) && String(i.productId) !== String(productId));
    });

    if (!getAuthToken()) {
      const updated = wishlist.filter(i => String(i.id) !== String(productId) && String(i.productId) !== String(productId));
      saveLocalGuestWishlist(updated);
      return;
    }

    const item = snapshot.find(i => String(i.id) === String(productId) || String(i.productId) === String(productId));
    const targetWishlistId = item?.wishlistId || item?.wishlist_item_id || item?.wishlist_id;

    if (targetWishlistId) {
      try {
        await wishlistApi.deleteWishlistItem(targetWishlistId);
      } catch (err) {
        console.warn('Failed to delete item from server wishlist:', err);
      }
    } else {
      try {
        await wishlistApi.toggleWishlist(productId);
      } catch (err) {
        console.warn('Failed to toggle item from server wishlist:', err);
      }
    }
  };

  const addToWishlist = async (product) => {
    if (!isInWishlist(product.id)) {
      await toggleWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistItems: wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlist.length,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
