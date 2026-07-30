<template>
  <div :class="`${isDown.phone ? 'h5' : 'pc'}`">
    <!-- 三方Oauth按鈕區塊 -->
    <ThirdPartyLogin></ThirdPartyLogin>

    <!-- login -->
    <q-form
      v-if="isLoginMode"
      @submit="showPhoneLoginLayout ? showVerifyModal([handlePhoneLogin]) : showVerifyModal([accountLogin])"
    >
      <div class="form-content">
        <!-- 手機號碼欄位 -->
        <div v-if="showPhoneLoginLayout">
          <div class="form-container">
            <!-- sms login -->
            <template v-if="formLogin.login_method === LOGIN_METHOD.Enums.Sms">
              <div class="sms-country-phone-row">
                <!-- country code -->
                <div class="form-input-container">
                  <div class="form-input-label">{{ $t("member.register.country") }}</div>
                  <q-select
                    v-model="formLogin.country"
                    :options="envInfo.international_calling_code"
                    lazy-rules
                    :rules="[Rules.required()]"
                    class="form-input border-bottom-full flex-[1] text-center"
                    dense
                    borderless
                    :display-value="formLogin.country ? undefined : $t('member.register.country')"
                    ref="smsRef"
                  >
                    <template #prepend>
                      <div class="divider-error"></div>
                    </template>
                  </q-select>
                </div>
                <!-- phone -->
                <div class="form-input-container flex-1">
                  <div class="form-input-label">{{ $t("member.login.phone") }}</div>
                  <q-input
                    v-model="formLogin.phone"
                    ref="phoneRef"
                    class="form-input border-bottom-full flex-[2]"
                    dense
                    borderless
                    :placeholder="$t('placeholder.pleaseEnterPhoneNumber')"
                    :lazy-rules="Rules.nationalPhoneLazyRules(formLogin.country)"
                    :rules="[Rules.nationalPhoneByDialCode(formLogin.country, nationalPhoneRuleOpts)]"
                    :maxlength="Rules.nationalPhoneMaxLength(formLogin.country)"
                    inputmode="numeric"
                    @blur="onNationalPhoneBlur"
                    @focus="onNationalPhoneFocus"
                    @update:model-value="
                      (v) => (formLogin.phone = Rules.sanitizeNationalPhoneDigits(v, formLogin.country))
                    "
                  >
                    <template #prepend>
                      <div class="divider-error"></div>
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- SMS -->
              <div class="form-input-container">
                <div class="form-input-label">{{ $t("member.login.verifyCode") }}</div>
                <div class="sms-container">
                  <q-input
                    v-model="formLogin.sms_otp"
                    class="form-input"
                    dense
                    borderless
                    :placeholder="$t('placeholder.pleaseEnterVerificationCode')"
                    lazy-rules
                    :rules="[Rules.required()]"
                  >
                    <template #prepend>
                      <div class="divider-error"></div>
                    </template>
                  </q-input>
                  <q-btn v-if="counting" class="btn-send counting hide-hover" flat borderless disable>
                    <vue-countdown
                      @end="counting = false"
                      :time="90000"
                      v-slot="{ totalSeconds }"
                      class="counting-text"
                    >
                      {{ `${totalSeconds}S` }}
                    </vue-countdown>
                  </q-btn>
                  <q-btn
                    v-else
                    color="primary"
                    class="btn-send hide-hover"
                    :label="$t('common.btn.send')"
                    @click="getLoginOtpCode"
                    :disable="isLoading || !formLogin.phone"
                  />
                </div>
              </div>
            </template>
            <!-- password login -->
            <template v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password">
              <div class="sms-country-phone-row">
                <div class="form-input-container">
                  <div class="form-input-label">{{ $t("member.register.country") }}</div>
                  <!-- country code -->
                  <q-select
                    v-model="formLogin.country"
                    :options="envInfo.international_calling_code"
                    lazy-rules
                    :rules="[Rules.required()]"
                    class="form-input border-bottom-full flex-[1]"
                    dense
                    borderless
                    :display-value="formLogin.country ? undefined : $t('member.register.country')"
                    ref="smsRef"
                  >
                    <template #prepend>
                      <div class="divider-error"></div>
                    </template>
                  </q-select>
                </div>
                <div class="form-input-container flex-1">
                  <div class="form-input-label">{{ $t("member.login.phone") }}</div>

                  <!-- phone -->
                  <q-input
                    v-model="formLogin.phone"
                    ref="phoneRef"
                    class="form-input border-bottom-full flex-[2]"
                    dense
                    borderless
                    :placeholder="$t('placeholder.pleaseEnterPhoneNumber')"
                    :lazy-rules="Rules.nationalPhoneLazyRules(formLogin.country)"
                    :rules="[Rules.nationalPhoneByDialCode(formLogin.country, nationalPhoneRuleOpts)]"
                    :maxlength="Rules.nationalPhoneMaxLength(formLogin.country)"
                    inputmode="numeric"
                    @blur="onNationalPhoneBlur"
                    @focus="onNationalPhoneFocus"
                    @update:model-value="
                      (v) => (formLogin.phone = Rules.sanitizeNationalPhoneDigits(v, formLogin.country))
                    "
                  >
                    <template #prepend>
                      <div class="divider-error"></div>
                    </template>
                  </q-input>
                </div>
              </div>
              <!-- 密碼欄位 -->
              <div class="form-input-container">
                <div class="form-input-label">{{ $t("member.register.password") }}</div>
                <q-input
                  v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
                  v-model="formLogin.password"
                  class="form-input"
                  dense
                  borderless
                  :placeholder="$t('placeholder.pleaseEnterPassword')"
                  lazy-rules
                  :rules="[Rules.required()]"
                  :type="showPassword ? 'text' : 'password'"
                >
                  <template #prepend>
                    <div class="divider-error"></div>
                  </template>
                  <template #append>
                    <q-icon
                      class="eye-icon"
                      :name="showPassword ? 'visibility' : 'visibility_off'"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
              </div>
            </template>
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
              class="form-input !pt-0"
              dense
              borderless
              :placeholder="$t('placeholder.pleaseEnterUsername')"
              lazy-rules
              :rules="[Rules.required()]"
            >
              <template #prepend>
                <div class="divider-error"></div>
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
              class="form-input !pt-0"
              dense
              borderless
              :placeholder="$t('placeholder.pleaseEnterPassword')"
              lazy-rules
              :rules="[Rules.required()]"
              :type="showPassword ? 'text' : 'password'"
            >
              <template #prepend>
                <div class="divider-error"></div>
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
        <div v-if="isCash" class="forgot-container">
          <q-btn flat class="hide-hover" :disable="isLoading" @click="$router.push({ name: 'ForgotPass' })">
            {{ `${$t("member.forgotPassword.forgotPassword")}?` }}
          </q-btn>
        </div>

        <!-- 切換帳號、手機 btn -->
        <div v-if="isLoginOtpEnabled" class="btn-password-container flex items-center btn-phone-login-switch mt-3">
          <q-btn
            v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
            flat
            class="btn-password hide-hover"
            text-color="white"
            @click="changeLoginMethod(LOGIN_METHOD.Enums.Sms)"
            :disable="isLoading"
          >
            {{ $t("common.btn.smsLogin") }}
          </q-btn>
          <q-btn
            v-else
            flat
            class="btn-password hide-hover"
            text-color="white"
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
            :disabled="isLoading"
            :use-circle-icons="isDown.phone"
            @has-content="loginClauseHasContent = $event"
          />
          <div class="help-container">
            <p class="help-row">
              <span>{{ $t("member.login.needHelp") }} ? </span>
              <span class="contact-us" @click="handleOpenLiveChat">
                <div class="contact-icon">
                  <img :src="svgIcon('service')" alt="phone-number" />
                </div>
                {{ $t("home.contact_us") }}
              </span>
            </p>
            <ResponsibilityClauseImages position="login" class="responsibility-images" />
          </div>
        </div>
      </div>
      <div class="form-action">
        <!-- 登入按鈕 -->
        <q-btn
          color="primary"
          class="btn-submit mt-6 hide-hover"
          type="submit"
          :disable="loginClauseHasContent && !agreeTerms"
          :loading="isLoading"
        >
          {{ $t("common.btn.login") }}
        </q-btn>

        <!-- 註冊按鈕 -->
        <div v-if="isCash" class="btn-password-container">
          <div class="mr-3">{{ $t("member.login.noAccount") }}</div>
          <q-btn
            flat
            class="btn-password hide-hover"
            text-color="primary"
            @click="changeDialog(false)"
            :disable="isLoading"
          >
            {{ $t("member.forgotPassword.registeredAccount") }}
          </q-btn>
        </div>
      </div>
    </q-form>

    <!-- register -->
    <q-form v-else @submit="showVerifyModal([register])">
      <div class="form-content">
        <h3 v-if="isPhoneRegisterMode && isRegisterOtpEnabled" class="form-subtitle">
          {{ $t("member.login.phoneFormSubtitle") }}
        </h3>

        <div class="form-container pad:pt-3" v-if="customInputList.length !== 0">
          <template v-for="(column, key) in customInputList" :key="key">
            <!-- CMS欄位 -->
            <PhoneInput
              v-if="column.column_name === firstPhoneOrCountryColumn"
              v-model:phone="formRegister.phone"
              v-model:country="formRegister.country"
              :class="'form-input'"
              :phone-disable="phoneColumnDisable"
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
                  :phone="formRegister?.phone ?? ''"
                  :country-code="formRegister?.country || defaultCountryCode"
                  :class="'form-input !pt-0'"
                  v-model="(formRegister as Request.register)[column?.column_name]"
                ></SmsOtpInput>

                <ExtraInput
                  v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input"
                  :field="column"
                  :class="'form-input !pt-0'"
                  :custom-placeholder="genPlaceholderByColumnRule(column)"
                  :hide-bottom-space="envInfoStore.envInfo.member_bank_real_name === 1 && column.column_name === 'fullname'"
                  v-model="(formRegister as Request.register)[column?.column_name]"
                ></ExtraInput>

                <!-- 下拉選單類型 -->
                <ExtraSelect
                  v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
                  v-model="(formRegister as Request.register)[column?.column_name]"
                  :field="column"
                  :class="'form-input !pt-0'"
                  hide-field-label
                ></ExtraSelect>
                <DateInput
                  v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date"
                  :field="column"
                  :class="'form-input !pt-0'"
                  hide-field-label
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
      <q-btn color="primary" class="btn-submit mt-1 hide-hover" type="submit" :loading="isLoading">
        {{ $t("menu.createAccount") }}
      </q-btn>
      <div class="btn-password-container">
        <div class="mr-3">{{ $t("member.login.hasAccount") }}</div>
        <q-btn
          flat
          text-color="primary"
          class="btn-password hide-hover"
          @click="changeDialog(true)"
          :disable="isLoading"
        >
          {{ $t("common.btn.login") }}
        </q-btn>
      </div>
      <div
        v-if="promotionState.isFinishSpinRegisterRoulette && firstRegisterPromotion"
        class="promotion-register-wrapper"
      >
        <div class="promotion-register-content">
          <div class="content-title">{{ $t("promotion.signing_up") }}</div>
          <div class="content-value">
            {{ getCurrencyCodeById(firstRegisterPromotion.reward[0].currency_id) }}
            {{ moneyFormat(firstRegisterPromotion.reward[0].amount) }}
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import LoginRegisterOuterInputContainer from "src/common/components/LoginRegisterOuterInputContainer/index.vue"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
import ResponsibilityClauseAgreementCheckbox from "src/common/components/ResponsibilityClause/AgreementCheckbox.vue"
import ResponsibilityClauseContent from "src/common/components/ResponsibilityClause/Content.vue"
import ResponsibilityClauseImages from "src/common/components/ResponsibilityClause/Images.vue"
import ThirdPartyLogin from "src/common/components/ThirdPartyLogin/Index.vue"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { usePromotionRegister } from "src/common/composables/usePromotionRegister"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useCommon } from "src/common/hooks/useCommon"
import { useCurrency } from "src/common/hooks/useCurrency"
import { useEnv } from "src/common/hooks/useEnv"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { useRule } from "src/common/hooks/useRule"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { FIELD_TYPE, LOGIN_METHOD, PIXEL_CODE_TYPE, REGISTER_METHOD, SMS_OTP_TYPE } from "src/common/utils/constants"
import { genPlaceholderByColumnRule } from "src/common/utils/customRulesUtils"
import {
  useNationalPhoneBlurFullGate,
  useNationalPhoneRevalidateOnDialCodeChange,
} from "src/common/utils/nationalPhoneByDialCode"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { computed, onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import ExtraSelect from "../../components/ExtraInput/Select.vue"
import SmsOtpInput from "../../components/ExtraInput/SmsOtpInput.vue"

const { nowLang } = useLanguage()
const { getGiftsList } = useClaimGift()
const { isDown } = useMediaQuery()
const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const {
  isPhoneRegisterMode,
  companyName,
  isCash,
  envData,
  inviteCode,
  defaultCountryCode,
  isRegisterOtpEnabled,
  isLoginOtpEnabled,
} = useEnv()
// envData is required by the country selectors through envInfo.
const envInfo = envData()
const { isLoading, handleGetOTP, handleRegisterCustomInput, handleLogin, handleRegister, auth } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const { getFavoriteGames } = useGame()
const { loginImg, svgIcon } = useSiteImg()
void [companyName, loginImg]
const { showVerifyModal } = useSlideVerify()
const { eventOn, eventEmit } = useEventBus()
const { handleOpenLiveChat } = useLiveChat()
const { moneyFormat } = useCommon()
const { getCurrencyCodeById } = useCurrency()
const { promotionState, firstRegisterPromotion } = usePromotionRegister()
const { handleTriggerPixelCode } = usePixelCodes()
const envInfoStore = useEnvInfoStore()

const isLoginMode = ref(true)
const agreeTerms = ref(true)
const loginClauseHasContent = ref(false)
const counting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const phoneColumnDisable = ref(false)
const phoneRef = ref()
const smsRef = ref()

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

const firstPhoneOrCountryColumn = computed(() => {
  return customInputList.value.find((c) => c.column_name === "phone" || c.column_name === "country")?.column_name
})

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "", // 密碼用
  password: "", // 密碼用
  country: defaultCountryCode.value, // 手機用；僅單一國碼時由 store 預填
  phone: "", // 手機用
  sms_otp: "", // 手機用
})
const isSmsLogin = computed(() => formLogin.login_method === LOGIN_METHOD.Enums.Sms)
const showPhoneLoginLayout = computed(() => isPhoneRegisterMode.value || isSmsLogin.value)

useNationalPhoneRevalidateOnDialCodeChange(() => formLogin.country, phoneRef)

const { requireFullNationalNumber, onNationalPhoneBlur, onNationalPhoneFocus } = useNationalPhoneBlurFullGate(
  phoneRef,
  computed(() => formLogin.country)
)

const nationalPhoneRuleOpts = { requireFullNationalNumber }

const formRegister = ref<Request.register>({
  is_customize: true,
  country: defaultCountryCode.value,
})

function _handlePhoneInput(val: string) {
  formLogin.phone = Rules.sanitizeNationalPhoneDigits(val, formLogin.country)
}

// 切換 登入/註冊 模式
function changeDialog(status: boolean) {
  isLoginMode.value = status
  showPassword.value = false
  showConfirmPassword.value = false
  formLogin.username = ""
  formLogin.password = ""
  formLogin.sms_otp = ""
  formLogin.country = defaultCountryCode.value
  formRegister.value = {
    is_customize: true,
    country: defaultCountryCode.value,
  }
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formRegister.value = { ...formRegister.value, currency: singleCurrencyValue }
  }

  if (status) {
    changeLoginMethod(LOGIN_METHOD.Enums.Password)
    formLogin.phone = ""
    phoneColumnDisable.value = false
  }

  if (!status) {
    handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER)
    // 自動填入邀請碼（如果存在）
    if (inviteCode.value) {
      formRegister.value.invite_code = inviteCode.value
    }
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
    formLogin.country = formRegister.value.country
    formLogin.password = formRegister.value.password || ""
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
    await accountLogin()
  }
}

async function getLoginOtpCode() {
  smsRef.value.validate()
  if (smsRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.verificationError"),
      position: "top",
    })
  }
  phoneRef.value.validate()
  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.verificationError"),
      position: "top",
    })
  }

  counting.value = true
  const { status } = await handleGetOTP({
    phone: formLogin.phone as string,
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

async function handlePhoneLogin() {
  // 手機模式下，使用密碼登入
  if (!isLoginOtpEnabled.value || formLogin.login_method === LOGIN_METHOD.Enums.Password) {
    phoneLoginPassword()
    return
  }

  phoneLoginSms()
}

async function accountLogin() {
  const { status } = await handleLogin({
    login_method: LOGIN_METHOD.Enums.Password,
    username: formLogin.username,
    password: formLogin.password,
  })

  if (!status) {
    return
  }

  await loginAfter()
}

async function phoneLoginPassword() {
  const { status } = await handleLogin({
    login_method: LOGIN_METHOD.Enums.Password,
    country: formLogin.country,
    phone: formLogin.phone,
    password: formLogin.password,
  })

  if (!status) {
    return
  }

  await loginAfter()
}

async function phoneLoginSms() {
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
    await getGiftsList()
    await getFavoriteGames()
    await getUserWalletList()
    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000,
    })
  }
  eventEmit("openLogin", false)

  if (auth.value.need_update_profile === true) {
    eventEmit("openUpdateProfile", true)
  }
}

// watch(isLoginMode, (newVal) => {
//   emits("loginMode", newVal)
// })

watch(defaultCountryCode, (code) => {
  if (code && !formLogin.country) {
    formLogin.country = code
  }

  if (code && !formRegister.value.country) {
    formRegister.value.country = code
  }
})

onMounted(async () => {
  changeLoginMethod(LOGIN_METHOD.Enums.Password)
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formRegister.value = { ...formRegister.value, currency: singleCurrencyValue }
  }

  // 初始化時自動填入邀請碼（如果存在），並自動切換到註冊模式
  if (inviteCode.value) {
    formRegister.value.invite_code = inviteCode.value
    // 自動切換到註冊模式
    changeDialog(false)
  }

  eventOn("openLogin", (_show: boolean) => {
    // 如果有邀請碼，直接切換到註冊模式
    if (inviteCode.value) {
      changeDialog(false)
    } else {
      changeDialog(true)
    }
  })

  eventOn("changeRegisterForm", () => {
    changeDialog(false)
  })

  eventEmit("registerFormReady")
})

defineExpose({ isLoginMode })

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
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/form.scss";

.label-text-color,
:deep(.label-text-color) {
  color: var(--neutral-01);
}

.sms-country-phone-row {
  @apply flex flex-nowrap gap-2;

  :deep(.q-field__inner) {
    i {
      color: var(--neutral-01);
    }
  }
}

.btn-phone-login-switch {
  width: 100%;
  text-align: center;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.625rem;
}

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

.pc {
  display: flex;
  flex-direction: column;
  height: 100%;

  .form-container {
    .input-label {
      color: var(--neutral-01);
      font-size: 0.8rem;
    }
  }

  .form-input-container {
    min-width: 8rem;
  }

  .form-input-label {
    color: var(--neutral-04);
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .form-input {
    margin-top: 0;

    ::v-deep(.q-field__inner) {
      height: 2.7875rem;
      border-radius: 0.25rem;
      border: 2px solid var(--neutral-05);
      background: var(--secondary-10);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);

      .q-field__native {
        color: var(--neutral-01);
        padding: 0.75rem !important;
      }

      .q-field__control {
        color: var(--primany-01);

        input {
          padding: 0 0.75rem;
        }
      }
    }
  }

  .form-subtitle {
    margin: 0 0 1.75rem;
    font-size: 0.875rem;
    color: var(--neutral-04);
    font-weight: 400;
    overflow-wrap: break-word;
    line-height: normal;
    text-align: center;
  }
  .sms-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .form-input {
      flex: 1;

      :deep(.q-field__control) {
        color: var(--primany-01);
      }
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 9.375rem;
      height: 2.7875rem;
      font-weight: 700;
      font-size: 0.75rem;

      &.counting {
        background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%);
        color: var(--neutral-01);
        opacity: 1 !important;
      }
    }
  }
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 700;
    text-transform: capitalize;
    border-radius: 0.25rem;
    color: var(--primany-01);
    height: 3.75rem;
    width: 100%;
    position: relative;
    margin: 1.5rem auto;
  }
  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--neutral-04);
    font-weight: 400;
    font-size: 0.875rem;

    .divider-vertical {
      color: var(--primany-01);
      margin: 0 0.75rem;
    }

    .btn-password {
      overflow-wrap: break-word;
      text-transform: none;
      padding: 0;
      min-height: auto;
    }
  }
  .forgot-container {
    display: flex;
    justify-content: flex-end;
    color: var(--neutral-01);
    margin-bottom: 0.625rem;

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
    padding-top: 0.625rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .terms-container {
      width: 30.25rem;
      height: 8.75rem;
      border: 1px solid var(--neutral-05);
      border-radius: 0.375rem;
      color: var(--neutral-01);
      overflow-y: scroll;
      padding: 0.5rem 0.375rem;
      margin-bottom: 0.5rem;

      :deep(p),
      :deep(span),
      :deep(ol),
      :deep(ul),
      :deep(li) {
        color: inherit;
      }

      &::-webkit-scrollbar {
        display: block;
        width: 2px;
        height: 1.5rem;
        background-color: transparent;
        border-radius: 2.1875rem;
        appearance: inherit;
      }
      &::-webkit-scrollbar-thumb {
        background-color: var(--primany-01);
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        box-shadow: none;
        -webkit-box-shadow: none;
      }
      .term-row {
        color: var(--neutral-04);
        font-family: "Open Sans";
        font-size: 0.75rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.13rem;
        display: flex;
        -webkit-box-pack: start;
        justify-content: flex-start;
        align-items: flex-start;
      }
    }
    .agree-container {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      :deep(.agree-text) {
        margin: 0;
        padding: 0;
        color: var(--neutral-01);
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
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .help-row {
        color: var(--neutral-04);
        font-size: 0.875rem;
        font-weight: 600;
        overflow-wrap: break-word;
        margin: 0.75rem 0;
        display: flex;
        align-items: center;
        .contact-us {
          height: 1.5rem;
          display: flex;
          align-items: center;
          font-weight: 410;
          color: var(--primany-01);
          cursor: pointer;
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
    }
  }
}

.h5 {
  display: flex;
  flex-direction: column;
  height: 100%;

  .form-input-container {
    min-width: 8rem;
  }

  .form-input-label {
    color: var(--neutral-04);
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .form-input {
    height: 3.75rem;
    padding: 0;
    margin-bottom: 0;
    ::v-deep(.q-field__inner) {
      height: 2.7875rem;
      border-radius: 0.25rem;
      border: 2px solid var(--neutral-05);
      background: var(--secondary-10);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);

      .q-field__native {
        color: var(--neutral-01);
        padding: 0.75rem !important;
      }

      .q-field__control {
        color: var(--primany-01);
        padding: 0;

        input {
          padding: 0 0.75rem;
        }
      }
    }
  }
  .form-subtitle {
    margin: 1rem 0 0;
    font-size: 0.875rem;
    color: var(--neutral-04);
    font-weight: 400;
    overflow-wrap: break-word;
    line-height: normal;
    text-align: center;
  }
  .sms-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .form-input {
      flex: 1;

      :deep(.q-field__control) {
        color: var(--primany-01);
      }
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 9.375rem;
      height: 2.7875rem;
      font-weight: 700;
      font-size: 0.75rem;
    }
  }

  .register-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--neutral-01);
    text-align: center;
    margin-top: 1.5rem;
  }

  .form-container {
    margin: 0 auto;
    border-radius: 0.5rem;
    .input-label {
      padding: 0rem 0.75rem 0rem;
      color: var(--neutral-01);
      font-size: 0.8rem;
    }
  }
  .btn-submit {
    height: 60px;
    width: 100%;
    display: flex;
    margin: 1rem auto;
    font-family: inherit;
    font-size: 1rem;
    border-radius: 4px;
    text-align: center;
    border: none;
    text-transform: capitalize;
    &.disabled {
      opacity: 0.5 !important;
    }
  }
  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--neutral-01);
    margin-bottom: 1rem;
    font-weight: 400;
    font-size: 0.875rem;

    .divider-vertical {
      color: var(--primany-01);
      margin: 0 0.75rem;
    }

    .btn-password {
      overflow-wrap: break-word;
      text-transform: none;
      padding: 0;
      min-height: auto;
    }
  }
  .forgot-container {
    display: flex;
    justify-content: flex-end;
    color: var(--neutral-01);

    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      padding: 0;
      min-height: auto;
      margin-bottom: 0.625rem;
    }
  }
  .form-bottom {
    width: 100%;
    border-radius: 16px;
    backdrop-filter: blur(20px);

    .terms-container {
      width: 100%;
      border: 1px solid var(--neutral-05);
      border-radius: 0.375rem;
      color: var(--neutral-01);
      overflow-y: scroll;
      padding: 0.625rem;

      :deep(p),
      :deep(span),
      :deep(ol),
      :deep(ul),
      :deep(li) {
        color: inherit;
      }

      .term-row {
        width: 100%;
        color: var(--neutral-04);
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
      color: var(--neutral-01);
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
        color: var(--neutral-04);
        line-height: 1.125rem;
        letter-spacing: -0.02em;
        font-size: 0.8125rem;
        .contact-us {
          display: flex;
          align-items: center;
          font-weight: 410;
          color: var(--primany-01);
          cursor: pointer;
          .contact-icon {
            margin: 0 2px 0 0.625rem;
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
    }
  }
}
.register-responsibility {
  margin-top: 0.75rem;
  color: var(--neutral-01);

  .terms-container {
    width: 100%;
    max-height: 8.75rem;
    border: 1px solid var(--neutral-05);
    border-radius: 0.375rem;
    color: inherit;
    overflow-y: auto;
    padding: 0.5rem 0.375rem;

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
