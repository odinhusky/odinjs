import { configureStore } from '@reduxjs/toolkit';
import { baseAPI, baseCryptoAPI } from '@mode2API/index';
import { indiaAPI, indiaCryptoAPI } from '@/external/api';

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    [baseCryptoAPI.reducerPath]: baseCryptoAPI.reducer,
    [indiaAPI.reducerPath]: indiaAPI.reducer,
    [indiaCryptoAPI.reducerPath]: indiaCryptoAPI.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseAPI.middleware)
      .concat(baseCryptoAPI.middleware)
      .concat(indiaAPI.middleware)
      .concat(indiaCryptoAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {});
