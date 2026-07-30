<template>
  <q-form @submit.prevent="register" class="register-form-wrapper">
    <template v-for="(column, key) in customInputList" :key="key">
      <SmsOtpInput
        v-if="column.column_name === 'sms_otp' && isRegisterOtpEnabled"
        :field="column"
        :phone="formData.phone ?? ''"
        :country-code="formData.country || defaultCountryCode"
        v-model="(formData as Request.register)[column.column_name]"
      />
      <div v-else-if="column.type === 2" class="field-input">
        <q-select
          v-model="(formData as Request.register)[column.column_name]"
          :label="getColumnLabel(column)"
          class="input-control form-control"
          dense
          popup-content-class="r029-dropdown"
          borderless
          lazy-rules
          :options="column.values || []"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          :rules="column.required ? [Rules.required()] : [Rules.noRule]"
        >
          <template v-if="column.column_name == 'country'" v-slot:prepend>
            <q-icon name="fas fa-globe" class="field-icon" />
          </template>
          <template v-else v-slot:prepend>
            <q-icon name="fas fa-pen" class="field-icon" />
          </template>
        </q-select>
      </div>
      <div v-else-if="column.column_name === 'account'" class="field-input">
        <q-input
          v-model="formData.account"
          :label="$t('placeholder.pleaseEnterUsername')"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :rules="[(val) => Rules.account(val, $t('placeholder.usernameValidation'))]"
          autocomplete="username"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-user" class="field-icon" />
          </template>
        </q-input>
      </div>
      <div v-else-if="column.column_name === 'email'" class="field-input">
        <q-input
          v-model="formData.email"
          :label="getColumnLabel(column)"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :rules="column.required ? [Rules.required(), Rules.email] : [Rules.email]"
          autocomplete="email"
        >
          <template v-slot:prepend>
            <q-icon name="fa-solid fa-envelope" class="field-icon" />
          </template>
        </q-input>
      </div>
      <div v-else-if="column.column_name === 'password'" class="field-input">
        <q-input
          v-model="formData.password"
          :label="getColumnLabel(column)"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
          :type="isPasswordVisible ? 'text' : 'password'"
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
      <div v-else-if="column.column_name === 'confirm_password'" class="field-input">
        <q-input
          v-model="formData.confirm_password"
          :label="getColumnLabel(column)"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :rules="[
            (val) => {
              if (column.required && !val) {
                return Rules.required()(val)
              }
              return val === formData.password || $t('common.validate.consistentPassword')
            },
          ]"
          :type="isConfirmPasswordVisible ? 'text' : 'password'"
          autocomplete="new-password"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-lock" class="field-icon" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isConfirmPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
              class="cursor-pointer field-icon"
              @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
            />
          </template>
        </q-input>
      </div>
      <template v-else-if="column.column_name === 'fullname'">
        <div class="field-input" :class="{ 'real-name-bank-match-field-input': shouldHideFullnameBottomSpace }">
          <q-input
            :ref="setFullnameInputRef"
            v-model="formData.fullname"
            :label="getColumnLabel(column)"
            class="input-control form-control"
            :class="{ 'real-name-bank-match-input': envInfoStore.envInfo.member_bank_real_name === 1 }"
            dense
            borderless
            lazy-rules
            :hide-bottom-space="shouldHideFullnameBottomSpace"
            :rules="[(val) => Rules.fullname(val, $t('placeholder.pleaseEnterFullName'))]"
            autocomplete="name"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-id-card" class="field-icon" />
            </template>
          </q-input>
        </div>
        <RealNameBankMatchNotice />
      </template>
      <div v-else-if="column.column_name === 'phone'" class="field-input">
        <q-input
          v-model="formData.phone"
          :label="getColumnLabel(column)"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :rules="column.required ? [Rules.required()] : [Rules.noRule]"
          autocomplete="phone"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-phone" class="field-icon" />
          </template>
        </q-input>
      </div>
      <div v-else class="field-input">
        <q-input
          v-model="(formData as Request.register)[column.column_name]"
          :label="getColumnLabel(column)"
          class="input-control form-control"
          dense
          borderless
          lazy-rules
          :rules="column.required ? [Rules.required()] : [Rules.noRule]"
          autocomplete="off"
        >
          <template v-slot:prepend>
            <q-icon :name="getColumnIcon(column.column_name)" class="field-icon" />
          </template>
        </q-input>
      </div>
    </template>
    <div class="btn-wrapper">
      <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.register") }}</q-btn>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import type { QInput } from "quasar"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, REGISTER_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import SmsOtpInput from "./SmsOtpInput.vue"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { defaultCountryCode, isRegisterOtpEnabled, isPhoneRegisterMode } = useEnv()
const envInfoStore = useEnvInfoStore()
const fullnameInputRef = ref<QInput | null>(null)
const setFullnameInputRef = (input: QInput | null): void => {
  fullnameInputRef.value = input
}
const shouldHideFullnameBottomSpace = computed<boolean>(
  () => envInfoStore.envInfo.member_bank_real_name === 1 && fullnameInputRef.value?.hasError !== true
)
const { isLoading, handleRegister, handleLogin, handleRegisterCustomInput } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const eventbus = injectStrict(EventBusKey)
const customInputList = ref<Response.RegistInputCustomList>([])

onMounted(async () => {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formData.currency = singleCurrencyValue
  }
})

const formData = reactive<Request.login & Request.register>({
  login_method: LOGIN_METHOD.Enums.Password,
  account: "",
  username: "",
  password: "",
  confirm_password: "",
  fullname: "",
  ref_account: "",
  invite_code: "",
  email: "",
  country: "",
  phone: "",
  sms_otp: "",
  is_customize: true,
})

// 监听 eventbus 接收推荐码
eventbus.on("setInviteCode", (inviteCode: string) => {
  console.log("收到邀请码:", inviteCode)
  formData.invite_code = inviteCode
})

const register = async () => {
  const registerPayload = customInputList.value.reduce<Request.register>(
    (payload, column) => {
      payload[column.column_name] = formData[column.column_name]
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
    const registerMethod = formData.register_method ?? envInfoStore.envInfo.registerMethod
    const useSmsOtpAutoLogin =
      registerMethod === REGISTER_METHOD.Enums.Phone && isRegisterOtpEnabled.value && !!formData.sms_otp
    const smsCountry = formData.country || defaultCountryCode.value
    const loginPayload: Request.login = useSmsOtpAutoLogin
      ? {
          login_method: LOGIN_METHOD.Enums.Sms,
          username: formData.phone,
          sms_otp: formData.sms_otp,
          ...(smsCountry ? { country: smsCountry } : {}),
        }
      : {
          login_method: LOGIN_METHOD.Enums.Password,
          country: formData.country || defaultCountryCode.value,
          phone: formData.phone,
          password: formData.password,
        }
    await login(loginPayload)
    return
  }

  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Password,
    username: formData.account,
    password: formData.password,
  }
  await login(payload)
}

const login = async (payload: Request.login) => {
  const { status } = await handleLogin(payload)
  if (!status) {
    return
  }
  await getUserWalletList()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000,
  })
  router.push({ name: "Home" })
  closeDialog()
}

const closeDialog = () => {
  eventbus.emit("openLoginWithRegister", false)
}

const getColumnLabel = (column: Response.RegistInputCustom) => {
  return column?.lang?.["en"] || t(`member.register.${column.column_name}`)
}

const getColumnIcon = (columnName: string) => {
  switch (columnName) {
    case "invite_code":
      return "fa-solid fa-user-plus"
    case "ref_account":
      return "fa-solid fa-user-plus"
    default:
      return "fas fa-pen"
  }
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r029/assets/css/_variable.scss";
@import "app/template/set_r029/assets/css/form.scss";

.field-input {
  @apply mb-7;

  ::v-deep(.q-field__messages) {
    color: #ed4014;
  }
}

.real-name-bank-match-field-input {
  margin-bottom: 0;
}

.register-form-wrapper {
  .btn-wrapper {
    @apply flex;
  }
}

.input-control {
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
      -webkit-box-shadow: 0 0 0px 1000px $r029-bg-card inset !important;
      box-shadow: 0 0 0px 1000px $r029-bg-card inset !important;
      // 強制文字顏色（例如白色）
      -webkit-text-fill-color: $r029-text-primary !important;

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

<style lang="scss">
@import "app/template/set_r029/assets/css/_variable.scss";

.r029-dropdown {
  background: $r029-bg-section !important;
  color: $r029-text-primary !important;
}

.btn-submit {
  border-radius: 0.25rem !important;
}
</style>
