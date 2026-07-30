<template>
  <div :class="`${isLargeTablet ? 'h5' : 'pc'}`">
    <!-- login -->
    <q-form
      v-if="isLoginMode"
      autocomplete="off"
      @submit="isPhoneRegisterMode ? showVerifyModal([handlePhoneLogin]) : showVerifyModal([accountLogin])"
    >
      <input type="text" name="fakeusernameremembered" autocomplete="off" style="display: none" />
      <input type="password" name="fakepasswordremembered" autocomplete="new-password" style="display: none" />
      <!-- 手機號碼欄位 -->
      <div v-if="showPhoneLoginLayout">
        <h2 class="form-title mb-2">
          {{ $t("member.login.phoneFormTitle") }}
        </h2>
        <h3 class="form-subtitle" v-if="formLogin.login_method === LOGIN_METHOD.Enums.Sms">
          {{ $t("member.login.phoneFormSubtitle") }}
        </h3>
        <div class="form-container">
          <!-- sms login -->
          <template v-if="isLoginOtpEnabled && formLogin.login_method === LOGIN_METHOD.Enums.Sms">
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
                  <div class="form-icon">
                    <img :src="svgIcon('country')" alt="country-code" />
                  </div>
                  <div class="divider"></div>
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
                autocomplete="off"
                name="login-phone-nosave"
                @blur="onNationalPhoneBlur"
                @focus="onNationalPhoneFocus"
                @update:model-value="(v) => (formLogin.phone = Rules.sanitizeNationalPhoneDigits(v, formLogin.country))"
              >
                <template #prepend>
                  <div class="divider-error"></div>
                  <div class="form-icon">
                    <img :src="svgIcon('phone')" alt="phone-number" />
                  </div>
                  <div class="divider"></div>
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
                autocomplete="one-time-code"
                name="login-otp-nosave"
              >
                <template #prepend>
                  <div class="divider-error"></div>
                  <div class="form-icon">
                    <img :src="svgIcon('shield')" alt="verify-code" />
                  </div>
                  <div class="divider"></div>
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
                  <div class="form-icon">
                    <img :src="svgIcon('country')" alt="country-code" />
                  </div>
                  <div class="divider"></div>
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
                autocomplete="off"
                name="login-phone2-nosave"
                @blur="onNationalPhoneBlur"
                @focus="onNationalPhoneFocus"
                @update:model-value="(v) => (formLogin.phone = Rules.sanitizeNationalPhoneDigits(v, formLogin.country))"
              >
                <template #prepend>
                  <div class="divider-error"></div>
                  <div class="form-icon">
                    <img :src="svgIcon('phone')" alt="phone-number" />
                  </div>
                  <div class="divider"></div>
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
              autocomplete="new-password"
              name="login-pw-nosave"
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
          </template>
        </div>
      </div>

      <!-- 登入帳號欄位 -->
      <div class="form-container flex flex-col gap-1" v-else>
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
            id="login_username"
            v-model="formLogin.username"
            class="input-control form-input !pt-0"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterUsername')"
            lazy-rules
            :rules="[Rules.required()]"
            autocomplete="off"
            name="login-username-nosave"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="loginImg(`account${$q.dark.isActive ? '-dark' : ''}.png`)" alt="phone-number" />
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
            id="login_password"
            v-model="formLogin.password"
            class="input-control form-input !pt-0"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            lazy-rules
            :rules="[Rules.required()]"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            name="login-password2-nosave"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="loginImg(`password${$q.dark.isActive ? '-dark' : ''}.png`)" alt="phone-number" />
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
        <q-btn
          flat
          class="hide-hover"
          :disable="isLoading"
          @click="goForgotPassword"
          style="font-family: PingFang SC !important"
        >
          {{ $t("member.forgotPassword.forgotPassword") }}
        </q-btn>
      </div>

      <!-- 登入按鈕 -->
      <q-btn
        class="btn-submit mt-5 mb-3 hide-hover"
        type="submit"
        :disable="responsibilityVisible && loginClauseHasContent && !agreeTerms"
        :loading="isLoading"
      >
        {{ $t("common.btn.login") }}
      </q-btn>

      <!-- 註冊按鈕 -->
      <div v-if="isCash" class="btn-password-container mb-3" style="font-family: PingFang SC !important">
        <q-btn flat class="btn-password hide-hover" @click="changeDialog(false)" :disable="isLoading">
          {{ $t("common.btn.register") }}
        </q-btn>
      </div>
      <!-- 切換帳號、手機 btn -->
      <div class="btn-password-container mt-3 mb-3" v-if="isLoginOtpEnabled">
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
      <div
        class="form-bottom"
        :class="{ 'has-responsibility': responsibilityVisible && (loginClauseHasContent || loginClauseHasImages) }"
      >
        <ResponsibilityClauseContent
          position="login"
          class="terms-container"
          :visible="responsibilityVisible"
          @has-content="loginClauseHasContent = $event"
        />
        <ResponsibilityClauseAgreementCheckbox
          v-model="agreeTerms"
          position="login"
          class="agree-container"
          :disabled="isLoading"
          :use-circle-icons="isLargeTablet"
          :visible="responsibilityVisible"
          @has-content="loginClauseHasContent = $event"
        />
        <div class="help-container">
          <p v-if="responsibilityVisible && (loginClauseHasContent || loginClauseHasImages)" class="help-row">
            <span>{{ $t("member.login.needHelp") }} ? </span>
            <span class="contact-us" @click="handleOpenLiveChat">
              <div class="contact-icon">
                <img :src="svgIcon('service')" alt="phone-number" />
              </div>
              {{ $t("home.contact_us") }}
            </span>
          </p>
          <ResponsibilityClauseImages
            position="login"
            class="responsibility-images"
            :visible="responsibilityVisible"
            @has-images="loginClauseHasImages = $event"
          />
        </div>
      </div>
    </q-form>

    <!-- register -->
    <q-form v-else autocomplete="off" @submit="showVerifyModal([register])">
      <input type="text" name="fakeusernameremembered2" autocomplete="off" style="display: none" />
      <input type="password" name="fakepasswordremembered2" autocomplete="new-password" style="display: none" />
      <div class="form-content">
        <div class="form-container pad:pt-3" v-if="customInputList.length > 0">
          <template v-for="(column, key) in customInputList" :key="key">
            <!-- 手機、國家欄位 if api return phone or country -->
            <PhoneInput
              v-if="column.column_name === firstPhoneOrCountryColumn"
              v-model:phone="formRegister.phone"
              v-model:country="formRegister.country"
              class="form-input"
              :phone-disable="phoneColumnDisable"
            />

            <LoginRegisterOuterInputContainer
              v-else-if="shouldRenderRegisterColumn(column)"
              :label-props="{
                labelText: column?.lang?.[nowLang] || $t(`member.register.${column.column_name}`),
                labelContainerClass: 'padLg:px-3',
                labelTextClass: 'label-text-color',
                isRequired: column.required,
                tooltipProps: {
                  columnName: column.column_name,
                  columnRule: column.column_rule,
                  iconClass: $q.dark.isActive ? 'text-white' : 'text-black',
                  tooltipClass: $q.dark.isActive ? 'bg-white' : 'bg-black',
                  tooltipTextClass: $q.dark.isActive ? 'text-black' : 'text-white',
                },
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
                />

                <!-- 下拉選單類型 -->
                <ExtraSelect
                  v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
                  v-model="(formRegister as Request.register)[column?.column_name]"
                  :field="column"
                  :class="'form-input !pt-0'"
                />

                <DateInput
                  v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date"
                  :field="column"
                  :class="'form-input !pt-0'"
                  v-model="(formRegister as Request.register)[column?.column_name]"
                />

                <RealNameBankMatchNotice v-if="column.column_name === 'fullname'" />
              </div>
            </LoginRegisterOuterInputContainer>
          </template>
        </div>

        <div
          class="form-bottom"
          :class="{
            'mb-3 has-responsibility': responsibilityVisible && (registerClauseHasContent || registerClauseHasImages),
          }"
        >
          <div :class="{ 'mb-3': responsibilityVisible && registerClauseHasContent }">
            <ResponsibilityClauseContent
              position="register"
              class="terms-container"
              :visible="responsibilityVisible"
              @has-content="registerClauseHasContent = $event"
            />
          </div>

          <ResponsibilityClauseAgreementCheckbox
            v-if="isFA1M || isFA2M"
            v-model="agreeTerms"
            position="register"
            class="agree-container"
            :disabled="isLoading"
            :use-circle-icons="isLargeTablet"
            :visible="responsibilityVisible"
            @has-content="registerClauseHasContent = $event"
          />

          <div class="help-container">
            <p v-if="responsibilityVisible && (registerClauseHasContent || registerClauseHasImages)" class="help-row">
              <span>{{ $t("member.login.needHelp") }} ? </span>
              <span class="contact-us" @click="handleOpenLiveChat">
                <div class="contact-icon">
                  <img :src="svgIcon('service')" alt="phone-number" />
                </div>
                {{ $t("home.contact_us") }}
              </span>
            </p>
            <ResponsibilityClauseImages
              position="register"
              class="responsibility-images"
              :visible="responsibilityVisible"
              @has-images="registerClauseHasImages = $event"
            />
          </div>
        </div>
      </div>

      <q-btn
        class="btn-submit mt-1 hide-hover"
        type="submit"
        :loading="isLoading"
        :disable="responsibilityVisible && registerClauseHasContent && !agreeTerms"
      >
        {{ $t("common.btn.register") }}
      </q-btn>

      <div class="btn-password-container mt-2">
        <q-btn
          flat
          class="btn-password hide-hover"
          @click="changeDialog(true)"
          :disable="isLoading"
          style="font-family: PingFang SC !important"
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
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import LoginRegisterOuterInputContainer from "src/common/components/LoginRegisterOuterInputContainer/index.vue"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
import ResponsibilityClauseAgreementCheckbox from "src/common/components/ResponsibilityClause/AgreementCheckbox.vue"
import ResponsibilityClauseContent from "src/common/components/ResponsibilityClause/Content.vue"
import ResponsibilityClauseImages from "src/common/components/ResponsibilityClause/Images.vue"
import { useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { usePromotionRegister } from "src/common/composables/usePromotionRegister"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAgentCode } from "src/common/hooks/useAgentCode"
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
import { CMS_WEB_INFORMATION_URL_ID } from "src/common/utils/constants"
import { genPlaceholderByColumnRule } from "src/common/utils/customRulesUtils"
import {
  useNationalPhoneBlurFullGate,
  useNationalPhoneRevalidateOnDialCodeChange,
} from "src/common/utils/nationalPhoneByDialCode"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import ExtraSelect from "../../components/ExtraInput/Select.vue"
import SmsOtpInput from "../../components/ExtraInput/SmsOtpInput.vue"

const { getGiftsList } = useClaimGift()

const $q = useQuasar()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const Rules = useRule()
const { isPHBM, isFA1M, isFA2M } = useAgentCode()
const { isLargeTablet } = useMediaQuery()
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
// Keep CMS initialized for branches that still render the legacy policy links.
useCms()
void [isPHBM, companyName]
const { isLoading, handleGetOTP, handleRegisterCustomInput, handleLogin, handleRegister, auth } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const { getFavoriteGames } = useGame()
const { loginImg, svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
const { eventOn, eventEmit } = useEventBus()
const { handleOpenLiveChat } = useLiveChat()
const { moneyFormat } = useCommon()
const { getCurrencyCodeById } = useCurrency()
const { promotionState, firstRegisterPromotion } = usePromotionRegister()
const { handleTriggerPixelCode } = usePixelCodes()
const envInfoStore = useEnvInfoStore()

const isLoginMode = ref(true)
const responsibilityVisible = computed(() => !isFA1M.value && !isFA2M.value)
const agreeTerms = ref(!(isFA1M.value || isFA2M.value))
const loginClauseHasContent = ref(false)
const loginClauseHasImages = ref(false)
const registerClauseHasContent = ref(false)
const registerClauseHasImages = ref(false)
const counting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const phoneColumnDisable = ref(false)
const phoneRef = ref()
const smsRef = ref()
const { nowLang } = useLanguage()

// ==== 獲取隱私權政策以及服務條款的 id 以及 title Start ================
const { cmsWebInformationList } = useCms()

const privacyPolicyObj = computed(() => {
  const privatePolicyObj = cmsWebInformationList.value?.find(
    (item) => item.url_id === CMS_WEB_INFORMATION_URL_ID.Enums.PRIVACY_POLICY
  )

  return privatePolicyObj
})

const privacyPolicyId = computed(() => {
  return privacyPolicyObj.value && privacyPolicyObj.value?.id ? privacyPolicyObj.value.id : 0
})

const privacyPolicyTitle = computed(() => {
  return privacyPolicyObj.value && privacyPolicyObj.value?.Page
    ? privacyPolicyObj.value.Page?.find((item) => item.lang === nowLang.value)?.title
    : "Privacy Policy"
})

const termsOfServiceObj = computed(() => {
  const termsOfServiceObj = cmsWebInformationList.value?.find(
    (item) => item.url_id === CMS_WEB_INFORMATION_URL_ID.Enums.TERMS_AND_CONDITIONS
  )

  return termsOfServiceObj
})

const termsOfServiceId = computed(() => {
  return termsOfServiceObj.value && termsOfServiceObj.value?.id ? termsOfServiceObj.value.id : 0
})

const termsOfServiceTitle = computed(() => {
  return termsOfServiceObj.value && termsOfServiceObj.value?.Page
    ? termsOfServiceObj.value.Page?.find((item) => item.lang === nowLang.value)?.title
    : "Terms and Conditions"
})

// ==== 獲取隱私權政策以及服務條款的 id 以及 title End ================

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
  void router.replace({ name: "home" })

  if (auth.value.need_update_profile === true) {
    eventEmit("openUpdateProfile", true)
  }
}

async function goForgotPassword() {
  // 先切換路由關閉登入彈窗，等路由穩定後再開啟忘記密碼彈窗，
  // 否則 QDialog 的預設 route-dismiss 行為會在路由變更時把剛開啟的彈窗關掉（跳轉回首頁）
  await router.replace({ name: "home" })
  await nextTick()
  eventEmit("openForgotPassword", true)
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

  // 初始化時自動填入邀請碼（如果存在）
  if (inviteCode.value) {
    formRegister.value.invite_code = inviteCode.value
  }

  eventOn("changeRegisterForm", () => {
    changeDialog(false)
  })

  eventEmit("registerFormReady")
})

defineExpose({ isLoginMode, changeDialog })

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
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/form.scss";
@import "app/template/set_r022/assets/css/button.scss";

.label-text-colo,
:deep(.label-text-color) {
  color: var(--neutral-09);
}

.sms-country-phone-row {
  @apply flex flex-nowrap gap-2;
}

.pc {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;

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
    color: var(--secondary-01);
    font-weight: 700;
    overflow-wrap: break-word;
    line-height: normal;
    letter-spacing: normal;
  }

  .form-subtitle {
    margin: 0.3125rem 0 0.625rem;
    font-size: 0.875rem;
    color: var(--secondary-01);
    font-weight: 400;
    overflow-wrap: break-word;
    line-height: normal;
  }

  .sms-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    :deep(.form-input) {
      width: 18.875rem;
      height: fit-content !important;
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 5.625rem;
      height: 2.5rem;
      margin-top: 0.1875rem;
      color: var(--text-01);
      background: var(--primary-01);
      &.counting {
        background: #74aaff !important;
        color: #fff !important;
        opacity: 1 !important;
      }
      &.disabled,
      &[disabled] {
        background: #74aaff !important;
        color: #fff !important;
        opacity: 1 !important;
      }
    }
  }

  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    border-radius: 0.5rem;
    color: var(--text-01);
    height: 2.5rem;
    width: 100%;
    position: relative;
    background: var(--primary-01);
    font-family: PingFang SC;
  }

  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--primary-01);

    .btn-password {
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      text-transform: none;
      font-family: PingFang SC;
    }
  }

  .forgot-container {
    display: flex;
    justify-content: flex-end;
    color: var(--primary-01);

    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      font-family: PingFang SC !important;
      padding: 0;
      min-height: 0;
    }
  }

  .form-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    .terms-container {
      width: 100%;
      height: 8.75rem;
      border-radius: 0.375rem;
      border: 1px solid var(--neutral-03);
      color: var(--secondary-01);
      overflow-y: scroll;
      padding: 0.795625rem 0.6725rem;

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
        background-color: #cccccc;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        box-shadow: none;
        -webkit-box-shadow: none;
      }
      .term-row {
        color: var(--primary-02);
        font-family: "PingFang SC";
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
      margin: 1rem 0 0.78125rem;
      :deep(.agree-text) {
        margin: 0;
        padding: 0;
        color: var(--secondary-01);
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
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .help-row {
        color: var(--secondary-01);
        font-size: 0.875rem;
        font-weight: 600;
        overflow-wrap: break-word;
        margin: 0;
        display: flex;
        align-items: center;
        .contact-us {
          height: 1.5rem;
          display: flex;
          align-items: center;
          font-weight: 410;
          color: var(--primary-01);
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
      font-family: PingFang SC;
      font-weight: 700;
      color: var(--secondary-01);

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
    font-family: PingFang SC;
    text-align: center;
    color: var(--secondary-01);
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 1.5625rem;
    margin-bottom: 0.5rem;
  }
  .form-subtitle {
    font-weight: 200;
    font-size: 0.9647rem;
    line-height: 1;
    text-transform: capitalize;
    color: var(--secondary-01);
    text-align: center;
    min-height: 1.375rem;
  }
  .sms-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    :deep(.form-input) {
      width: 15.5rem;
      height: fit-content !important;
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 5.625rem;
      height: 2.5rem;
      margin: 0.1875rem 1rem 0 1rem;
      color: var(--text-01);
      background: var(--primary-01);
      &.counting {
        background: #74aaff !important;
        color: #fff !important;
        opacity: 1 !important;
      }
    }
  }
  .form-container {
    margin: 0 auto;
    background: var(--neutral-01);
    border-radius: 0.5rem;
    border: 1px solid var(--neutral-03);
  }
  .btn-submit {
    height: 2.75rem;
    width: 100%;
    font-size: 1rem;
    margin-top: 1.036875rem;
    background: var(--primary-01) !important;
    border-radius: 0.5rem;
    text-align: center;
    border: none;
    line-height: normal;
    padding: 0;
    color: var(--text-01);
    font-family: PingFang SC;

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
    color: var(--primary-01);

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
    margin-top: 0.6875rem;
    color: var(--primary-01);

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
    border-radius: 1rem;
    backdrop-filter: blur(20px);

    &.has-responsibility {
      margin-top: 1rem;
      border: 1px solid var(--neutral-03);
      padding: 0.795625rem 0.6725rem;
    }

    .terms-container {
      width: 100%;
      height: 8.75rem;
      border-radius: 0.375rem;
      color: var(--secondary-01);
      overflow-y: scroll;

      :deep(p),
      :deep(span),
      :deep(ol),
      :deep(ul),
      :deep(li) {
        color: inherit;
      }

      .term-row {
        width: 100%;
        color: var(--secondary-01);
        line-height: 1.13rem;
        font-size: 0.75rem;
        text-align: left;
        font-weight: 400;
        font-family: PingFang SC;
      }
    }
    .agree-container {
      width: 100%;
      margin-top: 0.841875rem;
      :deep(.agree-text) {
        font-size: 0.8269rem;
        line-height: 1.125rem;
        color: var(--secondary-01);
      }
    }
    .help-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .help-row {
        display: flex;
        align-items: center;
        margin: 0;
        color: var(--primary-02);
        line-height: 1.125rem;
        letter-spacing: -0.02em;
        font-size: 0.8125rem;
        .contact-us {
          display: flex;
          align-items: center;
          font-weight: 410;
          color: var(--primary-01);
          cursor: pointer;
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
    }

    &.has-responsibility {
      .help-container {
        margin-top: 0.9425rem;
      }
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
      font-family: PingFang SC;
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

.input-control {
  :deep(.q-field__control:before) {
    @apply border-b-0 padLg:border-b;
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
      -webkit-box-shadow: 0 0 0px 1000px var(--neutral-01) inset !important;
      box-shadow: 0 0 0px 1000px var(--neutral-01) inset !important;
      // 強制文字顏色（例如白色）
      -webkit-text-fill-color: var(--secondary-01) !important;

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
