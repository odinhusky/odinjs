<template>
  <q-form @submit="register" autocomplete="new-password">
    <template v-for="(column, key) in customInputList" :key="key">
      <SmsOtpInput
        v-if="column.column_name === 'sms_otp' && isRegisterOtpEnabled"
        :field="column"
        :phone="formRegister?.phone ?? ''"
        :country-code="formRegister?.country || defaultCountryCode"
        :class="'form-input !pt-0'"
        v-model="(formRegister as Request.register)[column?.column_name]"
      />
      <div v-else-if="column.type === 2" class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) }}</label>
        <q-select
          popup-content-class="bg-purple-700"
          v-model="(formRegister as Request.register)[column.column_name]"
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
      <!-- 帳號 -->
      <div v-else-if="column.column_name === 'account'" class="form-wrapper">
        <label class="form-label">{{ $t("member.login.username") }}</label>
        <q-input
          v-model="formRegister.account"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :placeholder="$t('placeholder.pleaseEnterUsername')"
          :rules="column.required ? [(val) => Rules.account(val)] : [Rules.noRule]"
          autocomplete="new-password"
        />
      </div>
      <!-- email -->
      <div v-else-if="column.column_name === 'email'" class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) }}</label>
        <q-input
          v-model="formRegister.email"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :placeholder="$t('placeholder.pleaseEnterEmail')"
          :rules="column.required ? [Rules.required(), Rules.email] : [Rules.email]"
        />
      </div>
      <!-- 密碼 -->
      <div v-else-if="column.column_name === 'password'" class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) }}</label>
        <q-input
          v-model="formRegister.password"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :placeholder="$t('placeholder.pleaseEnterPassword')"
          :rules="
            column.required ? [(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))] : [Rules.noRule]
          "
          type="password"
          autocomplete="new-password"
        />
      </div>
      <!-- 確認密碼 -->
      <div v-else-if="column.column_name === 'confirm_password'" class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) }}</label>
        <q-input
          v-model="formRegister.confirm_password"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
          :rules="[
            (val) => {
              if (column.required && !val) {
                return Rules.required()(val)
              }
              return val === formRegister.password || $t('common.validate.consistentPassword')
            },
          ]"
          type="password"
          autocomplete="off"
        />
      </div>
      <!-- 全名 -->
      <div v-else-if="column.column_name === 'fullname'" class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) }}</label>
        <q-input
          :ref="setFullnameInputRef"
          v-model="formRegister.fullname"
          class="input-control form-control"
          :class="{ 'real-name-bank-match-input': envInfoStore.envInfo.member_bank_real_name === 1 }"
          dense
          borderless
          lazy-rules
          :placeholder="$t('placeholder.pleaseEnterFullname')"
          :hide-bottom-space="shouldHideFullnameBottomSpace"
          :rules="column.required ? [(val) => Rules.fullname(val)] : [Rules.noRule]"
        />
        <RealNameBankMatchNotice />
      </div>
      <!-- 電話號碼 -->
      <div v-else-if="column.column_name === 'phone'" class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) }}</label>
        <q-input
          :placeholder="$t('placeholder.pleaseEnterContactNo')"
          v-model="formRegister.phone"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :rules="column.required ? [Rules.required()] : [Rules.noRule]"
        />
      </div>
      <div v-else class="form-wrapper">
        <label class="form-label">{{ getColumnLabel(column) }}</label>
        <q-input
          v-model="(formRegister as Request.register)[column.column_name]"
          class="input-control form-control"
          dense
          borderless
          :placeholder="$t('placeholder.pleaseEnter')"
          lazy-rules
          :rules="column.required ? [Rules.required()] : [Rules.noRule]"
          autocomplete="off"
        />
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
import { normalizeRegisterColumns } from "app/template/set_royalslot88/utils/registerColumns"
import type { QInput } from "quasar"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, REGISTER_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

import SmsOtpInput from "./SmsOtpInput.vue"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { defaultCountryCode, isRegisterOtpEnabled, isPhoneRegisterMode } = useEnv()
const envInfoStore = useEnvInfoStore()
const fullnameInputRef = ref<QInput | null>(null)
const setFullnameInputRef = (input: QInput | null): void => {
  fullnameInputRef.value = input
}
const shouldHideFullnameBottomSpace = computed<boolean>(
  () => envInfoStore.envInfo.member_bank_real_name === 1 && fullnameInputRef.value?.hasError !== true
)
const { isLoading, handleLogin, handleRegister, auth, handleRegisterCustomInput } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const { getFavoriteGames } = useGame()
const eventbus = injectStrict(EventBusKey)

const customInputList = ref<Response.RegistInputCustomList>([])

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: "",
})

const formRegister = reactive<Request.register>({
  account: "",
  password: "",
  confirm_password: "",
  fullname: "",
  gender: null,
  email: "",
  country: defaultCountryCode.value,
  sms_otp: "",
  phone: "",
  ref_account: "",
  contacts: {
    contact1: "",
    contact2: "",
  },
  is_customize: true,
})

function initForm() {
  formLogin.username = ""
  formLogin.password = ""
  formRegister.account = ""
  formRegister.password = ""
  formRegister.confirm_password = ""
  formRegister.fullname = ""
  formRegister.email = ""
  formRegister.country = defaultCountryCode.value
  formRegister.sms_otp = ""
  formRegister.phone = ""
  formRegister.ref_account = ""
  formRegister.contacts.contact1 = ""
  formRegister.contacts.contact2 = ""
  customInputList.value.forEach((column) => {
    if (column.column_name in formRegister) {
      if (column.type === 2) {
        formRegister[column.column_name] = null
        return
      }
      formRegister[column.column_name] = column.column_name === "country" ? defaultCountryCode.value : ""
      return
    }
    if (column.type === 2) {
      ;(formRegister as Record<string, unknown>)[column.column_name] = null
      return
    }
    ;(formRegister as Record<string, unknown>)[column.column_name] =
      column.column_name === "country" ? defaultCountryCode.value : ""
  })
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formRegister.currency = singleCurrencyValue
  }
}

const getColumnLabel = (column: Response.RegistInputCustom) => {
  return column?.lang?.["en"] || t(`member.register.${column.column_name}`)
}

async function register() {
  const registerPayload = customInputList.value.reduce<Request.register>(
    (payload, column) => {
      payload[column.column_name] = formRegister[column.column_name]
      return payload
    },
    { is_customize: true }
  )
  if (!isRegisterOtpEnabled.value) {
    delete registerPayload.sms_otp
  }
  const { status } = await handleRegister(registerPayload)
  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000,
  })

  if (isPhoneRegisterMode.value) {
    const registerMethod = formRegister.register_method ?? envInfoStore.envInfo.registerMethod
    const useSmsOtpAutoLogin =
      registerMethod === REGISTER_METHOD.Enums.Phone && isRegisterOtpEnabled.value && !!formRegister.sms_otp
    const smsCountry = formRegister.country || defaultCountryCode.value
    const loginPayload: Request.login = useSmsOtpAutoLogin
      ? {
          login_method: LOGIN_METHOD.Enums.Sms,
          username: String(formRegister.phone ?? ""),
          sms_otp: String(formRegister.sms_otp ?? ""),
          ...(smsCountry ? { country: smsCountry } : {}),
        }
      : {
          login_method: LOGIN_METHOD.Enums.Password,
          country: formRegister.country || defaultCountryCode.value,
          phone: String(formRegister.phone ?? ""),
          password: formRegister.password,
        }
    const { status: loginStatus } = await handleLogin(loginPayload)
    if (!loginStatus) {
      return
    }
    if (auth.value.access_token) {
      await getFavoriteGames()
      await getUserWalletList()
      $q.notify({
        type: "positive",
        message: t("common.alarm.loginSuccess"),
        position: "top",
        timeout: 1000,
      })
    }
    eventbus.emit("openRegister", false)
    eventbus.emit("openLogin", false)
    return
  }

  formLogin.username = formRegister.account
  formLogin.password = formRegister.password
  await login()
}

async function login() {
  const { status } = await handleLogin({
    login_method: formLogin.login_method,
    username: formLogin.username,
    password: formLogin.password,
  })

  if (!status) {
    return
  }
  if (auth.value.access_token) {
    await getFavoriteGames()
    await getUserWalletList()
    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000,
    })
  }
  eventbus.emit("openRegister", false)
  eventbus.emit("openLogin", false)
}

watch(defaultCountryCode, (code) => {
  if (code && !formRegister.country) {
    formRegister.country = code
  }
})

async function loadRegisterColumns() {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = normalizeRegisterColumns(data)
}

onMounted(async () => {
  await loadRegisterColumns()
  initForm()

  eventbus.on("openRegister", async (show: boolean) => {
    if (show) {
      await loadRegisterColumns()
    }
    initForm()
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";

.input-control {
  :deep(.q-field__control),
  :deep(.q-field__control::before),
  :deep(.q-field__control::after) {
    border-style: none;
  }

  :deep(.q-field__control:before) {
    @apply border-b-0 padLg:border-b;
  }
  :deep(.q-field__control-container) {
    @apply flex items-center justify-center;
  }
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
