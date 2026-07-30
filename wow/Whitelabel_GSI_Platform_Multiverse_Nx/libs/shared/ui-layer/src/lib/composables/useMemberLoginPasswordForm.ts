import { useQueryClient } from "@tanstack/vue-query"
import { useUserInfo } from "@shared-lib/api/hooks/useUserInfo"

export const useMemberLoginPasswordForm = () => {
  const queryClient = useQueryClient()
  const { pushToast } = useToastQueue()
  const { accountInfo, refetch: refetchAccountInfo } = useAccountInfo()
  const { userInfo, refetch: refetchUserInfo } = useUserInfo()
  const { registerInfoList } = useGetRegisterInfo({ params: { type: "register" } })
  const { setUserPassword, isPending: isSetUserPasswordPending } = useSetUserPassword()

  const form = createMemberPasswordFormState()
  const hasSubmitted = ref(false)

  const passwordLengthRule = computed(() => resolveRegisterPasswordLengthRule(registerInfoList.value))
  const shouldShowOldPassword = computed(() => !accountInfo.value?.empty_password)
  const errors = computed(() =>
    buildMemberPasswordErrors({
      form,
      shouldShowOldPassword: shouldShowOldPassword.value,
      passwordLengthRule: passwordLengthRule.value
    })
  )
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  const isSubmitting = computed(() => isSetUserPasswordPending.value)

  const resetForm = () => {
    resetMemberPasswordForm({ form, hasSubmitted })
  }

  const submit = async () => {
    hasSubmitted.value = true
    if (hasErrors.value || isSubmitting.value) return

    await setUserPassword(buildMemberPasswordPayload(form))

    await refreshMemberPasswordDependencies({
      queryClient,
      refetchAccountInfo,
      refetchUserInfo
    })

    pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "Success",
      detail: "登入密碼更新成功",
      life: 2200
    })

    resetForm()
  }

  return {
    userInfo,
    accountInfo,
    form,
    hasSubmitted,
    errors,
    hasErrors,
    shouldShowOldPassword,
    isSubmitting,
    submit,
    resetForm
  }
}
