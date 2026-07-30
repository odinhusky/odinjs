<script setup lang="ts">
interface Props {
  countryCode: string
  phone: string
  smsOtp: string
  countryCodeError?: string
  phoneError?: string
  smsOtpError?: string
  otpCountdownKey: string
}

const props = withDefaults(defineProps<Props>(), {
  countryCodeError: "",
  phoneError: "",
  smsOtpError: ""
})

const emit = defineEmits<{
  "update:countryCode": [value: string]
  "update:phone": [value: string]
  "update:smsOtp": [value: string]
  "otp-sent": []
}>()
</script>

<template>
  <div :class="cx(FLEX_COL, 'gap-4')">
    <BasePhoneInput
      :country-code="props.countryCode"
      :phone-number="props.phone"
      label="手機號碼"
      required
      placeholder="請輸入 ..."
      :invalid="!!props.countryCodeError || !!props.phoneError"
      :error-message="props.phoneError || props.countryCodeError"
      @update:country-code="emit('update:countryCode', String($event ?? ''))"
      @update:phone-number="emit('update:phone', String($event ?? ''))"
    />

    <BaseSMSOTPInput
      :model-value="props.smsOtp"
      label="驗證碼"
      required
      placeholder="請輸入 ..."
      :country-code="props.countryCode"
      :phone-number="props.phone"
      :request-type="SMS_OTP_TYPE_ENUMS.FORGOT_PASSWORD"
      :countdown-key="props.otpCountdownKey"
      :invalid="!!props.smsOtpError"
      :error-message="props.smsOtpError"
      @update:model-value="emit('update:smsOtp', $event as string)"
      @otp-sent="emit('otp-sent')"
    />
  </div>
</template>
