<script setup lang="ts">
const { form, hasSubmitted, validationErrors, isResetPassPending, submitResetPass } = useForgotPassChangePass()

const { t } = useI18n()
const pageTitle = computed(() => t("common.change_password"))

const handleSubmit = () => {
  handleGlobalClick({
    target: "handleForgotPassTokenResetSubmitClick",
    debounceTimer: 250,
    callback: async () => {
      await submitResetPass()
    }
  })
}
</script>

<template>
  <MemberContainer :title="pageTitle" :subtitle="''" :show-aside="false" @back="() => {}">
    <PasswordChangePanel
      :password="form.password"
      :confirm-password="form.confirmPassword"
      :password-error="hasSubmitted ? validationErrors.password : ''"
      :confirm-password-error="hasSubmitted ? validationErrors.confirmPassword : ''"
      @update:password="form.password = $event"
      @update:confirm-password="form.confirmPassword = $event"
    />

    <template #actions>
      <BaseBtn class="w-full" size="xl" :loading="isResetPassPending" @click="handleSubmit"> 確定 </BaseBtn>
    </template>
  </MemberContainer>
</template>
