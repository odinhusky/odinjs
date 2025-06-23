// import { create } from 'zustand';
// import { devtoolsAndPersistWrapper, devtoolsWrapper } from '@mode2/zustand/middlewareWrapper';
// import cloneDeep from 'lodash/cloneDeep';
//
// interface PersonalInfoKycData {
//   id: number;
//   name: string;
//   phone: string;
// }
//
// interface BankAccountInfoKycData {
//   realName: string;
//   bankCode: string;
//   ifsc: string;
// }
//
// export interface InitialValuesTypes {
//   bankCode: string;
//   bankName: string;
//   cnic: string;
//   phone: string;
//   realName: string;
//   userName: string;
//   password: string;
// }
//
// export interface UpdateFromValuesTypes {
//   bankCode?: string;
//   bankName?: string;
//   cnic?: string;
//   phone?: string;
//   realName?: string;
//   userName?: string;
//   password?: string;
// }
//
//
// export interface KYCDisplayStoreTypes {
//   isShowPersonalBlock: boolean;
//   setIsShowPersonalBlock: (bool: boolean) => void;
//   isShowBankAccountBlock: boolean;
//   setIsShowBankAccountBlock: (bool: boolean) => void;
//   isShowPasswordInput: boolean;
//   setIsShowPasswordInput: (bool: boolean) => void;
//   isDisablePhoneInput: boolean;
//   setIsDisablePhoneInput: (bool: boolean) => void;
//   updateFormValues: UpdateFromValuesTypes;
//   setUpdateFormValues: (values: UpdateFromValuesTypes) => void;
//   headerTitleText: string;
//   setHeaderTitleText: (text: string) => void;
// }
//
//
// export const useKycDisplayStore = create<KYCDisplayStoreTypes>()(
//   devtoolsWrapper('name', (set) => ({
//     isShowPersonalBlock: true,
//     setIsShowPersonalBlock: (bool) =>
//       set(() => ({ isShowPersonalBlock: bool })),
//
//     isShowBankAccountBlock: true,
//     setIsShowBankAccountBlock: (bool) =>
//       set(() => ({ isShowBankAccountBlock: bool })),
//
//     isShowPasswordInput: true,
//     setIsShowPasswordInput: (bool) =>
//       set(() => ({ isShowPasswordInput: bool })),
//
//     isDisablePhoneInput: false,
//     setIsDisablePhoneInput: (bool) =>
//       set(() => ({ isDisablePhoneInput: bool })),
//
//     updateFormValues: {} as UpdateFromValuesTypes,
//     setUpdateFormValues: (values: UpdateFromValuesTypes) =>
//       set(() => ({ updateFormValues: values })),
//
//     headerTitleText: '',
//     setHeaderTitleText: (text) => set(() => ({ headerTitleText: text }))
//   }))
// );
//
// export interface KycDataTypes {
//   isPersonalInfoFirstBind: boolean;
//   setIsPersonalInfoFirstBind: (value: boolean | null) => void;
//   isBankFirstBind: boolean;
//   setIsBankFirstBind: (value: boolean | null) => void;
//   personalInfo: PersonalInfoKycData;
//   setKycPersonalInfo: (info: PersonalInfoKycData) => void;
//   bankAccountInfo: BankAccountInfoKycData;
//   setKycBankAccountInfo: (info: BankAccountInfoKycData) => void;
//   resetKycData: () => void;
//   refreshKycInitCount: number;
//   refreshKYCInit: () => void;
//   isAPIPlayerInformationLoading: boolean;
//   setIsAPIPlayerInformationLoading: (bool: boolean) => void;
// }
//
//
// const defaultKycData = {
//   isPersonalInfoFirstBind: false, // 是否需要去完善個人資訊
//   isBankFirstBind: true, // 是否沒綁定過帳戶資訊, 如果是第一次綁定還需要設定提現密碼
//   personalInfo: {
//     id: -1,
//     name: '', // nickname
//     phone: ''
//   },
//   bankAccountInfo: {
//     realName: '',
//     bankCode: '',
//     ifsc: ''
//   },
//   refreshKycInitCount: 0, // refresh useKYCInit 的 API(v1/information) 發送
//   isAPIPlayerInformationLoading: false
// };
//
// /**
//  * KYC 所需資訊 (個人資訊, 銀行資訊)
//  */
// export const useKycDataStore = create<KycDataTypes>()(
//   devtoolsAndPersistWrapper('[user store] useKycDataStore', (set) => ({
//     ...cloneDeep(defaultKycData),
//     setIsPersonalInfoFirstBind: (value) =>
//       set(() => ({ isPersonalInfoFirstBind: value })),
//     setIsBankFirstBind: (value) => set(() => ({ isBankFirstBind: value })),
//     setKycPersonalInfo: (info) => set(() => ({ personalInfo: info })),
//     setKycBankAccountInfo: (info) => set(() => ({ bankAccountInfo: info })),
//     resetKycData: () => set(() => ({ ...cloneDeep(defaultKycData) })),
//     refreshKYCInit: () =>
//       set((state: KycDataTypes) => ({
//         refreshKycInitCount: state.refreshKycInitCount + 1
//       })),
//     setIsAPIPlayerInformationLoading: (bool) =>
//       set(() => ({ isAPIPlayerInformationLoading: bool }))
//   }))
// );
