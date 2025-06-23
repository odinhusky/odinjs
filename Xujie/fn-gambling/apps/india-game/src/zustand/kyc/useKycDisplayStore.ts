import { create } from 'zustand';

export interface InitialValuesTypes {
  bankCode: string;
  ifsc: string;
  phone: string;
  realName: string;
  userName: string;
  password: string;
}

export interface KYCDisplayStoreTypes {
  isShowPersonalBlock: boolean;
  setIsShowPersonalBlock: (bool: boolean) => void;
  isShowBankAccountBlock: boolean;
  setIsShowBankAccountBlock: (bool: boolean) => void;
  isShowPasswordInput: boolean;
  setIsShowPasswordInput: (bool: boolean) => void;
  isDisablePhoneInput: boolean;
  setIsDisablePhoneInput: (bool: boolean) => void;
  defaultValues: InitialValuesTypes;
  setDefaultValues: (values: InitialValuesTypes) => void;
  headerTitleText: string;
  setHeaderTitleText: (text: string) => void;
}

export const useKycDisplayStore = create<KYCDisplayStoreTypes>()((set) => ({
  isShowPersonalBlock: true,
  setIsShowPersonalBlock: (bool) => set(() => ({ isShowPersonalBlock: bool })),

  isShowBankAccountBlock: true,
  setIsShowBankAccountBlock: (bool) =>
    set(() => ({ isShowBankAccountBlock: bool })),

  isShowPasswordInput: true,
  setIsShowPasswordInput: (bool) => set(() => ({ isShowPasswordInput: bool })),

  isDisablePhoneInput: false,
  setIsDisablePhoneInput: (bool) => set(() => ({ isDisablePhoneInput: bool })),

  defaultValues: {
    bankCode: '',
    ifsc: '',
    phone: '',
    realName: '',
    userName: '',
    password: '',
  },
  setDefaultValues: (values: InitialValuesTypes) =>
    set(() => ({ defaultValues: values })),

  headerTitleText: '',
  setHeaderTitleText: (text) => set(() => ({ headerTitleText: text })),
}));
