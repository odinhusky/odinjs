import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '@mode2/zustand/middlewareWrapper';
import { cloneDeep } from 'lodash';

// interface PersonalInfoKycData {
//   id: number;
//   name: string;
//   phone: string;
// }

interface BankAccountInfoKycData {
  realName: string;
  bankCode: string;
  ifsc: string;
}


export interface KycDataTypes {
  // isPersonalInfoFirstBind: boolean;
  // setIsPersonalInfoFirstBind: (value: boolean | null) => void;
  // isBankFirstBind: boolean;
  // setIsBankFirstBind: (value: boolean | null) => void;
  // personalInfo: PersonalInfoKycData;
  // setKycPersonalInfo: (info: PersonalInfoKycData) => void;
  bankAccountInfo: BankAccountInfoKycData;
  setKycBankAccountInfo: (info: BankAccountInfoKycData) => void;
  resetKycData: () => void;
  refreshKycInitCount: number;
  refreshKYCInit: () => void;
  isAPIPlayerInformationLoading: boolean;
  setIsAPIPlayerInformationLoading: (bool: boolean) => void;
}

const defaultKycData = {
  // isPersonalInfoFirstBind: false, // 是否需要去完善個人資訊
  // isBankFirstBind: true, // 是否沒綁定過帳戶資訊, 如果是第一次綁定還需要設定提現密碼
  // personalInfo: {
  //   id: -1,
  //   name: '', // nickname
  //   phone: ''
  // },
  bankAccountInfo: {
    realName: '',
    bankCode: '',
    ifsc: '',
  },
  refreshKycInitCount: 0, // refresh useKYCInit 的 API(v1/information) 發送
  isAPIPlayerInformationLoading: false,
};

/**
 * KYC 所需資訊 (個人資訊, 銀行資訊)
 */
export const useKycDataStore = create<KycDataTypes>()(
  devtoolsAndPersistWrapper('[user store] useKycDataStore', (set) => ({
    ...cloneDeep(defaultKycData),
    // setIsPersonalInfoFirstBind: (value) =>
    //   set(() => ({ isPersonalInfoFirstBind: value })),
    // setIsBankFirstBind: (value) => set(() => ({ isBankFirstBind: value })),
    // setKycPersonalInfo: (info) => set(() => ({ personalInfo: info })),
    setKycBankAccountInfo: (info) => set(() => ({ bankAccountInfo: info })),
    resetKycData: () => set(() => ({ ...cloneDeep(defaultKycData) })),
    refreshKYCInit: () =>
      set((state: KycDataTypes) => ({
        refreshKycInitCount: state.refreshKycInitCount + 1,
      })),
    setIsAPIPlayerInformationLoading: (bool) =>
      set(() => ({ isAPIPlayerInformationLoading: bool })),
  }))
);
