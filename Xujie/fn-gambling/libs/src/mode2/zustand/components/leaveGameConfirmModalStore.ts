import { create } from 'zustand';
import { devtoolsWrapper } from '../middlewareWrapper';

export const useLeaveGameConfirmModalStore = create<{
  isShowLeaveGameConfirmModal: boolean;
  setIsShowLeaveGameConfirmModal: (bool: boolean) => void;
}>()(
  devtoolsWrapper('[component store] useLeaveGameConfirmModalStore', (set) => ({
    isShowLeaveGameConfirmModal: false,
    setIsShowLeaveGameConfirmModal: (isShowLeaveGameConfirmModal) =>
      set(() => ({ isShowLeaveGameConfirmModal })),
  }))
);

export default useLeaveGameConfirmModalStore;
