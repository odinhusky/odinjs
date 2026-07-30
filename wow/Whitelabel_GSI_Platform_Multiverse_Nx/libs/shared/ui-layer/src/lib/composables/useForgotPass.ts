import { FORGOT_PASSWORD_SMS_OTP_COUNTDOWN_END_TIME } from "@shared-lib/constants/localStorageKeys"
import { useForgotPassMutation } from "@shared-lib/api/hooks/useForgotPassMutation"
import { useForgotPassSms as useForgotPassSmsMutation } from "@shared-lib/api/hooks/useForgotPassSms"

export const FORGOT_PASS_VERIFY_METHOD = {
  EMAIL: "email",
  SMS: "sms"
} as const

export type ForgotPassVerifyMethod = (typeof FORGOT_PASS_VERIFY_METHOD)[keyof typeof FORGOT_PASS_VERIFY_METHOD]

export interface ForgotPassEmailFormType {
  account: string
  email: string
}

export interface ForgotPassSmsFormType {
  countryCode: string
  phone: string
  smsOtp: string
}

export const useForgotPass = () => {
  const { pushToast } = useToastQueue()
  const { setting: registerMethod } = useSetting({ selector: (s) => s.register_method })

  const activeMethod = ref<ForgotPassVerifyMethod>(FORGOT_PASS_VERIFY_METHOD.EMAIL)
  const mobileContentVisible = ref(false)

  const emailForm = reactive<ForgotPassEmailFormType>({
    account: "",
    email: ""
  })

  const smsForm = reactive<ForgotPassSmsFormType>({
    countryCode: "",
    phone: "",
    smsOtp: ""
  })

  const hasSubmittedEmail = ref(false)
  const hasSubmittedSms = ref(false)

  const { forgotPass, isPending: isForgotPassPending } = useForgotPassMutation()
  const { forgotPassSms, isPending: isForgotPassSmsPending } = useForgotPassSmsMutation()

  const isAccountMode = computed(() => registerMethod.value === REGISTER_METHOD_ENUMS.ACCOUNT)
  const isPhoneMode = computed(() => registerMethod.value === REGISTER_METHOD_ENUMS.PHONE)
  const shouldShowMethodMenu = computed(() => isPhoneMode.value)

  const emailErrors = computed(() => {
    const errors: Partial<Record<keyof ForgotPassEmailFormType, string>> = {}

    if (!isRequiredFilled(emailForm.account)) {
      errors.account = "請輸入註冊帳戶"
    }

    if (!isRequiredFilled(emailForm.email)) {
      errors.email = "請輸入註冊電子信箱"
    } else if (!isEmailValid(emailForm.email)) {
      errors.email = "電子郵件格式不正確"
    }

    return errors
  })

  const smsErrors = computed(() => {
    const errors: Partial<Record<keyof ForgotPassSmsFormType, string>> = {}

    if (!isRequiredFilled(smsForm.countryCode)) {
      errors.countryCode = "請選擇國碼"
    }

    if (!isRequiredFilled(smsForm.phone)) {
      errors.phone = "請輸入手機號碼"
    }

    if (!isRequiredFilled(smsForm.smsOtp)) {
      errors.smsOtp = "請輸入驗證碼"
    }

    return errors
  })

  const hasEmailError = computed(() => Object.keys(emailErrors.value).length > 0)
  const hasSmsError = computed(() => Object.keys(smsErrors.value).length > 0)

  watch(
    registerMethod,
    (method) => {
      if (method === REGISTER_METHOD_ENUMS.ACCOUNT) {
        activeMethod.value = FORGOT_PASS_VERIFY_METHOD.EMAIL
        mobileContentVisible.value = true
        return
      }

      activeMethod.value = FORGOT_PASS_VERIFY_METHOD.SMS
      mobileContentVisible.value = false
    },
    { immediate: true }
  )

  const verifyMethods = computed(() => {
    if (!shouldShowMethodMenu.value) return []

    return [
      {
        key: FORGOT_PASS_VERIFY_METHOD.EMAIL,
        label: "電子郵件驗證",
        icon: "mdi:email-outline"
      },
      {
        key: FORGOT_PASS_VERIFY_METHOD.SMS,
        label: "簡訊驗證",
        icon: "mdi:message-text-outline"
      }
    ] as const
  })

  const isEmailMethod = computed(() => activeMethod.value === FORGOT_PASS_VERIFY_METHOD.EMAIL)

  const setActiveMethod = (method: ForgotPassVerifyMethod) => {
    activeMethod.value = method
    mobileContentVisible.value = true
  }

  const backToMethodMenu = () => {
    mobileContentVisible.value = false
  }

  const notifyVerifyMailSent = () => {
    pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "Success",
      detail: "重設密碼信件已寄出",
      life: 2200
    })
  }

  const notifyVerifySmsSent = () => {
    pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "Success",
      detail: "重設密碼簡訊已送出",
      life: 2200
    })
  }

  const notifyOtpSent = () => {
    pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "OTP Sent",
      detail: "驗證碼已發送",
      life: 2000
    })
  }

  const submitEmailVerify = async () => {
    hasSubmittedEmail.value = true
    if (hasEmailError.value || isForgotPassPending.value) return

    try {
      await forgotPass({
        account: emailForm.account.trim(),
        email: emailForm.email.trim()
      })
      notifyVerifyMailSent()
    } catch {
      // 錯誤由 useApiMutation 的 handleApiError 統一處理
    }
  }

  const submitSmsVerify = async () => {
    hasSubmittedSms.value = true
    if (hasSmsError.value || isForgotPassSmsPending.value) return

    try {
      await forgotPassSms({
        phone: smsForm.phone,
        sms_otp: smsForm.smsOtp,
        country_code: smsForm.countryCode
      })
      notifyVerifySmsSent()
    } catch {
      // 錯誤由 useApiMutation 的 handleApiError 統一處理
    }
  }

  return {
    activeMethod,
    mobileContentVisible,
    verifyMethods,
    shouldShowMethodMenu,
    isAccountMode,
    isPhoneMode,
    emailForm,
    smsForm,
    emailErrors,
    smsErrors,
    isEmailMethod,
    hasSubmittedEmail,
    hasSubmittedSms,
    isForgotPassPending,
    isForgotPassSmsPending,
    otpCountdownKey: FORGOT_PASSWORD_SMS_OTP_COUNTDOWN_END_TIME,
    setActiveMethod,
    backToMethodMenu,
    submitEmailVerify,
    submitSmsVerify,
    notifyOtpSent
  }
}
