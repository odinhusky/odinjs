import {
  TANSTACK_QUERY_KEY_ACCOUNT_INFO,
  TANSTACK_QUERY_KEY_USER_INFO
} from "@shared-lib/constants/tanstackQueryKeys"
import type { RegisterInputCustomItem } from "@shared-lib/api/apiFunctions/auth_registerCustomInput"
import type { QueryClient } from "@tanstack/vue-query"

export interface MemberPasswordFormState {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const DEFAULT_PASSWORD_MIN_LENGTH = 8
const DEFAULT_PASSWORD_MAX_LENGTH = 20

export interface PasswordLengthRule {
  minLength: number
  maxLength: number
}

const resolveLength = (value: unknown, fallback: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback
  const normalized = Math.trunc(value)
  return normalized > 0 ? normalized : fallback
}

export const resolveRegisterPasswordLengthRule = (
  registerInfoList?: RegisterInputCustomItem[] | null
): PasswordLengthRule => {
  const passwordField = registerInfoList?.find((field) => field.column_name === "password")
  const minLength = resolveLength(passwordField?.column_rule?.minLength, DEFAULT_PASSWORD_MIN_LENGTH)
  const maxLength = resolveLength(passwordField?.column_rule?.maxLength, DEFAULT_PASSWORD_MAX_LENGTH)

  if (maxLength < minLength) {
    return {
      minLength: DEFAULT_PASSWORD_MIN_LENGTH,
      maxLength: DEFAULT_PASSWORD_MAX_LENGTH
    }
  }

  return { minLength, maxLength }
}

export const createMemberPasswordFormState = () =>
  reactive<MemberPasswordFormState>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

export const buildMemberPasswordErrors = ({
  form,
  shouldShowOldPassword,
  passwordLengthRule
}: {
  form: MemberPasswordFormState
  shouldShowOldPassword: boolean
  passwordLengthRule: PasswordLengthRule
}) => {
  const result: Partial<Record<keyof MemberPasswordFormState, string>> = {}
  const oldPassword = String(form.oldPassword ?? "").trim()
  const newPassword = String(form.newPassword ?? "").trim()

  if (shouldShowOldPassword && !oldPassword) {
    result.oldPassword = "請輸入原始密碼"
  }

  if (!newPassword) {
    result.newPassword = "請輸入新密碼"
  } else if (shouldShowOldPassword && oldPassword && newPassword === oldPassword) {
    result.newPassword = "新密碼不可與目前密碼相同"
  } else if (newPassword.length < passwordLengthRule.minLength) {
    result.newPassword = `新密碼至少需要 ${passwordLengthRule.minLength} 碼`
  } else if (newPassword.length > passwordLengthRule.maxLength) {
    result.newPassword = `新密碼不可超過 ${passwordLengthRule.maxLength} 碼`
  }

  if (!String(form.confirmPassword).trim()) {
    result.confirmPassword = "請輸入確認密碼"
  } else if (form.confirmPassword !== form.newPassword) {
    result.confirmPassword = "兩次密碼輸入不一致"
  }

  return result
}

export const buildMemberPasswordPayload = (form: MemberPasswordFormState) => ({
  old_password: form.oldPassword,
  new_password: form.newPassword,
  confirm_password: form.confirmPassword
})

export const resetMemberPasswordForm = ({
  form,
  hasSubmitted
}: {
  form: MemberPasswordFormState
  hasSubmitted: { value: boolean }
}) => {
  form.oldPassword = ""
  form.newPassword = ""
  form.confirmPassword = ""
  hasSubmitted.value = false
}

export const refreshMemberPasswordDependencies = async ({
  queryClient,
  refetchAccountInfo,
  refetchUserInfo
}: {
  queryClient: QueryClient
  refetchAccountInfo: () => Promise<unknown>
  refetchUserInfo: () => Promise<unknown>
}) => {
  await Promise.all([
    refetchAccountInfo(),
    refetchUserInfo(),
    queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_ACCOUNT_INFO] }),
    queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_USER_INFO] })
  ])
}