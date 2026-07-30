<script setup lang="ts">
import { INPUT_TYPE_ENUMS } from "@shared-lib/constants/enums/inputType"
import { SMS_OTP_TYPE_ENUMS } from "@shared-lib/constants/enums/smsOtpType"

interface DynamicFieldItem {
  column_name: string
  type: number
  required: boolean
  values?: Array<{ label: string; value: string | number }>
  lang?: {
    en?: string
    EN?: string
  } & Record<string, string>
  edit?: boolean
}

type FieldLabelMap = {
  country?: string
  phone?: string
} & Record<string, string>

type FormErrors = {
  phone?: string
  country?: string
  sms_otp?: string
} & Record<string, string>

interface Props {
  fields: DynamicFieldItem[]
  formData: Record<string, unknown>
  formErrors: FormErrors
  phoneField?: DynamicFieldItem
  countryField?: DynamicFieldItem
  hasPhoneField: boolean
  hasCountryField: boolean
  phoneGroupAnchor: DynamicFieldItem | null
  shouldSkipField: (field: DynamicFieldItem) => boolean
  fieldLabelMap?: FieldLabelMap
  registerInfoType?: string
  showSmsOtp?: boolean
  smsOtpRequestType?: SMS_OTP_TYPE_ENUMS
  smsOtpCountdownKey?: string
  smsOtpLabel?: string
  smsOtpPlaceholder?: string
  disableByEdit?: boolean
  inputPlaceholderResolver?: (field: DynamicFieldItem) => string
}

const props = withDefaults(defineProps<Props>(), {
  phoneField: undefined,
  countryField: undefined,
  fieldLabelMap: () => ({}),
  registerInfoType: "register",
  showSmsOtp: false,
  smsOtpRequestType: SMS_OTP_TYPE_ENUMS.REGISTER,
  smsOtpCountdownKey: "",
  smsOtpLabel: "Verify code",
  smsOtpPlaceholder: "請輸入...",
  disableByEdit: false,
  inputPlaceholderResolver: () => "請輸入..."
})

const emit = defineEmits<{
  updateField: [payload: { key: string; value: unknown }]
  clearError: [key: string]
  otpSent: []
}>()

const { currentLocale } = useLanguage()

const normalizeLocaleCode = (code: string) => code.toLowerCase().replace("_", "-")

const resolveLocalizedFieldLabel = (field?: DynamicFieldItem): string | undefined => {
  if (!field) return undefined
  const langMap = field.lang ?? {}
  const localeCode = normalizeLocaleCode(String(currentLocale.value || "en"))

  const exact = Object.entries(langMap).find(([key]) => normalizeLocaleCode(key) === localeCode)?.[1]
  if (exact) return exact

  const localePrefix = localeCode.split("-")[0]
  const partial = Object.entries(langMap).find(([key]) => normalizeLocaleCode(key).startsWith(localePrefix))?.[1]
  if (partial) return partial

  return langMap.en || langMap.EN
}

const resolveFieldLabel = (field: DynamicFieldItem) => {
  return props.fieldLabelMap?.[field.column_name] || resolveLocalizedFieldLabel(field) || field.column_name
}

const resolvePhoneGroupLabel = () => {
  const countryLabel = props.fieldLabelMap.country || resolveLocalizedFieldLabel(props.countryField)
  const phoneLabel = props.fieldLabelMap.phone || resolveLocalizedFieldLabel(props.phoneField)

  return `${countryLabel || "Country"} / ${phoneLabel || "Mobile"}`
}

const toTextValue = (value: unknown): string | number | undefined => {
  if (typeof value === "string" || typeof value === "number") return value
  return undefined
}

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value === "string") return value
  if (typeof value === "number") return String(value)
  return undefined
}

const toDateValue = (value: unknown): string | string[] | null => {
  if (typeof value === "string") return value
  if (Array.isArray(value)) return value.map((item) => String(item))
  return null
}

const updateField = (key: string, value: unknown) => {
  emit("updateField", { key, value })
}

const clearError = (key: string) => {
  emit("clearError", key)
}

const isDisabledField = (field: DynamicFieldItem) => props.disableByEdit && field.edit === false
</script>

<template>
  <template v-for="field in props.fields" :key="field.column_name">
    <BasePhoneInput
      v-if="field === props.phoneGroupAnchor && (props.hasPhoneField || props.hasCountryField)"
      :country-code="toTextValue(props.formData['country'])"
      :phone-number="toTextValue(props.formData['phone'])"
      :options="(props.countryField?.values as any[]) || []"
      :register-info-type="props.registerInfoType"
      :show-country="props.hasCountryField"
      :show-phone="props.hasPhoneField"
      :label="resolvePhoneGroupLabel()"
      :required="props.phoneField?.required || props.countryField?.required"
      placeholder="請輸入..."
      :invalid="Boolean(props.formErrors.phone)"
      :error-message="props.formErrors.phone"
      :disabled="isDisabledField(field)"
      @update:country-code="
        (value) => {
          updateField('country', value)
          clearError('country')
        }
      "
      @update:phone-number="
        (value) => {
          updateField('phone', value)
          clearError('phone')
        }
      "
    />

    <template v-else-if="props.shouldSkipField(field)" />

    <BaseSMSOTPInput
      v-else-if="props.showSmsOtp && field.column_name === 'sms_otp'"
      :model-value="toStringValue(props.formData['sms_otp'])"
      :label="props.smsOtpLabel"
      :required="field.required"
      :placeholder="props.smsOtpPlaceholder"
      :country-code="toTextValue(props.formData['country'])"
      :phone-number="toTextValue(props.formData['phone'])"
      :request-type="props.smsOtpRequestType"
      :countdown-key="props.smsOtpCountdownKey"
      :invalid="Boolean(props.formErrors['sms_otp'])"
      :error-message="props.formErrors['sms_otp']"
      :disabled="isDisabledField(field)"
      @otp-sent="emit('otpSent')"
      @update:model-value="
        (value) => {
          updateField('sms_otp', value)
          clearError('sms_otp')
        }
      "
    />

    <BaseDatePicker
      v-else-if="field.type === INPUT_TYPE_ENUMS.DATE"
      :model-value="toDateValue(props.formData[field.column_name])"
      :label="resolveFieldLabel(field)"
      :required="field.required"
      placeholder="請選擇..."
      :invalid="Boolean(props.formErrors[field.column_name])"
      :error-message="props.formErrors[field.column_name]"
      :disabled="isDisabledField(field)"
      @update:model-value="
        (value) => {
          updateField(field.column_name, value)
          clearError(field.column_name)
        }
      "
    />

    <BaseSelect
      v-else-if="field.type === INPUT_TYPE_ENUMS.SELECT"
      :model-value="props.formData[field.column_name]"
      :label="resolveFieldLabel(field)"
      :required="field.required"
      :options="field.values || []"
      option-label="label"
      option-value="value"
      placeholder="請選擇..."
      :invalid="Boolean(props.formErrors[field.column_name])"
      :error-message="props.formErrors[field.column_name]"
      :disabled="isDisabledField(field)"
      @update:model-value="
        (value) => {
          updateField(field.column_name, value)
          clearError(field.column_name)
        }
      "
    />

    <BaseCheckBox
      v-else-if="field.type === INPUT_TYPE_ENUMS.CHECKBOX"
      :model-value="Boolean(props.formData[field.column_name])"
      :label="resolveFieldLabel(field)"
      :disabled="isDisabledField(field)"
      @update:model-value="
        (value) => {
          updateField(field.column_name, value)
          clearError(field.column_name)
        }
      "
    />

    <BaseInput
      v-else
      :model-value="toTextValue(props.formData[field.column_name])"
      :type="field.column_name === 'password' || field.column_name === 'confirm_password' ? 'password' : 'text'"
      :label="resolveFieldLabel(field)"
      :required="field.required"
      :placeholder="props.inputPlaceholderResolver(field)"
      :invalid="Boolean(props.formErrors[field.column_name])"
      :error-message="props.formErrors[field.column_name]"
      :disabled="isDisabledField(field)"
      @update:model-value="
        (value) => {
          updateField(field.column_name, value)
          clearError(field.column_name)
        }
      "
    />
  </template>
</template>
