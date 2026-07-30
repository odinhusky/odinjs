<template>
  <q-form @submit.prevent="registerSms">
    <template v-for="(column, key) in customInputList" :key="column.column_name || String(key)">
      <div v-if="column.column_name === 'password'" class="field-input flex">
        <q-input
          v-model="fieldValues.password"
          :label="getColumnLabel(column) || $t('placeholder.pleaseEnterPassword')"
          rounded
          dense
          borderless
          bg-color="white"
          color="black"
          class="input-control input-style"
          lazy-rules
          :rules="
            column.required ? [(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))] : [Rules.noRule]
          "
          :type="isRegPasswordVisible ? 'text' : 'password'"
          autocomplete="new-password"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-lock" class="text-black ml-2" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isRegPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
              class="cursor-pointer text-black ml-2"
              @click="isRegPasswordVisible = !isRegPasswordVisible"
            />
          </template>
        </q-input>
      </div>
      <div v-else-if="column.column_name === 'confirm_password'" class="field-input flex">
        <q-input
          v-model="fieldValues.confirm_password"
          :label="getColumnLabel(column) || $t('placeholder.pleaseEnterConfirmPassword')"
          rounded
          dense
          borderless
          bg-color="white"
          color="black"
          class="input-control input-style"
          lazy-rules
          :rules="[
            (val) => {
              if (column.required && !val) { return Rules.required()(val) }
              return val === fieldValues.password || $t('common.validate.consistentPassword')
            }
          ]"
          :type="isRegConfirmPasswordVisible ? 'text' : 'password'"
          autocomplete="new-password"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-lock" class="text-black ml-2" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isRegConfirmPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
              class="cursor-pointer text-black ml-2"
              @click="isRegConfirmPasswordVisible = !isRegConfirmPasswordVisible"
            />
          </template>
        </q-input>
      </div>
      <div v-else-if="column.type === 2" class="field-input flex">
        <q-select
          popup-content-class="bg-white"
          v-model="fieldValues[column.column_name]"
          :label="getColumnLabel(column)"
          rounded
          dense
          borderless
          bg-color="white"
          color="black"
          class="input-control input-style"
          lazy-rules
          :options="column.values || []"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          :rules="column.required ? [Rules.required()] : [Rules.noRule]"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-globe" class="text-black ml-2" />
          </template>
        </q-select>
      </div>
      <div v-else-if="column.column_name === 'phone'" class="field-input flex">
        <q-input
          ref="phoneRef"
          v-model="fieldValues.phone"
          :label="getColumnLabel(column) || $t('placeholder.phoneNumber')"
          rounded
          dense
          borderless
          bg-color="white"
          color="black"
          class="input-control input-style"
          lazy-rules
          :rules="column.required ? [Rules.required()] : [Rules.noRule]"
          unmasked-value
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-phone" class="text-black ml-2" />
          </template>
        </q-input>
      </div>
      <template v-else-if="column.column_name === 'sms_otp'">
        <template v-if="isRegisterOtpEnabled">
          <div class="get-otp-wrapper">
            <q-btn class="otp-btn" :disable="!fieldValues.phone || counting" @click="getOtpCode">
              {{ $t("common.btn.otp") }}</q-btn
            >
            <vue-countdown
              @end="counting = false"
              v-if="counting"
              :time="180000"
              v-slot="{ totalSeconds }"
              class="counting-text"
              >{{ `${ totalSeconds }s` }}</vue-countdown
            >
          </div>
          <div class="field-input flex items-center">
            <q-input
              v-model="fieldValues.sms_otp"
              :label="$t('placeholder.enterOTP')"
              rounded
              dense
              borderless
              bg-color="white"
              color="black"
              class="input-control input-style"
              lazy-rules
              :rules="[Rules.required()]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-shield-alt" class="text-black ml-2" />
              </template>
            </q-input>
          </div>
        </template>
      </template>
      <template v-else>
        <div
          class="field-input flex"
          :class="{
            'real-name-bank-match-field-input': column.column_name === 'fullname' && shouldHideFullnameBottomSpace,
          }"
        >
          <q-input
            :ref="column.column_name === 'fullname' ? setFullnameInputRef : undefined"
            v-model="fieldValues[column.column_name]"
            :label="getColumnLabel(column)"
            rounded
            dense
            borderless
            bg-color="white"
            color="black"
            class="input-control input-style"
            :class="{
              'real-name-bank-match-input':
                column.column_name === 'fullname' && envInfoStore.envInfo.member_bank_real_name === 1,
            }"
            lazy-rules
            :hide-bottom-space="column.column_name === 'fullname' && shouldHideFullnameBottomSpace"
            :rules="column.required ? [Rules.required()] : [Rules.noRule]"
            autocomplete="off"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-pen" class="text-black ml-2" />
            </template>
          </q-input>
        </div>
        <RealNameBankMatchNotice v-if="column.column_name === 'fullname'" />
      </template>
    </template>

    <div>
      <q-btn class="btn-submit" type="submit" :loading="isLoading" :disabled="!agreeTerms">
        {{ $t("common.btn.register") }}</q-btn
      >
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import VueCountdown from "@chenfengyuan/vue-countdown"
import type { QInput } from "quasar"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, REGISTER_METHOD, SMS_OTP_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const eventbus = injectStrict(EventBusKey)
const { isRegisterOtpEnabled, defaultCountryCode } = useEnv()
const { isLoading, handleRegisterSms, handleLogin, handleGetOTP, handleRegisterCustomInput } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const envInfoStore = useEnvInfoStore()
const phoneRef = ref()
const fullnameInputRef = ref<QInput | null>(null)
const setFullnameInputRef = (input: QInput | null): void => {
  fullnameInputRef.value = input
}
const shouldHideFullnameBottomSpace = computed<boolean>(
  () => envInfoStore.envInfo.member_bank_real_name === 1 && fullnameInputRef.value?.hasError !== true
)
const counting = ref(false)
const agreeTerms = ref(true)
const customInputList = ref<Response.RegistInputCustomList>([])
const fieldValues = reactive<Record<string, string | number | null>>({})
const isRegPasswordVisible = ref(false)
const isRegConfirmPasswordVisible = ref(false)

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

async function loadRegisterColumns() {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []
  initFieldValuesFromColumns()
}

const getOtpCode = async () => {
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
      : defaultCountryCode.value
  const { status } = await handleGetOTP({
    phone: String(fieldValues.phone ?? ""),
    request_type: SMS_OTP_TYPE.Enums.Register,
    country_code: countryCode })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top" })
  }
}

const registerSms = async () => {
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
    const smsCountry =
      typeof fieldValues.country === "string" || typeof fieldValues.country === "number"
        ? String(fieldValues.country)
        : defaultCountryCode.value
    const payload: Request.login = {
      login_method: LOGIN_METHOD.Enums.Sms,
      username: String(fieldValues.phone ?? ""),
      sms_otp: String(fieldValues.sms_otp ?? ""),
      ...(smsCountry ? { country: smsCountry } : {}) }
    await login(payload)
    return
  }

  eventbus.emit("openLoginWithRegister", false)
}

const login = async (payload: Request.login) => {
  const { status } = await handleLogin(payload)
  if (!status) { return }
  await getUserWalletList()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000 })
  router.push({ name: "Home" })
  closeDialog()
}

const closeDialog = () => { eventbus.emit("openLoginWithRegister", false) }

onMounted(async () => { await loadRegisterColumns() })
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/form.scss";

.input-style { @apply w-10/12; }

.real-name-bank-match-field-input {
  margin-bottom: 0;
}

.get-otp-wrapper {
  @apply flex items-center gap-2 mb-4;

  .otp-btn {
    @apply text-white rounded-[.625rem];
    background: $primary-color;
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
      -webkit-box-shadow: 0 0 0px 1000px $midnight-blue-color inset !important;
      box-shadow: 0 0 0px 1000px $midnight-blue-color inset !important;
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
