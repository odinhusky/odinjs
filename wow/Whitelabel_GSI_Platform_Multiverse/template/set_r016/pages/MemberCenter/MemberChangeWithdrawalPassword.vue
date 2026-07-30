<template>
  <div class="change-password">
    <BackBtn />

    <div class="change-password-form">
      <div class="change-password-content">
        {{ $t("member.changePassword.setWithdrawalPassword") }}
      </div>

      <q-form class="form-content" @submit="handleSubmit">
        <!-- old password -->
        <div v-if="accountInfo.has_withdrawal_password" class="form-item">
          <div class="form-label form-title required">{{ $t("member.forgotPassword.currentPassword") }}</div>
          <q-input
            v-model="withdrawalPasswordForm.old_password"
            class="input-control form-input"
            :placeholder="$t('placeholder.currenctPassword')"
            :type="showPassword.oldPassword ? 'text' : 'password'"
            rounded
            outlined
            dense
            borderless
            lazy-rules
            no-error-icon
            :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
          >
            <template #append>
              <q-icon
                class="cursor-pointer"
                size="xs"
                :name="showPassword.oldPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword.oldPassword = !showPassword.oldPassword"
              />
            </template>
          </q-input>
        </div>

        <!-- new password -->
        <div class="form-item">
          <div class="form-label form-title required">{{ $t("member.forgotPassword.newPassword") }}</div>
          <q-input
            v-model="withdrawalPasswordForm.new_password"
            class="input-control form-input"
            :type="showPassword.newPassword ? 'text' : 'password'"
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            rounded
            outlined
            dense
            borderless
            lazy-rules
            no-error-icon
            :rules="[
              (val) => Rules.password(val, $t('placeholder.passwordValidationShort')),
              (val) => Rules.newPassword(withdrawalPasswordForm.old_password, val)
            ]"
          >
            <template #append>
              <q-icon
                class="cursor-pointer"
                size="xs"
                :name="showPassword.newPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword.newPassword = !showPassword.newPassword"
              />
            </template>
          </q-input>
        </div>

        <!-- confirm password -->
        <div class="form-item">
          <div class="form-label form-title required">{{ $t("member.forgotPassword.confirmPassword") }}</div>
          <q-input
            v-model="withdrawalPasswordForm.confirm_password"
            class="input-control form-input"
            :type="showPassword.confirmPassword ? 'text' : 'password'"
            rounded
            outlined
            dense
            borderless
            lazy-rules
            no-error-icon
            :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
            :rules="[(val) => Rules.confirmPassword(withdrawalPasswordForm.new_password, val)]"
          >
            <template #append>
              <q-icon
                class="cursor-pointer"
                size="xs"
                :name="showPassword.confirmPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword.confirmPassword = !showPassword.confirmPassword"
              />
            </template>
          </q-input>
        </div>

        <q-btn class="btn-submit" type="submit">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { reactive } from "vue"
import { useRouter } from "vue-router"

const Rules = useRule()
const router = useRouter()
const { accountInfo, useBasicInfoQuery, withdrawalPasswordForm, resetWithdrawalPasswordForm, setUserWithdrawalPassword } =
  useUserInfo()

useBasicInfoQuery()
const showPassword = reactive({
  oldPassword: false,
  newPassword: false,
  confirmPassword: false })

const handleSubmit = async () => {
  const { status } = await setUserWithdrawalPassword()
  if (status) {
    resetWithdrawalPasswordForm()
    router.push({ name: "MemberWithdrawal" })
  }
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";

.change-password {
  max-width: 75rem;
  margin: 1.25rem auto 0;

  &-form {
    margin-top: 1.25rem;
    border-radius: 0.5rem;
    background: $primary07;
    padding: 3.75rem;

    @include phone-width() { padding: 1.25rem; }

    .change-password-content {
      @include fontStyle(1.625rem);
      color: $secondary03;
    }

    .form-content {
      @apply flex flex-col items-center justify-center;
      margin-top: 1.25rem;

      .form-item {
        @apply m-0;
        width: 100%;
        max-width: 37.5rem;
        margin-top: 1.25rem;

        .form-label { color: $neutral01; }
      }
    }

    .btn-submit {
      @apply flex items-center justify-center mx-auto;
      @include fontStyle(0.875rem, 400);

      border-radius: 0.5rem;
      background: $gradient01;
      color: $neutral01;
      width: 18.75rem;
      height: 2.25rem;
      margin-top: 1.25rem;

      @include phone-width() {
        width: 100%;
        margin-top: 0.25rem;
      }
    }
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
