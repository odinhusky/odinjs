<template>
  <q-card class="form-container">
    <!-- title -->
    <q-card-section class="p-0 mb-8">
      <h4 class="text-2xl font-bold">{{ $t("member.forgotPassword.updatePasswordDetails") }}</h4>
    </q-card-section>
    <!-- form -->
    <q-card-section class="p-0">
      <q-form @submit="handleSubmit" ref="passwordFromRef">
        <!-- old_password -->
        <div v-if="!userInfo2.empty_password" class="form-row">
          <label class="form-label">{{ $t("member.forgotPassword.currentPassword") }}</label>
          <q-input
            v-model="passwordForm.old_password"
            type="password"
            class="input-control form-input"
            bg-color="white"
            outlined
            lazy-rules
            :rules="[(val) => Rules.password(val)]"
            :placeholder="$t('placeholder.currenctPassword')"
          />
        </div>
        <!-- new_password -->
        <div class="form-row">
          <label class="form-label">{{ $t("member.forgotPassword.newPassword") }}</label>
          <q-input
            v-model="passwordForm.new_password"
            type="password"
            class="input-control form-input"
            bg-color="white"
            outlined
            lazy-rules
            :rules="[Rules.password, (val) => Rules.newPassword(passwordForm.old_password, val)]"
            :placeholder="$t('placeholder.passwordValidationShort')"
          />
        </div>
        <!-- confirm_password -->
        <div class="form-row">
          <label class="form-label">{{ $t("member.forgotPassword.confirmPassword") }}</label>
          <q-input
            v-model="passwordForm.confirm_password"
            type="password"
            class="input-control form-input"
            bg-color="white"
            outlined
            lazy-rules
            :rules="[(val) => Rules.confirmPassword(passwordForm.new_password, val)]"
          />
        </div>

        <!-- submit btn -->
        <div class="form-row-submit">
          <q-btn class="text-black" rounded color="submit" push :label="$t('common.btn.submit')" type="submit" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
export default {
  name: "ProfilePassword"
}
</script>

<script lang="ts" setup>
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { ref } from "vue"

const { userInfo2, passwordForm, setUserPassword, resetPasswordForm } = useUserInfo()
const Rules = useRule()
const passwordFromRef = ref()

async function handleSubmit() {
  const { status } = await setUserPassword()
  if (!status) return
  resetPasswordForm()
  passwordFromRef.value.resetValidation()
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "src/css/modal.sass";
@import "app/template/set33_RED/assets/css/_variable.sass";
@import "app/template/set33_RED/assets/css/button.sass";

.form-container {
  @apply bg-transparent shadow-none mt-2 p-6 rounded-lg;
  background: rgba(61, 2, 2, 1);
  border: 1px solid rgba(209, 68, 68, 1);

  .form-row {
    @apply mb-5 flex items-center flex-wrap;

    @include iphone-width {
      @apply mb-0;
    }

    .form-label {
      @apply text-base w-1/5 flex justify-between items-center;

      @include iphone-width {
        @apply w-full mt-5 mb-2;
      }
    }

    .form-input {
      @apply w-4/5;

      @include iphone-width {
        @apply w-full;
      }

      :deep(.q-field__control) {
        @include iphone-width {
          height: 2.375rem;
          min-height: auto;

          .q-field__native {
            min-height: auto;
          }

          .q-field__append {
            height: 2.375rem;
          }
        }
      }
    }
  }

  .form-row-submit {
    @apply flex justify-end;

    @include pad-width {
      @apply w-1/5 block;
    }

    @include iphone-width {
      @apply w-full;
    }

    .bg-submit {
      margin-left: 25%;

      @include iphone-width {
        @apply w-full ml-0;
      }
    }
  }
}

.input-control {
  :deep(.q-field__control-container) {
    @apply flex items-center justify-center;
  }
  :deep(.q-field__native) {
    height: calc(100% - 2px);
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
