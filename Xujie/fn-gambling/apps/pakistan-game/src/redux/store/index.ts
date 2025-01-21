import { configureStore } from '@reduxjs/toolkit';
import { baseAPI, baseCryptoAPI } from '@mode2API/index';
import { pakistanAPI, pakistanCryptoAPI } from '@/external/api';

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    [baseCryptoAPI.reducerPath]: baseCryptoAPI.reducer,
    [pakistanAPI.reducerPath]: pakistanAPI.reducer,
    [pakistanCryptoAPI.reducerPath]: pakistanCryptoAPI.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseAPI.middleware)
      .concat(baseCryptoAPI.middleware)
      .concat(pakistanAPI.middleware)
      .concat(pakistanCryptoAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {});
