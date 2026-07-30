<template>
  <link rel="stylesheet" href="/css/_var.css" />
  <link rel="stylesheet" href="/css/site/r010/_var.css" />
  <div v-if="isReady" class="home-page">
    <div id="slide_right">
      <img :src="liveChatImg()" alt="" />
    </div>
    <div class="layout-main wide" id="layout-main">
      <div class="hm-content">
        <Transition>
          <AsideMenu
            v-if="isAsideShow"
            v-model="isAsideShow"
            @changeLogin="(val: boolean) => getStatus(val, MODAL_TYPE.Enums.Login)"
            @changeRegister="(val: boolean) => getStatus(val, MODAL_TYPE.Enums.Register)"
          />
        </Transition>
        <div class="inner-content" :class="{ mobile: isMobile }">
          <HeaderArea
            v-model="isAsideShow"
            @changeLogin="(val: boolean) => getStatus(val, MODAL_TYPE.Enums.Login)"
            @changeRegister="(val: boolean) => getStatus(val, MODAL_TYPE.Enums.Register)"
          ></HeaderArea>
          <MenuBar v-if="!$q.platform.is.mobile"></MenuBar>
          <div class="page-layout">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
        </div>
      </div>
      <div class="footer-wrapper">
        <!-- Footer CMS -->
        <div v-if="cmsFooterLogos && cmsFooterLogos.length" class="mx-auto logo-list-wrapper">
          <ul class="flex flex-row justify-center provider-list">
            <li
              class="flex justify-center flex-initial py-1 phone:py-2 px-[.625rem] phone:px-[1.5625rem]"
              v-for="item in cmsFooterLogos"
              :key="item"
            >
              <img
                :src="item"
                :alt="item.toString()"
                @error="setDefaultProductTabImg"
                class="w-[7.5rem] h-auto object-contain"
              />
            </li>
          </ul>
        </div>
        <div v-if="cmsFooterTextContent?.content" class="mx-auto mt-4 text-content-wrapper">
          <div class="content cms-content" v-html="cmsFooterTextContent?.content"></div>
        </div>
        <!-- Mobile Bottom CMS -->
        <div class="m-footer-bottom">
          <section class="menu-btm">
            <div class="menu-wrapper">
              <template v-for="(cmsItem, cmsIndex) in h5BottomMenuList" :key="cmsIndex">
                <q-btn
                  v-if="cmsIndex !== 2"
                  flat
                  fab-mini
                  class="menuft"
                  @click="
                    handleEntranceClick({
                      entrance: cmsItem.Entrance[0],
                      opening_method: cmsItem.Setting.payload.opening_method
                    })
                  "
                >
                  <img
                    :src="
                      isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path
                    "
                  />
                  <p>{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
                </q-btn>
                <template v-else>
                  <div></div>
                  <div
                    class="aff-qr"
                    @click="
                      handleEntranceClick({
                        entrance: cmsItem.Entrance[0],
                        opening_method: cmsItem.Setting.payload.opening_method
                      })
                    "
                  >
                    <img
                      :src="
                        isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path
                      "
                    />
                  </div>
                </template>
              </template>
            </div>
          </section>
        </div>
      </div>
    </div>
    <GS1MiniGame />
  </div>
  <Transition>
    <Modal v-if="isLoginShow" v-model="isLoginShow">
      <template v-slot:title>
        <img class="title" :src="loginTitleImg" />
      </template>

      <template v-slot:form>
        <q-form @submit="login">
          <div class="form-item">
            <p>{{ $t("member.login.username") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formLogin.username"
              :placeholder="$t('placeholder.pleaseEnterUsername')"
              dense
              lazy-rules
              :rules="[(val) => Rules.account(val)]"
            />
          </div>
          <div class="form-item">
            <p>{{ $t("member.login.password") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formLogin.password"
              type="password"
              :placeholder="$t('placeholder.pleaseEnterPassword')"
              dense
              lazy-rules
              :rules="[(val) => Rules.password(val)]"
            />
          </div>
          <div class="form-bottom">
            <q-btn class="form-btn login" :loading="isLoading" type="submit">{{ $t("common.btn.login") }}</q-btn>
            <q-btn class="form-btn join" :loading="isLoading" @click="getStatus(true, MODAL_TYPE.Enums.Register)">{{ $t("home.joinUs") }}</q-btn>
          </div>
          <div class="forgot-area">
            <span>{{ $t("member.login.forgotPassword") }}</span>
            <q-btn class="reset-btn px-1" flat @click="forgotPass">{{ $t("common.btn.reset") }}</q-btn>
          </div>
        </q-form>
      </template>
    </Modal>
  </Transition>
  <Transition>
    <Modal v-if="isRegistShow" v-model="isRegistShow">
      <template v-slot:title>
        <img class="title" :src="registerTitleImg" />
      </template>

      <template v-slot:form>
        <q-form @submit="register">
          <template v-for="(column, key) in customInputList" :key="key">
            <SmsOtpInput
              v-if="column.column_name === 'sms_otp' && isRegisterOtpEnabled"
              :field="column"
              :phone="formRegister?.phone ?? ''"
              :country-code="formRegister?.country || defaultCountryCode"
              class="form-item modal-content home-register-sms"
              v-model="(formRegister as Request.register)[column.column_name]"
            />
            <div v-else-if="column.type === 2" class="form-item modal-content">
              <p>{{ getColumnLabel(column) }}</p>
              <q-select
                bg-color="white"
                filled
                dense
                v-model="(formRegister as Request.register)[column.column_name]"
                :options="column.values || []"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                lazy-rules
                :rules="column.required ? [Rules.required()] : [Rules.noRule]"
              />
            </div>
            <div v-else-if="column.column_name === 'account'" class="form-item modal-content">
              <p>{{ $t("member.register.username") }}</p>
              <q-input
                bg-color="white"
                filled
                v-model="formRegister.account"
                :placeholder="$t('placeholder.usernameValidation')"
                dense
                lazy-rules
                :rules="column.required ? [(val) => Rules.account(val)] : [Rules.noRule]"
              />
            </div>
            <div v-else-if="column.column_name === 'fullname'" class="form-item modal-content">
              <p>{{ $t("member.register.fullName") }}</p>
              <q-input
                bg-color="white"
                filled
                v-model="formRegister.fullname"
                :placeholder="$t('placeholder.pleaseEnterFullName')"
                dense
                lazy-rules
                :rules="
                  column.required
                    ? [(val) => Rules.fullname(val, $t('placeholder.pleaseEnterFullName'))]
                    : [Rules.noRule]
                "
              />
            </div>
            <div v-else-if="column.column_name === 'phone'" class="form-item modal-content">
              <p>{{ $t("member.register.contactNo") }}</p>
              <q-input
                bg-color="white"
                filled
                v-model="formRegister.phone"
                :placeholder="$t('placeholder.pleaseEnterContactNo')"
                dense
                lazy-rules
                :rules="column.required ? [Rules.required()] : [Rules.noRule]"
              />
            </div>
            <div v-else-if="column.column_name === 'password'" class="form-item modal-content">
              <p>{{ $t("member.register.password") }}</p>
              <q-input
                bg-color="white"
                filled
                v-model="formRegister.password"
                type="password"
                :placeholder="$t('placeholder.passwordValidationShort')"
                dense
                lazy-rules
                :rules="column.required ? [(val) => Rules.password(val)] : [Rules.noRule]"
              />
            </div>
            <div v-else-if="column.column_name === 'confirm_password'" class="form-item modal-content">
              <p>{{ $t("member.register.confirmPassword") }}</p>
              <q-input
                bg-color="white"
                filled
                v-model="formRegister.confirm_password"
                type="password"
                :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
                dense
                lazy-rules
                :rules="[
                  (val) => {
                    if (column.required && !val) { return Rules.required()(val) }
                    return val === formRegister.password || $t('common.validate.consistentPassword')
                  }
                ]"
              />
            </div>
            <div v-else-if="column.column_name === 'email'" class="form-item modal-content">
              <p>{{ $t("member.register.email") }}</p>
              <q-input
                bg-color="white"
                filled
                v-model="formRegister.email"
                :placeholder="$t('placeholder.pleaseEnterEmail')"
                dense
                lazy-rules
                :rules="column.required ? [Rules.required(), Rules.email] : [Rules.email]"
              />
            </div>
            <div v-else class="form-item modal-content">
              <p>{{ getColumnLabel(column) }}</p>
              <q-input
                bg-color="white"
                filled
                v-model="(formRegister as Request.register)[column.column_name]"
                :placeholder="$t('placeholder.pleaseEnter')"
                dense
                lazy-rules
                :rules="column.required ? [Rules.required()] : [Rules.noRule]"
              />
            </div>
          </template>
          <div class="form-bottom">
            <q-btn class="form-btn register" :loading="isLoading" type="submit">{{ $t("common.btn.register") }}</q-btn>
          </div>
        </q-form>
      </template>
    </Modal>
  </Transition>
  <Transition>
    <Modal v-if="isUpdatedPasswordShow" v-model="isUpdatedPasswordShow">
      <template v-slot:title>
        <img class="title" :src="loginTitleImg" />
        <div class="title-tip">{{ $t("member.forgotPassword.updatePasswordDetailsUpperCase") }}</div>
      </template>
      <template v-slot:form>
        <q-form @submit="resetPassword">
          <div class="form-item">
            <p>{{ $t("member.forgotPassword.newPassword") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formResetPassword.password"
              :placeholder="$t('member.forgotPassword.newPassword')"
              dense
              lazy-rules
              :rules="[(val) => Rules.account(val)]"
            />
          </div>
          <div class="form-item">
            <p>{{ $t("member.forgotPassword.confirmPassword") }}</p>
            <q-input
              bg-color="white"
              filled
              v-model="formResetPassword.confirm_password"
              type="password"
              :placeholder="$t('member.forgotPassword.confirmPassword')"
              dense
              lazy-rules
              :rules="[(val) => val === formResetPassword.password || $t('common.validate.consistentPassword')]"
            />
          </div>
          <div class="form-bottom">
            <q-btn class="form-btn join" :loading="isLoading" @click="resetPassword">{{ $t("common.btn.submit") }}</q-btn>
          </div>
        </q-form>
      </template>
    </Modal>
  </Transition>
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <CryptoWalletDialog />
  <LoginRegisterDialog />
  <SlideVerify />
  <ForgotPasswordDialog />
  <LiveChat />
</template>

<script lang="ts" setup>
import "vue3-carousel/dist/carousel.css"

import { useWindowSize } from "@vueuse/core"
import ForgotPasswordDialog from "app/template/set_jokerhill/components/Dialog/ForgotPassword.vue"
import LoginRegisterDialog from "app/template/set_jokerhill/components/Dialog/LoginRegister.vue"
import SmsOtpInput from "app/template/set_jokerhill/components/ExtraInput/SmsOtpInput.vue"
import HeaderArea from "app/template/set_jokerhill/components/Header/Index.vue"
import MenuBar from "app/template/set_jokerhill/components/MenuBar/Index.vue"
import { useEntranceHandler } from "app/template/set_jokerhill/composables/useCms"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import AsideMenu from "app/template/set_jokerhill/layouts/AsideMenu.vue"
import { MENU } from "app/template/set_jokerhill/utils/constants"
import { ensureSmsOtpColumn } from "app/template/set_jokerhill/utils/ensureSmsOtpColumn"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import CryptoWalletDialog from "src/common/components/dialog/CryptoWalletDialog.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import Modal from "src/common/components/modal/modalBase.vue"
import SlideVerify from "src/common/components/modal/SlideVerify.vue"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useInit } from "src/common/composables/useInit"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, MODAL_TYPE, REGISTER_METHOD } from "src/common/utils/constants"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { onMounted, reactive, ref, watch, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

const { t } = useI18n()
const $q = useQuasar()
const Rules = useRule()
const { defaultCountryCode, isRegisterOtpEnabled, isPhoneRegisterMode } = useEnv()
const envInfoStore = useEnvInfoStore()
const eventbus = injectStrict(EventBusKey)
const { getFavoriteGames } = useGame()
const { isLoading, handleLogin, handleRegister, handleResetPassword, auth, handleRegisterCustomInput } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const { isReady, initialize } = useInit()
const router = useRouter()
const route = useRoute()
const { nowLang } = useLanguage()
const { enableConfig, injectHtml } = useLiveChat()
const {
  cmsFooterLogos,
  cmsFooterTextContent,
  h5BottomMenuList } = useCms()
const { handleEntranceClick } = useEntranceHandler()

const { liveChatImg, loginTitleImg, registerTitleImg, setDefaultProductTabImg } = useSiteImg()

let isAsideShow = ref(true)
let isLoginShow = ref(false)
let isRegistShow = ref(false)
let isUpdatedPasswordShow = ref(false)

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: "" })

const customInputList = ref<Response.RegistInputCustomList>([])

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
    contact2: "" },
  is_customize: true })

const formResetPassword = reactive<Request.resetPassword>({
  token: "",
  account: "",
  password: "",
  confirm_password: "" })

const { width } = useWindowSize()

let isMobile = ref(false)

function resetFormRegisterBase() {
  formRegister.account = ""
  formRegister.password = ""
  formRegister.confirm_password = ""
  formRegister.fullname = ""
  formRegister.gender = null
  formRegister.email = ""
  formRegister.country = defaultCountryCode.value
  formRegister.sms_otp = ""
  formRegister.phone = ""
  formRegister.ref_account = ""
  formRegister.contacts.contact1 = ""
  formRegister.contacts.contact2 = ""
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formRegister.currency = singleCurrencyValue
  }
}

function initFormData() {
  formLogin.login_method = LOGIN_METHOD.Enums.Password
  formLogin.username = ""
  formLogin.password = ""
  resetFormRegisterBase()
}

function getColumnLabel(column: Response.RegistInputCustom) {
  return column?.lang?.["en"] || t(`member.register.${ column.column_name }`)
}

async function loadRegisterCustomColumns() {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = ensureSmsOtpColumn(data || [], isRegisterOtpEnabled.value)
  resetFormRegisterBase()
  customInputList.value.forEach((column) => {
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

let getStatus = (status: boolean, modalType: MODAL_TYPE.Enums) => {
  switch (modalType) {
    case MODAL_TYPE.Enums.Login:
      isLoginShow.value = status
      isRegistShow.value = false
      initFormData()
      break
    case MODAL_TYPE.Enums.Register:
      isRegistShow.value = status
      isLoginShow.value = false
      initFormData()
      break
  }
}

async function login() {
  const { status } = await handleLogin({
    login_method: formLogin.login_method,
    username: formLogin.username,
    password: formLogin.password })

  if (!status) { return }

  if (auth.value.access_token) {
    await getUserWalletList()

    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000 })
    getStatus(false, MODAL_TYPE.Enums.Login)
  } else {
    isLoginShow.value = false
    isUpdatedPasswordShow.value = true
  }
}

async function resetPassword() {
  const { status } = await handleResetPassword({
    token: formResetPassword.token,
    account: formResetPassword.account,
    password: formResetPassword.password,
    confirm_password: formResetPassword.confirm_password })

  if (!status) { return }

  $q.notify({
    type: "positive",
    message: t("common.tip.updateCompleted"),
    position: "top",
    timeout: 1000 })

  isLoginShow.value = true
  isUpdatedPasswordShow.value = false
  await getUserWalletList()
}

async function register() {
  const registerPayload = customInputList.value.reduce<Request.register>(
    (payload, column) => {
      payload[column.column_name] = formRegister[column.column_name]
      return payload
    },
    { is_customize: true }
  )
  if (!isRegisterOtpEnabled.value) { delete registerPayload.sms_otp }
  const { status } = await handleRegister(registerPayload)
  if (!status) { return }

  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000 })

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
          ...(smsCountry ? { country: smsCountry } : {}) }
      : {
          login_method: LOGIN_METHOD.Enums.Password,
          country: formRegister.country || defaultCountryCode.value,
          phone: formRegister.phone,
          password: formRegister.password }
    const { status: loginStatus } = await handleLogin(loginPayload)
    if (!loginStatus) { return }
    if (auth.value.access_token) {
      await getFavoriteGames()
      await getUserWalletList()
      $q.notify({
        type: "positive",
        message: t("common.alarm.loginSuccess"),
        position: "top",
        timeout: 1000 })
    }
    getStatus(false, MODAL_TYPE.Enums.Register)
    getStatus(false, MODAL_TYPE.Enums.Login)
    eventbus.emit("openLogin", false)
    return
  }

  formLogin.username = formRegister.account ?? ""
  formLogin.password = formRegister.password ?? ""
  await login()
  getStatus(false, MODAL_TYPE.Enums.Register)
}

watch(isRegistShow, async (show) => {
  if (show) { await loadRegisterCustomColumns() }
})

watch(defaultCountryCode, (code) => {
  if (code && !formRegister.country) { formRegister.country = code }
})

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isAsideShow.value = true // 電腦版: 當在resize 時  就先初始化打開
      isMobile.value = false
    } else {
      isAsideShow.value = false //手機版:  當在resize 時  就先初始化關掉
      isMobile.value = true
    }
  },
  { immediate: true }
)

const forgotPass = () => {
  isLoginShow.value = false
  router.push({ name: "ForgotPass" })
}

watchEffect(() => {
  if (enableConfig.value) { injectHtml() }
})

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: Response.CmsEntranceItem) => { return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid) }

onMounted(async () => { initialize() })
</script>

<style lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/set_jokerhill/assets/css/main.sass"
@import "src/css/modal.sass"

// fadeIn
.v-enter-active,
.v-leave-active
  transition: opacity 0.3s ease

.v-enter-from,
.v-leave-to
  opacity: 0

// modal slot
.form-item
  margin: 10px 0
  p
    margin-bottom: 5px
    color: rgba(255, 255, 255, 0.70)
    font-family: "NotoSansTC"
    font-size: 14px
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: capitalize

// layout style
.home-page
  position: relative
  background-color: #F5F5F5
#slide_right
  position: fixed
  bottom: 5vw
  right: 1vw
  z-index: 9
  +iphone-width
    bottom: 25vw
  img
    width: 3rem
    cursor: pointer
.footer-wrapper
  width: 100%
  background: #4B5D7F
  padding: 2.5rem
  padding-bottom: 1vw
  .footer_right
    width: 55vw
    margin: 0 0 0 2vw
    font-size: 0.9vw
    .footer-top
      flex-direction: row
      flex-wrap: wrap
      display: flex
      color:#fff
      .payment-methods
        flex-direction: row
        order: 0
        display: flex
        align-items: center
        align-self: flex-start
        margin-bottom: 0.6vw
        justify-content: flex-start
        width: 90%
        padding-top:1vw
        .title
          margin-right: 16px
          margin-bottom: 0
          display: flex
          justify-content: center
        .methods
          display: flex
          flex-wrap: wrap
          justify-content: space-around
          gap: 10px
          align-items: center
      .navigation-menu
        border-radius: 5px
        display: flex
        flex-wrap: wrap
        align-items: center
        justify-content: start
        line-height: 24px
        margin-bottom: 8px
        .q-size
          font-size: 1vw
          padding: 0.3vw
        .link-seperator
          height: 25px
          margin: 0px 5px
    .footer-bottom
      color: #fff
      .footer-content-bottom
        display: flex
        justify-content: space-between
        flex-wrap: wrap
        width: 100%
        .be-support-content
          display: flex
          color: #fff
          font-size: 1.1vw
          .support_pc
            display: block
          .support_m
            display: none
          #footer-responsible-gaming
            text-decoration: underline
            cursor: context-menu
      .terms-info
        padding-top: 2vw
  +pad-width
    .q-size
      font-size: 0.9vw
      padding: 0
  +phone-width
    padding: 1.25rem 1rem
    padding-bottom: 30%
    height: auto
    flex-direction: column
    position: relative

    .footer_right
      margin: 4vw 0
      width: 100%
      font-size: 3.8vw
      .footer-top
        .navigation-menu
          display: none
        .payment-methods
          flex-direction: column
          .title
            margin-right:0px
            margin-bottom: 2vw
      .footer-bottom
        margin-top: 5vw
        .footer-content-bottom
          display: block
          .be-support-content
            font-size: 4.1vw
            display: block
            text-align: center
            .support_pc
              display: none
            .support_m
              display: block
        .terms-info
          text-align: center
          padding-top: 10vw
//H5 底下MENU BAR
.m-footer-bottom
  display: none
  position: fixed
  width: 100%
  bottom: 0
  z-index: 99
  +iphone-width
    display: block
  .menu-btm
    position: fixed
    margin: auto
    width: 100%
    height: 18vw
    bottom: 0
    left: 0
    right: 0
    background: url('../../assets/images/footer/ftr-menu-bar.png') no-repeat top center
    background-size: 100%
  .aff-qr
    +setFlex
    background: #6288D2
    padding: 3.5%
    width: 13%
    border-radius: 100%
    position: absolute
    left: -1px
    right: 0
    bottom: 28px
    margin: auto
    z-index: 9
    a
      +setFlex
  .menu-wrapper
    display: grid
    grid-template-columns: repeat(5,1fr)
    text-align: center
    padding: 11px 0 1px
    position: relative
    .menuft
      color: #fff
      font-size: 2.5vw
      text-transform: uppercase
      +setFlex
      flex-direction: row
      font-weight: 600
      padding: 0 0
      .q-btn__content
        display: flex !important
        flex-direction: column !important
      .q-focus-helper
        opacity: 0
      img
        max-width: 31%
        display: block
        margin: auto auto 2px
//footer End
// common style
.btn-common
  margin: 0vw
  img
    width: 1.2vw
.btn-title
  color: rgba(255, 255, 255, 0.70)
  font-family: "NotoSansTC"
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
.btn-content
  color: rgba(255, 255, 255, 0.70)
  font-family: "NotoSansTC"
  font-size: 0.8vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  &.yellow
    color: $yellow-active
// layout style
.layout-main
  @apply flex flex-col min-h-[100vh]
  position: relative
  height: auto
  .hm-content
    @apply w-full
    flex-grow: 1
    .inner-content
      @apply w-full h-full
      &.mobile
        width: 100%
      .page-layout
        @apply mb-[2rem]
.reset-btn
  text-transform: none
  margin: 0 .3125rem
  color: #fff
  text-decoration-line: underline
  :deep(.q-focus-helper)
    opacity: 0 !important
.logo-area
  .title-tip
    color: #EB5757
    margin-top: 1.25rem
    font-size: 1.5rem
</style>
