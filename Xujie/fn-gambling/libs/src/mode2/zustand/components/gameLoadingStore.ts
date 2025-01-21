import { create } from 'zustand';

interface gameLoadingStore {
  isShowGameLoading: boolean;
  setIsShowGameLoading: (visible: boolean) => void;
}

export const useGameLoadingStore = create<gameLoadingStore>((set) => ({
  isShowGameLoading: false,
  setIsShowGameLoading: (value) => set(() => ({ isShowGameLoading: value })),
}));
