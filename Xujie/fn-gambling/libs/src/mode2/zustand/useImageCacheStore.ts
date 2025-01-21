import { create } from 'zustand';

interface CacheData {
  [key: string]: string;
}

interface ImageCacheStoreType {
  allCacheData: CacheData;
  setImageCaches: (map: CacheData[]) => void;
  setImageCache: (data: CacheData) => void;
  getByKey: (key: string) => string | null;
}

export const useImageCacheStore = create<ImageCacheStoreType>((set, get) => ({
  allCacheData: {},
  setImageCaches: (map) =>
    set((state) => {
      const newCacheData: CacheData = {};
      map.forEach((cache) => {
        Object.assign(newCacheData, cache);
      });
      return { allCacheData: { ...state.allCacheData, ...newCacheData } };
    }),
  setImageCache: (data) =>
    set((state) => {
      return { allCacheData: { ...state.allCacheData, ...data } };
    }),
  getByKey: (key) => {
    return get().allCacheData[key] || null;
  },
}));
