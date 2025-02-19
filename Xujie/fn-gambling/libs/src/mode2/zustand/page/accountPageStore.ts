import { create } from 'zustand';

export enum AccountPageTypes {
  MYINFO = 0, // 個人詳情頁
  AVATAR = 1, // 修改頭像頁
}

export enum AccountPageGenderTypes {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum AccountPageModalTitleTypes {
  NICKNAME = 'Edit nickname', // 編輯暱稱
  GENDER = 'Select the gender', // 編輯性別
  INVITE_CODE = 'Blind invitation code', // 綁定邀請碼
  PASSWORD = 'Set login password', // 設定密碼
}

export type TLoginFormProps = {
  phone: string;
  otpCode: string;
  password: string;
  confirmPassword: string;
};

export interface AccountFormValues extends TLoginFormProps {
  nickname?: string;
}

export type AccountPageStoreTypes = {
  tabIndex: AccountPageTypes;
  setTabIndex: (index: AccountPageTypes) => void;

  isShowEditModal: boolean;
  setShowEditModal: (index: boolean) => void;
  modalTitle: AccountPageModalTitleTypes;
  setModalTitle: (index: AccountPageModalTitleTypes) => void;

  nickname: string;
  setNickname: (nickname: string) => void;

  referCode: string; // 邀請碼
  setReferCode: (referCode: string) => void;

  gender: AccountPageGenderTypes;
  setGender: (nickname: AccountPageGenderTypes) => void;

  loginForm: TLoginFormProps;
  setLoginForm: (loginForm: TLoginFormProps) => void;

  passwordVisibility: {
    password: boolean;
    confirmPassword: boolean;
  };
  togglePasswordVisibility: (field: 'password' | 'confirmPassword') => void;
};

export const useAccountPageStore = create<AccountPageStoreTypes>()((set) => ({
  tabIndex: AccountPageTypes.MYINFO,
  setTabIndex: (index: AccountPageTypes) => set(() => ({ tabIndex: index })),

  isShowEditModal: false,
  setShowEditModal: (value: boolean) => set(() => ({ isShowEditModal: value })),
  modalTitle: AccountPageModalTitleTypes.NICKNAME,
  setModalTitle: (value: AccountPageModalTitleTypes) =>
    set(() => ({ modalTitle: value })),

  referCode: '',
  setReferCode: (referCode: string) => set(() => ({ referCode })),

  nickname: '',
  setNickname: (nickname: string) => set(() => ({ nickname })),

  gender: AccountPageGenderTypes.FEMALE,
  setGender: (gender: AccountPageGenderTypes) => set(() => ({ gender })),

  loginForm: {} as TLoginFormProps,
  setLoginForm: (loginForm: TLoginFormProps) => set(() => ({ loginForm })),

  passwordVisibility: {
    password: false,
    confirmPassword: false,
  },
  togglePasswordVisibility: (field) =>
    set((state) => ({
      passwordVisibility: {
        ...state.passwordVisibility,
        [field]: !state.passwordVisibility[field],
      },
    })),
}));
