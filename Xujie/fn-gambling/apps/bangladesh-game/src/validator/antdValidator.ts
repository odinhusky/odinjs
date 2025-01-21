import { NAME_REGEX } from '@libs/constant/regex';
import { TFunction } from 'i18next';
export const KYCValidator = {
  bankAccount: (value: string, t: TFunction) => {
    if (!value) {
      return Promise.reject('Please input bank account'); // TODO i18n 缺少
    }

    return Promise.resolve();
  },
  ifscCode: (value: string, t: TFunction) => {
    if (!value) {
      return Promise.reject('Please input IFSC code'); // TODO i18n 缺少
    }

    return Promise.resolve();
  },
  phone: (value: string, t: TFunction) => {
    const nameRegex = /^\d{10,11}$/;
    if (!value) {
      return Promise.reject(t('toast_mobile_phone_cannot_be_empty'));
    }
    if (!nameRegex.test(value)) {
      return Promise.reject(t('toast_phone_numbers_restrict'));
    }

    return Promise.resolve();
  },
  username: (value: string, t: TFunction) => {
    if (!value) {
      return Promise.reject('Please input username'); // TODO i18n 缺少
    }
    if (!NAME_REGEX.test(value)) {
      return Promise.reject(
        t('account_personal_info_input_hint_only_fill_and_english')
      );
    }
    return Promise.resolve();
  },
  password: (value: string, t: TFunction) => {
    const passwordRegex = /^(?!.*\s)[\s\S]{4,13}$/;
    if (!value) {
      return Promise.reject(t('toast_password_cannot_be_empty'));
    }
    if (!passwordRegex.test(value)) {
      return Promise.reject(t('toast_password_hint'));
    }
    return Promise.resolve();
  },
};

export const ForgotPasswordValidator = {
  phone: (value: string, t: TFunction) => {
    const nameRegex = /^\d{10,11}$/;
    if (!value) {
      return Promise.reject(t('toast_mobile_phone_cannot_be_empty'));
    }
    if (!nameRegex.test(value)) {
      return Promise.reject(t('toast_phone_numbers_restrict'));
    }

    return Promise.resolve();
  },
  password: (value: string, t: TFunction) => {
    const passwordRegex = /^(?!.*\s)[\s\S]{4,13}$/;
    if (!value) {
      return Promise.reject(t('toast_password_cannot_be_empty'));
    }
    if (!passwordRegex.test(value)) {
      return Promise.reject(t('toast_password_hint'));
    }
    return Promise.resolve();
  },
  otpCode: (value: string, t: TFunction) => {
    if (!value) {
      return Promise.reject(
        t('sign_in_popup_new_password_input_hint_enter_verification_code')
      );
    }
    return Promise.resolve();
  },
};

export const WithdrawContentValidator = {
  amount: (value: string, t: TFunction, maxLimit: number) => {
    if (!value) {
      return Promise.reject(t('toast_field_cannot_be_empty'));
    }

    if (Number(value) > maxLimit) {
      return Promise.reject(
        t('toast_the_withdrawal_amount_2', {
          maxLimit,
        })
      );
    }
    return Promise.resolve();
  },
};
