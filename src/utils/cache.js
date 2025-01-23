// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

class Cache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if cache has expired
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  // Get time remaining before cache expires
  getTimeRemaining(key) {
    const item = this.cache.get(key);
    if (!item) return 0;

    const remaining = CACHE_DURATION - (Date.now() - item.timestamp);
    return remaining > 0 ? remaining : 0;
  }
}

export const channelCache = new Cache(); 