<template>
  <div class="login-form-wrapper">
    <q-form @submit.prevent="login" autocomplete="new-password">
      <div v-if="isLoginOtpEnabled" class="mb-[10px]">
        <q-btn-toggle
          v-model="loginData.login_method"
          flat
          :options="[
            { label: $t('common.btn.password'), value: LOGIN_METHOD.Enums.Password },
            { label: $t('common.btn.smsOtp'), value: LOGIN_METHOD.Enums.Sms }
          ]"
        />
      </div>
      <div v-if="showPhoneLoginLayout" class="phone-login">
        <div v-if="isSmsLogin" class="phone-account">
          <div class="field-input">
            <q-select
              v-model="loginData.country"
              class="input-control form-control"
              dense
              borderless
              emit-value
              map-options
              option-value="value"
              option-label="label"
              :options="loginCountrySelectOptions"
              :label="$t('member.register.country')"
              :rules="[Rules.noRule]"
              color="black"
            />
          </div>
        </div>
        <!-- Phone Account -->
        <div class="phone-account">
          <div class="field-input">
            <q-input
              ref="phoneRef"
              v-model="loginData.username"
              :label="$t('placeholder.phoneNumber')"
              class="input-control form-control"
              dense
              borderless
              lazy-rules
              :rules="[Rules.noRule]"
              unmasked-value
              color="black"
              autocomplete="phone-number"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="field-input">
          <q-input
            v-model="loginData.username"
            :label="$t('placeholder.pleaseEnterUsername')"
            class="input-control form-control"
            dense
            borderless
            lazy-rules
            color="black"
            :rules="[(val) => Rules.account(val)]"
            autocomplete="username"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-user" class="field-icon" />
            </template>
          </q-input>
        </div>
      </div>
      <!-- Password -->
      <div v-if="loginData.login_method === LOGIN_METHOD.Enums.Password">
        <div class="field-input">
          <q-input
            v-model="loginData.password"
            :label="$t('placeholder.pleaseEnterPassword')"
            :type="isPasswordVisible ? 'text' : 'password'"
            class="input-control form-control"
            dense
            borderless
            lazy-rules
            color="black"
            :rules="[(val) => Rules.password(val)]"
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-lock" class="field-icon" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
                class="cursor-pointer field-icon"
                @click="isPasswordVisible = !isPasswordVisible"
              />
            </template>
          </q-input>
        </div>
      </div>
      <!-- OTP -->
      <div v-else-if="isLoginOtpEnabled" class="input-area">
        <div class="field-input">
          <div class="flex w-full">
            <q-input
              type="password"
              class="input-control"
              v-model="loginData.sms_otp"
              :label="$t('placeholder.enterOTP')"
              dense
              borderless
              lazy-rules
              autocomplete="otp-password"
              color="black"
              :rules="[Rules.required()]"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="opt-btn" :disable="!loginData.username || counting" @click="getOtpCode">
            <span>{{ $t("common.btn.otp") }}</span>
          </button>
          <vue-countdown
            @end="counting = false"
            v-if="counting"
            :time="180000"
            v-slot="{ totalSeconds }"
            class="counting-text"
            >{{ `${ totalSeconds }s` }}</vue-countdown
          >
        </div>
      </div>
      <!-- Forgot Password -->
      <div class="btn-forgot-password">
        <span class="forgot-text" @click="emit('switchView', 'forgotPassword')">
          {{ $t("member.forgotPassword.forgotPassword") }}
        </span>
      </div>
      <!-- Submit -->
      <div>
        <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.login") }}</q-btn>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, SMS_OTP_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { isPhoneRegisterMode, isLoginOtpEnabled, defaultCountryCode } = useEnv()
const envInfoStore = useEnvInfoStore()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const { isLoading, handleLogin, handleGetOTP, handleRegisterCustomInput, auth } = useAuth()
const phoneRef = ref()
const counting = ref(false)
const isPasswordVisible = ref(false)
const eventbus = injectStrict(EventBusKey)
type DialSelectOption = { label: string; value: string }
const loginData = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  country: defaultCountryCode.value,
  username: "",
  password: "",
  sms_otp: "" })
const loginCountrySelectOptions = ref<DialSelectOption[]>([])
const emit = defineEmits<{ (e: "switchView", view: string): void }>()
const isSmsLogin = computed(() => loginData.login_method === LOGIN_METHOD.Enums.Sms)
const showPhoneLoginLayout = computed(() => isPhoneRegisterMode.value || isSmsLogin.value)

function normalizeDialSelectOptions(values: unknown): DialSelectOption[] {
  if (!Array.isArray(values) || values.length === 0) return []
  return values.map((item) => {
    if (item != null && typeof item === "object" && "value" in item) {
      const raw = item as { label?: string; value: string | number }
      const value = String(raw.value)
      const label = raw.label != null && String(raw.label) !== "" ? String(raw.label) : value
      return { label, value }
    }
    const value = String(item)
    return { label: value, value }
  })
}

async function loadLoginCountryOptions() {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  const countryColumn = (data || []).find((column: Response.RegistInputCustom) => column.column_name === "country")
  const fromCms = normalizeDialSelectOptions(countryColumn?.values)

  if (fromCms.length > 0) {
    loginCountrySelectOptions.value = fromCms
    return
  }

  loginCountrySelectOptions.value = (envInfoStore.envInfo.international_calling_code || []).map((dialCode) => {
    const value = String(dialCode)
    return { label: value, value }
  })
}

const getOtpCode = async () => {
  phoneRef.value.validate()

  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.phoneFormatError"),
      position: "top" })
  }
  counting.value = true
  const smsCountry = loginData.country || defaultCountryCode.value
  const { status } = await handleGetOTP({
    phone: loginData.username,
    country_code: smsCountry,
    request_type: SMS_OTP_TYPE.Enums.Login })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top" })
  }
}

const login = async () => {
  const payload: Request.login = {
    login_method: loginData.login_method,
    username: loginData.username }
  if (loginData.login_method === LOGIN_METHOD.Enums.Password) { payload.password = loginData.password }
  if (isLoginOtpEnabled.value && loginData.login_method === LOGIN_METHOD.Enums.Sms) {
    payload.sms_otp = loginData.sms_otp
    payload.country = loginData.country || defaultCountryCode.value
  }

  const { status } = await handleLogin(payload)

  if (!status) { return }

  if (auth.value.access_token) {
    await getUserWalletList()

    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000 })
    router.push({ name: "Home" })
    closeDialog()
  }
}

const closeDialog = () => { eventbus.emit("openLoginWithRegister", false) }

onMounted(() => { void loadLoginCountryOptions() })

watch(
  () => loginData.login_method,
  () => {
    loginData.password = ""
    loginData.sms_otp = ""
  },
  { immediate: true }
)

watch(
  defaultCountryCode,
  (code) => {
    if (code && !loginData.country) { loginData.country = code }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_ed3/assets/css/_variable.scss";
@import "app/template/set_ed3/assets/css/form.scss";

.btn-forgot-password {
  .forgot-text {
    @apply text-[.875rem] cursor-pointer;
    border-bottom: 1px solid $text01;
    color: $input-text-color;
  }
}

.phone-login {
  :deep(.text-primary) { color: $secondary-color !important; }
}

.opt-btn {
  @apply rounded-[.625rem] p-1 px-2 text-white;
  background: $secondary-color;
}

.input-control {
  :deep(.q-field__control-container) { @apply flex items-center justify-center; }
  :deep(.q-field__native) {
    height: calc(100% - 6px);
    min-height: initial !important;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      /* --- 關鍵：停用 Quasar 的自動填入偵測動畫 --- */
      -webkit-animation-name: none !important;
      animation-name: none !important;

      /* 除了內陰影，強行把 background 設為透明 */
      background-color: transparent !important;
      background-image: none !important;

      // 使用巨大的內陰影覆蓋背景色
      -webkit-box-shadow: 0 0 0px 1000px $green03 inset !important;
      box-shadow: 0 0 0px 1000px $green03 inset !important;
      // 強制文字顏色（例如白色）
      -webkit-text-fill-color: $common-white-color !important;

      // --- 關鍵修復：處理左右出現的邊框 ---
      border-radius: 0 !important;
      border: none !important;
      outline: none !important;

      /* 阻止樣式跳轉 */
      transition: background-color 5000s ease-in-out 0s;
    }
  }
}
</style>
