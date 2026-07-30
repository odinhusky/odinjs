import { ROUTE_PATH } from "@shared-lib/constants/routePath"

export interface ResetPassFormType {
  password: string
  confirmPassword: string
}

export const useForgotPassChangePass = () => {
  const route = useRoute()
  const router = useRouter()
  const { pushToast } = useToastQueue()

  const form = reactive<ResetPassFormType>({
    password: "",
    confirmPassword: ""
  })

  const hasSubmitted = ref(false)

  const token = computed(() => String(route.params.token ?? "").trim())
  const account = computed(() => String(route.query.account ?? "").trim())

  const { resetPass, isPending: isResetPassPending } = useResetPass()

  const validationErrors = computed(() => {
    const errors: Partial<Record<keyof ResetPassFormType, string>> = {}

    if (!isRequiredFilled(form.password)) {
      errors.password = "請輸入新密碼"
    } else if (!isPasswordValid(form.password)) {
      errors.password = "新密碼至少需要 6 碼"
    }

    if (!isRequiredFilled(form.confirmPassword)) {
      errors.confirmPassword = "請再次輸入新密碼"
    } else if (form.confirmPassword !== form.password) {
      errors.confirmPassword = "兩次輸入的新密碼不一致"
    }

    return errors
  })

  const hasValidationError = computed(() => Object.keys(validationErrors.value).length > 0)

  const submitResetPass = async () => {
    hasSubmitted.value = true

    if (!token.value) {
      pushToast({
        severity: TOAST_SEVERITY_ENUMS.ERROR,
        summary: "Invalid Link",
        detail: "重設密碼連結無效",
        life: 2200
      })
      return
    }

    if (hasValidationError.value || isResetPassPending.value) return

    try {
      await resetPass({
        token: token.value,
        account: account.value || undefined,
        password: form.password,
        confirm_password: form.confirmPassword
      })

      pushToast({
        severity: TOAST_SEVERITY_ENUMS.SUCCESS,
        summary: "Success",
        detail: "密碼重設成功",
        life: 2200
      })

      await router.push(ROUTE_PATH.LOGIN.PASSWORD)
    } catch {
      // 錯誤由 useApiMutation 的 handleApiError 統一處理
    }
  }

  return {
    token,
    account,
    form,
    hasSubmitted,
    validationErrors,
    hasValidationError,
    isResetPassPending,
    submitResetPass
  }
}
