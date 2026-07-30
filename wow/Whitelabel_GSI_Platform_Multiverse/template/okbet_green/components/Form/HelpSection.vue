<template>
  <div class="form-bottom">
    <ResponsibilityClauseContent :position="position" class="terms-container" />
    <ResponsibilityClauseAgreementCheckbox
      v-model="modelValue"
      :position="position"
      class="agree-container"
      :disabled="isLoading"
      :use-circle-icons="$q.platform.is.mobile"
      @has-content="emit('hasContent', $event)"
    />
    <div class="help-container">
      <p class="help-row">
        <span>{{ $t("member.login.needHelp") }} ? </span>
        <span class="contact-us" @click="handleOpenLiveChat">
          <div class="contact-icon">
            <img :src="svgIcon('service')" alt="phone-number" />
          </div>
          {{ $t("home.contact_us") }}
        </span>
      </p>
      <ResponsibilityClauseImages :position="position" class="responsibility-images" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
import type * as Request from "src/api/request.type"
import ResponsibilityClauseAgreementCheckbox from "src/common/components/ResponsibilityClause/AgreementCheckbox.vue"
import ResponsibilityClauseContent from "src/common/components/ResponsibilityClause/Content.vue"
import ResponsibilityClauseImages from "src/common/components/ResponsibilityClause/Images.vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useLiveChat } from "src/common/hooks/useLiveChat"

const { companyName } = useEnv()
const { loginImg, svgIcon } = useSiteImg()
void [companyName, loginImg]
const { handleOpenLiveChat } = useLiveChat()
const emit = defineEmits<{
  hasContent: [value: boolean]
}>()

// 使用 defineModel 來定義雙向綁定的 modelValue
const modelValue = defineModel<boolean>({
  default: false,
})

// 其他 props
defineProps<{
  position: Request.GetResponsibilityClause["position"]
  isLoading?: boolean
}>()
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";

.pc {
  .form-bottom {
    padding-top: 0.625rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .terms-container {
      border: 1px solid $border-gray-color;
      border-radius: 0.375rem;
      font-size: 12px;
      overflow-y: scroll;
      padding: 0.5rem 0.375rem;
      margin-bottom: 0.5rem;

      :deep(*) {
        font-size: 12px;
      }

      &::-webkit-scrollbar {
        display: block;
        width: 2px;
        height: 1.5rem;
        background-color: transparent;
        border-radius: 2.1875rem;
        appearance: inherit;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $background-medium-gray-color;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        box-shadow: none;
        -webkit-box-shadow: none;
      }
      .term-row {
        color: $text-steel-blue-color;
        font-family: "Open Sans";
        font-size: 0.75rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.13rem;
        display: flex;
        -webkit-box-pack: start;
        justify-content: flex-start;
        align-items: flex-start;
      }
    }
    .agree-container {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      :deep(.agree-text) {
        margin: 0;
        padding: 0;
        color: rgba($text-dark-color, 0.88);
        font-size: 0.875rem;
        line-height: 1;
        list-style: none;
        position: relative;
        white-space: nowrap;
        cursor: pointer;
        border-radius: 0.25rem;
        align-self: center;
      }
    }
    .help-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      .help-row {
        color: $text-night-sky-color;
        font-size: 0.875rem;
        font-weight: 600;
        overflow-wrap: break-word;
        margin: 0.75rem 0;
        display: flex;
        align-items: center;
        .contact-us {
          height: 1.5rem;
          display: flex;
          align-items: center;
          font-weight: 410;
          color: $primary-color;
          cursor: pointer;
          .contact-icon {
            margin: 0 0.625rem;
            img {
              width: 1rem;
              height: 1rem;
            }
          }
        }
      }
      .game-responsibly {
        width: 4.6875rem;
        height: 1.5625rem;
      }
      .responsibility-images {
        max-width: 100%;
        min-height: 1.5625rem;
      }
    }
  }
}

.h5 {
  .form-bottom {
    width: 100%;
    margin-top: 1rem;
    color: $text-charcoal-gray-color-light;
    border-radius: 16px;
    border: 0.5px solid $border-misty-blue-color;
    backdrop-filter: blur(20px);
    .terms-container {
      width: 100%;
      height: 8.75rem;
      border: 1px solid $border-gray-color;
      border-radius: 0.375rem;
      font-size: 12px;
      overflow-y: scroll;
      padding: 0.625rem;

      :deep(*) {
        font-size: 12px;
      }

      .term-row {
        width: 100%;
        color: $text-charcoal-gray-color-light;
        line-height: 1.13rem;
        font-size: 0.75rem;
        text-transform: capitalize;
        text-align: left;
        font-weight: 400;
        font-family: Helvetica;
      }
    }
    .agree-container {
      width: 100%;
      padding-top: 0.5rem;
      box-shadow: rgba($box-shadow-deep-slate-color, 0.06) 0px -4px 6px;
      :deep(.agree-text) {
        font-size: 0.8269rem;
        line-height: 1.125rem;
      }
    }
    .help-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 0.625rem;
      .help-row {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        color: $text-steel-blue-color;
        line-height: 1.125rem;
        letter-spacing: -0.02em;
        font-size: 0.8125rem;
        .contact-us {
          display: flex;
          align-items: center;
          font-weight: 410;
          color: $primary-color;
          cursor: pointer;
          .contact-icon {
            margin: 0 2px;
            img {
              width: 1.25rem;
              height: 1.25rem;
            }
          }
        }
      }
      .game-responsibly {
        margin-top: 1rem;
        width: 8rem;
      }
      .responsibility-images {
        margin-top: 1rem;
        min-height: 1.5625rem;
      }
    }
  }
}
</style>
