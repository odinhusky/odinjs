<template>
  <ModalBase v-model="modalShow" modal-class="modal_share_custom" @close="closeDialog">
    <q-form @submit.prevent="resetPassword">
      <!-- 新密碼 -->
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.forgotPassword.newPassword") }}</label>
        <q-input
          v-model="formData.password"
          class="input-control form-control"
          dense
          borderless
          type="password"
          lazy-rules
          :rules="[(val) => Rules.password(val)]"
        />
      </div>
      <!-- 確認密碼 -->
      <div class="form-wrapper">
        <label class="form-label">{{ $t("member.forgotPassword.confirmPassword") }}</label>
        <q-input
          v-model="formData.confirm_password"
          class="input-control form-control"
          dense
          borderless
          type="password"
          lazy-rules
          :rules="[(val) => val === formData.password || $t('common.validate.consistentPassword')]"
        />
      </div>
      <div class="btn-modal-big">
        <q-btn class="btn-modal-login hide-hover normal-case text-base font-normal" type="submit" :loading="isLoading">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </div>
    </q-form>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { useI18n } from "vue-i18n"

import ModalBase from "./modalBase.vue"

const $q = useQuasar()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { isLoading, handleResetPassword } = useAuth()
const Rules = useRule()

const token = computed<string>(() => route.params.token as string)
const account = computed<string>(() => route.params.account as string)

const checkToken = computed(() => {
  return !!token.value
})

const checkAccount = computed(() => {
  return !!account.value
})

const modalShow = ref(true)

const formData = reactive({
  password: "",
  confirm_password: ""
})
async function resetPassword() {
  const { status } = await handleResetPassword({
    token: token.value,
    account: account.value,
    password: formData.password,
    confirm_password: formData.confirm_password
  })

  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.tip.updateCompleted"),
    position: "top",
    timeout: 1000
  })

  router.push({ name: "home" })
}

function closeDialog() {
  if (window.history.state.back) {
    router.back()
    return
  }

  router.push({ name: "home" })
}

onMounted(() => {
  if (!checkToken.value || !checkAccount.value) {
    router.push({ name: "home" })
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";

.input-control {
  :deep(.q-field__control:before) {
    @apply border-b-0 padLg:border-b;
  }
  :deep(.q-field__control-container) {
    @apply flex items-center justify-center;
  }
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
