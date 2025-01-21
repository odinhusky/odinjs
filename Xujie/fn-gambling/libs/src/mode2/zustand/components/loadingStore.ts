import { create } from 'zustand';

interface LoadingStore {
  isShowLoading: boolean;
  setShowLoading: (visible: boolean) => void;
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  isShowLoading: false,
  setShowLoading: (value) => set(() => ({ isShowLoading: value })),
}));
