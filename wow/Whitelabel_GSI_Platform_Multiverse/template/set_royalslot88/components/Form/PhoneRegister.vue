<template>
  <q-form @submit="registerSms">
    <template v-for="(column, key) in customInputList" :key="column.column_name || String(key)">
      <div v-if="column.column_name === 'password'" class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) || $t("member.register.password") }}</label>
        <q-input
          v-model="fieldValues.password"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          type="password"
          :rules="
            column.required ? [(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))] : [Rules.noRule]
          "
          autocomplete="new-password"
        />
      </div>
      <div v-else-if="column.column_name === 'confirm_password'" class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) || $t("member.register.confirmPassword") }}</label>
        <q-input
          v-model="fieldValues.confirm_password"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          type="password"
          :rules="[
            (val) => {
              if (column.required && !val) { return Rules.required()(val) }
              return val === fieldValues.password || $t('common.validate.consistentPassword')
            }
          ]"
          autocomplete="new-password"
        />
      </div>
      <div v-else-if="column.type === 2" class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) }}</label>
        <q-select
          popup-content-class="bg-purple-700"
          v-model="fieldValues[column.column_name]"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :options="column.values || []"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          :rules="column.required ? [Rules.required()] : [Rules.noRule]"
        />
      </div>
      <div v-else-if="column.column_name === 'phone'" class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) || $t("member.login.phone") }}</label>
        <q-input
          v-model="fieldValues.phone"
          ref="phoneRef"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :rules="column.required ? [Rules.required()] : [Rules.noRule]"
        />
      </div>
      <template v-else-if="column.column_name === 'sms_otp'">
        <div v-if="isRegisterOtpEnabled" class="form-wrapper">
          <label class="form-label">{{ $t("member.login.verifyCode") }}</label>
          <div class="forgot_wrap">
            <q-input
              v-model="fieldValues.sms_otp"
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
              :disable="isLoading || !fieldValues.phone"
            />
          </div>
        </div>
      </template>
      <div v-else class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) }}</label>
        <q-input
          v-model="fieldValues[column.column_name]"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :placeholder="$t('placeholder.pleaseEnter')"
          :rules="column.required ? [Rules.required()] : [Rules.noRule]"
          autocomplete="off"
        />
        <RealNameBankMatchNotice v-if="column.column_name === 'fullname'" />
      </div>
    </template>
    <div class="btn-modal-big">
      <q-btn class="btn-modal-login hide-hover normal-case text-base font-normal" type="submit" :loading="isLoading">
        {{ $t("common.btn.register") }}
      </q-btn>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { normalizeRegisterColumns } from "app/template/set_royalslot88/utils/registerColumns"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, REGISTER_METHOD, SMS_OTP_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isRegisterOtpEnabled, defaultCountryCode } = useEnv()
const { isLoading, handleRegisterSms, handleLogin, handleGetOTP, auth, handleRegisterCustomInput } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const { getFavoriteGames } = useGame()
const envInfoStore = useEnvInfoStore()
const eventbus = injectStrict(EventBusKey)

const phoneRef = ref()
const counting = ref(false)
const customInputList = ref<Response.RegistInputCustomList>([])
const fieldValues = reactive<Record<string, string | number | null>>({})

const getColumnLabel = (column: Response.RegistInputCustom) => {
  return column?.lang?.["en"] || t(`member.register.${ column.column_name }`)
}

function clearFieldValues() {
  Object.keys(fieldValues).forEach((k) => { delete fieldValues[k] })
}

function initFieldValuesFromColumns() {
  clearFieldValues()
  customInputList.value.forEach((column) => {
    if (column.column_name === "sms_otp" && !isRegisterOtpEnabled.value) { return }
    if (column.type === 2) {
      fieldValues[column.column_name] = null
      return
    }
    fieldValues[column.column_name] = column.column_name === "country" ? defaultCountryCode.value : ""
  })
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    fieldValues.currency = singleCurrencyValue
  }
}

function resetRegisterFormUi() {
  counting.value = false
  clearFieldValues()
}

async function loadRegisterColumns() {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = normalizeRegisterColumns(data)
  initFieldValuesFromColumns()
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
  const countryCode =
    typeof fieldValues.country === "string" || typeof fieldValues.country === "number"
      ? String(fieldValues.country)
      : undefined
  const { status } = await handleGetOTP({
    phone: String(fieldValues.phone ?? ""),
    request_type: SMS_OTP_TYPE.Enums.Register,
    ...(countryCode ? { country_code: countryCode } : {}) })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top" })
  }
}

async function registerSms() {
  const registerMethod = envInfoStore.envInfo.registerMethod
  const registerPayload = customInputList.value.reduce<Record<string, unknown>>(
    (payload, column) => {
      payload[column.column_name] = fieldValues[column.column_name]
      return payload
    },
    { register_method: registerMethod, is_customize: true }
  )
  if (!isRegisterOtpEnabled.value) { delete registerPayload.sms_otp }
  const countryVal =
    typeof registerPayload.country === "string" || typeof registerPayload.country === "number"
      ? String(registerPayload.country)
      : defaultCountryCode.value
  registerPayload.country = countryVal

  const { status } = await handleRegisterSms(registerPayload as unknown as Request.RegisterSms)
  if (!status) { return }
  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000 })

  if (isRegisterOtpEnabled.value && registerMethod === REGISTER_METHOD.Enums.Phone) {
    await loginSms()
    return
  }

  eventbus.emit("openRegister", false)
  eventbus.emit("openLogin", true)
}

async function loginSms() {
  const smsCountry =
    typeof fieldValues.country === "string" || typeof fieldValues.country === "number"
      ? String(fieldValues.country)
      : undefined
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    username: String(fieldValues.phone ?? ""),
    sms_otp: String(fieldValues.sms_otp ?? ""),
    ...(smsCountry ? { country: smsCountry } : {}) }
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
  eventbus.emit("openRegister", false)
  eventbus.emit("openLogin", false)
}

onMounted(async () => {
  await loadRegisterColumns()

  eventbus.on("openRegister", async (show: boolean) => {
    if (show) { await loadRegisterColumns() } else { resetRegisterFormUi() }
  })
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

      /* 除了內陰影，強行把 background 設為 transparent */
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
