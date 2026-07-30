<script setup lang="ts">
import { computed, watch } from "vue"
import { storeToRefs } from "pinia"
import { AUTH_ROUTE_GROUPS, ROUTE_PATH, toForgotPassTokenRoute } from "@shared-lib/constants/routePath"
import { POST_LOGIN_RETURN_ROUTE } from "@shared-lib/constants/sessionStorageKeys"
const route = useRoute()
const router = useRouter()

const visible = defineModel<boolean>("visible", { default: false })

const emit = defineEmits(["close"])

const loginStore = useLoginStore()
const { passwordForm, smsForm, phonePasswordForm } = storeToRefs(loginStore)
const { resetPasswordForm, resetSmsForm, resetPhonePasswordForm } = loginStore

const authStore = useAuthStore()
const postLoginReturnRoute = useSessionStorage<string>(POST_LOGIN_RETURN_ROUTE, "")
const { prefetchPostLoginQueries } = usePostLoginBootstrap()
const { pushToast } = useToastQueue()

const { registerInfoList, refetch: refetchRegisterInfo } = useGetRegisterInfo({
  params: { type: "register" },
  options: {
    enabled: false
  }
})

// 取得 registerMethod 設定，決定登入表單樣式
const { setting: registerMethod } = useSetting({
  selector: (s) => s.register_method
})

const LOGIN_DIALOG_MODE = {
  ACCOUNT: "account",
  PHONE_SMS: "phone-sms",
  PHONE_PASSWORD: "phone-password"
} as const

type LoginDialogMode = (typeof LOGIN_DIALOG_MODE)[keyof typeof LOGIN_DIALOG_MODE]

const getLoginDialogMode = (method: number | undefined, path: string): LoginDialogMode => {
  if (method === REGISTER_METHOD_ENUMS.ACCOUNT) return LOGIN_DIALOG_MODE.ACCOUNT
  return path === ROUTE_PATH.LOGIN.SMS ? LOGIN_DIALOG_MODE.PHONE_PASSWORD : LOGIN_DIALOG_MODE.PHONE_SMS
}

const currentMode = ref<LoginDialogMode>(getLoginDialogMode(registerMethod.value, route.path))

const isAgree = ref(false)
const guestOnlyRoutes = new Set<string>(AUTH_ROUTE_GROUPS.GUEST_ONLY_ROUTES)

const sanitizeInternalPath = (path: string) => {
  if (!path) return ""
  if (!path.startsWith("/")) return ""
  if (path.startsWith("//")) return ""
  return path
}

const isGuestOnlyFullPath = (fullPath: string) => {
  const [path] = fullPath.split("?")
  return guestOnlyRoutes.has(path || "")
}

const navigateAfterLogin = async () => {
  const saved = sanitizeInternalPath(postLoginReturnRoute.value)
  postLoginReturnRoute.value = ""

  if (!saved || isGuestOnlyFullPath(saved)) {
    await navigateTo(ROUTE_PATH.HOME, { replace: true })
    return
  }

  await navigateTo(saved, { replace: true })
}

const { login, isPending: isSubmitting } = useLogin({
  onSuccess: async (response) => {
    const loginData = response.data

    if (loginData?.need_change_password) {
      const resetToken = String(loginData?.access_token || "").trim()
      const resetAccount = String(loginData?.account || "").trim()
      authStore.clearAuth()

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

    if (loginData?.access_token) {
      authStore.setAuth(loginData)

      await prefetchPostLoginQueries()
    }

    pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "Login Success",
      detail: "Welcome back!",
      life: 2000
    })

    resetPasswordForm()
    resetSmsForm()
    resetPhonePasswordForm()

    await navigateAfterLogin()
  }
})

const descriptionTextClass = cx("block text-sm leading-5 text-[var(--dialog-dialog-title-content)]")

// 當 Dialog 打開時，補上預設國碼
const countryOptions = computed(() => {
  const countryField = registerInfoList.value?.find((item) => item.column_name === "country")
  return countryField?.values ?? []
})

watch(
  [registerMethod, () => route.path],
  ([method, path]) => {
    currentMode.value = getLoginDialogMode(method, path)
  },
  { immediate: true }
)

watch(
  visible,
  (isVisible) => {
    if (!isVisible) return

    if (!registerInfoList.value?.length) {
      refetchRegisterInfo()
    }

    if (!smsForm.value.countryCode && countryOptions.value.length > 0) {
      smsForm.value.countryCode = String(countryOptions.value[0].value)
    }
    if (!phonePasswordForm.value.countryCode && countryOptions.value.length > 0) {
      phonePasswordForm.value.countryCode = String(countryOptions.value[0].value)
    }
  },
  { immediate: true }
)

watch(
  countryOptions,
  (options) => {
    if (!visible.value || options.length === 0) return
    if (!smsForm.value.countryCode) {
      smsForm.value.countryCode = String(options[0].value)
    }
    if (!phonePasswordForm.value.countryCode) {
      phonePasswordForm.value.countryCode = String(options[0].value)
    }
  },
  { immediate: true }
)

const handleGoRegister = () => {
  handleGlobalClick({
    target: "handleLoginDialogNavigateToRegisterRouteClick",
    debounceTimer: 250,
    callback: async () => {
      await navigateTo(ROUTE_PATH.REGISTER)
    }
  })
}

const handleSwitchToPasswordLogin = () => {
  handleGlobalClick({
    target: "handleLoginDialogSwitchToPasswordLoginClick",
    debounceTimer: 200,
    callback: async () => {
      currentMode.value = LOGIN_DIALOG_MODE.PHONE_PASSWORD
      await router.push(ROUTE_PATH.LOGIN.SMS)
    }
  })
}

const handleSwitchToSmsLogin = () => {
  handleGlobalClick({
    target: "handleLoginDialogSwitchToSmsLoginClick",
    debounceTimer: 200,
    callback: async () => {
      currentMode.value = LOGIN_DIALOG_MODE.PHONE_SMS
      await router.push(ROUTE_PATH.LOGIN.PASSWORD)
    }
  })
}

const handleSubmit = async () => {
  if (!isAgree.value || isSubmitting.value) return

  if (currentMode.value === LOGIN_DIALOG_MODE.ACCOUNT) {
    await login({
      login_method: LOGIN_METHOD_ENUMS.PASSWORD,
      username: passwordForm.value.username,
      password: passwordForm.value.password
    })
  } else if (currentMode.value === LOGIN_DIALOG_MODE.PHONE_SMS) {
    await login({
      login_method: LOGIN_METHOD_ENUMS.SMS,
      phone: smsForm.value.phoneNumber,
      sms_otp: smsForm.value.verifyCode,
      country: smsForm.value.countryCode
    })
  } else {
    // phone-password
    await login({
      login_method: LOGIN_METHOD_ENUMS.PASSWORD,
      phone: phonePasswordForm.value.phoneNumber,
      password: phonePasswordForm.value.password,
      country: phonePasswordForm.value.countryCode
    })
  }
}

const handleSubmitClick = () => {
  handleGlobalClick({
    target: "handleLoginDialogSubmitClick",
    debounceTimer: 300,
    callback: async () => {
      await handleSubmit()
    }
  })
}
</script>

<template>
  <BaseDialog :visible="visible" @close="emit('close')">
    <template #header> Login </template>

    <div :class="cx(FLEX_COL, 'gap-5')">
      <ThirdPartyLoginSection />

      <transition name="fade" mode="out-in">
        <div :key="currentMode">
          <!-- ACCOUNT 模式：username + password，無切換按鈕 -->
          <UsernameLoginForm
            v-if="currentMode === LOGIN_DIALOG_MODE.ACCOUNT"
            v-model:username="passwordForm.username"
            v-model:password="passwordForm.password"
          />

          <!-- PHONE 模式 /login：手機 + OTP -->
          <SmsLoginForm
            v-else-if="currentMode === LOGIN_DIALOG_MODE.PHONE_SMS"
            v-model:country-code="smsForm.countryCode"
            v-model:phone-number="smsForm.phoneNumber"
            v-model:verify-code="smsForm.verifyCode"
            @switch-to-password="handleSwitchToPasswordLogin"
          />

          <!-- PHONE 模式 /login/phone：手機 + 密碼 -->
          <PasswordLoginForm
            v-else
            v-model:country-code="phonePasswordForm.countryCode"
            v-model:phone-number="phonePasswordForm.phoneNumber"
            v-model:password="phonePasswordForm.password"
            @switch-to-sms="handleSwitchToSmsLogin"
          />
        </div>
      </transition>

      <div :class="cx(FLEX_COL, 'gap-2')">
        <TermsAndConditions />

        <BaseCheckBox v-model="isAgree" label="I agree to the above terms and conditions" />
      </div>

      <div :class="cx(FLEX_COL, 'items-center gap-4')">
        <div :class="cx(FLEX_ITEMS_CENTER, 'gap-5')">
          <span :class="descriptionTextClass">Need help ?</span>

          <BaseBtn category="text" size="sm">
            <div :class="cx(FLEX_ITEMS_CENTER, 'gap-2')">
              <BaseIcon name="mingcute:service-fill" size="16px" />

              <span>Contact Us</span>
            </div>
          </BaseBtn>
        </div>

        <div>
          <BaseImage src="/images/login/login-game.png" :class-obj="{ image: cx('w-[80px]') }" />
        </div>
      </div>
    </div>

    <template #footer>
      <div :class="cx(FLEX_COL, 'gap-5')">
        <BaseBtn
          class="w-full"
          size="xl"
          :disabled="!isAgree || isSubmitting"
          :loading="isSubmitting"
          @click="handleSubmitClick"
        >
          Login
        </BaseBtn>

        <div :class="cx(FLEX_CENTER, 'gap-5')">
          <div class="text-sm leading-5 text-[var(--dialog-dialog-title-content)]">Don't have an account yet?</div>

          <BaseBtn category="text" size="sm" @click="handleGoRegister"> Registered Account </BaseBtn>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
