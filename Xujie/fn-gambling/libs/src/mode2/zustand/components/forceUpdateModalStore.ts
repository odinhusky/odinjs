import { create } from 'zustand';

interface ForceUpdateModalStoreTypes {
  isShowForceUpdateModal: boolean;
  setIsShowForceUpdateModal: (bool: boolean) => void;
  isWeakUpdate: boolean;
  setIsWeakUpdate: (bool: boolean) => void;
}

export const useForceUpdateModalStore = create<ForceUpdateModalStoreTypes>()(
  (set) => ({
    isShowForceUpdateModal: false,
    setIsShowForceUpdateModal: (bool) =>
      set(() => ({ isShowForceUpdateModal: bool })),
    isWeakUpdate: false,
    setIsWeakUpdate: (bool) => set(() => ({ isWeakUpdate: bool })),
  })
);

export default useForceUpdateModalStore;
