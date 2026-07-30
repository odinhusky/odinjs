<template>
  <BannerMember />
  <div class="change-password-layout">
    <div class="change-password-content">
      <MemberNav />
      <div class="form-title-content">
        <img :src="svgIcon('member-title-icon')" />
        <div class="title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</div>
      </div>
      <div class="change-password-form column">
        <q-form class="form-content" @submit="setUserPassword">
          <div class="form-item row">
            <div class="label col-12">{{ $t("member.forgotPassword.currentPassword") }}</div>
            <div class="input-content col-12 col-sm-9">
              <q-input
                standout
                v-model="passwordForm.old_password"
                :placeholder="$t('placeholder.currenctPassword')"
                type="password"
                class="input-control"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                :rules="[(val) => Rules.password(val)]"
              />
            </div>
          </div>
          <div class="form-item row">
            <div class="label col-12">{{ $t("member.forgotPassword.newPassword") }}</div>
            <div class="input-content col-12 col-sm-9">
              <q-input
                standout
                v-model="passwordForm.new_password"
                type="password"
                :placeholder="$t('placeholder.passwordValidationShort')"
                rounded
                class="input-control"
                outlined
                dense
                borderless
                lazy-rules
                :rules="[Rules.password, (val) => Rules.newPassword(passwordForm.old_password, val)]"
              />
            </div>
          </div>
          <div class="form-item row">
            <div class="label col-12">{{ $t("member.forgotPassword.confirmPassword") }}</div>
            <div class="input-content col-12 col-sm-9">
              <q-input
                standout
                v-model="passwordForm.confirm_password"
                type="password"
                class="input-control"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                :rules="[(val) => Rules.confirmPassword(passwordForm.new_password, val)]"
              />
            </div>
          </div>
          <!-- <div class="form-item">
            <div class="tip">Incorrect confirmation input</div>
          </div> -->
          <div class="action-btns row justify-center">
            <q-btn text-color="white" label="SUBMIT" class="submit-btn" type="submit" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BannerMember from "app/template/set_jokerhill/components/BannerMember.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import MemberNav from "../../components/MemberNav.vue"

const { passwordForm, setUserPassword } = useUserInfo()
const { svgIcon } = useSiteImg()
const Rules = useRule()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "../../assets/css/form.sass";

.change-password-layout {
  padding-top: 6rem;

  @include iphone-width {
    padding-top: 0;
  }

  .change-password-content {
    color: rgba(20, 20, 20, 0.6);
    overflow: hidden;
    max-width: 62.5rem;
    margin: 0 auto;

    @include iphone-width {
      padding: 0;
    }

    .change-password-form {
      // width: 100%
      border-radius: 8px;
      background: #fff;
      padding: 3rem;

      @include iphone-width {
        // width: 100vw
        margin-top: 0;
        padding: 0;
        background: #fff;
      }

      .form-content {
        @include iphone-width {
          width: 80%;
          margin: 0rem auto;
          padding: 0rem 1.5rem;
          background: #fff;
          border-radius: 0.5rem;
        }

        .form-item {
          &:first-child {
            // margin-top: 4rem
            @include iphone-width {
              margin-top: 2rem;
            }
          }

          .tip {
            color: #6fcf97;
            font-family: "NotoSansTC";
            font-size: 1rem;
            font-weight: 700;
            text-transform: capitalize;

            @include iphone-width {
              margin-top: 1rem;
              font-size: 1rem;
            }
          }

          .input-content {
            margin-top: 0.5rem;
            padding: 0;
          }
        }
      }

      .action-btns {
        margin-top: 5rem;
        margin-bottom: 4rem;

        @include iphone-width {
          margin-top: 1.8rem;
          margin-bottom: 2.5rem;
        }
      }
    }
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
