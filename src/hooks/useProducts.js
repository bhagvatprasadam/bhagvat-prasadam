import { useState, useEffect, useCallback } from 'react';
import { getProducts, getProductByHandle, getProductById } from '../api/productsApi.js';

// Purge any stale cached products from sessionStorage immediately on module load
try {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    Object.keys(sessionStorage).forEach((k) => {
      if (k.startsWith('bhagvat_prasadam_')) {
        sessionStorage.removeItem(k);
      }
    });
  }
} catch {
  // Ignore sessionStorage access errors
}

let inMemoryProducts = null;
let pendingPromise = null;

export function useProducts({ limit = 100 } = {}) {
  const [products, setProducts] = useState(() => inMemoryProducts || []);
  const [loading, setLoading] = useState(() => !inMemoryProducts || inMemoryProducts.length === 0);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    // If an identical fetch is already in flight, await the shared promise
    if (pendingPromise) {
      try {
        const res = await pendingPromise;
        const list = Array.isArray(res) ? res : (res?.products || []);
        setProducts(list);
        setLoading(false);
        return list;
      } catch (err) {
        console.error('Shared products fetch error:', err);
        return inMemoryProducts || [];
      }
    }

    setLoading(!inMemoryProducts || inMemoryProducts.length === 0);
    setError(null);
    try {
      pendingPromise = getProducts({ limit })
        .then(result => (result && Array.isArray(result.products) ? result.products : []));

      const result = await pendingPromise;
      if (Array.isArray(result) && result.length > 0) {
        inMemoryProducts = result;
        setProducts(result);
        return result;
      }
      return inMemoryProducts || [];
    } catch (err) {
      console.error('Failed to fetch products from API:', err);
      setError(err.message || 'Failed to load products');
      return inMemoryProducts || [];
    } finally {
      pendingPromise = null;
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const findProduct = useCallback(async (slugOrId) => {
    if (!slugOrId) return null;
    const clean = String(slugOrId).trim().toLowerCase();

    // Check in-memory products
    const inMem = products.find(
      p => p.slug === clean || p.handle === clean || String(p.id) === clean
    );
    if (inMem) return inMem;

    // Fetch from API directly
    try {
      const isNum = /^\d+$/.test(clean);
      if (isNum) {
        return await getProductById(clean);
      }
      return await getProductByHandle(clean);
    } catch {
      return null;
    }
  }, [products]);

  return {
    products,
    loading,
    error,
    refetch: () => fetchAll(true),
    findProduct
  };
}

export default useProducts;
