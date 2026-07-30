import { GENDER } from "src/utils/constants"
import { useI18n } from "vue-i18n"

export function useRule() {
  const { t } = useI18n()

  const accountMaxLength = 20
  const accountMinLength = 8
  const passwordMaxLength = 20
  const passwordMinLength = 8

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/
  const phoneMask = "(##) ### - ### - ####"
  const otpRegex = /^\d{4}$/

  const account = (val: string, customMessage?: string) => {
    const rules = /^(?![0()\/'*#])/

    if (!val || val === "") {
      return customMessage || t("common.validate.mustNotBeEmpty")
    }

    if (!rules.test(val)) {
      return customMessage ?? t("common.validate.verificationError")
    }

    if (val.length < accountMinLength) {
      return t("common.validate.limitMinLength", { num: accountMinLength })
    }

    if (val.length > accountMaxLength) {
      return t("common.validate.limitLength", { num: accountMaxLength })
    }

    return true
  }

  const phone = (val: string, customMessage?: string) => {
    if (!val || val === "") {
      return customMessage || t("common.validate.phoneFormatError")
    }

    if (!phoneRegex.test(val)) {
      return t("common.validate.phoneFormatError")
    }

    return true
  }

  const handleAccountValidate = (val: string, isPhoneRegisterMode: boolean) => {
    if (isPhoneRegisterMode) {
      return phone(val)
    }

    return account(val)
  }

  // 限制只能輸入正整數 & 小數點
  const validatePositiveNumber = (e: KeyboardEvent) => {
    if (!/^\d*\.?\d*$/.test((e.target as HTMLInputElement).value + e.key)) {
      e.preventDefault()
    }
  }

  return {
    noRule: () => true,
    /** 必填 */
    required: (customMessage?: string) => (val: string | number) => {
      if (typeof val === "string") {
        return (!!val && val.length > 0) || customMessage || t("common.validate.mustNotBeEmpty")
      }
      return !!val || customMessage || t("common.validate.mustNotBeEmpty")
    },
    requiredInt: (val: string) => !!val || t("common.validate.mustNotBeEmpty"),
    requiredGender: (val: GENDER.Enums) => {
      if (!Object.values(GENDER.Enums).includes(val)) {
        return t("common.validate.mustNotBeEmpty")
      }
      return true
    },
    arrayLength: (val: []) => {
      return !!val.length || t("common.validate.mustNotBeEmpty")
    },
    /** 帳號規則 */
    account,

    /** 密碼規則 */
    password: (val: string, customMessage?: string) => {
      const rules = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d!@#~${}?;"%=^&*|()_+.\[\]/\\*\-+'><:`]{8,20}$/

      if (!val || val === "") {
        return customMessage || t("common.validate.mustNotBeEmpty")
      }

      if (!rules.test(val)) {
        return customMessage || t("common.validate.verificationError")
      }

      if (val.length < passwordMinLength) {
        return t("common.validate.limitMinLength", { num: passwordMinLength })
      }

      if (val.length > passwordMaxLength) {
        return t("common.validate.limitLength", { num: passwordMaxLength })
      }

      return true
    },

    /** 新密碼規則 */
    newPassword: (oldPassword: string, newPasswordew: string) => {
      if (oldPassword === newPasswordew) {
        return t("common.validate.newPasswordValidation")
      }
      return true
    },

    /** 確認密碼規則 */
    confirmPassword: (newPassword: string, nconfirmPasswordew: string) => {
      if (newPassword !== nconfirmPasswordew) {
        return t("common.validate.confimrPasswordValidation")
      }
      return true
    },

    /** 全名規則 */
    fullname: (val: string, customMessage?: string) => {
      if (!val || val === "") {
        return customMessage ?? t("common.validate.mustNotBeEmpty")
      }
      return true
    },

    /** 信箱規則 */
    email: (val: string) => {
      if (!val || val === "") {
        return t("common.validate.mustNotBeEmpty")
      }

      if (!emailRegex.test(val)) {
        return t("common.validate.emailFormatError")
      }

      return true
    },

    /** 手機規則 */
    phone,

    /** 存款金額規則 */
    depositAmount: ({ min, max, val }: { min: string; max: string; val: string }) => {
      const numberVal = Number(val)

      if (isNaN(numberVal)) {
        return t("common.validate.numberFormatError")
      }

      const numberMin = Number(min)
      const numberMax = Number(max)

      if (numberVal < numberMin) {
        return t("common.validate.amountExceedMinLimit")
      }

      if (numberVal > numberMax) {
        return t("common.validate.amountExceedMaxLimit")
      }

      return true
    },
    /** 帳號驗證 */
    handleAccountValidate,

    /** 手機號碼input mask */
    phoneMask,

    /** 信箱規則 */
    otp: (val: string) => {
      if (!val || val === "") {
        return t("common.validate.verifyCodeError")
      }

      if (!otpRegex.test(val)) {
        return t("common.validate.verifyCodeError")
      }

      return true
    },

    /** 限制只能輸入正整數 & 小數點 */
    validatePositiveNumber
  }
}
