import { create } from 'zustand';
import { devtoolsWrapper } from '@mode2/zustand/middlewareWrapper';


export interface InitialValuesTypes {
  bankCode: string;
  bankName: string;
  cnic: string;
  phone: string;
  realName: string;
  userName: string;
  password: string;
}

export interface UpdateFromValuesTypes {
  bankCode?: string;
  bankName?: string;
  cnic?: string;
  phone?: string;
  realName?: string;
  userName?: string;
  password?: string;
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
  updateFormValues: UpdateFromValuesTypes;
  setUpdateFormValues: (values: UpdateFromValuesTypes) => void;
  headerTitleText: string;
  setHeaderTitleText: (text: string) => void;
}


export const useKycDisplayStore = create<KYCDisplayStoreTypes>()(
  devtoolsWrapper('name', (set) => ({
    isShowPersonalBlock: true,
    setIsShowPersonalBlock: (bool) =>
      set(() => ({ isShowPersonalBlock: bool })),

    isShowBankAccountBlock: true,
    setIsShowBankAccountBlock: (bool) =>
      set(() => ({ isShowBankAccountBlock: bool })),

    isShowPasswordInput: true,
    setIsShowPasswordInput: (bool) =>
      set(() => ({ isShowPasswordInput: bool })),

    isDisablePhoneInput: false,
    setIsDisablePhoneInput: (bool) =>
      set(() => ({ isDisablePhoneInput: bool })),

    updateFormValues: {} as UpdateFromValuesTypes,
    setUpdateFormValues: (values: UpdateFromValuesTypes) =>
      set(() => ({ updateFormValues: values })),

    headerTitleText: '',
    setHeaderTitleText: (text) => set(() => ({ headerTitleText: text }))
  }))
);






