<script setup lang="ts">
import { ROUTE_PATH, toForgotPassTokenRoute } from "@shared-lib/constants/routePath"
const router = useRouter()
const authStore = useAuthStore()
const { prefetchPostLoginQueries } = usePostLoginBootstrap()
const { pushToast } = useToastQueue()

const visible = defineModel<boolean>("visible", { default: false })

const emit = defineEmits(["close"])

const handleGoLogin = () => {
  handleGlobalClick({
    target: "handleRegisterDialogNavigateToLoginRouteClick",
    debounceTimer: 250,
    callback: async () => {
      await router.push(ROUTE_PATH.LOGIN.PASSWORD)
    }
  })
}

const { register, isPending: isSubmitting } = useRegister({
  onSuccess: async (response: any) => {
    const data = response.data

    if (data?.need_change_password) {
      const resetToken = String(data?.access_token || "").trim()
      const resetAccount = String(data?.account || "").trim()
      authStore.clearAuth()
      emit("close")

      if (resetToken) {
        await router.push({
          path: toForgotPassTokenRoute(resetToken),
          query: resetAccount ? { account: resetAccount } : undefined
        })
      } else {
        await router.push(ROUTE_PATH.FORGOT_PASSWORD)
      }
      return
    }

    // 若回傳了 access_token 則直接登入
    if (data?.access_token) {
      authStore.setAuth(data as any)

      await prefetchPostLoginQueries()
    }

    pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "Register Success",
      detail: "Your account has been created!",
      life: 2000
    })

    emit("close")
  }
})

const handleFormSubmit = async (formData: Record<string, any>) => {
  if (isSubmitting.value) return
  await register({ is_customize: true, ...formData })
}
</script>

<template>
  <BaseDialog :visible="visible" @close="emit('close')">
    <template #header> Create an account </template>

    <div :class="cx(FLEX_COL, 'gap-5')">
      <ThirdPartyLoginSection />

      <RegisterForm v-if="visible" @submit="handleFormSubmit" />
    </div>

    <template #footer>
      <div :class="cx(FLEX_COL, 'gap-5')">
        <div :class="cx(FLEX_CENTER, 'gap-5')">
          <div class="text-sm leading-5 text-[var(--dialog-dialog-title-content)]">Already have an account?</div>

          <BaseBtn category="text" size="sm" @click="handleGoLogin"> Login </BaseBtn>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
