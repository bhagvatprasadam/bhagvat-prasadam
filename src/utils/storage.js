// Safe storage utility for browser localStorage with in-memory fallback
const memoryStorage = new Map();

function isLocalStorageAvailable() {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      if (!isLocalStorageAvailable()) {
        const val = memoryStorage.get(key);
        return val !== undefined ? val : defaultValue;
      }
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch {
      try {
        if (isLocalStorageAvailable()) {
          return window.localStorage.getItem(key) || defaultValue;
        }
        return defaultValue;
      } catch {
        return defaultValue;
      }
    }
  },

  set: (key, value) => {
    try {
      if (!isLocalStorageAvailable()) {
        memoryStorage.set(key, value);
        return true;
      }
      if (typeof value === 'string') {
        window.localStorage.setItem(key, value);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
      return true;
    } catch (e) {
      console.warn('Storage set notice:', e.message);
      memoryStorage.set(key, value);
      return false;
    }
  },

  remove: (key) => {
    try {
      if (!isLocalStorageAvailable()) {
        memoryStorage.delete(key);
        return true;
      }
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('Storage remove notice:', e.message);
      memoryStorage.delete(key);
      return false;
    }
  }
};
