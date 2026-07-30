<script setup lang="ts">
// SMS 模式的預設登入表單（對應路由 /login）
// 顯示：手機號碼 + OTP 驗證碼，切換到 /login/phone 可改用密碼登入

const countryCode = defineModel<string>("countryCode", { default: "" })
const phoneNumber = defineModel<string>("phoneNumber", { default: "" })
const verifyCode = defineModel<string>("verifyCode", { default: "" })

const emit = defineEmits(["switch-to-password"])

const { pushToast } = useToastQueue()

const handleOtpSent = () => {
  pushToast({
    severity: TOAST_SEVERITY_ENUMS.SUCCESS,
    summary: "OTP Sent",
    detail: "Verification code has been sent successfully.",
    life: 2000
  })
}

const handleSwitchToPassword = () => {
  handleGlobalClick({
    target: "handleSmsLoginSwitchToPasswordClick",
    debounceTimer: 200,
    callback: () => {
      emit("switch-to-password")
    }
  })
}
</script>

<template>
  <div class="space-y-4">
    <BasePhoneInput
      v-model:country-code="countryCode"
      v-model:phone-number="phoneNumber"
      label="Phone Number"
      required
      placeholder="請輸入..."
    />

    <BaseSMSOTPInput
      v-model="verifyCode"
      label="Verify code"
      required
      placeholder="請輸入..."
      :country-code="countryCode"
      :phone-number="phoneNumber"
      :request-type="SMS_OTP_TYPE_ENUMS.LOGIN"
      :countdown-key="LOGIN_SMS_OTP_COUNTDOWN_END_TIME"
      @otp-sent="handleOtpSent"
    />

    <div :class="cx(FLEX_END_CENTER, 'w-full')">
      <ForgotPasswordBtn />
    </div>

    <div class="w-full">
      <BaseBtn class="w-full" category="outline" size="xl" @click="handleSwitchToPassword"> Password Login </BaseBtn>
    </div>
  </div>
</template>
