import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// 定義圖片快取狀態
export interface ImageCacheState {
  [imageUrl: string]: {
    cacheValue: string,
    expirationTime?: number; //快取的有效期限（時間戳記）(Milliseconds)
  };
}


// 初始狀態
const initialState: ImageCacheState = {};

// 建立圖片快取的 slice
export const imageCacheSlice = createSlice({
  name: 'imageCache',
  initialState,
  reducers: {
    // 快取圖片
    cacheImage: (state: ImageCacheState, action: PayloadAction<{
      key: string;
      cacheValue: string,
      expirationTime: number | undefined
    }>) => {
      const {key, cacheValue, expirationTime} = action.payload;
      state[key] = {
        cacheValue: cacheValue,
        expirationTime: expirationTime ? expirationTime : -1
      };
    },
    // 更新快取圖片
    updateCachedImage: (state: ImageCacheState, action: PayloadAction<{
      key: string; cacheValue: string,
      expirationTime: number | undefined
    }>) => {
      const {key, cacheValue, expirationTime} = action.payload;
      state[key] = {
        cacheValue: cacheValue,
        expirationTime: expirationTime ? expirationTime : -1
      }
    },
    // 清除圖片快取
    clearImageCache: () => {
      return {};
    },
    // 清除指定圖片快取
    clearImageCacheByKey: (state: ImageCacheState, action: PayloadAction<string>) => {
      const key = action.payload;
      console.log("---> clear CacheByKey", key)
      if (state[key]) {
        delete state[key];
      }
    },
  },
});

// 匯出 action creators 和 reducer
export const {cacheImage, updateCachedImage, clearImageCache, clearImageCacheByKey} = imageCacheSlice.actions;
export const imageCacheReducer = imageCacheSlice.reducer;
