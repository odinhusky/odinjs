<script setup lang="ts">
import { type ForgotPassVerifyMethod, useForgotPass } from "@shared-lib/composables/useForgotPass"
const {
  activeMethod,
  mobileContentVisible,
  verifyMethods,
  shouldShowMethodMenu,
  isEmailMethod,
  emailForm,
  smsForm,
  emailErrors,
  smsErrors,
  hasSubmittedEmail,
  hasSubmittedSms,
  isForgotPassPending,
  isForgotPassSmsPending,
  otpCountdownKey,
  setActiveMethod,
  backToMethodMenu,
  submitEmailVerify,
  submitSmsVerify,
  notifyOtpSent
} = useForgotPass()

const { t } = useI18n()

const pageTitle = computed(() => t("menu.forgetPassword"))
const pageSubtitle = computed(() => {
  if (
    activeMethod.value === FORGOT_PASS_VERIFY_METHOD.EMAIL ||
    (activeMethod.value === FORGOT_PASS_VERIFY_METHOD.SMS && isEmailMethod.value)
  ) {
    return "重新設密碼，輸入您註冊的電子郵件地址以接收密碼重設連結。"
  } else if (activeMethod.value === FORGOT_PASS_VERIFY_METHOD.SMS) {
    return "重新設密碼，請輸入手機號碼以取得簡訊驗證碼。"
  }
})

const handleSelectMethod = (method: string) => {
  handleGlobalClick({
    target: `handleForgotPassMethod${method}Select`,
    debounceTimer: 200,
    callback: () => {
      setActiveMethod(method as ForgotPassVerifyMethod)
    }
  })
}

const handleBackToMenu = () => {
  handleGlobalClick({
    target: "handleForgotPassBackToMethodMenu",
    debounceTimer: 200,
    callback: () => {
      backToMethodMenu()
    }
  })
}

const handleSubmitEmail = () => {
  handleGlobalClick({
    target: "handleForgotPassSubmitEmailVerify",
    debounceTimer: 250,
    callback: async () => {
      await submitEmailVerify()
    }
  })
}

const handleSubmitSms = () => {
  handleGlobalClick({
    target: "handleForgotPassSubmitSmsVerify",
    debounceTimer: 250,
    callback: async () => {
      await submitSmsVerify()
    }
  })
}
</script>

<template>
  <MemberContainer
    :title="pageTitle"
    :subtitle="pageSubtitle"
    :show-aside="shouldShowMethodMenu"
    :mobile-content-visible="mobileContentVisible"
    @back="handleBackToMenu"
  >
    <template #aside>
      <MemberAsideInfo :actions="verifyMethods" :active-key="activeMethod" @select="handleSelectMethod" />
    </template>

    <ForgotPassEmailForm
      v-if="isEmailMethod"
      :account="emailForm.account"
      :email="emailForm.email"
      :account-error="hasSubmittedEmail ? emailErrors.account : ''"
      :email-error="hasSubmittedEmail ? emailErrors.email : ''"
      @update:account="emailForm.account = $event"
      @update:email="emailForm.email = $event"
    />

    <ForgotPassSmsForm
      v-else
      :country-code="smsForm.countryCode"
      :phone="smsForm.phone"
      :sms-otp="smsForm.smsOtp"
      :country-code-error="hasSubmittedSms ? smsErrors.countryCode : ''"
      :phone-error="hasSubmittedSms ? smsErrors.phone : ''"
      :sms-otp-error="hasSubmittedSms ? smsErrors.smsOtp : ''"
      :otp-countdown-key="otpCountdownKey"
      @update:country-code="smsForm.countryCode = $event"
      @update:phone="smsForm.phone = $event"
      @update:sms-otp="smsForm.smsOtp = $event"
      @otp-sent="notifyOtpSent"
    />

    <template #actions>
      <BaseBtn
        class="w-full"
        size="xl"
        :loading="isEmailMethod ? isForgotPassPending : isForgotPassSmsPending"
        @click="isEmailMethod ? handleSubmitEmail() : handleSubmitSms()"
      >
        確定
      </BaseBtn>
    </template>
  </MemberContainer>
</template>
