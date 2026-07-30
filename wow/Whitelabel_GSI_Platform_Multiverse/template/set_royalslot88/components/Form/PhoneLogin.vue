<template>
  <div>
    <!-- sms -->
    <q-form v-if="isLoginOtpEnabled && formSms.login_method === LOGIN_METHOD.Enums.Sms" @submit="loginSms">
      <!-- Country code -->
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.register.country") }}</label>
        <q-select
          v-model="formSms.country"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :options="loginCountrySelectOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          popup-content-class="bg-purple-700"
          :rules="[Rules.noRule]"
        />
      </div>
      <!-- 手機號碼 -->
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.login.phone") }}</label>
        <q-input
          v-model="formSms.phone"
          ref="phoneRef"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :rules="[Rules.noRule]"
        />
      </div>
      <!-- SMS -->
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.login.verifyCode") }}</label>
        <div class="forgot_wrap">
          <q-input
            v-model="formSms.sms_otp"
            class="input-control form-control"
            dense
            borderless
            lazy-rules
            :rules="[Rules.otp]"
          />
          <q-btn v-if="counting" class="vcode_img hide-hover btn-modal-reg btn-counting" flat borderless disable>
            <vue-countdown @end="counting = false" :time="90000" v-slot="{ totalSeconds }" class="counting-text">
              {{ `${ totalSeconds }S` }}
            </vue-countdown>
          </q-btn>
          <q-btn
            v-else
            class="vcode_img hide-hover btn-modal-reg btn-counting"
            :label="$t('common.btn.send')"
            @click="getOtpCode"
            :disable="isLoading || !formSms.phone"
          />
        </div>
      </div>
      <!-- 切換密碼登入 -->
      <div class="flex justify-end" v-if="isLoginOtpEnabled">
        <q-btn
          flat
          text-color="white"
          class="hide-hover capitalize"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Password)"
          :disable="isLoading"
        >
          {{ $t("common.btn.password") }} {{ $t("common.btn.login") }}
        </q-btn>
      </div>
      <!-- 登入 -->
      <div class="btn-modal-big">
        <q-btn class="btn-modal-login hide-hover normal-case text-base font-normal" type="submit" :loading="isLoading">
          {{ $t("home.signIn") }}
        </q-btn>
      </div>
      <!-- 忘記密碼 / 註冊 -->
      <div class="btn-modal-group">
        <q-btn
          class="btn-modal-forgot hide-hover normal-case text-base font-normal"
          :loading="isLoading"
          @click="goForgotPassword"
        >
          {{ $t("member.forgotPassword.forgotPassword") }}
        </q-btn>
        <q-btn
          class="btn-modal-reg hide-hover normal-case text-base font-normal"
          :loading="isLoading"
          @click="openRegister"
        >
          {{ $t("home.signup") }}
        </q-btn>
      </div>
    </q-form>
    <!-- password -->
    <q-form v-else @submit="loginPassword">
      <!-- Country code -->
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.register.country") }}</label>
        <q-select
          v-model="formSms.country"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :options="loginCountrySelectOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          popup-content-class="bg-purple-700"
          :rules="[Rules.noRule]"
        />
      </div>
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.login.phone") }}</label>
        <q-input
          v-model="formSms.username"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :rules="[Rules.noRule]"
        />
      </div>
      <div class="form-wrapper">
        <label class="form-label">{{ $t("common.btn.password") }}</label>
        <q-input
          v-model="formSms.password"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :rules="[(val) => Rules.password(val)]"
          type="password"
          autocomplete
        />
      </div>
      <!-- 切換簡訊登入 -->
      <div class="flex justify-end" v-if="isLoginOtpEnabled">
        <q-btn
          flat
          text-color="white"
          class="hide-hover capitalize"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Sms)"
          :disable="isLoading"
        >
          {{ $t("member.login.verifyCode") }} {{ $t("common.btn.login") }}
        </q-btn>
      </div>
      <!-- 登入 -->
      <div class="btn-modal-big">
        <q-btn class="btn-modal-login hide-hover normal-case text-base font-normal" type="submit" :loading="isLoading">
          {{ $t("home.signIn") }}
        </q-btn>
      </div>
      <!-- 忘記密碼 / 註冊 -->
      <div class="btn-modal-group">
        <q-btn
          class="btn-modal-forgot hide-hover normal-case text-base font-normal"
          :loading="isLoading"
          @click="goForgotPassword"
        >
          {{ $t("member.forgotPassword.forgotPassword") }}
        </q-btn>
        <q-btn
          class="btn-modal-reg hide-hover normal-case text-base font-normal"
          :loading="isLoading"
          @click="openRegister"
        >
          {{ $t("home.signup") }}
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { normalizeRegisterColumns } from "app/template/set_royalslot88/utils/registerColumns"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, REGISTER_METHOD, SMS_OTP_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isLoginOtpEnabled, defaultCountryCode } = useEnv()
const { isLoading, handleLogin, handleGetOTP, handleRegisterCustomInput, auth } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const { getFavoriteGames } = useGame()
const envInfoStore = useEnvInfoStore()
const eventbus = injectStrict(EventBusKey)

const phoneRef = ref()
const counting = ref(false)

type DialSelectOption = {
  label: string
  value: string
}

type PhoneLoginForm = Request.login & {
  register_method: REGISTER_METHOD.Enums
  country: string
  username: string
  password: string
  phone: string
  sms_otp: string
}

const formSms = reactive<PhoneLoginForm>({
  login_method: LOGIN_METHOD.Enums.Sms,
  register_method: envInfoStore.envInfo.registerMethod,
  country: defaultCountryCode.value,
  username: "", // 密碼用
  password: "", // 密碼用
  phone: "", // 手機用
  sms_otp: "", // 手機用
})
const loginCountrySelectOptions = ref<DialSelectOption[]>([])

function normalizeDialSelectOptions(values: unknown): DialSelectOption[] {
  if (!Array.isArray(values) || values.length === 0) { return [] }

  return values.map((item) => {
    if (item !== null && typeof item === "object" && "value" in item) {
      const raw = item as { label?: string | number; value: string | number }
      const value = String(raw.value)
      const label = raw.label !== undefined && String(raw.label) !== "" ? String(raw.label) : value

      return { label, value }
    }

    const value = String(item)

    return { label: value, value }
  })
}

async function loadLoginCountryOptions() {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  const countryColumn = normalizeRegisterColumns(data).find(
    (column: Response.RegistInputCustom) => column.column_name === "country"
  )
  const apiOptions = normalizeDialSelectOptions(countryColumn?.values)

  if (apiOptions.length > 0) {
    loginCountrySelectOptions.value = apiOptions
    return
  }

  loginCountrySelectOptions.value = (envInfoStore.envInfo.international_calling_code || []).map((dialCode) => {
    const value = String(dialCode)

    return { label: value, value }
  })
}

function changeLoginMethod(type: LOGIN_METHOD.Enums) {
  formSms.login_method = type
  formSms.country = formSms.country || defaultCountryCode.value
  formSms.username = ""
  formSms.password = ""
  formSms.phone = ""
  formSms.sms_otp = ""
}

async function getOtpCode() {
  phoneRef.value.validate()
  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.verificationError"),
      position: "top" })
  }
  counting.value = true
  const { status } = await handleGetOTP({
    phone: formSms.phone,
    country_code: formSms.country || defaultCountryCode.value,
    request_type: SMS_OTP_TYPE.Enums.Login })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top" })
  }
}

async function loginPassword() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Password,
    phone: formSms.username,
    country: formSms.country || defaultCountryCode.value,
    password: formSms.password }
  const { status } = await handleLogin(payload)
  if (!status) { return }
  await loginAfter()
}

async function loginSms() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    username: formSms.phone,
    sms_otp: formSms.sms_otp,
    country: formSms.country || defaultCountryCode.value }
  const { status } = await handleLogin(payload)
  if (!status) { return }
  await loginAfter()
}

async function loginAfter() {
  if (auth.value.access_token) {
    await getFavoriteGames()
    await getUserWalletList()
    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000 })
  }
  eventbus.emit("openLogin", false)
}

function goForgotPassword() {
  eventbus.emit("openLogin", false)
  eventbus.emit("openForgotPassword", true)
}

function openRegister() { eventbus.emit("openRegister", true) }

onMounted(async () => {
  await loadLoginCountryOptions()
  eventbus.on("openLogin", () => { changeLoginMethod(LOGIN_METHOD.Enums.Password) })
})

watch(defaultCountryCode, (code) => {
  if (code && !formSms.country) { formSms.country = code }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";

.input-control {
  :deep(.q-field__control:before) { @apply border-b-0 padLg:border-b; }
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
      -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
      box-shadow: 0 0 0px 1000px transparent inset !important;

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
