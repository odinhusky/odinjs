<script setup lang="ts">
import { computed, reactive, watch } from "vue"
import type { RegisterInputCustomItem } from "@shared-lib/api/apiFunctions/auth_registerCustomInput"
import { REGISTER_SMS_OTP_COUNTDOWN_END_TIME } from "@shared-lib/constants/localStorageKeys"
type DynamicFieldLike = {
  column_name: string
  type: number
  required: boolean
  values?: Array<{ label: string; value: string | number }>
  lang?: Record<string, string>
  edit?: boolean
}

// ---------------------------------------------------------------------------
// Props / Emits
// ---------------------------------------------------------------------------
const emit = defineEmits<{
  submit: [formData: Record<string, any>]
}>()

// ---------------------------------------------------------------------------
// 取得動態欄位清單
// ---------------------------------------------------------------------------
const { registerInfoList, isLoading } = useGetRegisterInfo({ params: { type: "register" } })

// ---------------------------------------------------------------------------
// 動態表單狀態
// ---------------------------------------------------------------------------
const formData = reactive<Record<string, any>>({})
const formErrors = reactive<Record<string, string>>({})

watch(
  registerInfoList,
  (list) => {
    if (!list) return
    list.forEach((field) => {
      if (!(field.column_name in formData)) {
        formData[field.column_name] = field.type === FIELD_TYPE_ENUMS.DATE ? null : ""
      }
    })
  },
  { immediate: true }
)

// ---------------------------------------------------------------------------
// phone + country 群組邏輯
// ---------------------------------------------------------------------------
const phoneField = computed(() => registerInfoList.value?.find((f) => f.column_name === "phone"))
const countryField = computed(() => registerInfoList.value?.find((f) => f.column_name === "country"))
const hasPhoneField = computed(() => !!phoneField.value)
const hasCountryField = computed(() => !!countryField.value)

// phone/country 中先出現的欄位作為「錨點」，在此渲染 BasePhoneInput
const phoneGroupAnchor = computed(
  () => registerInfoList.value?.find((f) => f.column_name === "phone" || f.column_name === "country") ?? null
)

// 渲染時跳過 phone/country（已由 BasePhoneInput 群組處理）
const shouldSkipField = (field: DynamicFieldLike) => {
  if (!hasPhoneField.value && !hasCountryField.value) return false
  return field.column_name === "country" || field.column_name === "phone"
}

const resolveInputPlaceholder = (field: DynamicFieldLike) => {
  return getColumnRulePlaceholder(field as RegisterInputCustomItem)
}

// ---------------------------------------------------------------------------
// 欄位驗證
// ---------------------------------------------------------------------------
const validateSingleField = (field: RegisterInputCustomItem): boolean => {
  // confirm_password 特殊規則：必須與 password 相符
  if (field.column_name === "confirm_password") {
    const val = String(formData["confirm_password"] ?? "")
    if (!val.trim()) {
      formErrors["confirm_password"] = "此欄位為必填"
      return false
    }
    if (val !== formData["password"]) {
      formErrors["confirm_password"] = "與密碼不符，請確認"
      return false
    }
    formErrors["confirm_password"] = ""
    return true
  }

  const result = validateField({ value: formData[field.column_name], field })
  formErrors[field.column_name] = result.message
  return !result.invalid
}

const validatePhone = (): boolean => {
  if (!hasPhoneField.value) return true
  const ph = String(formData["phone"] ?? "").trim()
  if (!ph) {
    formErrors["phone"] = "請輸入電話號碼"
    return false
  }
  formErrors["phone"] = ""
  return true
}

const validateAll = (): boolean => {
  if (!registerInfoList.value) return false
  let valid = true

  if (hasPhoneField.value || hasCountryField.value) {
    if (!validatePhone()) valid = false
  }

  registerInfoList.value.forEach((field) => {
    if (field.column_name === "phone" || field.column_name === "country") return
    if (field.column_name === "sms_otp") {
      if (!String(formData["sms_otp"] ?? "").trim()) {
        formErrors["sms_otp"] = "請輸入驗證碼"
        valid = false
      } else {
        formErrors["sms_otp"] = ""
      }
      return
    }
    if (field.type === FIELD_TYPE_ENUMS.INPUT) {
      if (!validateSingleField(field)) valid = false
    } else if (field.type === FIELD_TYPE_ENUMS.SELECT || field.type === FIELD_TYPE_ENUMS.DATE) {
      if (field.required && !formData[field.column_name]) {
        formErrors[field.column_name] = "此欄位為必填"
        valid = false
      } else {
        formErrors[field.column_name] = ""
      }
    }
  })

  return valid
}

const handleSubmit = () => {
  handleGlobalClick({
    target: "handleRegisterFormSubmitClick",
    debounceTimer: 300,
    callback: () => {
      if (!validateAll()) return
      emit("submit", { ...formData })
    }
  })
}

// OTP 發送成功 Toast
const { pushToast } = useToastQueue()
const handleOtpSent = () => {
  pushToast({
    severity: TOAST_SEVERITY_ENUMS.SUCCESS,
    summary: "OTP Sent",
    detail: "Verification code has been sent.",
    life: 2000
  })
}

const handleDynamicFieldUpdate = ({ key, value }: { key: string; value: unknown }) => {
  formData[key] = value as never
}

const handleDynamicFieldClearError = (key: string) => {
  formErrors[key] = ""
}
</script>

<template>
  <div class="space-y-4">
    <template v-if="isLoading">
      <div class="text-center py-8 text-[var(--text-text-primary)]">Loading...</div>
    </template>

    <template v-else-if="registerInfoList && registerInfoList.length">
      <DynamicFields
        :fields="registerInfoList"
        :form-data="formData"
        :form-errors="formErrors"
        :phone-field="phoneField"
        :country-field="countryField"
        :has-phone-field="hasPhoneField"
        :has-country-field="hasCountryField"
        :phone-group-anchor="phoneGroupAnchor"
        :should-skip-field="shouldSkipField"
        :show-sms-otp="true"
        :sms-otp-request-type="SMS_OTP_TYPE_ENUMS.REGISTER"
        :sms-otp-countdown-key="REGISTER_SMS_OTP_COUNTDOWN_END_TIME"
        sms-otp-label="Verify code"
        sms-otp-placeholder="請輸入..."
        :input-placeholder-resolver="resolveInputPlaceholder"
        @update-field="handleDynamicFieldUpdate"
        @clear-error="handleDynamicFieldClearError"
        @otp-sent="handleOtpSent"
      />
    </template>

    <BaseBtn class="w-full" size="xl" @click="handleSubmit"> Create Account </BaseBtn>
  </div>
</template>
