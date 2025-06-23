import { create } from 'zustand';

export const useLeaveGameConfirmModalStore = create<{
  isShowLeaveGameConfirmModal: boolean;
  setIsShowLeaveGameConfirmModal: (bool: boolean) => void;
}>()((set) => ({
  isShowLeaveGameConfirmModal: false,
  setIsShowLeaveGameConfirmModal: (isShowLeaveGameConfirmModal) =>
    set(() => ({ isShowLeaveGameConfirmModal })),
}));

export default useLeaveGameConfirmModalStore;
