import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const maxLimit = Number(import.meta.env['VITE_FETCH_BATCH_MAX_LIMIT'] || 5);

export const axiosBatch = rateLimit(axios.create(), {
  maxRequests: maxLimit,
  perMilliseconds: 1000,
});

// 用 Map 存储请求缓存
const requestCache = new Map<string, Promise<any>>();
const CACHE_DURATION = 500; // 0.5秒

// Evan 避免0.5秒內相同請求
export const axiosGetBatch = async (url: string, config = {}) => {
  const cacheKey = JSON.stringify({ url, config });

  if (requestCache.has(cacheKey)) {
    console.log('@@@===> request deduplication');
    return requestCache.get(cacheKey);
  }

  // 发起请求并存入缓存
  const requestPromise = axiosBatch.get(url, config).finally(() => {
    setTimeout(() => {
      requestCache.delete(cacheKey);
    }, CACHE_DURATION);
  });

  requestCache.set(cacheKey, requestPromise);
  return requestPromise;
};

// export const axiosPreloadBatch = async (url: string, config = {}) => {
//   const cacheKey = JSON.stringify({ url, config });
//
//   if (requestCache.has(cacheKey)) {
//     console.log('@@@===> request deduplication');
//     return requestCache.get(cacheKey);
//   }
//
//   // 发起请求并存入缓存
//   const requestPromise = axiosPBatch.get(url, config).finally(() => {
//     setTimeout(() => {
//       requestCache.delete(cacheKey);
//     }, CACHE_DURATION);
//   });
//
//   requestCache.set(cacheKey, requestPromise);
//   return requestPromise;
// };
