import { create } from 'zustand';

export const useLeaveModalStore = create<{
  isShowleaveModal: boolean;
  setIsShowleaveModal: (bool: boolean) => void;
}>()((set) => ({
  isShowleaveModal: false,
  setIsShowleaveModal: (isShowleaveModal) => set(() => ({ isShowleaveModal })),
}));

export default useLeaveModalStore;
