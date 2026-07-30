<template>
  <div class="reg-area">
    <div class="back-btn-container"><BackBtn /></div>
    <div class="con-info">
      <div class="con">
        <div class="form-layout">
          <div class="title">{{ $t("menu.register") }}</div>
          <div class="form-validation mt-6" v-if="customInputList.length !== 0">
            <q-form class="modal-form px-4" @submit.prevent="register">
              <!-- CMS欄位 -->
              <div
                class="input-area"
                v-if="phoneLabel && firstPhoneOrCountryColumn !== 'phone' && firstPhoneOrCountryColumn !== 'country'"
              >
                <label class="field-label" for="">{{ phoneLabel }}</label>
                <div class="field-input width-auto">
                  <PhoneInput
                    v-model:phone="formRegister.phone"
                    v-model:country="formRegister.country"
                    :class="'form-input'"
                  ></PhoneInput>
                </div>
              </div>
              <template v-for="(column, key) in customInputList" :key="key">
                <div class="input-area" v-if="column.column_name === firstPhoneOrCountryColumn">
                  <label class="field-label" for="">{{ phoneLabel }}</label>
                  <div class="field-input width-auto">
                    <PhoneInput
                      v-model:phone="formRegister.phone"
                      v-model:country="formRegister.country"
                      :class="'form-input'"
                    ></PhoneInput>
                  </div>
                </div>

                <div class="input-area" v-else-if="column.column_name === 'sms_otp' && isRegisterOtpEnabled">
                  <label class="field-label" for="">{{
                    column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${ column.column_name }`)
                  }}</label>
                  <div class="field-input">
                    <SmsOtpInput
                      :field="column"
                      :phone="formRegister?.phone ?? ''"
                      :country-code="formRegister.country || defaultCountryCode"
                      :class="'form-input'"
                      v-model="(formRegister as Request.register)[column?.column_name]"
                    ></SmsOtpInput>
                  </div>
                </div>
                <div
                  class="input-area"
                  v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input"
                >
                  <label class="field-label" for="">{{
                    column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${ column.column_name }`)
                  }}</label>
                  <div class="field-input">
                    <ExtraInput
                      :field="column"
                      :class="'form-input'"
                      :hide-bottom-space="envInfoStore.envInfo.member_bank_real_name === 1 && column.column_name === 'fullname'"
                      v-model="(formRegister as Request.register)[column?.column_name]"
                    ></ExtraInput>
                    <RealNameBankMatchNotice v-if="column.column_name === 'fullname'" />
                  </div>
                </div>
                <div
                  class="input-area"
                  v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
                >
                  <label class="field-label" for="">{{
                    column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${ column.column_name }`)
                  }}</label>
                  <div class="field-input">
                    <!-- 下拉選單類型 -->
                    <ExtraSelect
                      v-model="(formRegister as Request.register)[column?.column_name]"
                      :field="column"
                      :class="'form-input'"
                    ></ExtraSelect>
                  </div>
                </div>
                <div
                  class="input-area"
                  v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date"
                >
                  <label class="field-label" for="">{{
                    column?.lang[nowLang] ? column?.lang[nowLang] : $t(`member.register.${ column.column_name }`)
                  }}</label>
                  <div class="field-input">
                    <DateInput
                      :field="column"
                      :class="'form-input'"
                      v-model="(formRegister as Request.register)[column?.column_name]"
                    ></DateInput>
                  </div>
                </div>
              </template>
              <div class="input-area">
                <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.register") }}</q-btn>
              </div>
            </q-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
import BackBtn from "src/common/components/btns/BackBtn.vue"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { FIELD_TYPE, LOGIN_METHOD, REGISTER_METHOD } from "src/common/utils/constants"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { computed, onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import ExtraSelect from "../../components/ExtraInput/Select.vue"
import SmsOtpInput from "../../components/ExtraInput/SmsOtpInput.vue"

const $q = useQuasar()
const _Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const { nowLang } = useLanguage()

const { isLoading, handleRegisterCustomInput, handleRegister, handleLogin } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const {} = useCommonImg()
const { isPhoneRegisterMode, isRegisterOtpEnabled, defaultCountryCode, inviteCode } = useEnv()
const envInfoStore = useEnvInfoStore()

// 排除特殊墜欄位
const excludeColumn = (columnName: string) => {
  switch (columnName) {
    case "phone":
    case "country":
    case "sms_otp":
      return false

    default:
      return true
  }
}

const customInputList = ref<Response.RegistInputCustomList>([])

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "", // 密碼用
  password: "", // 密碼用
  phone: "", // 手機用
  sms_otp: "", // 手機用
})

const formRegister = ref<Request.register>({ is_customize: true })

// let formData = reactive<Request.login & Request.register>({
//   login_method: LOGIN_METHOD.Enums.Password,
//   account: "",
//   username: "",
//   password: "",
//   confirm_password: "",
//   fullname: "",
//   ref_account: undefined,
//   email: "",
//   phone: "",
//   contacts: {
//     contact1: "",
//     contact2: ""
//   }
// })
// let formSms = reactive<Request.RegisterSms>({
//   register_method: REGISTER_METHOD.Enums.Phone,
//   phone: "",
//   sms_otp: ""
// })

const firstPhoneOrCountryColumn = computed(() => { return customInputList.value.find((c) => c.column_name === "phone" || c.column_name === "country")?.column_name })

const phoneLabel = computed(() => {
  const countryItem = customInputList.value.filter((field) => field.column_name === "country")[0]
  const phoneItem = customInputList.value.filter((field) => field.column_name === "phone")[0]
  if (phoneItem)
    return phoneItem?.lang[nowLang.value]
      ? phoneItem?.lang[nowLang.value]
      : t(`member.register.${ phoneItem.column_name }`)
  else if (countryItem && !phoneItem)
    return countryItem?.lang[nowLang.value]
      ? countryItem?.lang[nowLang.value]
      : t(`member.register.${ countryItem.column_name }`)
  else return null
})

async function register() {
  const registerPayload = { ...formRegister.value }
  if (!isRegisterOtpEnabled.value) { delete registerPayload.sms_otp }
  const { status } = await handleRegister(registerPayload)

  if (!status) { return }

  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000 })

  if (!isPhoneRegisterMode.value) {
    formLogin.username = formRegister.value.account
    formLogin.password = formRegister.value.password
    await login()
  } else {
    formLogin.phone = formRegister.value.phone
    formLogin.sms_otp = formRegister.value.sms_otp ?? ""
    const registerMethod = formRegister.value.register_method ?? envInfoStore.envInfo.registerMethod
    const useSmsOtpAutoLogin =
      registerMethod === REGISTER_METHOD.Enums.Phone && isRegisterOtpEnabled.value && !!formRegister.value.sms_otp

    if (useSmsOtpAutoLogin) { await loginSms() } else if (formRegister.value.password) {
      formLogin.username = formRegister.value.phone
      formLogin.password = formRegister.value.password
      await login()
    } else {
      router.push({ name: "Login" })
    }
  }
}

async function loginSms() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    username: formLogin.phone,
    sms_otp: formLogin.sms_otp,
    country: formRegister.value.country || defaultCountryCode.value }
  const { status } = await handleLogin(payload)

  if (!status) { return }
  await getUserWalletList()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000 })
  router.push({ name: "HomePage" })
}

async function login() {
  const { status } = await handleLogin({
    login_method: LOGIN_METHOD.Enums.Password,
    username: formLogin.username,
    password: formLogin.password })

  if (!status) { return }
  await getUserWalletList()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000 })
  router.push({ name: "HomePage" })
}

onMounted(async () => {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formRegister.value = { ...formRegister.value, currency: singleCurrencyValue }
  }

  // 自動填入邀請碼（如果存在且註冊欄位有 invite_code）
  if (inviteCode.value && customInputList.value.some((column) => column.column_name === "invite_code")) {
    formRegister.value.invite_code = inviteCode.value
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set33_RED/assets/css/_variable.sass";
@import "app/template/set33_RED/assets/css/main.sass";

.back-btn-container {
  min-width: 320px;
  width: 990px;
  margin-top: 1.25rem;
  margin-bottom: 0.625rem;

  @include pad-width { width: 100%; }
}

.con {
  min-width: 61.875rem;

  @include phone-width { min-width: 0; }

  .form-layout {
    width: 950px;
    // max-width: 40.625rem
    margin-left: auto;
    margin-right: auto;

    @include pad-width { width: 90vw; }

    .title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-left: 0;
      padding-left: 1rem;
    }

    .sub-title {
      font-size: 1.25rem;
      margin-top: 1.875rem;
      margin-bottom: 0.625rem;
      padding-left: 1rem;
    }

    .counting-text {
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
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
      position: absolute;
      top: 0;
      right: -5.625rem;
      height: 2.375rem;
      width: 5.625rem;
      margin-left: 0;
      font-size: 1rem;
      line-height: 2.375rem;
      padding: 0;
      text-transform: none;
      white-space: nowrap;
    }
  }
}

/* 轉換 ::v-deep 為 Vue 3 標準 :deep() */
:deep(.q-field__messages) {
  color: #ed4014;
  font-size: 0.8rem;

  @include pad-width { font-size: 2vw; }

  @include iphone-width { font-size: 3.2vw; }
}

:deep(.q-field__marginal) { height: 38px; }

:deep(.q-field__control) {
  height: 38px;
  padding-left: 10px;

  .q-field__native {
    font-weight: 500;
    height: 38px;

    &:focus { color: rgba(28, 30, 34, 0.7); }
  }
}

.form-validation {
  margin-top: 25px;
  min-width: 950px;

  @include pad-width { min-width: 100%; }

  @include iphone-width { min-width: 100%; }
}

.btn-back {
  color: #000;
  background: linear-gradient(180deg, #72d766 0%, #408837 100%);
}
</style>
