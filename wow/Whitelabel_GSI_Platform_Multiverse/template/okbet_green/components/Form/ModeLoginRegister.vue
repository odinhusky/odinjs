<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <!-- login -->
    <q-form
      v-if="isLoginMode"
      @submit="isPhoneRegisterMode ? showVerifyModal([handlePhoneLogin]) : showVerifyModal([accountLogin])"
    >
      <div class="form-content">
        <!-- 三方Oauth按鈕區塊 -->
        <ThirdPartyLogin theme="light"></ThirdPartyLogin>

        <!-- 手機號碼欄位 -->
        <div v-if="isPhoneRegisterMode">
          <h2 class="form-title mb-2">
            {{ $t("member.login.phoneFormTitle") }}
          </h2>
          <h3 class="form-subtitle" v-if="formLogin.login_method === LOGIN_METHOD.Enums.Sms">
            {{ $t("member.login.phoneFormSubtitle") }}
          </h3>
          <div class="form-container">
            <!-- sms login -->
            <template v-if="formLogin.login_method === LOGIN_METHOD.Enums.Sms">
              <div class="sms-country-phone-row">
                <!-- country code -->
                <q-select
                  v-model="formLogin.country"
                  :options="envInfo.international_calling_code"
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input border-bottom border-bottom-full flex-[1]"
                  dense
                  borderless
                  :display-value="formLogin.country ? undefined : $t('member.register.country')"
                  ref="smsRef"
                >
                  <template #prepend>
                    <div class="divider-error"></div>
                    <!-- <div class="form-icon">
                  <img :src="svgIcon('people')" alt="country-code" />
                </div>
                <div class="divider"></div> -->
                  </template>
                </q-select>
                <!-- phone -->
                <q-input
                  v-model="formLogin.phone"
                  ref="phoneRef"
                  class="form-input border-bottom border-bottom-full flex-[2]"
                  dense
                  borderless
                  :placeholder="$t('member.login.phone')"
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
                    <!-- <div class="form-icon">
                  <img :src="svgIcon('phone')" alt="phone-number" />
                </div>
                <div class="divider"></div> -->
                  </template>
                </q-input>
              </div>

              <!-- SMS -->
              <div class="sms-container">
                <q-input
                  v-model="formLogin.sms_otp"
                  class="form-input"
                  dense
                  borderless
                  :placeholder="$t('member.login.verifyCode')"
                  lazy-rules
                  :rules="[Rules.required()]"
                >
                  <template #prepend>
                    <div class="divider-error"></div>
                    <!-- <div class="form-icon">
                  <img :src="svgIcon('shield')" alt="verify-code" />
                </div>
                <div class="divider"></div> -->
                  </template>
                </q-input>
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
                  @click="getLoginOtpCode"
                  :disable="isLoading || !formLogin.phone"
                />
              </div>
            </template>
            <!-- password login -->
            <template v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password">
              <div class="sms-country-phone-row">
                <!-- country code -->
                <q-select
                  v-model="formLogin.country"
                  :options="envInfo.international_calling_code"
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input border-bottom border-bottom-full flex-[1]"
                  dense
                  borderless
                  :display-value="formLogin.country ? undefined : $t('member.register.country')"
                  ref="smsRef"
                >
                  <template #prepend>
                    <div class="divider-error"></div>
                    <!-- <div class="form-icon">
                  <img :src="svgIcon('people')" alt="country-code" />
                </div>
                <div class="divider"></div> -->
                  </template>
                </q-select>
                <!-- phone -->
                <q-input
                  v-model="formLogin.phone"
                  ref="phoneRef"
                  class="form-input border-bottom border-bottom-full flex-[2]"
                  dense
                  borderless
                  :placeholder="$t('member.login.phone')"
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
                    <!-- <div class="form-icon">
                  <img :src="svgIcon('phone')" alt="phone-number" />
                </div>
                <div class="divider"></div> -->
                  </template>
                </q-input>
              </div>
              <!-- 密碼欄位 -->
              <q-input
                v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
                v-model="formLogin.password"
                class="form-input border-bottom"
                dense
                borderless
                :placeholder="$t('placeholder.pleaseEnterPassword')"
                lazy-rules
                :rules="[Rules.required()]"
                :type="showPassword ? 'text' : 'password'"
              >
                <template #prepend>
                  <div class="divider-error"></div>
                  <!-- <div class="form-icon">
                  <img :src="svgIcon('password')" alt="phone-number" />
                </div>
                <div class="divider"></div> -->
                </template>
                <template #append>
                  <q-icon
                    class="eye-icon"
                    :name="showPassword ? 'visibility' : 'visibility_off'"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
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
        <div v-if="isCash" class="forgot-container">
          <q-btn flat text-color="primary" class="hide-hover" :disable="isLoading" @click="goForgotPassword">
            {{ $t("member.forgotPassword.forgotPassword") }}
          </q-btn>
        </div>

        <!-- 切換帳號、手機 btn -->
        <div class="btn-password-container mt-3" v-if="isPhoneRegisterMode && isLoginOtpEnabled">
          <q-btn
            v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
            flat
            text-color="primary"
            class="btn-password hide-hover"
            @click="changeLoginMethod(LOGIN_METHOD.Enums.Sms)"
            :disable="isLoading"
          >
            {{ $t("common.btn.smsLogin") }}
          </q-btn>
          <q-btn
            v-else
            flat
            text-color="primary"
            class="btn-password hide-hover"
            @click="changeLoginMethod(LOGIN_METHOD.Enums.Password)"
            :disable="isLoading"
          >
            {{ $t("common.btn.passwordLogin") }}
          </q-btn>
        </div>

        <!-- 條款、幫助 -->
        <HelpSection
          v-model="agreeTerms"
          position="login"
          :is-loading="isLoading"
          @has-content="loginClauseHasContent = $event"
        />
      </div>

      <div class="form-action">
        <!-- 註冊按鈕 -->
        <q-btn
          v-if="isCash"
          flat
          color="primary"
          class="btn-switch hide-hover"
          @click="changeDialog(false)"
          :disable="isLoading"
        >
          {{ $t("common.btn.register") }}
        </q-btn>

        <!-- 登入按鈕 -->
        <q-btn
          color="primary"
          class="btn-submit hide-hover"
          type="submit"
          :disable="(loginClauseHasContent && !agreeTerms) || (isSmsLogin && !hasSentOtp)"
          :loading="isLoading"
        >
          {{ $t("common.btn.login") }}
        </q-btn>
      </div>
    </q-form>

    <!-- register -->
    <q-form v-else @submit="showVerifyModal([register])">
      <div class="form-content">
        <!-- 三方Oauth按鈕區塊 -->
        <ThirdPartyLogin theme="light"></ThirdPartyLogin>

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
                  :minAge="column.column_name === 'dob' ? 21 : 0"
                  :class="'form-input !pt-0'"
                  v-model="(formRegister as Request.register)[column?.column_name]"
                ></DateInput>

                <RealNameBankMatchNotice v-if="column.column_name === 'fullname'" />
              </div>
            </LoginRegisterOuterInputContainer>
          </template>
        </div>

        <!-- 條款、幫助 -->
        <HelpSection
          v-model="agreeTerms"
          position="register"
          :is-loading="isLoading"
          @has-content="registerClauseHasContent = $event"
        />
      </div>

      <div class="form-action">
        <q-btn flat color="primary" class="btn-switch hide-hover" @click="changeDialog(true)" :disable="isLoading">
          {{ $t("common.btn.login") }}
        </q-btn>
        <q-btn
          color="primary"
          class="btn-submit hide-hover"
          type="submit"
          :loading="isLoading"
          :disable="registerClauseHasContent && !agreeTerms"
        >
          {{ $t("common.btn.register") }}
        </q-btn>
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
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import LoginRegisterOuterInputContainer from "src/common/components/LoginRegisterOuterInputContainer/index.vue"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
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
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { useRule } from "src/common/hooks/useRule"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import {
  ERROR_CODE_TYPE,
  FIELD_TYPE,
  LOGIN_METHOD,
  PIXEL_CODE_TYPE,
  REGISTER_METHOD,
  SMS_OTP_TYPE,
} from "src/common/utils/constants"
import {
  useNationalPhoneBlurFullGate,
  useNationalPhoneRevalidateOnDialCodeChange,
} from "src/common/utils/nationalPhoneByDialCode"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { computed, defineExpose, onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import ExtraSelect from "../../components/ExtraInput/Select.vue"
import SmsOtpInput from "../../components/ExtraInput/SmsOtpInput.vue"
import HelpSection from "./HelpSection.vue"

const { getGiftsList } = useClaimGift()
const { nowLang } = useLanguage()
const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const {
  isPhoneRegisterMode,
  isCash,
  envData,
  inviteCode,
  defaultCountryCode,
  isRegisterOtpEnabled,
  isLoginOtpEnabled,
} = useEnv()
const envInfo = envData()
const {
  isLoading,
  isOnBoarding,
  hasSentOtp,
  handleGetOTP,
  handleRegisterCustomInput,
  handleLogin,
  handleLoginExchange,
  handleRegister,
  auth,
  handleGetTotpStatus,
} = useAuth()

const { getUserWalletList, useBasicInfoQuery, userKyc, getUserKycStatus, getUserKyc } = useUserInfo()
useBasicInfoQuery()
const { getFavoriteGames } = useGame()
const { svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
const { eventOn, eventEmit } = useEventBus()
const {} = useLiveChat()
const { moneyFormat } = useCommon()
const { getCurrencyCodeById } = useCurrency()
const { promotionState, firstRegisterPromotion } = usePromotionRegister()
const { handleTriggerPixelCode } = usePixelCodes()
const envInfoStore = useEnvInfoStore()

const isSmsLogin = computed(() => isPhoneRegisterMode.value && formLogin.login_method === LOGIN_METHOD.Enums.Sms)

const isLoginMode = ref(true)
const agreeTerms = ref(true)
const loginClauseHasContent = ref(false)
const registerClauseHasContent = ref(false)
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

    const { status: loginStatus, code } = await handleLogin(loginPayload)
    if (!loginStatus) {
      if (code === ERROR_CODE_TYPE.Enums.P_USER_AUTH_REQUIRED) {
        await loginAfterOnBoarding(loginPayload)
      }
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
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Password,
    username: formLogin.username,
    password: formLogin.password,
  }
  const { status, code } = await handleLogin(payload)

  if (!status) {
    if (code === ERROR_CODE_TYPE.Enums.P_USER_AUTH_REQUIRED) {
      await loginAfterOnBoarding(payload)
    }

    return
  }

  await loginAfter()
}

async function phoneLoginPassword() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Password,
    country: formLogin.country,
    phone: formLogin.phone,
    password: formLogin.password,
  }
  const { status, code } = await handleLogin(payload)

  if (!status) {
    if (code === ERROR_CODE_TYPE.Enums.P_USER_AUTH_REQUIRED) {
      await loginAfterOnBoarding(payload)
    }

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
  const { status, code } = await handleLogin(payload)

  if (!status) {
    if (code === ERROR_CODE_TYPE.Enums.P_USER_AUTH_REQUIRED) {
      await loginAfterOnBoarding(payload)
    }

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

  // if (isOnBoarding.value) {
  //   await getUserKycStatus()
  //   await getUserKyc()

  //   if (!userKyc.value.length) {
  //     eventEmit("openKycUploadDialog", true)
  //     return
  //   }

  //   eventEmit("openKycResultDialog", true, kycStatus.value)
  // }

  if (auth.value.need_update_profile === true) {
    eventEmit("openUpdateProfile", true)
  }
}

async function loginAfterOnBoarding(formData: Request.login) {
  await handleGetTotpStatus()
  eventEmit("openLogin", false)

  if (isOnBoarding.value) {
    await getUserKycStatus()
    await getUserKyc()

    if (!userKyc.value.length) {
      eventEmit("openKycUploadDialog", true)
      return new Promise((resolve) => {
        const handleKycCompleted = async (_success: boolean) => {
          // KYC 完成後，用前一次 login 拿到的暫時性 token (store.access_token)
          // 透過 /v1/player/user/login/exchange 換取正式 JWT。
          // 不論註冊管道是 SMS OTP 還是 password，都走同一條路，避免重用已被消費的 OTP。
          const { status } = await handleLoginExchange()
          if (status) {
            await loginAfter()
          }
          // _ = formData（保留簽名，不再用其欄位 re-login）
          void formData
          resolve(undefined)
        }

        // 監聽 KYC 完成事件（只監聽一次）
        eventOn("kycUploadCompleted", handleKycCompleted)
      })
    }

    // eventEmit("openKycResultDialog", true, kycStatus.value)
  }
}

function goForgotPassword() {
  eventEmit("openForgotPassword", true)
  eventEmit("openLogin", false)
}

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
@import "app/template/okbet_green/assets/css/_variable.sass";
@import "app/template/okbet_green/assets/css/form.scss";
@import "app/template/okbet_green/assets/css/button.scss";

.label-text-color,
:deep(.label-text-color) {
  color: $common-black-color;
  // @include pad-large-width {
  //   color: $common-black-color;
  // }
}

.sms-country-phone-row {
  @apply flex flex-nowrap gap-2;
}

.pc {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.q-form) {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .form-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .form-action {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    margin-top: 1.25rem;
  }

  .btn-switch {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    color: $text-light-color;
    height: 2.5rem;
    flex: 1;
  }

  .form-title {
    font-size: 1rem;
    color: $login-register-title;
    font-weight: 700;
    overflow-wrap: break-word;
    line-height: normal;
    letter-spacing: normal;
  }
  .form-input {
    ::v-deep(.q-field__inner) {
      height: fit-content;
      border-radius: 0.5rem;
    }

    ::v-deep(.q-field__control) {
      background: #fff;
      border-radius: 0.5rem;
      color: $primary-color;

      &::before {
        border: none;
      }
    }
  }
  .form-subtitle {
    margin: 0.3125rem 0 0.625rem;
    font-size: 0.875rem;
    color: $login-register-subtitle;
    font-weight: 400;
    overflow-wrap: break-word;
    line-height: normal;
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
      &.counting {
        background: $background-pale-silver-color;
        color: $text-sky-gray-color;
        opacity: 1 !important;
      }
    }
  }
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    color: $text-light-color;
    height: 2.5rem;
    flex: 1;
  }
  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn-password {
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      text-transform: none;
    }
  }
  .forgot-container {
    display: flex;
    justify-content: flex-end;
    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      padding: 0;
      overflow-wrap: break-word;
      min-height: initial;
    }
  }
  .promotion-register-wrapper {
    @apply relative w-full h-[6.75rem] rounded-xl mt-[3.25rem];

    &:after {
      @apply block absolute top-0 right-0 bottom-0 left-0 z-0 rounded-xl;
      content: "";
      background-size: cover;
      background-position: center top;
      background-repeat: no-repeat;
      background-image: url("../../../../src/common/assets/images/roulette-game-register/bg-register.png");
    }

    .promotion-register-content {
      @apply absolute z-10;
      max-width: 260px;
      top: 22.5px;
      left: 133.23px;
      font-family: NotoSans;
      font-weight: 700;
      color: #ffffff;

      .content-title {
        @apply block max-w-full;
        font-size: 1rem;
        line-height: 1.375rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .content-value {
        @apply block max-w-full;
        font-size: 30px;
        line-height: 2.5625rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.h5 {
  padding: 0 0.625rem;
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.q-form) {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .form-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .form-action {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
  }

  .btn-switch {
    height: 3.0625rem;
    flex: 1;
    font-family: inherit;
    font-size: 1.1026rem;
    text-align: center;
    border: none;
    text-transform: capitalize;
    border-radius: 0.625rem;
    color: $text-light-color;
    &.disabled {
      opacity: 0.5 !important;
    }
  }

  .form-title {
    font-family: Helvetica;
    text-align: center;
    color: $login-register-title-h5;
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 1.5625rem;
    margin-bottom: 0.5rem;
  }
  .form-input {
    ::v-deep(.q-field__inner) {
      height: fit-content;
      border-radius: 0.5rem;
    }

    ::v-deep(.q-field__control) {
      background: #fff;
      border-radius: 0.5rem;
      color: #009e50 !important;
    }
  }
  .form-subtitle {
    font-weight: 200;
    font-size: 0.9647rem;
    line-height: 1;
    text-transform: capitalize;
    color: $login-register-title-h5;
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
      &.counting {
        background: $background-pale-silver-color !important;
        color: $text-sky-gray-color !important;
        &.disabled {
          opacity: 1 !important;
        }
      }
    }
  }
  .form-container {
    margin: 0.6875rem auto;
    background: $background-light-color;
    box-shadow: rgba($box-shadow-deep-slate-color, 0.06) 0px 0.4375rem 0.6875rem;
    border-radius: 0.5rem;
    border: 1px solid $border-misty-blue-color;
    padding-bottom: 0.625rem;
  }
  .btn-submit {
    height: 3.0625rem;
    flex: 1;
    font-family: inherit;
    font-size: 1.1026rem;
    border-radius: 0.5rem;
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
    margin-top: 1.0625rem;
    margin-bottom: 1rem;
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
    display: flex;
    justify-content: flex-end;
    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      padding: 0;
      min-height: auto;
    }
  }

  .promotion-register-wrapper {
    @apply relative w-full h-[6.21rem] rounded-xl my-[1.6875rem];

    &:after {
      @apply block absolute top-0 right-0 bottom-0 left-0 z-0 rounded-xl;
      content: "";
      background-size: cover;
      background-position: center top;
      background-repeat: no-repeat;
      background-image: url("../../../../src/common/assets/images/roulette-game-register/bg-register.png");
    }

    .promotion-register-content {
      @apply absolute z-10;
      max-width: 240px;
      top: 20.68px;
      left: 122.57px;
      font-family: NotoSans;
      font-weight: 700;
      color: #ffffff;

      .content-title {
        @apply block max-w-full;
        font-size: 0.92rem;
        line-height: 1.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .content-value {
        @apply block max-w-full;
        font-size: 1.725rem;
        line-height: 2.375rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
