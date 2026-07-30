<script setup lang="ts">
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
const handleGoForgotPassword = () => {
  handleGlobalClick({
    target: "handleForgotPasswordBtnNavigateToForgotPasswordRouteClick",
    debounceTimer: 250,
    callback: async () => {
      await navigateTo(ROUTE_PATH.FORGOT_PASSWORD)
    }
  })
}
</script>

<template>
  <BasePlainBtn
    :class-obj="{ button: 'text-[var(--dialog-dialog-title-content)] text-sm leading-5' }"
    @click="handleGoForgotPassword"
  >
    Forgot Password?
  </BasePlainBtn>
</template>
