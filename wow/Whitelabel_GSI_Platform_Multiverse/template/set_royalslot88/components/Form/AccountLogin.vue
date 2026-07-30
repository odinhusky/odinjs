<template>
  <q-form @submit="login" class="login_form" autocomplete="new-password">
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.login.username") }}</label>
      <q-input
        v-model="formLogin.username"
        class="input-control form-control"
        dense
        borderless
        lazy-rules
        :rules="[(val) => Rules.account(val)]"
        autocomplete="new-password"
      />
    </div>
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.login.password") }}</label>
      <q-input
        v-model="formLogin.password"
        class="input-control form-control"
        dense
        borderless
        lazy-rules
        :rules="[(val) => Rules.password(val)]"
        type="password"
        autocomplete="new-password"
      />
    </div>
    <div class="btn-modal-big">
      <q-btn class="btn-modal-login hide-hover normal-case text-base font-normal" type="submit" :loading="isLoading">
        {{ $t("home.signIn") }}
      </q-btn>
    </div>
    <div class="btn-modal-group">
      <q-btn
        class="btn-modal-forgot hide-hover normal-case text-base font-normal"
        :loading="isLoading"
        @click="goForgotPassword"
      >
        {{ $t("member.forgotPassword.forgotPassword") }}
      </q-btn>
      <q-btn
        class="btn-modal-reg hide-hover normal-case text-base font-normal"
        :loading="isLoading"
        @click="openRegister"
      >
        {{ $t("home.signup") }}
      </q-btn>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { LOGIN_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, reactive } from "vue"
import { useI18n } from "vue-i18n"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isLoading, handleLogin, auth } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const eventbus = injectStrict(EventBusKey)

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "",
  password: "" })

function initFormLogin() {
  formLogin.username = ""
  formLogin.password = ""
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
  }
  eventbus.emit("openLogin", false)
}

function goForgotPassword() {
  eventbus.emit("openLogin", false)
  eventbus.emit("openForgotPassword", true)
}

function openRegister() { eventbus.emit("openRegister", true) }

onMounted(() => {
  eventbus.on("openLogin", (_show: boolean) => { initFormLogin() })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";

.input-control {
  :deep(.q-field__control:before) { @apply border-b-0 padLg:border-b; }
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
      -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
      box-shadow: 0 0 0px 1000px transparent inset !important;

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
