import { useState, useEffect } from 'react';
import { getBanners } from '../api/bannersApi.js';

export function useBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    async function load() {
      try {
        const res = await getBanners();
        if (isSubscribed && Array.isArray(res) && res.length > 0) {
          setBanners(res);
        }
      } catch (err) {
        console.warn('useBanners error:', err);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { isSubscribed = false; };
  }, []);

  return { banners, loading };
}

export default useBanners;
