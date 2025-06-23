import { create } from 'zustand';

export interface WinningsShareModelStoreTypes {
  isShowWinningsShareModel: boolean;
  setShowWinningsShareModel: (isShow: boolean) => void;

  winningAmount: number;
  setWinningAmount: (value: number) => void;
}

export const useWinningsShareModelStore = create<WinningsShareModelStoreTypes>(
  (set) => ({
    isShowWinningsShareModel: false,
    setShowWinningsShareModel: (isShow) =>
      set(() => ({ isShowWinningsShareModel: isShow })),

    winningAmount: 0,
    setWinningAmount: (value) => set(() => ({ winningAmount: value })),
  })
);

export default useWinningsShareModelStore;
