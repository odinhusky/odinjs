import { useEffect } from 'react';

export const deleteCachedFiles = async (targets: string[]) => {
  // 列出所有 Cache Storage 名稱
  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    // 打開特定 Cache Storage
    const cache = await caches.open(cacheName);

    // 列出緩存中的所有請求
    const requests = await cache.keys();

    // 如果 targets 是空陣列，則刪除所有緩存
    if (targets.length === 0) {
      const deletePromises = requests.map(async (request) => {
        console.log(`Deleting: ${request.url}`);
        await cache.delete(request); // 刪除所有緩存文件
      });
      await Promise.all(deletePromises); // 等待所有刪除操作完成
    } else {
      // 如果 targets 有內容，則刪除匹配的緩存
      const deletePromises = requests.map(async (request) => {
        for (const item of targets) {
          if (request.url.endsWith(item)) {
            console.log(`Deleting: ${request.url}`);
            await cache.delete(request); // 刪除匹配的緩存文件
          }
        }
      });
      await Promise.all(deletePromises); // 等待所有刪除操作完成
    }
  }
};

export const useClearCacheStorage = () => {
  useEffect(() => {
    console.log('@@ caches', caches);
    deleteCachedFiles(['.js']).then(() => {
      console.log(
        '@@ Selected JS and CSS files have been deleted from Cache Storage.'
      );
    });
  }, []);
};

export default useClearCacheStorage;
