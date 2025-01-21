import { configureStore } from '@reduxjs/toolkit';

import { ActivityCenterAPI } from '@/external/api';

export const store = configureStore({
  reducer: {
    [ActivityCenterAPI.reducerPath]: ActivityCenterAPI.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ActivityCenterAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {});
