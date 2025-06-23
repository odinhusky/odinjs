import { OTPCountDownKeys } from '@libs/mode2/zustand/components/OTPCountDownStore';

export interface OTPCountDownProps {
  className?: string;
  btnClassName?: string;
  classNameText?: string;
  currentKey: OTPCountDownKeys;
  duration?: number;
  mobile?: string;
  getMobileFn?: () => string;
  i18nKey?: string;
  showUnit?: boolean; // 顯示倒數計時單位 default true
}
