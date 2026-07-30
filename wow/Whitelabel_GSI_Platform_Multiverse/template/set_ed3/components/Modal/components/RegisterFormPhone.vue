<template>
  <q-form @submit.prevent="registerSms">
    <div class="field-input flex">
      <q-input
        ref="phoneRef"
        v-model="formSms.phone"
        :label="$t('placeholder.phoneNumber')"
        rounded
        dense
        borderless
        bg-color="white"
        color="black"
        class="input-control input-style"
        lazy-rules
        :rules="[Rules.noRule]"
        unmasked-value
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-phone" class="text-black ml-2" />
        </template>
      </q-input>
    </div>
    <div v-if="isRegisterOtpEnabled" class="get-otp-wrapper">
      <q-btn class="otp-btn" :disable="!formSms.phone || counting" @click="getOtpCode">
        {{ $t("common.btn.otp") }}</q-btn
      >
      <vue-countdown
        @end="counting = false"
        v-if="counting"
        :time="180000"
        v-slot="{ totalSeconds }"
        class="counting-text"
        >{{ `${ totalSeconds }s` }}</vue-countdown
      >
    </div>
    <div v-if="isRegisterOtpEnabled" class="field-input flex items-center">
      <q-input
        v-model="formSms.sms_otp"
        :label="$t('placeholder.enterOTP')"
        rounded
        dense
        borderless
        bg-color="white"
        color="black"
        class="input-control input-style"
        lazy-rules
        :rules="[Rules.required()]"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-shield-alt" class="text-black ml-2" />
        </template>
      </q-input>
    </div>
    <div>
      <q-btn class="btn-submit" type="submit" :loading="isLoading" :disabled="!agreeTerms">
        {{ $t("common.btn.register") }}</q-btn
      >
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD, REGISTER_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

const $q = useQuasar()
const Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const eventbus = injectStrict(EventBusKey)
const { isRegisterOtpEnabled } = useEnv()
const { isLoading, handleRegisterSms, handleLogin, handleGetOTP } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const envInfoStore = useEnvInfoStore()
const phoneRef = ref()
const counting = ref(false)
const agreeTerms = ref(true)

const formSms = reactive<Request.RegisterSms>({
  register_method: envInfoStore.envInfo.registerMethod,
  phone: "",
  sms_otp: "" })

const getOtpCode = async () => {
  phoneRef.value.validate()

  if (phoneRef.value.hasError) {
    return $q.notify({
      type: "negative",
      message: t("common.validate.verificationError"),
      position: "top" })
  }
  counting.value = true
  const { status } = await handleGetOTP({ phone: formSms.phone })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top" })
  }
}

const registerSms = async () => {
  const registerMethod = formSms.register_method ?? envInfoStore.envInfo.registerMethod
  const registerPayload: Partial<Request.RegisterSms> = {
    register_method: registerMethod,
    phone: formSms.phone }
  if (isRegisterOtpEnabled.value) { registerPayload.sms_otp = formSms.sms_otp }
  const { status } = await handleRegisterSms(registerPayload)
  if (!status) { return }
  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000 })
  if (isRegisterOtpEnabled.value && registerMethod === REGISTER_METHOD.Enums.Phone) {
    const payload: Request.login = {
      login_method: LOGIN_METHOD.Enums.Sms,
      username: formSms.phone,
      sms_otp: formSms.sms_otp }
    await login(payload)
    return
  }

  eventbus.emit("openLoginWithRegister", false)
}

const login = async (payload: Request.login) => {
  const { status } = await handleLogin(payload)
  if (!status) { return }
  await getUserWalletList()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000 })
  router.push({ name: "Home" })
  closeDialog()
}

const closeDialog = () => { eventbus.emit("openLoginWithRegister", false) }
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed3/assets/css/form.scss";

.input-style { @apply w-10/12; }

.get-otp-wrapper {
  @apply flex items-center gap-2 mb-4;

  .otp-btn {
    @apply text-white rounded-[.625rem];
    background: $primary-color-light;
  }
}

.input-control {
  :deep(.q-field__control-container) { @apply flex items-center justify-center; }
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
      -webkit-box-shadow: 0 0 0px 1000px $green03 inset !important;
      box-shadow: 0 0 0px 1000px $green03 inset !important;
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
