import { INPUT_TYPE_ENUMS } from "@shared-lib/constants/enums/inputType"
import {
  TANSTACK_QUERY_KEY_ACCOUNT_INFO,
  TANSTACK_QUERY_KEY_MEMBER_COLUMN,
  TANSTACK_QUERY_KEY_USER_INFO
} from "@shared-lib/constants/tanstackQueryKeys"
import type { MemberColumn } from "@shared-lib/api/apiFunctions/userInfo_getMemberColumn"
import type { SetSingleUserInfoWithoutParamsLimitParamsType } from "@shared-lib/api/apiFunctions/userInfo_setSingleUserInfoWithoutParamsLimit"
import { useQueryClient } from "@tanstack/vue-query"
import { useMemberColumn } from "@shared-lib/api/hooks/useMemberColumn"
import { useSetSingleUserInfoWithoutParamsLimit } from "@shared-lib/api/hooks/useSetSingleUserInfoWithoutParamsLimit"
import { toRfc3339 } from "@shared-lib/utils/useRfc3339"

type MemberProfileFormValue = string | number | boolean | null | string[] | undefined

const resolveFieldLabel = (field: MemberColumn) => {
  const langMap = field.lang ?? {}
  return (
    langMap["zh-TW"] ||
    langMap["zh-tw"] ||
    langMap["zh_CN"] ||
    langMap["zh-CN"] ||
    langMap.en ||
    langMap.EN ||
    field.column_name
  )
}

const validateFieldValue = (field: MemberColumn, value: unknown): string => {
  const valueText = String(value ?? "")

  if (field.required && !valueText.trim()) {
    return "此欄位為必填"
  }

  return ""
}

const normalizeFormValue = (value: unknown): MemberProfileFormValue => {
  if (value === null || value === undefined) return ""
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value
  if (Array.isArray(value)) return value as string[]
  return String(value)
}

export const useMemberProfileForm = () => {
  const queryClient = useQueryClient()
  const { pushToast } = useToastQueue()
  const { memberColumnList, isLoading: isMemberColumnLoading, refetch: refetchMemberColumns } = useMemberColumn()
  const { accountInfo, isLoading: isAccountInfoLoading, refetch: refetchAccountInfo } = useAccountInfo()

  const { setSingleUserInfoWithoutParamsLimit, isPending: isSavingProfile } = useSetSingleUserInfoWithoutParamsLimit()

  const formData = reactive<Record<string, MemberProfileFormValue>>({})
  const formErrors = reactive<Record<string, string>>({})

  const profileFields = computed<MemberColumn[]>(() => memberColumnList.value ?? [])
  const editableFields = computed<MemberColumn[]>(() => (memberColumnList.value ?? []).filter((field) => field.edit))

  const phoneField = computed(() => profileFields.value.find((field) => field.column_name === "phone"))
  const countryField = computed(() => profileFields.value.find((field) => field.column_name === "country"))
  const hasPhoneField = computed(() => Boolean(phoneField.value))
  const hasCountryField = computed(() => Boolean(countryField.value))
  const phoneGroupAnchor = computed(
    () => profileFields.value.find((field) => field.column_name === "phone" || field.column_name === "country") ?? null
  )

  const shouldSkipField = (field: { column_name: string }) => {
    if (!hasPhoneField.value && !hasCountryField.value) return false
    return field.column_name === "country" || field.column_name === "phone"
  }

  watch(
    [profileFields, accountInfo],
    ([fields, info]) => {
      if (!fields.length || !info) return

      fields.forEach((field: MemberColumn) => {
        const key = field.column_name
        if (!(key in formData)) {
          formData[key] = normalizeFormValue((info as Record<string, unknown>)[key])
        }
      })

      if (hasCountryField.value && !formData.country) {
        const firstCountry = countryField.value?.values?.[0]
        if (firstCountry?.value !== undefined) {
          formData.country = String(firstCountry.value)
        }
      }
    },
    { immediate: true }
  )

  const clearFieldError = (key: string) => {
    formErrors[key] = ""
  }

  const validateForm = () => {
    let valid = true

    editableFields.value.forEach((field: MemberColumn) => {
      if (shouldSkipField(field)) return
      const errorMessage = validateFieldValue(field, formData[field.column_name])
      formErrors[field.column_name] = errorMessage
      if (errorMessage) valid = false
    })

    return valid
  }

  const submitProfile = async (selfExclusionDate?: string | null) => {
    if (!validateForm()) return

    const nextSelfExclusionAt = (() => {
      if (selfExclusionDate === undefined) return accountInfo.value?.self_exclusion_at ?? null
      if (!selfExclusionDate) return null

      const rfc3339 = toRfc3339(selfExclusionDate)
      if (!rfc3339) return null

      const millis = Date.parse(rfc3339)
      if (Number.isNaN(millis)) return null

      return Math.floor(millis / 1000)
    })()

    const payload: SetSingleUserInfoWithoutParamsLimitParamsType = {
      single: true,
      self_exclusion_at: nextSelfExclusionAt
    }

    editableFields.value.forEach((field: MemberColumn) => {
      const fieldKey = field.column_name
      const currentValue = formData[fieldKey]

      if (field.type === INPUT_TYPE_ENUMS.DATE && typeof currentValue === "string") {
        payload[fieldKey] = currentValue
        return
      }

      payload[fieldKey] = currentValue ?? ""
    })

    await setSingleUserInfoWithoutParamsLimit(payload)

    await Promise.all([
      refetchAccountInfo(),
      refetchMemberColumns(),
      queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_ACCOUNT_INFO] }),
      queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_MEMBER_COLUMN] }),
      queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_USER_INFO] })
    ])

    pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "Success",
      detail: "個人資訊更新成功",
      life: 2200
    })
  }

  const fieldLabelMap = computed(() => {
    const map: Record<string, string> = {}
    profileFields.value.forEach((field: MemberColumn) => {
      map[field.column_name] = resolveFieldLabel(field)
    })
    return map
  })

  return {
    formData,
    formErrors,
    profileFields,
    editableFields,
    fieldLabelMap,
    phoneField,
    countryField,
    hasPhoneField,
    hasCountryField,
    phoneGroupAnchor,
    shouldSkipField,
    isMemberColumnLoading,
    isAccountInfoLoading,
    isSavingProfile,
    clearFieldError,
    accountInfo,
    submitProfile
  }
}
