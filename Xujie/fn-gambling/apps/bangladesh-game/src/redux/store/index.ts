import { configureStore } from '@reduxjs/toolkit';
import { baseAPI, baseCryptoAPI } from '@mode2API/index';
import { bangladeshAPI, bangladeshCryptoAPI } from '@/external/api';

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    [baseCryptoAPI.reducerPath]: baseCryptoAPI.reducer,
    [bangladeshAPI.reducerPath]: bangladeshAPI.reducer,
    [bangladeshCryptoAPI.reducerPath]: bangladeshCryptoAPI.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseAPI.middleware)
      .concat(baseCryptoAPI.middleware)
      .concat(bangladeshAPI.middleware)
      .concat(bangladeshCryptoAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {});
