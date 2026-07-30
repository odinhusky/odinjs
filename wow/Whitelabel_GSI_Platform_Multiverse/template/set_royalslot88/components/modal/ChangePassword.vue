<template>
  <ModalBase v-model="modalShow" use-title :title="$t('menu.changePassword')" max-width="56.25rem">
    <div class="change-password-wrapper">
      <q-form @submit="handleSubmit" class="password-form" ref="passwordFromRef">
        <div class="form-wrapper">
          <label class="form-label">{{ $t("member.forgotPassword.currentPassword") }}</label>
          <q-input
            v-model="passwordForm.old_password"
            type="password"
            class="input-control form-control"
            dense
            borderless
            lazy-rules
            :placeholder="$t('placeholder.currenctPassword')"
            :rules="[(val) => Rules.password(val)]"
          >
          </q-input>
        </div>
        <div class="form-wrapper">
          <label class="form-label">{{ $t("member.forgotPassword.newPassword") }}</label>
          <q-input
            v-model="passwordForm.new_password"
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            :rules="[
              (val) => Rules.password(val, $t('placeholder.passwordValidationShort')),
              (val) => Rules.newPassword(passwordForm.old_password, val)
            ]"
            type="password"
            class="input-control form-control"
            dense
            borderless
            lazy-rules
          >
          </q-input>
        </div>
        <div class="form-wrapper">
          <label class="form-label">{{ $t("member.forgotPassword.confirmPassword") }}</label>
          <q-input
            v-model="passwordForm.confirm_password"
            :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
            :rules="[(val) => Rules.password(val), (val) => Rules.confirmPassword(passwordForm.new_password, val)]"
            type="password"
            class="input-control form-control"
            dense
            borderless
            lazy-rules
          >
          </q-input>
        </div>
      </q-form>
      <div class="password-rule">
        <div class="password-rule-title">{{ $t("common.validate.rulesForCreatingPasswords") }}</div>
        <ul class="password-rule-list">
          <li v-for="(item, index) in validateList" :key="index" class="rule-item">{{ $t(item) }}</li>
        </ul>
      </div>
    </div>
    <div class="change-password-btn-group">
      <q-btn @click="modalShow = false" class="btn_for">
        {{ $t("common.btn.cancel") }}
      </q-btn>
      <q-btn @click="handleSubmit" class="btn_for btn_for_sub">
        {{ $t("common.btn.submit") }}
      </q-btn>
    </div>
  </ModalBase>
</template>

<script lang="ts" setup>
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, ref } from "vue"

import ModalBase from "./modalBase.vue"

const { passwordForm, setUserPassword, resetPasswordForm, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const Rules = useRule()
const passwordFromRef = ref()
const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)

const validateList = ref([
  "common.validate.mustNotBeEmpty",
  "placeholder.passwordValidationShort",
  "common.validate.newPasswordValidation",
  "common.validate.confimrPasswordValidation",
])

const handleSubmit = async () => {
  const isValid = await passwordFromRef.value.validate()
  if (!isValid) return

  const { status } = await setUserPassword()
  if (!status) return
  resetPasswordForm()
  passwordFromRef.value.resetValidation()
  modalShow.value = false
}

onMounted(() => {
  eventbus.on("openChangePassword", (show: boolean) => { modalShow.value = show })
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "../../assets/css/btn.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";

.change-password-wrapper {
  @apply grid gap-[2.1875rem];
  grid-template-columns: repeat(2, 1fr);

  @include pad-portrait {
    @apply gap-0;
    grid-template-columns: auto;
  }

  .password-form {
    &::after {
      @apply w-[.0625rem] h-full absolute right-[-1.25rem] top-0;
      content: "";
      background-color: rgb(158 35 115);
    }
  }

  .password-rule-title {
    font-size: 1.1875rem;
    color: rgb(158 35 115);
  }

  .password-rule-list { @apply ml-4; }

  .rule-item {
    list-style: disc;
    font-weight: bold;
  }
}
.change-password-btn-group { @apply flex justify-center gap-[10px] mt-[1.875rem]; }

.input-control {
  :deep(.q-field__control:before) { @apply border-b-0; }
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
