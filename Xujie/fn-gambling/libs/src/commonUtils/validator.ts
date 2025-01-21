import {
  EMAIL_REGEX,
  MOBILE_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
} from '@libs/constant/regex';

export interface ValidatorType {
  username: (value: string) => Error | undefined;
  mobile: (value: string) => Error | undefined;
  email: (value: string) => Error | undefined;
  bankCode: (value: string) => Error | undefined;
  lazyPassword: (value: string) => Error | undefined;
  password: (value: string) => Error | undefined;
}

export const validator: ValidatorType = {
  username: (value: string) => {
    if (!value) {
      return new Error('please input username');
    }
    if (!NAME_REGEX.test(value)) {
      return new Error('只能英文');
    }
    return;
  },
  mobile: (value: string) => {
    if (!value) {
      return new Error('please input mobile');
    }
    if (!MOBILE_REGEX.test(value)) {
      return new Error('10-11');
    }
    return;
  },
  email: (value: string) => {
    if (!value) {
      return new Error('please input email');
    }
    if (!EMAIL_REGEX.test(value)) {
      return new Error('格式不正确');
    }
    return;
  },
  bankCode: (value: string) => {
    if (!value) {
      return new Error('please input bankCode');
    }
    return;
  },
  lazyPassword: (value: string) => {
    if (!value) {
      return new Error('please input lazyPassword');
    }
    if (!PASSWORD_REGEX.test(value)) {
      return new Error('4-13');
    }
    return;
  },
  password: (value: string) => {
    if (!value) {
      return new Error('please input password');
    }
    if (!PASSWORD_REGEX.test(value)) {
      return new Error('4-13');
    }
    return;
  },
};

export default validator;
