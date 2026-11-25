import { useState, useEffect, useCallback } from 'react';
import { getCollections, getCollectionByHandle } from '../api/collectionsApi.js';

// Purge any stale cached collections from sessionStorage immediately on module load
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

let inMemoryCollections = null;
let pendingCollectionsPromise = null;

export function useCollections() {
  const [collections, setCollections] = useState(() => inMemoryCollections || []);
  const [loading, setLoading] = useState(() => !inMemoryCollections || inMemoryCollections.length === 0);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (force = false) => {
    if (pendingCollectionsPromise) {
      try {
        const res = await pendingCollectionsPromise;
        const list = Array.isArray(res) ? res : [];
        setCollections(list);
        setLoading(false);
        return list;
      } catch (err) {
        console.error('Shared collections fetch error:', err);
        return inMemoryCollections || [];
      }
    }

    if (!force && inMemoryCollections && inMemoryCollections.length > 0) {
      setCollections(inMemoryCollections);
      setLoading(false);
      return inMemoryCollections;
    }

    setLoading(!inMemoryCollections || inMemoryCollections.length === 0);
    setError(null);
    try {
      pendingCollectionsPromise = getCollections(force);
      const result = await pendingCollectionsPromise;
      const list = Array.isArray(result) ? result : [];
      if (list.length > 0) {
        inMemoryCollections = list;
        setCollections(list);
        return list;
      }
      return inMemoryCollections || [];
    } catch (err) {
      console.error('Failed to fetch collections from API:', err);
      setError(err.message || 'Failed to load collections');
      return inMemoryCollections || [];
    } finally {
      pendingCollectionsPromise = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const findCollection = useCallback(async (slugOrHandle) => {
    if (!slugOrHandle) return null;
    const clean = String(slugOrHandle).trim().toLowerCase();

    // Check in-memory collections
    const inMem = collections.find(
      c => c.handle === clean || c.slug === clean || String(c.id) === clean || c.title?.toLowerCase() === clean
    );
    if (inMem) return inMem;

    // Fetch from API directly
    try {
      return await getCollectionByHandle(clean);
    } catch {
      return null;
    }
  }, [collections]);

  return {
    collections,
    loading,
    error,
    refetch: () => fetchAll(true),
    findCollection
  };
}

export default useCollections;
