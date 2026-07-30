<script setup lang="ts">
import { computed } from "vue"
import BaseInput from "@shared-lib/components/base/BaseInput.vue"
import BaseBtn from "@shared-lib/components/base/BaseBtn.vue"
import { useGetOptCode } from "@shared-lib/api/hooks/useGetOTPCode"
import { useCountdownMemo } from "@shared-lib/composables/useCountdownMemo"
import { SMS_OTP_TYPE_ENUMS } from "@shared-lib/constants/enums/smsOtpType"
import type { ApiResponse } from "@shared-lib/api/types"
import type { GetOTPResponseType } from "@shared-lib/api/apiFunctions/auth_getOTP"

interface Props {
  modelValue?: string
  // 用來發送 OTP 的電話資訊
  countryCode?: string | number
  phoneNumber?: string | number
  // 通用欄位設定
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  errorMessage?: string
  // OTP 設定
  requestType?: SMS_OTP_TYPE_ENUMS
  // 💡 localStorage key，確保同頁多個倒數計時器不衝突
  countdownKey?: string
  classObj?: {
    root?: string // 最外層整行容器
    input?: string // 驗證碼輸入框
    button?: string // 取得驗證碼按鈕
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  requestType: SMS_OTP_TYPE_ENUMS.REGISTER,
  countdownKey: LOGIN_SMS_OTP_COUNTDOWN_END_TIME,
  required: false,
  disabled: false,
  invalid: false,
  classObj: () => ({})
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
  // 💡 OTP 發送成功，父層可自行決定是否顯示 Toast
  "otp-sent": [response: ApiResponse<GetOTPResponseType>]
  "otp-error": [error: Error]
}>()

const { getOTPCode, isPending: isGettingOtp } = useGetOptCode({
  onSuccess: async (response) => {
    emit("otp-sent", response)
  },
  onError: async (error) => {
    emit("otp-error", error)
  }
})

// 💡 countdownKey 在元件掛載時固定，不支援動態切換
const { start, remainingSeconds } = useCountdownMemo({
  key: props.countdownKey,
  time: 90
})

const isGetCodeDisabled = computed(() => {
  return isGettingOtp.value || remainingSeconds.value > 0 || !props.countryCode || !props.phoneNumber || props.disabled
})

const handleGetCode = async () => {
  if (isGetCodeDisabled.value) return

  await getOTPCode({
    phone_number: String(props.phoneNumber),
    country_code: String(props.countryCode),
    request_type: props.requestType
  })

  start()
}
</script>

<template>
  <div :class="cx('flex gap-2 items-start', props.classObj?.root)">
    <BaseInput
      :model-value="modelValue"
      :label="label"
      :placeholder="placeholder ?? '請輸入...'"
      :required="required"
      :disabled="disabled"
      :invalid="invalid"
      :error-message="errorMessage"
      :class-obj="{ root: cx('flex-1', props.classObj?.input) }"
      @update:model-value="emit('update:modelValue', $event as string)"
    />

    <BaseBtn
      :class="cx('h-[46px] whitespace-nowrap flex-shrink-0 self-start', label && 'mt-6', props.classObj?.button)"
      :disabled="isGetCodeDisabled"
      :loading="isGettingOtp"
      @click="handleGetCode"
    >
      {{ remainingSeconds > 0 ? `${remainingSeconds}s` : "Get code" }}
    </BaseBtn>
  </div>
</template>
