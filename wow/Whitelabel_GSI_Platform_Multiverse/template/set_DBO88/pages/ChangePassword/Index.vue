<template>
  <div class="change-password-wrapper">
    <div class="page-title">{{ $t("menu.password") }}</div>
    <q-form class="change-password-form column pt-4" @submit="handleSubmit" ref="passwordFromRef">
      <!-- current password -->
      <div class="form-label">{{ $t("member.forgotPassword.currentPassword") }} :</div>
      <q-input
        v-if="!userInfo.empty_password"
        standout
        v-model="passwordForm.old_password"
        :type="isPasswordVisible ? 'text' : 'password'"
        :label="$t('placeholder.currenctPassword')"
        outlined
        dense
        lazy-rules
        :rules="[(val) => Rules.password(val)]"
        class="input-control form-input"
        bg-color="white"
        color="black"
        autocomplete="off"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" class="field-icon" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="cursor-pointer field-icon"
            @click="isPasswordVisible = !isPasswordVisible"
          />
        </template>
      </q-input>
      <!-- new password -->
      <div class="form-label">{{ $t("member.forgotPassword.newPassword") }} :</div>
      <q-input
        standout
        v-model="passwordForm.new_password"
        :type="isNewPasswordVisible ? 'text' : 'password'"
        :label="$t('placeholder.passwordValidation')"
        outlined
        dense
        borderless
        lazy-rules
        :rules="[(val) => Rules.password(val), (val) => Rules.newPassword(passwordForm.old_password, val)]"
        class="input-control form-input"
        bg-color="white"
        color="black"
        autocomplete="off"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" class="field-icon" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isNewPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="cursor-pointer field-icon"
            @click="isNewPasswordVisible = !isNewPasswordVisible"
          />
        </template>
      </q-input>
      <!-- confirm password -->
      <div class="form-label">{{ $t("member.forgotPassword.confirmPassword") }} :</div>
      <q-input
        standout
        v-model="passwordForm.confirm_password"
        :type="isConfirmPasswordVisible ? 'text' : 'password'"
        outlined
        dense
        borderless
        lazy-rules
        :rules="[(val) => Rules.password(val), (val) => Rules.confirmPassword(passwordForm.new_password, val)]"
        class="input-control form-input"
        bg-color="white"
        color="black"
        autocomplete="off"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" class="field-icon" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isConfirmPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="cursor-pointer field-icon"
            @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
          />
        </template>
      </q-input>
      <div class="form-btn-wrapper">
        <q-btn label="submit" class="form-btn-submit change-password-btn" type="submit" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"

const { userInfo, passwordForm, setUserPassword, resetPasswordForm } = useUserInfo()
const Rules = useRule()
const passwordFromRef = ref()
const isPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const modalShow = ref(false)

const handleSubmit = async () => {
  const { status } = await setUserPassword()
  if (!status) return
  resetPasswordForm()
  passwordFromRef.value.resetValidation()
  modalShow.value = false
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";
@import "app/template/set_DBO88/assets/css/form.scss";
@import "app/template/set_DBO88/assets/css/text.scss";

.change-password-wrapper {
  @apply flex flex-col w-full max-w-[65rem] mx-auto;

  .field-icon {
    color: $primary-color;
  }

  :deep(.form-label) {
    @apply uppercase text-base font-bold;
    color: $text-white;
  }

  @include pad-large-width {
    @apply p-4;
  }

  .change-password-form {
    @apply p-[2.25rem] rounded-2xl;
    background-color: #24262b;
  }

  .change-password-btn {
    @apply h-[52px] rounded-[.625rem] font-bold text-base;
  }
}

.input-control {
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
