import { TFunction } from 'i18next';

interface ErrorMsgType {
  emptyI18nKey?: string;
  unValidateI18nKey?: string;
}

// 印度專案的正則
const USER_AND_REAL_NAME_REGEX = /^[a-zA-Z](?:[a-zA-Z\s]*[a-zA-Z])?$/;
const NICK_NAME_REGEX = /^[a-zA-Z0-9]*$/;
const PASSWORD_REGEX = /^(?!.*\s)[\s\S]{4,13}$/;
// 正規 IFSC code 格式
// 固定長度為 11 位數
// 前 4 位是字母
// 第 5 位固定為 0
// 後 6 位是數字
const IFSC_REGEX = /^[A-Z]{4}0\d{6}$/;

// 泛用類型，只檢查值是否不為 falsy 或是 空字串，可自定義錯誤訊息
const validateRequired = (value: string, t: TFunction, i18nKey: string) =>
  value ? Promise.resolve() : Promise.reject(t(i18nKey));

type CommonEmptyValidatorErrorMsg = Pick<ErrorMsgType, 'emptyI18nKey'>;

export const CommonEmptyValidator = (t: TFunction) => ({
  inputValue: (value: string, errorMsg?: CommonEmptyValidatorErrorMsg) => {
    return validateRequired(
      value,
      t,
      errorMsg?.emptyI18nKey
        ? errorMsg.emptyI18nKey
        : 'toast_field_cannot_be_empty'
    );
  },
});

interface WithdrawContentAmountValidatorErrorMsg extends ErrorMsgType {}

export const WithdrawContentValidator = (t: TFunction) => ({
  amount: (
    value: string,
    maxLimit: number,
    errorMsg?: WithdrawContentAmountValidatorErrorMsg
  ) => {
    if (!value) {
      return Promise.reject(
        t(
          errorMsg?.emptyI18nKey
            ? errorMsg.emptyI18nKey
            : 'toast_field_cannot_be_empty'
        )
      );
    }

    if (Number(value) > maxLimit) {
      return Promise.reject(
        t(
          errorMsg?.unValidateI18nKey
            ? errorMsg.unValidateI18nKey
            : 'toast_the_withdrawal_amount_2',
          {
            maxLimit,
          }
        )
      );
    }
    return Promise.resolve();
  },
});

interface FullOrderDetailValidatorErrorMsg extends ErrorMsgType {}

export const FullOrderDetailValidator = (t: TFunction) => ({
  confirmCode: (
    value: string,
    minLimit: number,
    errorMsg?: FullOrderDetailValidatorErrorMsg
  ) => {
    if (!value) {
      return Promise.reject(
        t(
          errorMsg?.emptyI18nKey
            ? errorMsg.emptyI18nKey
            : 'balance_record_deposit_record_receipt_not_filled_toast'
        )
      );
    }

    if (value.length < minLimit) {
      return Promise.reject(
        t(
          errorMsg?.unValidateI18nKey
            ? errorMsg.unValidateI18nKey
            : 'balance_record_deposit_record_receipt_input_placeholde'
        )
      );
    }
    return Promise.resolve();
  },
});

type BankAccountValidatorErrorMsg = Pick<ErrorMsgType, 'emptyI18nKey'>;
type BankAccountRepeatValidatorErrorMsg = Pick<
  ErrorMsgType,
  'unValidateI18nKey'
>;
interface IFSCValidatorErrorMsg extends ErrorMsgType {}
type IFSCRepeatValidatorErrorMsg = Pick<ErrorMsgType, 'unValidateI18nKey'>;

export const KYCInputValidator = (t: TFunction) => ({
  bankAccount: (value: string, errorMsg?: BankAccountValidatorErrorMsg) => {
    return validateRequired(
      value,
      t,
      errorMsg?.emptyI18nKey
        ? errorMsg.emptyI18nKey
        : 'toast_field_cannot_be_empty'
    );
  },
  repeatBankAccount: (
    value: string,
    getFieldValue: (name: string) => string,
    errorMsg?: BankAccountRepeatValidatorErrorMsg
  ) => {
    if (value !== getFieldValue('bankCode')) {
      return Promise.reject(
        t(
          errorMsg?.unValidateI18nKey
            ? errorMsg.unValidateI18nKey
            : 'TODO 不同 bank account'
        )
      );
    }

    return Promise.resolve();
  },
  ifscCode: (value: string, errorMsg?: IFSCValidatorErrorMsg) => {
    if (!value) {
      return Promise.reject(
        errorMsg?.emptyI18nKey
          ? errorMsg.emptyI18nKey
          : t('toast_field_cannot_be_empty')
      );
    }
    if (!IFSC_REGEX.test(value)) {
      return Promise.reject(
        t(
          errorMsg?.unValidateI18nKey
            ? errorMsg.unValidateI18nKey
            : 'Wrong IFSC, please check your IFSC'
          // : 'IFSC Code must be 11 characters, starting with 4 letters, followed by 0, and ending with 6 digits.'
        )
      ); // TODO i18n
    }
    return Promise.resolve();
  },
  repeatIfscCode: (
    value: string,
    getFieldValue: (name: string) => string,
    errorMsg?: IFSCRepeatValidatorErrorMsg
  ) => {
    if (value !== getFieldValue('ifsc')) {
      return Promise.reject(
        errorMsg?.unValidateI18nKey
          ? errorMsg.unValidateI18nKey
          : t('TODO 不同 ifsc')
      );
    }
    return Promise.resolve();
  },
});

interface UserNameValidatorErrorMsg {
  emptyI18nKey?: string;
  unValidateI18nKey?: string;
}

export const UserNameValidator = (t: TFunction) => ({
  username: (value: string, errorMsg?: UserNameValidatorErrorMsg) => {
    if (!value) {
      // return Promise.reject('Please input username'); // TODO Evan 可優化
      return Promise.reject(
        t(
          errorMsg?.emptyI18nKey
            ? errorMsg.emptyI18nKey
            : 'toast_field_cannot_be_empty'
        )
      );
    }
    if (!USER_AND_REAL_NAME_REGEX.test(value)) {
      return Promise.reject(
        t(
          errorMsg?.unValidateI18nKey
            ? errorMsg.unValidateI18nKey
            : 'account_personal_info_input_hint_only_fill_and_english'
        )
      );
    }
    return Promise.resolve();
  },
});

interface NickNameValidatorErrorMsg extends ErrorMsgType {}

export const NickNameValidator = (t: TFunction) => ({
  nickname: (value: string, errorMsg?: NickNameValidatorErrorMsg) => {
    if (!value) {
      // return Promise.reject('Please input username'); // TODO Evan 可優化
      return Promise.reject(
        errorMsg?.emptyI18nKey
          ? errorMsg.emptyI18nKey
          : t('toast_field_cannot_be_empty')
      );
    }
    if (!NICK_NAME_REGEX.test(value)) {
      return Promise.reject(
        t(
          errorMsg?.unValidateI18nKey
            ? errorMsg.unValidateI18nKey
            : 'Nickname must be letters or digit'
        )
      );
    }
    return Promise.resolve();
  },
});

interface PasswordValidatorErrorMsg extends ErrorMsgType {}
type PasswordRepeatValidatorErrorMsg = Pick<ErrorMsgType, 'unValidateI18nKey'>;

export const PasswordValidator = (t: TFunction) => ({
  password: (value: string, errorMsg?: PasswordValidatorErrorMsg) => {
    if (!value) {
      return Promise.reject(
        t(
          errorMsg?.emptyI18nKey
            ? errorMsg.emptyI18nKey
            : 'toast_password_cannot_be_empty'
        )
      );
    }
    if (!PASSWORD_REGEX.test(value)) {
      return Promise.reject(
        t(
          errorMsg?.unValidateI18nKey
            ? errorMsg.unValidateI18nKey
            : 'toast_password_hint'
        )
      );
    }
    return Promise.resolve();
  },
  confirmPassword: (
    value: string,
    getFieldValue: (name: string) => string,
    errorMsg?: PasswordRepeatValidatorErrorMsg
  ) => {
    if (value !== getFieldValue('password')) {
      return Promise.reject(
        t(
          errorMsg?.unValidateI18nKey
            ? errorMsg.unValidateI18nKey
            : 'toast_confirm_password_not_match'
        )
      );
    }
    return Promise.resolve();
  },
});

type GiftCodeRedeemValidatorErrorMsg = Pick<ErrorMsgType, 'emptyI18nKey'>;

export const GiftCodeRedeemValidator = (t: TFunction) => ({
  giftCode: (value: string, errorMsg?: GiftCodeRedeemValidatorErrorMsg) => {
    return validateRequired(
      value,
      t,
      errorMsg?.emptyI18nKey
        ? errorMsg.emptyI18nKey
        : 'gift_code_popup_input_placeholder'
    );
  },
});

interface OTPCodeValidatorErrorMsg extends ErrorMsgType {}

export const OTPCodeValidator = (t: TFunction) => ({
  otpCode: (value: string, errorMsg?: OTPCodeValidatorErrorMsg) => {
    if (!value) {
      return Promise.reject(
        t(
          errorMsg?.emptyI18nKey
            ? errorMsg.emptyI18nKey
            : 'toast_field_cannot_be_empty'
        )
      );
    }
    if (value.length !== 6) {
      return Promise.reject(
        t(
          errorMsg?.unValidateI18nKey
            ? errorMsg.unValidateI18nKey
            : 'sign_in_popup_new_password_input_hint_enter_verification_code'
        )
      );
    }
    return Promise.resolve();
  },
});

interface PhoneNumberValidatorErrorMsg extends ErrorMsgType {}

export const PhoneNumberValidator = (t: TFunction) => ({
  phone: (value: string, errorMsg?: PhoneNumberValidatorErrorMsg) => {
    const nameRegex = /^\d{10,11}$/;
    if (!value) {
      return Promise.reject(
        errorMsg?.emptyI18nKey
          ? errorMsg.emptyI18nKey
          : t('toast_mobile_phone_cannot_be_empty')
      );
    }
    if (!nameRegex.test(value)) {
      return Promise.reject(
        errorMsg?.unValidateI18nKey
          ? errorMsg.unValidateI18nKey
          : t('toast_phone_numbers_restrict')
      );
    }

    return Promise.resolve();
  },
});
