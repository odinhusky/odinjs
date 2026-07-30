<template>
  <div class="reg-area">
    <div class="back-btn-container"><BackBtn /></div>
    <div class="con-info">
      <div class="con">
        <div class="title">{{ $t("menu.login") }}</div>
        <div class="form-validation">
          <q-form class="modal-form px-4" @submit.prevent="login">
            <!-- login method toggle -->
            <div v-if="isLoginOtpEnabled" class="input-area flex-row">
              <label class="field-label" for="PrimaryLoginCred">{{ $t("member.login.loginType") }}</label>
              <div class="field-input">
                <q-btn-toggle
                  class="login-method-toggle"
                  v-model="loginData.login_method"
                  toggle-color="primary"
                  flat
                  :options="[
                    { label: $t('common.btn.password'), value: LOGIN_METHOD.Enums.Password },
                    ...(isLoginOtpEnabled ? [{ label: $t('common.btn.smsOtp'), value: LOGIN_METHOD.Enums.Sms }] : [])
                  ]"
                />
              </div>
            </div>
            <!-- account -->
            <div class="input-area flex-row">
              <template v-if="showPhoneLoginLayout">
                <label class="field-label" for="">{{ $t("member.login.phone") }}</label>
                <div class="field-input flex flex-nowrap gap-2">
                  <q-select
                    ref="countryCodeRef"
                    bg-color="white"
                    v-model="otpData.country_code"
                    :options="loginCountrySelectOptions"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    class="form-style flex-[1]"
                    lazy-rules
                    :rules="[Rules.required()]"
                    outlined
                    clearable
                    dense
                    :display-value="otpData.country_code ? undefined : $t('member.register.country')"
                    no-error-icon
                  />
                  <q-input
                    ref="phoneRef"
                    bg-color="white"
                    v-model="loginData.phone"
                    outlined
                    :placeholder="$t('member.register.phone')"
                    class="input-control form-style flex-[2]"
                    lazy-rules
                    :rules="[Rules.required()]"
                    unmasked-value
                  />
                </div>
              </template>
              <template v-else>
                <label class="field-label" for="">{{ $t("member.login.username") }}</label>
                <div class="field-input">
                  <q-input
                    bg-color="white"
                    v-model="loginData.username"
                    outlined
                    :placeholder="$t('placeholder.pleaseEnterUsername')"
                    class="input-control form-style"
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </template>
            </div>
            <!-- passowrd -->
            <div v-if="loginData.login_method === LOGIN_METHOD.Enums.Password" class="input-area flex-row">
              <label class="field-label" for="">{{ $t("member.login.password") }}</label>
              <div class="field-input">
                <q-input
                  bg-color="white"
                  outlined
                  v-model="loginData.password"
                  :placeholder="$t('placeholder.pleaseEnterPassword')"
                  class="input-control form-style"
                  type="password"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- otp -->
            <div v-else-if="isLoginOtpEnabled" class="input-area flex-row">
              <label class="field-label" for="Password">OTP</label>
              <div class="field-input">
                <div class="inner-flex relative">
                  <div class="relative flex flex-nowrap items-center gap-2">
                    <q-input
                      bg-color="white"
                      outlined
                      class="input-control form-style"
                      v-model="loginData.sms_otp"
                      :placeholder="$t('placeholder.enterOTP')"
                      lazy-rules
                      :rules="[Rules.required()]"
                    >
                      <vue-countdown
                        @end="counting = false"
                        :time="180000"
                        v-if="counting"
                        v-slot="{ totalSeconds }"
                        class="counting-text"
                      >
                        {{ `${ totalSeconds }s` }}
                      </vue-countdown>
                    </q-input>

                    <q-btn
                      id="btn-otp"
                      class="btn-submit"
                      :disable="!loginData.phone || !otpData.country_code || counting"
                      @click="getOtpCode"
                    >
                      {{ $t("common.btn.otp") }}</q-btn
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- register now -->
            <div v-if="isCash" class="login-mark">
              <span class="input-text">
                {{ $t("member.login.unAccount") }} &nbsp;
                <router-link :to="{ name: 'Register' }">{{ $t("member.login.regsiterNow") }}</router-link>
              </span>
            </div>
            <!-- forgot pass -->
            <div v-if="isCash" class="login-mark">
              <span class="input-text">
                <router-link :to="{ name: 'ForgotPass' }" class="btn-for">
                  {{ $t("member.login.forgotPassword") }}
                </router-link>
              </span>
            </div>
            <!-- submit -->
            <div class="input-area">
              <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.login") }}</q-btn>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, SMS_OTP_TYPE } from "src/common/utils/constants"
import { useEnvInfoStore } from "src/stores/envStore"
import { computed, onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

type DialSelectOption = {
  label: string
  value: string
}

function normalizeDialSelectOptions(values: unknown): DialSelectOption[] {
  if (!Array.isArray(values) || values.length === 0) {
    return []
  }

  return values.map((item) => {
    if (item != null && typeof item === "object" && "value" in item) {
      const raw = item as { label?: string | number; value: string | number }
      const value = String(raw.value)
      const label = raw.label != null && String(raw.label) !== "" ? String(raw.label) : value

      return { label, value }
    }

    const value = String(item)

    return { label: value, value }
  })
}

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()

const { isLoading, handleLogin, handleGetOTP, auth } = useAuth()
const router = useRouter()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const { isPhoneRegisterMode, isCash, isLoginOtpEnabled } = useEnv()
const envInfoStore = useEnvInfoStore()

const loginCountrySelectOptions = computed((): DialSelectOption[] => {
  return normalizeDialSelectOptions(envInfoStore.envInfo.international_calling_code || [])
})

const countryCodeRef = ref()
const phoneRef = ref()
const counting = ref(false)

let loginData = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: "",
  sms_otp: "",
  phone: "" })

const otpData = reactive<Request.GetOTP>({
  phone_number: "",
  country_code: "",
  request_type: SMS_OTP_TYPE.Enums.Login })
const isSmsLogin = computed(() => loginData.login_method === LOGIN_METHOD.Enums.Sms)
const showPhoneLoginLayout = computed(() => isPhoneRegisterMode.value || isSmsLogin.value)

async function getOtpCode() {
  countryCodeRef.value.validate()
  phoneRef.value.validate()

  if (countryCodeRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.mustNotBeEmpty"),
      position: "top" })
  }
  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.phoneFormatError"),
      position: "top" })
  }
  counting.value = true
  otpData.phone_number = loginData.phone as string
  const { status } = await handleGetOTP(otpData)
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top" })
  }
}

async function login() {
  const payload: Request.login = { login_method: loginData.login_method }

  if (showPhoneLoginLayout.value) {
    payload.phone = loginData.phone
    payload.country = otpData.country_code
  } else { payload.username = loginData.username }

  if (loginData.login_method === LOGIN_METHOD.Enums.Password) { payload.password = loginData.password }
  if (isLoginOtpEnabled.value && loginData.login_method === LOGIN_METHOD.Enums.Sms) { payload.sms_otp = loginData.sms_otp }

  const { status } = await handleLogin(payload)

  if (!status) { return }

  if (auth.value.access_token) {
    await getUserWalletList()

    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000 })
    router.push({ name: "HomePage" })
  }
}

watch(
  () => loginData.login_method,
  () => {
    loginData.password = ""
    loginData.sms_otp = ""
    loginData.phone = ""
    loginData.country = ""
    otpData.country_code = ""
  },
  { immediate: true }
)

onMounted(() => {
  if (isPhoneRegisterMode.value) { loginData.login_method = LOGIN_METHOD.Enums.Password }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set33_GREEN/assets/css/_variable.sass";
@import "app/template/set33_GREEN/assets/css/main.sass";

:deep(.q-field__messages) {
  color: #ed4014;
  font-size: 0.9vw;

  @include pad-width { font-size: 2vw; }

  @include iphone-width { font-size: 3.2vw; }
}

:deep(.q-field__marginal) { height: 38px; }

:deep(.q-field__control) {
  border-radius: 20px;
  height: 38px;

  .q-field__native {
    font-weight: 500;
    height: 38px;

    &:focus { color: rgba(28, 30, 34, 0.7); }

    @include iphone-width { font-size: 4vw; }
  }
}

:deep(.q-field__control) { min-height: 2.375rem !important; }

.login-method-toggle {
  :deep(.q-btn) {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 150px;
    padding: 6px 30px;
    border: 1px solid #0c103d;
    border-radius: 25px;
    background: #011b10;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
  }

  :deep(.q-btn::before) { box-shadow: none; }

  :deep(.q-focus-helper) { display: none; }

  :deep(.q-btn.bg-primary),
  :deep(.q-btn.text-primary),
  :deep(.q-btn.q-btn--active),
  :deep(.q-btn[aria-pressed="true"]),
  :deep(.q-btn:hover) {
    border: 1px solid #8cbe1c;
    background: linear-gradient(to bottom, rgba(169, 211, 32, 1) 0%, rgba(56, 131, 18, 1) 100%) !important;
    box-shadow: inset 0px 0px 5px #fff;
    color: #fff !important;
  }
}

.back-btn-container {
  min-width: 320px;
  width: 990px;
  margin-top: 1.25rem;
  margin-bottom: 0.625rem;

  @include pad-width { width: 100%; }
}

.form-validation {
  margin-top: 25px;
  min-width: 950px;

  .counting-text {
    text-align: center;
    height: 2.375rem;
    width: 5.625rem;
    margin-left: 0;
    font-size: 1rem;
    line-height: 2.375rem;
    white-space: nowrap;
    color: #000;
    opacity: 0.6;
  }

  #btn-otp {
    width: auto;
    min-height: auto;
    margin-left: 0;
    font-size: 1rem;
    line-height: 2.375rem;
    padding: 0px 16px;
    text-transform: none;
    white-space: nowrap;
  }

  @include pad-width { min-width: 100%; }

  @include iphone-width { min-width: 100%; }
}

.login-mark {
  margin-bottom: 20px;
  align-items: center;
  width: 100%;

  .input-text {
    margin-left: 23%;

    a {
      color: #ffcd00;
      text-decoration: underline;
      font-weight: bold;
    }

    @include pad-width {
      width: 100%;
      margin: 0px;
      text-align: center;
      font-size: 2vw;
      @include setFlex;
    }

    @include iphone-width {
      width: 100%;
      margin: 0px;
      text-align: center;
      font-size: 3.5vw;
      @include setFlex;
    }
  }

  label {
    font-size: 16px;
    width: 25%;

    @include pad-width { width: 100%; }

    @include iphone-width { min-width: 100%; }
  }
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
      -webkit-box-shadow: 0 0 0px 1000px $common-white-color inset !important;
      box-shadow: 0 0 0px 1000px $common-white-color inset !important;
      // 強制文字顏色（例如白色）
      // -webkit-text-fill-color: $common-white-color !important;

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
