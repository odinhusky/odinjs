import { useImageCacheStore } from '@mode2/zustand/useImageCacheStore';
import { axiosGetBatch } from '@libs/commonUtils';
import { imageStore } from '@mode2/localforage/stroe';
import dayjs from 'dayjs';

interface CacheData {
  data: Blob;
  lastUpdateTime: number;
}

interface ImageResult {
  key: string; // 图像的键，类型为字符串
  data: CacheData; // 图像的 Blob 数据，可能为 null
}

const GAME_IMAGE_CACHE_DURATION: number = Number(
  import.meta.env['VITE_GAME_IMAGE_CACHE_DURATION'] || 604800000
);
const ICON_CACHE_DURATION: number = -1;

/**
 * 不要轉成 hook
 */
export const useImageCache = {
  async syncAllImageCacheStore() {
    try {
      const allImages: string[] = await imageStore.keys(); // 获取所有键
      const imageData: (CacheData | null)[] = await Promise.all(
        allImages.map((key) => imageStore.getItem<CacheData>(key)) // 使用泛型指定数据类型
      );

      // 返回键和对应的 Blob 数据
      // 返回键和对应的 Blob 数据，并过滤掉 data 为 null 的对象
      const result: ImageResult[] = allImages
        .map((key, index) => ({
          key,
          data: imageData[index],
        }))
        .filter(
          (item): item is ImageResult =>
            item.data !== null && item.data.data !== null
        ); // 类型保护，确保 data 不为 null

      // 使用 useImageCacheStore 将有效的结果存储到缓存
      useImageCacheStore.getState().setImageCache(
        result.reduce((acc, item) => {
          const data = URL.createObjectURL(item.data.data);
          acc[item.key] = data; // 以键值对的形式添加到缓存
          return acc;
        }, {} as { [key: string]: string }) // 将结果转换为 CacheData 类型，确保类型匹配
      );
    } catch (error) {
      console.error('syncAllImageCacheStore Error', error);
    }
  },

  // TODO Evan 導入 Command Pattern，累積N數再一次執行
  async asyncHandleCacheData(
    src: string,
    cacheDuration: number,
    isLocalRes: boolean = false,
    version: string = ''
  ) {
    if (
      src.startsWith(`${window.location.origin}/resources/')`) ||
      src.startsWith('/resources') ||
      src.startsWith(`${window.location.origin}/static/')`) ||
      src.startsWith('/static') ||
      src.startsWith('/images') ||
      isLocalRes
    ) {
      const keyName = `${src}${version}`;
      const cachedItem: CacheData | null = await imageStore.getItem<CacheData>(
        keyName
      );
      const now = dayjs().unix();

      // cacheDuration <= 0 表示永久緩存
      const isExpired =
        cacheDuration > 0
          ? now - (cachedItem?.lastUpdateTime || 0) >= cacheDuration
          : false;

      if (
        cachedItem === null || // 緩存無資料
        isExpired // 緩存 expTime 過期
      ) {
        try {
          const resp = await axiosGetBatch(src, { responseType: 'blob' });
          if (resp.status !== 200) {
            return Promise.resolve();
          }
          const newData: CacheData = {
            data: resp.data,
            lastUpdateTime: now,
          };
          await imageStore.setItem(keyName, newData);
          const newCacheData = { [`${src}`]: URL.createObjectURL(resp.data) };
          useImageCacheStore.getState().setImageCache(newCacheData);
          return Promise.resolve();
        } catch (e) {
          console.error('Handle Cache Data Error', e);
        }
      }
    }
  },

  getByCache(url: string): string {
    const cacheData = useImageCacheStore.getState().getByKey(url);
    // 如果沒有，進入 asyncHandleCacheData 執行 緩存作業
    if (!cacheData) {
      // 進入异步操作
      this.asyncHandleCacheData(url, GAME_IMAGE_CACHE_DURATION);
    }
    // 不等待，直接 return
    return useImageCacheStore.getState().getByKey(url) || url;
  },
  getIconByCache(src: string, color: string): string {
    const version = `_${String(import.meta.env['VITE_ICON_VERSION'] || '')}`;
    const keyName = `${src}${color}${version}`;
    const cacheData = useImageCacheStore.getState().getByKey(keyName);
    // 如果沒有，進入 asyncHandleCacheData 執行 緩存作業

    if (!cacheData) {
      // 進入异步操作
      this.asyncHandleCacheData(src, ICON_CACHE_DURATION, true, version);
    }
    // 不等待，直接 return
    return useImageCacheStore.getState().getByKey(keyName) || src;
  },
  async asyncHandleIconCache(src: string, color: string, data: Blob | null) {
    const version = `_${String(import.meta.env['VITE_ICON_VERSION'] || '')}`;
    const keyName = `${src}${color}${version}`;
    const cacheData = useImageCacheStore.getState().getByKey(keyName);
    if (!cacheData && data) {
      const newData: CacheData = {
        data: data,
        lastUpdateTime: dayjs().unix(),
      };
      await imageStore.setItem(keyName, newData);
      const newCacheData = { [`${src}`]: URL.createObjectURL(data) };
      useImageCacheStore.getState().setImageCache(newCacheData);
    }
  },
};
