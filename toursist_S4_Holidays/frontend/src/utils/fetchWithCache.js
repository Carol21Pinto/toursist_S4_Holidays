// ⚡ Reusable cache utility for all pages
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchWithCache = async (url) => {
  if (cache.has(url)) {
    const { data, timestamp } = cache.get(url);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log('✅ Using cached data for:', url);
      return data;
    }
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  
  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  
  return data;
};

// Clear cache function (useful for manual refresh)
export const clearCache = () => {
  cache.clear();
  console.log('Cache cleared');
};
