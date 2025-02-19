import { create } from 'zustand';

export enum BindType {
  BIND_PHONE = 'BIND_PHONE',
  BIND_PHONE_AND_PASSWORD = 'BIND_PHONE_AND_PASSWORD',
}

export interface BindPlayerPhoneModalStoreTypes {
  isShowBindPlayerPhoneModal: boolean;
  setShowBindPlayerPhoneModal: (isShow: boolean) => void;

  bindType: BindType;
  setBindType: (type: BindType) => void;
}

export const useBindPlayerPhoneModalStore =
  create<BindPlayerPhoneModalStoreTypes>((set) => ({
    isShowBindPlayerPhoneModal: false,
    setShowBindPlayerPhoneModal: (isShow) =>
      set(() => ({ isShowBindPlayerPhoneModal: isShow })),

    bindType: BindType.BIND_PHONE,
    setBindType: (type) =>
      set(() => ({
        bindType: type,
      })),
  }));

export default useBindPlayerPhoneModalStore;
