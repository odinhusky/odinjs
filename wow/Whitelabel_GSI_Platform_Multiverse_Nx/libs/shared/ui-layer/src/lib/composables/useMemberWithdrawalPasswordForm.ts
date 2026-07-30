import { useQueryClient } from "@tanstack/vue-query"
import { useSetUserWithdrawalPassword } from "@shared-lib/api/hooks/useSetUserWithdrawalPassword"
import { useUserInfo } from "@shared-lib/api/hooks/useUserInfo"

export const useMemberWithdrawalPasswordForm = () => {
  const queryClient = useQueryClient()
  const { pushToast } = useToastQueue()
  const { accountInfo, refetch: refetchAccountInfo } = useAccountInfo()
  const { userInfo, refetch: refetchUserInfo } = useUserInfo()
  const { registerInfoList } = useGetRegisterInfo({ params: { type: "register" } })
  const { setUserWithdrawalPassword, isPending: isSetWithdrawalPasswordPending } = useSetUserWithdrawalPassword()

  const form = createMemberPasswordFormState()
  const hasSubmitted = ref(false)

  const passwordLengthRule = computed(() => resolveRegisterPasswordLengthRule(registerInfoList.value))
  const shouldShowOldPassword = computed(() => Boolean(accountInfo.value?.has_withdrawal_password))
  const errors = computed(() =>
    buildMemberPasswordErrors({
      form,
      shouldShowOldPassword: shouldShowOldPassword.value,
      passwordLengthRule: passwordLengthRule.value
    })
  )
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  const isSubmitting = computed(() => isSetWithdrawalPasswordPending.value)

  const resetForm = () => {
    resetMemberPasswordForm({ form, hasSubmitted })
  }

  const submit = async () => {
    hasSubmitted.value = true
    if (hasErrors.value || isSubmitting.value) return

    await setUserWithdrawalPassword(buildMemberPasswordPayload(form))

    await refreshMemberPasswordDependencies({
      queryClient,
      refetchAccountInfo,
      refetchUserInfo
    })

    pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "Success",
      detail: "出款密碼更新成功",
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
