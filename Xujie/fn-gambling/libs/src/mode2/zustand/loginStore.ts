import { create } from 'zustand';
import sdkUtils from '@mode2/utils/sdk';
import { devtoolsWrapper } from './middlewareWrapper';

export enum LoginFormType {
  LOGIN = 'login',
  REGISTER = 'register',
  OTP_LOGIN = 'otpLogin',
}

interface FormTabs {
  label: string;
  onAction: () => void;
  active: boolean;
}

export interface IsShowLoginModalStoreTypes {
  loginType: LoginFormType;
  isShowLoginModal: boolean;
  isShowForgotPasswordModal: boolean;
  setIsShowLoginModal: (value: boolean, type?: LoginFormType) => void;
  toggleIsLoginModal: () => void;
  setIsShowForgotPasswordModal: (value: boolean) => void;
  setLoginType: (value: LoginFormType) => void;

  formTabs: FormTabs[];
  currentFormTab: LoginFormType;
  setFormTabs: (value: FormTabs[]) => void;
  setCurrentFormTab: (currentFormTab: LoginFormType) => void;
  referralCode: string;
  setReferralCode: (referralCode: string) => void;
  optCode: string;
  optId: string;
  setOptCode: (optCode: string) => void;
  setOptId: (optId: string) => void;
}

export const useIsShowLoginModalStore = create<IsShowLoginModalStoreTypes>(
  (set) => ({
    loginType: LoginFormType.LOGIN,
    isShowLoginModal: false,
    isShowForgotPasswordModal: false,
    setIsShowLoginModal: (isShowLoginModal, loginType = LoginFormType.LOGIN) =>
      set(() => ({ isShowLoginModal, loginType })),
    toggleIsLoginModal: () =>
      set((state: IsShowLoginModalStoreTypes) => ({
        isShowLoginModal: !state.isShowLoginModal,
      })),
    setIsShowForgotPasswordModal: (value) =>
      set(() => ({ isShowForgotPasswordModal: value })),
    setLoginType: (loginType = LoginFormType.LOGIN) =>
      set(() => ({ loginType })),

    formTabs: [],
    currentFormTab: LoginFormType.LOGIN,
    setFormTabs: (formTabs: FormTabs[]) => set(() => ({ formTabs })),
    setCurrentFormTab: (currentFormTab = LoginFormType.LOGIN) =>
      set(() => ({ currentFormTab })),
    referralCode: '',
    setReferralCode: (referralCode: string) => set(() => ({ referralCode })),
    optCode: '',
    optId: '',
    setOptCode: (optCode: string) => set(() => ({ optCode })),
    setOptId: (optId: string) => set(() => ({ optId })),
  })
);

export interface IsLoginStoreTypes {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export const useIsLoginStore = create<IsLoginStoreTypes>()(
  devtoolsWrapper('[login store] useIsLoginStore', (set) => ({
    isLogin: sdkUtils.isCurrentLogin(),
    setIsLogin: (value) => set(() => ({ isLogin: value })),
  }))
);
