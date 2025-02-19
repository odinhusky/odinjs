import { create } from 'zustand';

export enum OTPCountDownKeys {
  DEFAULT = 'default',
  OTP_LOGIN = 'otpLogin',
  LOGIN = 'login',
  REGISTER = 'register',
  BIND_PLAYER_PHONE_MODAL_COUNTDOWN = 'BindPlayerPhoneModalCountDown',
  FORGOT_PASSWORD = 'ForgotPassword',
}

interface OTPCountDownStoreTypes {
  countDowns: Record<string, number>;
  setCountDownTime: (key: string, time: number) => void;
  removeCountDownTime: (key: string) => void;

  otpId: string;
  setOtpId: (value: string) => void;
}

export const useOTPCountDownStore = create<OTPCountDownStoreTypes>((set) => ({
  countDowns: {},
  setCountDownTime: (key, time) =>
    set((state) => ({
      countDowns: { ...state.countDowns, [key]: time },
    })),
  removeCountDownTime: (key) =>
    set((state) => {
      const newCountDowns = { ...state.countDowns };
      delete newCountDowns[key];
      return { countDowns: newCountDowns };
    }),

  otpId: '',
  setOtpId: (value) => set(() => ({ otpId: value })),
}));
