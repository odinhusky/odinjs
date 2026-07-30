<template>
  <div :class="`${isLargeTablet ? 'h5' : 'pc'}`">
    <!-- login -->
    <q-form
      v-if="isLoginMode"
      @submit="isPhoneRegisterMode ? showVerifyModal([handlePhoneLogin]) : showVerifyModal([accountLogin])"
    >
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
                class="form-input border-bottom border-bottom-full flex-[1.5]"
                dense
                outlined
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
                outlined
                :placeholder="$t('member.login.phone')"
                :lazy-rules="Rules.nationalPhoneLazyRules(formLogin.country)"
                :rules="[Rules.nationalPhoneByDialCode(formLogin.country, nationalPhoneRuleOpts)]"
                :maxlength="Rules.nationalPhoneMaxLength(formLogin.country)"
                inputmode="numeric"
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
                outlined
                :placeholder="$t('member.login.verifyCode')"
                lazy-rules
                :rules="[Rules.required()]"
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
                :disable="isLoading || !formLogin.phone || !formLogin.country"
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
                class="form-input border-bottom border-bottom-full flex-[2]"
                dense
                outlined
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
                outlined
                :placeholder="$t('member.login.phone')"
                :lazy-rules="Rules.nationalPhoneLazyRules(formLogin.country)"
                :rules="[Rules.nationalPhoneByDialCode(formLogin.country, nationalPhoneRuleOpts)]"
                :maxlength="Rules.nationalPhoneMaxLength(formLogin.country)"
                inputmode="numeric"
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
              outlined
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
            outlined
            :placeholder="$t('placeholder.pleaseEnterUsername')"
            lazy-rules
            :rules="[Rules.required()]"
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
            outlined
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            lazy-rules
            :rules="[Rules.required()]"
            :type="showPassword ? 'text' : 'password'"
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
        :disable="!isFA1M && !isFA2M && !agreeTerms"
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
      <div class="btn-password-container mb-3" v-if="isPhoneRegisterMode">
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
      <div v-if="!isFA1M && !isFA2M" class="form-bottom">
        <div v-if="isPHBM && !isFA1M && !isFA2M" class="terms-container">
          <div class="term-row">
            <span> By logging in to your Phibet account, you confirm and agree that: </span>
          </div>
          <div class="term-row">
            <span>
              1. You are at least 18 years of age (or the legal age of majority in your jurisdiction, whichever is
              greater).
            </span>
          </div>
          <div class="term-row">
            <span>
              2. You continue to accept and comply with the latest Phibet
              <router-link
                :to="{ path: `/webInformationCms/${termsOfServiceId}` }"
                target="_blank"
                class="text-primary"
              >
                {{ termsOfServiceTitle }}</router-link
              >, and
              <router-link :to="{ path: `/webInformationCms/${privacyPolicyId}` }" target="_blank" class="text-primary">
                {{ privacyPolicyTitle }}</router-link
              >, and Responsible Gaming Policy (as amended from time to time).
            </span>
          </div>
          <div class="term-row">
            <span> 3. All information in your account remains true, accurate, and up to date. </span>
          </div>
          <div class="term-row">
            <span
              >4. You understand Phibet may suspend or close your account if any information is found to be false or if
              you breach any of the platform rules.</span
            >
          </div>
          <div class="term-row">
            <span
              >5. You agree to receive account-related and promotional communications in accordance with our Privacy
              Policy (you may unsubscribe from marketing at any time).</span
            >
          </div>
        </div>
        <div v-else-if="!isFA1M && !isFA2M" class="terms-container">
          <div class="term-row">
            <span>
              1. {{ $t("member.terms.news") }}
              <router-link :to="{ path: `/webInformationCms/${privacyPolicyId}` }" target="_blank" class="text-primary">
                {{ $t("home.privacy_policy") }}</router-link
              >.
            </span>
          </div>
          <div class="term-row">
            <span>
              2. {{ isPHBM ? $t("member.terms.over18") : $t("member.terms.over21") }} {{ companyName }}
              <router-link
                :to="{ path: `/webInformationCms/${termsOfServiceId}` }"
                target="_blank"
                class="text-primary"
              >
                {{ $t("home.term_condition") }}</router-link
              >.
            </span>
          </div>
          <div class="term-row">
            <span> 3. {{ $t("member.terms.notGovernment") }} </span>
          </div>
          <div class="term-row">
            <span>4. {{ $t("member.terms.notStudent") }}</span>
          </div>
          <div class="term-row">
            <span>5. {{ $t("member.terms.companyPunish", { company: companyName }) }}</span>
          </div>
        </div>
        <div v-show="!isFA1M && !isFA2M" class="agree-container">
          <!-- isLargeTablet -->
          <q-checkbox
            v-if="isLargeTablet"
            v-model="agreeTerms"
            checked-icon="check_circle"
            unchecked-icon="radio_button_unchecked"
            color="term"
            size="xs"
            :disable="isLoading"
          />
          <q-checkbox v-else v-model="agreeTerms" color="term" size="xs" :disable="isLoading" />

          <span class="agree-text">{{ $t("member.terms.agreeTerms") }} </span>
        </div>
        <div v-show="!isFA1M && !isFA2M" class="help-container">
          <p class="help-row">
            <span>{{ $t("member.login.needHelp") }} ? </span>
            <span class="contact-us" @click="handleOpenLiveChat">
              <div class="contact-icon">
                <img :src="svgIcon($q.dark.isActive ? 'service_dark' : 'service')" alt="phone-number" />
              </div>
              {{ $t("home.contact_us") }}
            </span>
          </p>
          <img v-if="!isPHBM" :src="loginImg('game-responsibly.png')" alt="game-responsibly" class="game-responsibly" />
        </div>
      </div>
    </q-form>

    <!-- register -->
    <q-form v-else @submit="showVerifyModal([register])">
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
            v-else-if="
              column.column_name === 'sms_otp' ||
              (excludeColumn(column.column_name) &&
                (column.type === FIELD_TYPE.Enums.Input ||
                  column.type === FIELD_TYPE.Enums.Select ||
                  column.type === FIELD_TYPE.Enums.Date))
            "
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
                v-if="column.column_name === 'sms_otp'"
                :field="column"
                :phone="formRegister?.phone"
                :country="formRegister?.country"
                :class="'form-input !pt-0'"
                outlined
                v-model="(formRegister as Request.register)[column?.column_name]"
              ></SmsOtpInput>

              <ExtraInput
                v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input"
                :field="column"
                :class="'form-input !pt-0'"
                :custom-placeholder="genPlaceholderByColumnRule(column)"
                :hide-bottom-space="
                  envInfoStore.envInfo.member_bank_real_name === 1 && column.column_name === 'fullname'
                "
                outlined
                v-model="(formRegister as Request.register)[column?.column_name]"
              />

              <!-- 下拉選單類型 -->
              <ExtraSelect
                v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
                v-model="(formRegister as Request.register)[column?.column_name]"
                :field="column"
                :class="'form-input !pt-0'"
                outlined
              />

              <DateInput
                v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date"
                :field="column"
                :class="'form-input !pt-0'"
                outlined
                v-model="(formRegister as Request.register)[column?.column_name]"
              />

              <RealNameBankMatchNotice v-if="column.column_name === 'fullname'" />
            </div>
          </LoginRegisterOuterInputContainer>
        </template>
      </div>

      <q-btn
        class="btn-submit mt-1 hide-hover"
        type="submit"
        :loading="isLoading"
        :disable="(isFA1M || isFA2M) && !agreeTerms"
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

      <div class="form-bottom" v-if="isFA1M || isFA2M">
        <div v-if="isFA1M || isFA2M" class="terms-container" style="height: fit-content !important">
          <div class="term-row">
            <span
              >1. Send me updates and promotions in accordance with the
              <a href="https://www.fanpesa.com/webInformationCms/60" target="_blank" class="text-primary"
                >Privacy Policy</a
              >.</span
            >
          </div>
          <div class="term-row">
            <span>
              2. I am over 21 years of age and have read and agree to the Website’s Our Website
              <a href="https://www.fanpesa.com/webInformationCms/50" target="_blank" class="text-primary"
                >Terms & Conditions</a
              >.
            </span>
          </div>
        </div>

        <div v-if="isFA1M || isFA2M" class="agree-container">
          <!-- isLargeTablet -->
          <q-checkbox
            v-if="isLargeTablet"
            v-model="agreeTerms"
            checked-icon="check_circle"
            unchecked-icon="radio_button_unchecked"
            color="term"
            size="xs"
            :disable="isLoading"
          />
          <q-checkbox v-else v-model="agreeTerms" color="term" size="xs" :disable="isLoading" />

          <span class="agree-text">{{ $t("member.terms.agreeTerms") }} </span>
        </div>
        <div v-if="isFA1M || isFA2M" class="help-container">
          <p class="help-row">
            <span>{{ $t("member.login.needHelp") }} ? </span>
            <span class="contact-us" @click="handleOpenLiveChat">
              <div class="contact-icon">
                <img :src="svgIcon($q.dark.isActive ? 'service_dark' : 'service')" alt="phone-number" />
              </div>
              {{ $t("home.contact_us") }}
            </span>
          </p>
          <img v-if="!isPHBM" :src="loginImg('game-responsibly.png')" alt="game-responsibly" class="game-responsibly" />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useSiteImg } from "app/template/set_r032/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import LoginRegisterOuterInputContainer from "src/common/components/LoginRegisterOuterInputContainer/index.vue"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
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
import { computed, defineExpose, onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import ExtraSelect from "../../components/ExtraInput/Select.vue"
import SmsOtpInput from "../../components/ExtraInput/SmsOtpInput.vue"

const { getGiftsList } = useClaimGift()

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isPHBM, isFA1M, isFA2M } = useAgentCode()
const { isLargeTablet } = useMediaQuery()
const { isPhoneRegisterMode, companyName, isCash, envData, inviteCode, defaultCountryCode } = useEnv()
const envInfoStore = useEnvInfoStore()
const envInfo = envData()
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

const isLoginMode = ref(true)
const agreeTerms = ref(!(isFA1M.value || isFA2M.value))
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
  if (isPhoneRegisterMode.value) {
    formRegister.value.register_method = REGISTER_METHOD.Enums.Phone
  }
  const { status } = await handleRegister(formRegister.value)

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
    formLogin.sms_otp = formRegister.value.sms_otp
    formLogin.country = formRegister.value.country
    await phoneLoginSms()
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
  const payload: Request.GetOTP = {
    phone_number: formLogin.phone as string,
    country_code: formLogin.country,
    request_type: SMS_OTP_TYPE.Enums.Login,
  }
  const { status } = await handleGetOTP(payload)
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
  if (formLogin.login_method === LOGIN_METHOD.Enums.Password) {
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
    country: formLogin.country,
    username: formLogin.phone,
    sms_otp: formLogin.sms_otp,
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
  if (isPhoneRegisterMode.value) {
    changeLoginMethod(LOGIN_METHOD.Enums.Sms)
  }
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

  eventOn("openLogin", (_show: boolean) => {
    changeDialog(true)
  })

  eventOn("changeRegisterForm", () => {
    changeDialog(false)
  })

  eventEmit("registerFormReady")
})

defineExpose({ isLoginMode })
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r032/assets/css/_variable.scss";
@import "app/template/set_r032/assets/css/form.scss";
@import "app/template/set_r032/assets/css/button.scss";

.label-text-colo,
:deep(.label-text-color) {
  color: var(--neutral-09);
}

.sms-country-phone-row {
  @apply flex flex-nowrap gap-2;
}

.pc {
  height: 100%;
  overflow-y: auto;

  // PC 版 outlined q-input/q-select 邊框配色（之後在這邊獨立調整）
  .form-input {
    // 防止窄寬度（flex-[1]）下 placeholder / display-value 文字逐字垂直換行
    // 例如國碼 q-select 在 sms-country-phone-row 裡只有 1/3 寬度
    :deep(.q-field__native) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @include light {
      :deep(.q-field__control) {
        color: transparent !important;
      }
      :deep(.q-field__control)::before {
        border-color: var(--neutral-03) !important;
      }
    }

    @include dark {
      // 預設（未 focus）— #dfdfdf 30% 透明度
      :deep(.q-field__control) {
        // border: 1px solid rgba(223, 223, 223, 0.3);
        color: rgba(223, 223, 223, 0.3) !important;
      }
      :deep(.q-field__control)::before {
        border-color: rgba(223, 223, 223, 0.3) !important;
        box-shadow: 0 0 10px 2px var(--border-soft);
      }

      // focus 時：邊框與文字提亮 + 外光暈
      &.q-field--focused {
        :deep(.q-field__control) {
          color: #dfdfdf !important;
        }
        :deep(.q-field__control)::before {
          border-color: #dfdfdf !important;
        }
      }
    }

    // error 狀態下的紅色直條（form.scss 預設顯示）
    :deep(.divider-error) {
      display: none;
    }
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
      color: var(--text-01) !important;
      background: var(--linear-gradient-primary-01);
      &.counting {
        background: #f0f1f4 !important;
        color: #0d2245 !important;
        opacity: 1 !important;

        @include dark {
          background: #706000 !important;
          color: #0d2245 !important;
          opacity: 1 !important;
        }
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
    background: var(--linear-gradient-primary-01);
    font-family: PingFang SC;
  }

  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--primary-01);
    font-size: 1rem;
    font-weight: 400;

    @include dark {
      background: var(--secondary-04);
      border: 1px solid var(--text-10);
      color: var(--text-02);
      border-radius: 0.5rem;
      height: 2.5rem;
      width: 100%;
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: -20px;
        left: -60px;
        width: 192px;
        height: 49px;
        border-radius: 50em;
        background: #9747ff;
        opacity: 0.5;
        fill: radial-gradient(50% 50% at 50% 50%, #9747ff 0%, rgba(151, 71, 255, 0) 100%);
        filter: blur(7.5px);
      }

      &::after {
        content: "";
        position: absolute;
        top: -24px;
        left: 30px;
        width: 288px;
        height: 42px;
        border-radius: 50em;
        background: #1677ff;
        opacity: 1;
        border-radius: 288px;
        background: radial-gradient(50% 50% at 50% 50%, #1677ff 33.65%, rgba(22, 119, 255, 0) 100%);
        filter: blur(15px);
      }
    }

    .btn-password {
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      text-transform: none;
      font-family: PingFang SC;
      position: relative;
      z-index: 1;
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
      border-radius: 0.375rem;
      border: 1px solid var(--neutral-03);
      overflow-y: scroll;
      padding: 0.795625rem 0.6725rem;
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
      .agree-text {
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
      .help-row {
        color: var(--secondary-01);
        font-size: 0.875rem;
        font-weight: 600;
        overflow-wrap: break-word;
        margin: 0 0 0.84375rem;
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
  // H5 版 outlined q-input/q-select 邊框配色
  .form-input {
    // 防止窄寬度（flex-[1]）下 placeholder / display-value 文字逐字垂直換行
    :deep(.q-field__native) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @include light {
      :deep(.q-field__control) {
        color: transparent !important;
      }
      :deep(.q-field__control)::before {
        border-color: var(--neutral-03) !important;
      }
    }

    @include dark {
      // 預設（未 focus）
      :deep(.q-field__control) {
        box-shadow: 0 0 10px 2px var(--border-soft);
        color: var(--text-1) !important;
      }
      :deep(.q-field__control)::before {
        border-color: var(--text-1) !important;
      }

      // focus 時：邊框與文字提亮 + 外光暈
      &.q-field--focused {
        :deep(.q-field__control) {
          color: var(--text-1) !important;
        }
        :deep(.q-field__control)::before {
          border-color: var(--text-1) !important;
          box-shadow: 0 0 10px 2px var(--border-soft);
        }
      }
    }
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
      color: var(--text-01) !important;
      background: var(--linear-gradient-primary-01);
      &.counting {
        background: #f0f1f4 !important;
        color: #0d2245 !important;
        opacity: 1 !important;

        @include dark {
          background: #706000 !important;
          color: #0d2245 !important;
          opacity: 1 !important;
        }
      }
    }
  }
  .form-container {
    margin: 0 auto;
  }
  .btn-submit {
    height: 2.75rem;
    width: 100%;
    font-size: 1rem;
    margin-top: 1.036875rem;
    background: var(--linear-gradient-primary-01) !important;
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

    @include dark {
      background: var(--secondary-04);
      border: 1px solid var(--text-10);
      color: var(--text-02);
      border-radius: 0.5rem;
      height: 2.5rem;
      width: 100%;
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: -20px;
        left: -60px;
        width: 192px;
        height: 49px;
        border-radius: 50em;
        background: #9747ff;
        opacity: 0.5;
        fill: radial-gradient(50% 50% at 50% 50%, #9747ff 0%, rgba(151, 71, 255, 0) 100%);
        filter: blur(7.5px);
      }

      &::after {
        content: "";
        position: absolute;
        top: -24px;
        left: 30px;
        width: 288px;
        height: 42px;
        border-radius: 50em;
        background: #1677ff;
        opacity: 1;
        border-radius: 288px;
        background: radial-gradient(50% 50% at 50% 50%, #1677ff 33.65%, rgba(22, 119, 255, 0) 100%);
        filter: blur(15px);
      }
    }

    .btn-password {
      font-weight: 400;
      font-size: 0.9647rem;
      overflow-wrap: break-word;
      text-transform: none;
      padding: 0;
      min-height: auto;
      position: relative;
      z-index: 1;
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
    margin-top: 1rem;
    border-radius: 1rem;
    border: 1px solid var(--neutral-03);
    backdrop-filter: blur(20px);
    padding: 0.795625rem 0.6725rem;
    .terms-container {
      width: 100%;
      border-radius: 0.375rem;
      overflow-y: scroll;
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
      .agree-text {
        font-size: 0.8269rem;
        line-height: 1.125rem;
        color: var(--secondary-01);
      }
    }
    .help-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 0.9425rem;
      .help-row {
        display: flex;
        align-items: center;
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
