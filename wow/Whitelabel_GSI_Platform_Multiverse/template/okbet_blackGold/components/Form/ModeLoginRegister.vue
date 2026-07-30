<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <!-- login -->
    <q-form
      v-if="isLoginMode"
      @submit="showPhoneLoginLayout ? showVerifyModal([handleLoginSms]) : showVerifyModal([login])"
      autocomplete="new-password"
    >
      <!-- 手機號碼 -->
      <div v-if="showPhoneLoginLayout">
        <h2 class="form-title mb-2">
          {{ $t("member.login.phoneFormTitle") }}
        </h2>
        <h3 class="form-subtitle" v-if="formLogin.login_method === LOGIN_METHOD.Enums.Sms">
          {{ $t("member.login.phoneFormSubtitle") }}
        </h3>

        <div class="form-container">
          <div class="login-country-phone-row">
            <q-select
              v-model="formLogin.country"
              :options="loginCountrySelectOptions"
              behavior="menu"
              emit-value
              map-options
              option-label="label"
              option-value="value"
              lazy-rules
              :rules="[Rules.required()]"
              class="input-control form-input border-bottom login-country-code-select"
              dense
              borderless
              :display-value="formLogin.country ? undefined : $t('member.register.country')"
              popup-content-class="blackgold-login-country-popup"
              color="white"
            >
              <template #prepend>
                <div class="divider-error"></div>
                <div class="form-icon">
                  <img :src="svgIcon('people')" alt="country-code" />
                </div>
                <div class="divider"></div>
              </template>
            </q-select>
            <q-input
              v-model="formLogin.phone"
              ref="phoneRef"
              class="input-control form-input border-bottom login-phone-input"
              dense
              borderless
              :placeholder="$t('member.login.phone')"
              lazy-rules
              :rules="[Rules.required()]"
              autocomplete="new-password"
              color="white"
            >
              <template #prepend>
                <div class="divider-error"></div>
                <div class="form-icon">
                  <img :src="svgIcon('people')" alt="phone-number" />
                </div>
                <div class="divider"></div>
              </template>
            </q-input>
          </div>
          <q-input
            v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
            v-model="formLogin.password"
            class="input-control form-input border-bottom"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            lazy-rules
            :rules="[Rules.required()]"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            color="white"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('password')" alt="phone-number" />
              </div>
              <div class="divider"></div>
            </template>
            <template #append>
              <q-icon
                class="eye-icon"
                :name="showPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          <!-- SMS -->
          <div class="sms-container" v-else>
            <q-input
              v-model="formLogin.sms_otp"
              class="input-control form-input"
              dense
              borderless
              :placeholder="$t('member.login.verifyCode')"
              lazy-rules
              :rules="[Rules.required()]"
              autocomplete="new-password"
              color="white"
            >
              <template #prepend>
                <div class="divider-error"></div>
                <div class="form-icon">
                  <img :src="svgIcon('shield')" alt="verify-code" />
                </div>
                <div class="divider"></div>
              </template>
            </q-input>
            <!-- 倒數秒數 -->
            <q-btn v-if="counting" class="btn-send counting hide-hover" flat borderless disable>
              <vue-countdown @end="counting = false" :time="90000" v-slot="{ totalSeconds }" class="counting-text">
                {{ `${totalSeconds}S` }}
              </vue-countdown>
            </q-btn>
            <q-btn
              v-else
              color="primary"
              class="btn-send hide-hover"
              :label="$t('common.btn.send')"
              @click="getOtpCode"
              :disable="isLoading || !formLogin.phone"
            />
          </div>
        </div>
      </div>

      <!-- 登入帳號欄位 -->
      <div class="form-container" v-else>
        <!-- 登入帳號 -->
        <LoginRegisterOuterInputContainer
          :label-props="{
            labelText: t('member.login.username'),
            labelContainerClass: 'pad:px-3',
            labelTextClass: 'label-text-color',
            isRequired: true,
          }"
          container-class="pad:pt-3"
        >
          <q-input
            v-model="formLogin.username"
            class="input-control form-input !pt-0"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterUsername')"
            lazy-rules
            :rules="[Rules.required()]"
            autocomplete="new-password"
            color="white"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('people')" alt="phone-number" />
              </div>
              <div class="divider"></div>
            </template>
          </q-input>
        </LoginRegisterOuterInputContainer>

        <!-- 登入密碼 -->
        <LoginRegisterOuterInputContainer
          :label-props="{
            labelText: t('member.login.password'),
            labelContainerClass: 'pad:px-3',
            labelTextClass: 'label-text-color',
            isRequired: true,
          }"
          container-class="pad:pt-3"
        >
          <q-input
            v-model="formLogin.password"
            class="input-control form-input !pt-0"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            lazy-rules
            :rules="[Rules.required()]"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            color="white"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('password')" alt="phone-number" />
              </div>
              <div class="divider"></div>
            </template>
            <template #append>
              <q-icon
                class="eye-icon"
                :name="showPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </LoginRegisterOuterInputContainer>
      </div>

      <!-- 忘記密碼 -->
      <div class="forgot-container">
        <q-btn flat class="hide-hover" :disable="isLoading" @click="goForgotPassword">
          {{ $t("member.forgotPassword.forgotPassword") }}
        </q-btn>
      </div>

      <!-- 登入按鈕 -->
      <q-btn
        class="btn-submit mt-5 hide-hover"
        type="submit"
        :disable="loginClauseHasContent && !agreeTerms"
        :loading="isLoading"
      >
        {{ $t("common.btn.login") }}
      </q-btn>

      <!-- 註冊按鈕 -->
      <div class="btn-password-container mt-3">
        <q-btn flat class="btn-password hide-hover" @click="changeDialog(false)" :disable="isLoading">
          {{ $t("common.btn.register") }}
        </q-btn>
      </div>

      <div class="btn-password-container mt-3" v-if="isLoginOtpEnabled">
        <q-btn
          v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
          flat
          class="btn-password hide-hover"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Sms)"
          :disable="isLoading"
        >
          {{ $t("common.btn.smsLogin") }}
        </q-btn>
        <q-btn
          v-else
          flat
          class="btn-password hide-hover"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Password)"
          :disable="isLoading"
        >
          {{ $t("common.btn.passwordLogin") }}
        </q-btn>
      </div>

      <!-- 條款、幫助 -->
      <div class="form-bottom">
        <ResponsibilityClauseContent position="login" class="terms-container" />
        <ResponsibilityClauseAgreementCheckbox
          v-model="agreeTerms"
          position="login"
          class="agree-container"
          color=""
          :disabled="isLoading"
          :use-circle-icons="$q.platform.is.mobile"
          @has-content="loginClauseHasContent = $event"
        />
        <div class="help-container">
          <p class="help-row">
            <span>{{ $t("member.login.needHelp") }} ? </span>
            <span class="contact-us text-gold-gradient" @click="handleOpenLiveChat">
              <div class="contact-icon">
                <img :src="svgIcon('service')" alt="phone-number" />
              </div>
              {{ $t("home.contact_us") }}
            </span>
          </p>
          <ResponsibilityClauseImages position="login" class="responsibility-images" />
        </div>
      </div>
    </q-form>

    <!-- register -->
    <q-form v-else @submit="showVerifyModal([register])" autocomplete="new-password">
      <div class="form-content">
        <div class="form-container pad:pt-3" v-if="customInputList.length !== 0">
          <template v-for="(column, key) in customInputList" :key="key">
            <!-- CMS欄位 -->
            <PhoneInput
              v-if="column.column_name === firstPhoneOrCountryColumn"
              v-model:phone="formRegister.phone"
              v-model:country="formRegister.country"
              :class="'form-input'"
            ></PhoneInput>

            <LoginRegisterOuterInputContainer
              v-else-if="shouldRenderRegisterColumn(column)"
              :label-props="{
                labelText: column?.lang?.[nowLang] || $t(`member.register.${column.column_name}`),
                labelContainerClass: 'padLg:px-3',
                labelTextClass: 'label-text-color',
                isRequired: column.required,
              }"
              :class="`dynamic-input-${column.column_name}`"
            >
              <div class="w-full">
                <!-- 文字輸入框 -->
                <SmsOtpInput
                  v-if="column.column_name === 'sms_otp' && isRegisterOtpEnabled"
                  :field="column"
                  :phone="formRegister.phone ?? ''"
                  :country-code="formRegister.country || defaultCountryCode"
                  :class="'form-input !pt-0'"
                  v-model="(formRegister as Request.register)[column?.column_name]"
                ></SmsOtpInput>

                <ExtraInput
                  v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input"
                  :field="column"
                  :class="'form-input !pt-0'"
                  :hide-bottom-space="envInfoStore.envInfo.member_bank_real_name === 1 && column.column_name === 'fullname'"
                  v-model="(formRegister as Request.register)[column?.column_name]"
                ></ExtraInput>

                <!-- 下拉選單類型 -->
                <ExtraSelect
                  v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
                  v-model="(formRegister as Request.register)[column?.column_name]"
                  :field="column"
                  :class="'form-input !pt-0'"
                ></ExtraSelect>

                <DateInput
                  v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date"
                  :field="column"
                  :class="'form-input !pt-0'"
                  v-model="(formRegister as Request.register)[column?.column_name]"
                ></DateInput>

                <RealNameBankMatchNotice v-if="column.column_name === 'fullname'" />
              </div>
            </LoginRegisterOuterInputContainer>
          </template>
        </div>
        <div class="register-responsibility">
          <ResponsibilityClauseContent position="register" class="terms-container" />
          <ResponsibilityClauseImages position="register" class="responsibility-images" />
        </div>
      </div>
      <q-btn class="btn-submit mt-1 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.register") }}
      </q-btn>
      <div class="btn-password-container mt-2">
        <q-btn flat class="btn-password hide-hover" @click="changeDialog(true)" :disable="isLoading">
          {{ $t("common.btn.login") }}
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useSiteImg } from "app/template/okbet_blackGold/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import LoginRegisterOuterInputContainer from "src/common/components/LoginRegisterOuterInputContainer/index.vue"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
import ResponsibilityClauseAgreementCheckbox from "src/common/components/ResponsibilityClause/AgreementCheckbox.vue"
import ResponsibilityClauseContent from "src/common/components/ResponsibilityClause/Content.vue"
import ResponsibilityClauseImages from "src/common/components/ResponsibilityClause/Images.vue"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { useRule } from "src/common/hooks/useRule"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { FIELD_TYPE, LOGIN_METHOD, PIXEL_CODE_TYPE, REGISTER_METHOD, SMS_OTP_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import ExtraSelect from "../../components/ExtraInput/Select.vue"
import SmsOtpInput from "../../components/ExtraInput/SmsOtpInput.vue"

const $q = useQuasar()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const Rules = useRule()
const { isPhoneRegisterMode, companyName, inviteCode, defaultCountryCode, isRegisterOtpEnabled, isLoginOtpEnabled } =
  useEnv()
const envInfoStore = useEnvInfoStore()
const { isLoading, handleGetOTP, handleRegisterCustomInput, handleLogin, handleRegister, auth } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const { getFavoriteGames } = useGame()
const { loginImg, svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
const { isNOVM } = useAgentCode()
void [companyName, loginImg, isNOVM]
const { nowLang } = useLanguage()
const eventbus = injectStrict(EventBusKey)
const { handleOpenLiveChat } = useLiveChat()
const { handleTriggerPixelCode } = usePixelCodes()

const isLoginMode = ref(true)
const agreeTerms = ref(true)
const loginClauseHasContent = ref(false)
const counting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

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

type DialSelectOption = { label: string; value: string }

function normalizeDialSelectOptions(values: unknown): DialSelectOption[] {
  if (!Array.isArray(values) || values.length === 0) {
    return []
  }

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

const loginCountrySelectOptions = computed((): DialSelectOption[] => {
  const countryColumn = customInputList.value.find((column) => column.column_name === "country")
  const cmsOptions = normalizeDialSelectOptions(countryColumn?.values)
  if (cmsOptions.length > 0) {
    return cmsOptions
  }

  return (envInfoStore.envInfo.international_calling_code || []).map((dialCode) => {
    const value = String(dialCode)
    return { label: value, value }
  })
})

const firstPhoneOrCountryColumn = computed(() => {
  return customInputList.value.find((c) => c.column_name === "phone" || c.column_name === "country")?.column_name
})

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "", // 密碼用
  password: "", // 密碼用
  country: defaultCountryCode.value, // 手機用
  phone: "", // 手機用
  sms_otp: "", // 手機用
})
const isSmsLogin = computed(() => formLogin.login_method === LOGIN_METHOD.Enums.Sms)
const showPhoneLoginLayout = computed(() => isPhoneRegisterMode.value || isSmsLogin.value)

const formRegister = ref<Request.register>({
  is_customize: true,
  country: defaultCountryCode.value,
})

// 切換 登入/註冊 模式
function changeDialog(status: boolean) {
  isLoginMode.value = status
  showPassword.value = false
  showConfirmPassword.value = false
  formLogin.username = ""
  formLogin.password = ""
  formLogin.country = defaultCountryCode.value
  formRegister.value = {
    is_customize: true,
    country: defaultCountryCode.value,
  }
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formRegister.value = { ...formRegister.value, currency: singleCurrencyValue }
  }

  if (!status) {
    handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER)
    if (inviteCode.value) {
      formRegister.value.invite_code = inviteCode.value
    }
  }

  const targetRouteName = status ? "Login" : "Register"
  if (route.name !== targetRouteName) {
    void router.replace({ name: targetRouteName })
  }
}

// 切換手機登入時  - password/otp 模式
function changeLoginMethod(type: LOGIN_METHOD.Enums) {
  formLogin.login_method = type
  formLogin.username = ""
  formLogin.password = ""
  formLogin.phone = ""
  formLogin.sms_otp = ""
  formLogin.country = defaultCountryCode.value
}

async function register() {
  const payload = { ...formRegister.value }

  if (!isRegisterOtpEnabled.value) {
    delete payload.sms_otp
  }
  if (!payload.password) {
    delete payload.password
  }
  if (!payload.confirm_password) {
    delete payload.confirm_password
  }

  const { status } = await handleRegister(payload)

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
    formLogin.phone = formRegister.value.phone
    formLogin.username = formRegister.value.phone
    formLogin.country = formRegister.value.country || defaultCountryCode.value
    formLogin.password = formRegister.value.password
    formLogin.sms_otp = formRegister.value.sms_otp ?? ""
    const registerMethod = formRegister.value.register_method ?? envInfoStore.envInfo.registerMethod
    const useSmsOtpAutoLogin =
      registerMethod === REGISTER_METHOD.Enums.Phone && isRegisterOtpEnabled.value && !!formRegister.value.sms_otp

    const smsCountry = formRegister.value.country || defaultCountryCode.value
    const loginPayload: Request.login = useSmsOtpAutoLogin
      ? {
          login_method: LOGIN_METHOD.Enums.Sms,
          username: formRegister.value.phone,
          sms_otp: formRegister.value.sms_otp,
          ...(smsCountry ? { country: smsCountry } : {}),
        }
      : {
          login_method: LOGIN_METHOD.Enums.Password,
          country: formRegister.value.country || defaultCountryCode.value,
          phone: formRegister.value.phone,
          password: formRegister.value.password,
        }

    const { status: loginStatus } = await handleLogin(loginPayload)
    if (!loginStatus) {
      return
    }
    await loginAfter()
  } else {
    formLogin.username = formRegister.value.account
    formLogin.password = formRegister.value.password
    await login()
  }
}

async function getOtpCode() {
  // phoneRef.value.validate()
  // if (phoneRef.value.hasError) {
  //   return $q.notify({
  //     type: "negative",
  //     message: t("common.validate.verificationError"),
  //     position: "top"
  //   })
  // }
  counting.value = true
  const { status } = await handleGetOTP({
    phone: formLogin.phone,
    country_code: formLogin.country || defaultCountryCode.value,
    request_type: SMS_OTP_TYPE.Enums.Login,
  })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top",
    })
  }
}

function handleLoginSms() {
  if (!isLoginOtpEnabled.value || formLogin.login_method === LOGIN_METHOD.Enums.Password) {
    phoneLoginPassword()
    return
  }
  loginSms()
}

async function phoneLoginPassword() {
  const { status } = await handleLogin({
    login_method: LOGIN_METHOD.Enums.Password,
    country: formLogin.country || defaultCountryCode.value,
    phone: formLogin.phone,
    password: formLogin.password,
  })

  if (!status) {
    return
  }

  await loginAfter()
}

async function loginSms() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    username: formLogin.phone,
    sms_otp: formLogin.sms_otp,
    country: formLogin.country || defaultCountryCode.value,
  }
  const { status } = await handleLogin(payload)
  if (!status) {
    return
  }
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
      timeout: 1000,
    })
  }
  void router.replace({ name: "home" })
}

async function login() {
  const { status } = await handleLogin({
    login_method: LOGIN_METHOD.Enums.Password,
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
  void router.replace({ name: "home" })
}

function goForgotPassword() {
  eventbus.emit("openForgotPassword", true)
  void router.replace({ name: "home" })
}

watch(
  defaultCountryCode,
  (code) => {
    if (code && !formLogin.country) {
      formLogin.country = code
    }

    if (code && !formRegister.value.country) {
      formRegister.value.country = code
    }
  },
  { immediate: true }
)

function shouldRenderRegisterColumn(column: Response.RegistInputCustom) {
  if (column.column_name === "sms_otp") {
    return isRegisterOtpEnabled.value
  }

  return (
    excludeColumn(column.column_name) &&
    (column.type === FIELD_TYPE.Enums.Input ||
      column.type === FIELD_TYPE.Enums.Select ||
      column.type === FIELD_TYPE.Enums.Date)
  )
}

onMounted(async () => {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formRegister.value = { ...formRegister.value, currency: singleCurrencyValue }
  }

  // 在 customInputList 載入完成後，補設預設國碼（避免 options 尚未就緒時 q-select 無法匹配）
  const firstOption = loginCountrySelectOptions.value[0]
  if (firstOption) {
    if (!formLogin.country) formLogin.country = firstOption.value
    if (!formRegister.value.country) formRegister.value.country = firstOption.value
  }

  if (inviteCode.value) {
    formRegister.value.invite_code = inviteCode.value
  }

  eventbus.on("changeRegisterForm", () => {
    changeDialog(false)
  })

  eventbus.emit("registerFormReady")
})

defineExpose({ isLoginMode, changeDialog })
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/form.scss";
@import "app/template/okbet_blackGold/assets/css/button.scss";
@import "app/template/okbet_blackGold/assets/css/text.scss";

.label-text-color,
:deep(.label-text-color) {
  color: $common-white-color;
}

.pc {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.q-form) {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    min-height: 0;
  }

  .form-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .form-title {
    font-size: 1rem;
    color: $color-white-text;
    font-weight: 700;
    overflow-wrap: break-word;
    line-height: normal;
    letter-spacing: normal;
  }
  .form-input {
    ::v-deep(.q-field__inner) {
      height: fit-content;
    }
  }
  .form-subtitle {
    margin: 0.3125rem 0 0.625rem;
    font-size: 0.875rem;
    color: $color-subtitle;
    font-weight: 400;
    overflow-wrap: break-word;
    line-height: normal;
  }
  .login-country-phone-row {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.5rem;

    .login-country-code-select {
      flex: 1.4 1 0;
      min-width: 8.5rem;
      max-width: 42%;
      flex-shrink: 0;

      ::v-deep(.q-field__native),
      ::v-deep(.q-field__native span) {
        white-space: nowrap;
      }
    }

    .login-phone-input {
      flex: 2 1 0;
      min-width: 0;
    }
  }
  .sms-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .form-input {
      width: 18.875rem;
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 5.625rem;
      height: 2.5rem;
      margin-top: 0.1875rem;
    }
  }
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    background: $primary-gradient-color;
    color: $primary-text-black;
    height: 2.5rem;
    width: 100%;
    position: relative;
  }
  .btn-password-container {
    @apply flex justify-center items-center;
    color: $primary-gold-color;
    .btn-password {
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      text-transform: none;
    }
  }
  .forgot-container {
    @apply flex justify-end;
    color: $primary-gold-color;
    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
    }
  }
  .form-bottom {
    padding-top: 0.625rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .terms-container {
      width: 25rem;
      height: 8.75rem;
      border: 1px solid $gray-border-color;
      border-radius: 0.375rem;
      overflow-y: scroll;
      padding: 0.5rem 0.375rem;
      margin-bottom: 0.5rem;
      &::-webkit-scrollbar {
        display: block;
        width: 2px;
        height: 1.5rem;
        background-color: transparent;
        border-radius: 2.1875rem;
        appearance: inherit;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgb(204, 204, 204);
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        box-shadow: none;
        -webkit-box-shadow: none;
      }
      .term-row {
        color: $primary-white-color;
        font-size: 0.75rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.13rem;
        display: flex;
        -webkit-box-pack: start;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
      }
    }
    .agree-container {
      @apply flex justify-start items-center w-full;
      :deep(.agree-text) {
        margin: 0;
        padding: 0;
        color: $primary-white-color;
        font-size: 0.875rem;
        line-height: 1;
        list-style: none;
        position: relative;
        white-space: nowrap;
        cursor: pointer;
        border-radius: 0.25rem;
        align-self: center;
      }
    }
    .help-container {
      position: absolute;
      right: 0;
      bottom: -5rem;
      left: 0;
      padding-bottom: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      .help-row {
        color: $primary-white-color;
        font-size: 0.875rem;
        font-weight: 600;
        overflow-wrap: break-word;
        margin: 0.75rem 0;
        display: flex;
        align-items: center;
        .contact-us {
          @apply flex items-center cursor-pointer font-normal;
          height: 1.5rem;
          .contact-icon {
            margin: 0 0.625rem;
            img {
              width: 1rem;
              height: 1rem;
            }
          }
        }
      }
      .game-responsibly {
        width: 4.6875rem;
        height: 1.5625rem;
      }
      .responsibility-images {
        margin-top: 12px;
      }
    }
  }
}
.h5 {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.q-form) {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    min-height: 0;
  }

  .form-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .form-title {
    font-family: Helvetica;
    text-align: center;
    color: $color-white-text;
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 1.5625rem;
    margin-bottom: 0.5rem;
  }
  .form-subtitle {
    font-family: HelveticaLight;
    font-weight: 200;
    font-size: 0.9647rem;
    line-height: 1;
    text-transform: capitalize;
    color: $color-title-h5;
    text-align: center;
    min-height: 1.375rem;
  }
  .sms-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .form-input {
      width: 15.5rem;
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 5.625rem;
      height: 2.5rem;
      margin: 0.1875rem 1rem 0 1rem;
    }
  }
  .form-container {
    margin: 0.6875rem auto;
    box-shadow: rgba(0, 24, 30, 0.06) 0px 0.4375rem 0.6875rem;
    border-radius: 0.5rem;
    border: 1px solid $gray-border-color;
    padding-bottom: 0.625rem;
  }
  .btn-submit {
    height: 3.0625rem;
    width: 100%;
    font-family: inherit;
    font-size: 1.1026rem;
    margin-top: 0.6875rem;
    background: $primary-gradient-color !important;
    border-radius: 0.5rem;
    text-align: center;
    border: none;
    text-transform: capitalize;
    &.disabled {
      opacity: 0.5 !important;
    }
  }
  .btn-password-container {
    @apply flex justify-center items-center;
    margin-top: 1.0625rem;
    margin-bottom: 1rem;
    color: $primary-gold-color;
    .btn-password {
      font-weight: 400;
      font-size: 0.9647rem;
      overflow-wrap: break-word;
      text-transform: none;
      padding: 0;
      min-height: auto;
    }
  }
  .forgot-container {
    @apply flex justify-end;
    color: $primary-gold-color;
    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      padding: 0;
      min-height: auto;
    }
  }
  .form-bottom {
    width: 100%;
    margin-top: 1rem;
    color: $primary-white-color;
    backdrop-filter: blur(20px);
    .terms-container {
      width: 100%;
      height: 8.75rem;
      border: 1px solid $gray-border-color;
      border-radius: 0.375rem;
      overflow-y: scroll;
      padding: 0.75rem 0.625rem 0px;
      .term-row {
        width: 100%;
        line-height: 1.13rem;
        font-size: 0.75rem;
        text-transform: capitalize;
        text-align: left;
        font-weight: 400;
        font-family: Helvetica;
      }
    }
    .agree-container {
      width: 100%;
      padding-top: 0.5rem;
      box-shadow: rgba(0, 24, 30, 0.06) 0px -4px 6px;
      :deep(.agree-text) {
        font-size: 0.8269rem;
        line-height: 1.125rem;
      }
    }
    .help-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 0.625rem;
      .help-row {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        color: $primary-white-color;
        line-height: 1.125rem;
        letter-spacing: -0.02em;
        font-size: 0.8125rem;
        .contact-us {
          @apply flex items-center cursor-pointer font-normal;
          .contact-icon {
            margin: 0 2px;
            img {
              width: 1.25rem;
              height: 1.25rem;
            }
          }
        }
      }
      .game-responsibly {
        display: none;
      }
      .responsibility-images {
        margin-top: 12px;
      }
    }
  }
}

.agree-container {
  :deep(.q-checkbox__inner--truthy, .q-checkbox__inner--indet) {
    color: $primary-gold-color !important;
  }
  :deep(.q-checkbox__svg) {
    color: $primary-text-black !important;
  }
}

.input-control {
  :deep(.q-field__control:before) {
    @apply border-b-0;
  }
  :deep(.q-field__control-container) {
    @apply flex items-center justify-center;
  }
  :deep(.q-field__native) {
    height: calc(100% - 6px);

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
      -webkit-box-shadow: 0 0 0px 1000px $primary-black-color inset !important;
      box-shadow: 0 0 0px 1000px $primary-black-color inset !important;
      // 強制文字顏色（例如白色）
      // -webkit-text-fill-color: var(--secondary-01) !important;

      // --- 關鍵修復：處理左右出現的邊框 ---
      border-radius: 0 !important;
      border: none !important;
      outline: none !important;

      /* 阻止樣式跳轉 */
      transition: background-color 5000s ease-in-out 0s;
    }
  }
}

:global(.blackgold-login-country-popup .q-item--active) {
  background: rgba($color-primary, 0.12) !important;
}

:global(.blackgold-login-country-popup .q-item--active .q-item__label) {
  color: $color-primary !important;
}

.h5 .input-control {
  :deep(.q-field__native) {
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      // 使用巨大的內陰影覆蓋背景色
      -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
      box-shadow: 0 0 0px 1000px transparent inset !important;
    }
  }
}
.register-responsibility {
  margin-top: 0.75rem;
  color: $primary-white-color;

  .terms-container {
    width: 100%;
    max-height: 8.75rem;
    color: $primary-white-color;
    overflow-y: auto;

    :deep(p),
    :deep(span),
    :deep(ol),
    :deep(ul),
    :deep(li) {
      color: inherit;
    }
  }

  .responsibility-images {
    margin-top: 0.75rem;
    min-height: 1.5625rem;
  }
}
</style>
