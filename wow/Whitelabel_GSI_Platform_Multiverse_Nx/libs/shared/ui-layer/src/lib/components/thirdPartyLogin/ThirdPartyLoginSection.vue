<script setup lang="ts">
const borderClass = cx("flex-1 h-[1px] bg-[var(--border-border-line)]")
const descriptionTextClass = cx("block text-sm leading-5 text-[var(--dialog-dialog-title-content)]")

const { isLoading: isGoogleLoading, isGoogleOAuthEnabled, handleGoogleLogin } = useGoogleOAuth()
const { isLoading: isTelegramLoading, isTelegramLoginEnabled, handleTelegramWebLogin } = useTelegramMiniApp()

const showThirdPartyLogin = computed(() => isGoogleOAuthEnabled.value || isTelegramLoginEnabled.value)

const onGoogleLogin = async () => {
  handleGlobalClick({
    target: "handleThirdPartyGoogleLoginClick",
    debounceTimer: 300,
    callback: async () => {
      await handleGoogleLogin()
    }
  })
}

const onTelegramLogin = async () => {
  handleGlobalClick({
    target: "handleThirdPartyTelegramLoginClick",
    debounceTimer: 300,
    callback: async () => {
      await handleTelegramWebLogin()
    }
  })
}
</script>

<template>
  <div v-if="showThirdPartyLogin" class="flex flex-col items-center gap-4">
    <div class="flex gap-4">
      <!-- Google Login Button -->
      <ThirdPartyLoginIconBtn
        v-if="isGoogleOAuthEnabled"
        icon-name="logos:google-icon"
        :disabled="isGoogleLoading"
        @click="onGoogleLogin"
      />

      <!-- Telegram Login Button -->
      <ThirdPartyLoginIconBtn
        v-if="isTelegramLoginEnabled"
        icon-name="logos:telegram"
        :disabled="isTelegramLoading"
        @click="onTelegramLogin"
      />
    </div>

    <span :class="descriptionTextClass">使用三方登入，請前往會員中心綁定個人資料，以維護您的帳號安全</span>

    <div :class="cx(FLEX_ITEMS_CENTER, 'w-full gap-[14px]')">
      <div :class="borderClass" />

      <span class="text-xs text-white/60 whitespace-nowrap">Or Continue With</span>

      <div :class="borderClass" />
    </div>
  </div>
</template>
