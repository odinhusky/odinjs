<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <!-- login -->
    <q-form v-if="isLoginMode" @submit="showVerifyModal([login])">
      <h2 class="form-title">{{ $t("menu.login") }}</h2>
      <!-- 手機號碼 -->
      <div class="form-container">
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
            class="input-control form-input border-bottom !pt-0"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterUsername')"
            lazy-rules
            :rules="[(val) => Rules.account(val)]"
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
            class="input-control form-input border-bottom !pt-0"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            lazy-rules
            :rules="[(val) => Rules.password(val)]"
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
      <div class="forgot-container">
        <p>{{ `${$t("member.forgotPassword.forgotPassword")}? ` }}</p>
        <q-btn flat class="hide-hover mx-1" :disable="isLoading" @click="goForgotPassword">
          {{ $t("member.login.reset") }}
        </q-btn>
      </div>
      <q-btn color="blue" class="btn-submit mt-5 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.login") }}
      </q-btn>
      <div class="btn-password-container mt-5">
        <q-btn
          flat
          text-color="blue"
          class="btn-password hide-hover"
          @click="changeLoginMode(false)"
          :disable="isLoading"
        >
          {{ $t("common.btn.register") }}
        </q-btn>
      </div>
    </q-form>
    <!-- register -->
    <q-form v-else @submit="showVerifyModal([register])">
      <h2 class="form-title">{{ $t("menu.register") }}</h2>
      <div class="form-container">
        <template v-for="(column, key) in customInputList" :key="key">
          <!-- 帳號 -->
          <q-input
            v-if="column.column_name === 'account'"
            v-model="formRegister.account"
            class="input-control form-input border-bottom"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterUsername')"
            lazy-rules
            :rules="[(val) => Rules.account(val, $t('placeholder.usernameValidation'))]"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('people')" alt="phone-number" />
              </div>
              <div class="divider"></div>
            </template>
          </q-input>
          <!-- 全名 -->
          <template v-else-if="column.column_name === 'fullname'">
            <q-input
              :ref="setFullnameInputRef"
              v-model="formRegister.fullname"
              class="input-control form-input border-bottom"
              :class="{ 'real-name-bank-match-input': envInfoStore.envInfo.member_bank_real_name === 1 }"
              dense
              borderless
              :placeholder="$t('placeholder.pleaseEnterFullNameShort')"
              lazy-rules
              :hide-bottom-space="shouldHideFullnameBottomSpace"
              :rules="[(val) => Rules.fullname(val, $t('placeholder.pleaseEnterFullName'))]"
            >
              <template #prepend>
                <div class="divider-error"></div>
                <div class="form-icon">
                  <img :src="svgIcon('name')" alt="phone-number" />
                </div>
                <div class="divider"></div>
              </template>
            </q-input>
            <RealNameBankMatchNotice />
          </template>
          <!-- 電話號碼 -->
          <q-input
            v-else-if="column.column_name === 'phone'"
            v-model="formRegister.phone"
            class="input-control form-input border-bottom"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterContactNo')"
            lazy-rules
            :rules="[Rules.noRule]"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('phone')" alt="phone-number" />
              </div>
              <div class="divider"></div>
            </template>
          </q-input>
          <!-- 密碼 -->
          <q-input
            v-else-if="column.column_name === 'password'"
            v-model="formRegister.password"
            class="input-control form-input border-bottom"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            lazy-rules
            :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
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
          <!-- 確認密碼 -->
          <q-input
            v-else-if="column.column_name === 'confirm_password'"
            v-model="formRegister.confirm_password"
            class="input-control form-input border-bottom"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
            lazy-rules
            :rules="[(val) => val === formRegister.password || $t('common.validate.consistentPassword')]"
            :type="showConfirmPassword ? 'text' : 'password'"
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
                :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>
          <!-- email -->
          <q-input
            v-else-if="column.column_name === 'email'"
            v-model="formRegister.email"
            class="input-control form-input border-bottom"
            dense
            borderless
            :placeholder="$t('placeholder.pleaseEnterEmail')"
            lazy-rules
            :rules="[Rules.required(), Rules.email]"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('mail')" alt="phone-number" />
              </div>
              <div class="divider"></div>
            </template>
          </q-input>
          <SmsOtpInput
            v-else-if="column.column_name === 'sms_otp' && isRegisterOtpEnabled"
            :field="column"
            :phone="formRegister?.phone ?? ''"
            :country-code="formRegister?.country || defaultCountryCode"
            :class="'input-control form-input border-bottom'"
            v-model="(formRegister as Request.register)[column?.column_name]"
          />
          <!-- 下拉選單欄位（ex: gender） -->
          <q-select
            v-else-if="column.type === 2"
            v-model="(formRegister as Request.register)[column.column_name]"
            :options="column.values || []"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            class="input-control form-input border-bottom"
            dense
            borderless
            :display-value="
              (formRegister as Request.register)[column.column_name]
                ? undefined
                : column?.lang?.['en'] || $t(`member.register.${ column.column_name }`)
            "
            lazy-rules
            :rules="column.required ? [Rules.required()] : [Rules.noRule]"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('member-title-icon')" alt="phone-number" />
              </div>
              <div class="divider"></div>
            </template>
          </q-select>
          <!-- API 未預設的欄位仍需渲染 -->
          <q-input
            v-else
            v-model="(formRegister as Request.register)[column.column_name]"
            class="input-control form-input border-bottom"
            dense
            borderless
            :placeholder="column?.lang?.['en'] || $t(`member.register.${column.column_name}`)"
            lazy-rules
            :rules="column.required ? [Rules.required()] : [Rules.noRule]"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('member-title-icon')" alt="phone-number" />
              </div>
              <div class="divider"></div>
            </template>
          </q-input>
        </template>
      </div>
      <q-btn color="blue" class="btn-submit mt-1 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.register") }}
      </q-btn>
      <div class="btn-password-container mt-2">
        <q-btn
          flat
          text-color="blue"
          class="btn-password hide-hover"
          @click="changeLoginMode(true)"
          :disable="isLoading"
        >
          {{ $t("common.btn.login") }}
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import SmsOtpInput from "app/template/set_jokerhill/components/ExtraInput/SmsOtpInput.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { ensureSmsOtpColumn } from "app/template/set_jokerhill/utils/ensureSmsOtpColumn"
import type { QInput } from "quasar"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import LoginRegisterOuterInputContainer from "src/common/components/LoginRegisterOuterInputContainer/index.vue"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { useRule } from "src/common/hooks/useRule"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { LOGIN_METHOD, PIXEL_CODE_TYPE, REGISTER_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

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
const { svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
const { handleTriggerPixelCode } = usePixelCodes()
const eventbus = injectStrict(EventBusKey)

const isLoginMode = ref(true)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
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
  is_customize: true,
})

function changeLoginMode(status: boolean) {
  isLoginMode.value = status
  showPassword.value = false
  showConfirmPassword.value = false
  formLogin.username = ""
  formLogin.password = ""
  formRegister.account = ""
  formRegister.password = ""
  formRegister.confirm_password = ""
  formRegister.fullname = ""
  formRegister.email = ""
  formRegister.country = defaultCountryCode.value
  formRegister.phone = ""
  customInputList.value.forEach((column) => {
    if (column.column_name in formRegister) {
      if (column.type === 2) {
        formRegister[column.column_name] = null
        return
      }
      formRegister[column.column_name] = column.column_name === "country" ? defaultCountryCode.value : ""
    }
  })
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formRegister.currency = singleCurrencyValue
  }

  if (!status) {
    handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER)
  }
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
          username: formRegister.phone,
          sms_otp: formRegister.sms_otp,
          ...(smsCountry ? { country: smsCountry } : {}),
        }
      : {
          login_method: LOGIN_METHOD.Enums.Password,
          country: formRegister.country || defaultCountryCode.value,
          phone: formRegister.phone,
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
  eventbus.emit("openLogin", false)
}

function goForgotPassword() {
  eventbus.emit("openForgotPassword", true)
  eventbus.emit("openLogin", false)
}

watch(defaultCountryCode, (code) => {
  if (code && !formRegister.country) {
    formRegister.country = code
  }
})

onMounted(async () => {
  eventbus.on("openLogin", (_show: boolean) => {
    changeLoginMode(true)
  })
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = ensureSmsOtpColumn(data || [], isRegisterOtpEnabled.value)
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formRegister.currency = singleCurrencyValue
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_jokerhill/assets/css/_variable.sass";
@import "app/template/set_jokerhill/assets/css/form.sass";
@import "app/template/set_jokerhill/assets/css/button.sass";

.label-text-colo,
:deep(.label-text-color) {
  color: $common-black-color;
}

.pc {
  .form-title {
    @apply uppercase text-center font-bold;
    color: rgba(#141414, 0.4);
    font-size: 2rem;
    margin-bottom: 2.5rem;
  }
  .form-subtitle {
    margin: 0.3125rem 0 0.625rem;
    font-size: 0.875rem;
    color: $color-subtitle;
    font-weight: 400;
    overflow-wrap: break-word;
    line-height: normal;
  }
  .form-container {
    ::v-deep(.q-field--error) {
      margin-bottom: 1rem;
    }
  }
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    color: $color-white-text;
    height: 2.5rem;
    width: 100%;
    position: relative;
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
    color: $color-subtitle;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .q-btn {
      @apply font-bold;
      color: #6288d2;
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
    }
  }
}
.h5 {
  .form-title {
    @apply uppercase text-center font-bold;
    color: rgba(#141414, 0.4);
    font-size: 2rem;
    margin-bottom: 2.5rem;
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
  .form-container {
    margin: 0.6875rem auto;
    background: rgb(255, 255, 255);
    box-shadow: rgba(0, 24, 30, 0.06) 0px 0.4375rem 0.6875rem;
    border-radius: 0.5rem;
    border: 1px solid rgb(221, 232, 255);
    padding-bottom: 0.625rem;
    ::v-deep(.q-field--error) {
      padding-bottom: 2.75rem;
      height: 6rem;
    }
  }
  .btn-submit {
    height: 3.0625rem;
    width: 100%;
    font-family: inherit;
    font-size: 1.1026rem;
    margin-top: 0.6875rem;
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
    color: $color-subtitle;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .q-btn {
      @apply ml-2;
      color: #6288d2;
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      padding: 0;
      min-height: auto;
    }
  }
}

.input-control {
  :deep(.q-field__control-container) {
    @apply flex items-center justify-center;
  }
  :deep(.q-field__native) {
    height: calc(100% - 4px);
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
      -webkit-box-shadow: 0 0 0px 1000px $common-white-color inset !important;
      box-shadow: 0 0 0px 1000px $common-white-color inset !important;
      // 強制文字顏色（例如白色）
      // -webkit-text-fill-color: $common-white-color !important;

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
