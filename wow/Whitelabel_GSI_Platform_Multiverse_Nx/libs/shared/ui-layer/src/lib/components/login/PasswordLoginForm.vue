<script setup lang="ts">
// SMS 模式的密碼登入表單（對應路由 /login/phone）
// 顯示：手機號碼 + 密碼，可切換回 /login 改用 OTP 驗證碼登入

const countryCode = defineModel<string>("countryCode", { default: "" })
const phoneNumber = defineModel<string>("phoneNumber", { default: "" })
const password = defineModel<string>("password", { default: "" })

const emit = defineEmits(["switch-to-sms"])

const handleSwitchToSms = () => {
  handleGlobalClick({
    target: "handlePasswordLoginSwitchToSmsClick",
    debounceTimer: 200,
    callback: () => {
      emit("switch-to-sms")
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

    <BaseInput v-model="password" label="Password" type="password" required placeholder="請輸入..." />

    <div :class="cx(FLEX_END_CENTER, 'w-full')">
      <ForgotPasswordBtn />
    </div>

    <div class="w-full">
      <BaseBtn class="w-full" category="outline" size="xl" @click="handleSwitchToSms"> SMS Login </BaseBtn>
    </div>
  </div>
</template>
