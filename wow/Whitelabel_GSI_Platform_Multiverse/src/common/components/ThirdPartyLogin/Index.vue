<template>
  <div
    v-if="isGoogleOAuthEnabled || isTelegramLoginEnabled"
    :class="cx('w-full flex flex-col items-center gap-2', props.containerClass, `theme-${props.theme}`)"
    :style="containerStyle"
    class="thirdparty-login-wrapper"
  >
    <!-- 第三方登入按鈕 -->
    <div class="login-buttons">
      <q-btn
        v-if="isGoogleOAuthEnabled"
        round
        flat
        class="login-btn google-btn"
        :loading="googleLoading"
        @click="onGoogleLogin"
      >
        <img src="./images/google.svg" alt="Google" class="icon" />
      </q-btn>
      <q-btn
        v-if="isTelegramLoginEnabled"
        round
        flat
        class="login-btn telegram-btn"
        :loading="telegramLoading"
        @click="onTelegramLogin"
      >
        <img v-if="props.theme === 'light'" src="./images/telegram-light.svg" alt="Telegram" class="icon" />
        <img v-else src="./images/telegram-dark.svg" alt="Telegram" class="icon" />
      </q-btn>
    </div>

    <!-- 提示文字 -->
    <p v-if="!props.hideTip" class="tip">{{ $t("common.tip.thirdpartyTip") }}</p>

    <!-- 分隔線 -->
    <div class="divider">
      <span class="divider-line"></span>
      <span class="divider-text">Or Continue With</span>
      <span class="divider-line"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cx } from "src/common/utils/cx"
import { useGoogleOAuth } from "src/common/composables/useGoogleOAuth"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import type { ThirdPartyLoginContainerProps, ThirdPartyLoginTheme } from "./types"

const props = defineProps({
  theme: {
    type: String as () => ThirdPartyLoginTheme,
    default: "dark"
  },
  containerClass: {
    type: String,
    default: ""
  },
  containerStyle: {
    type: Object as () => ThirdPartyLoginContainerProps["containerStyle"],
    default: () => ({})
  },
  hideTip: {
    type: Boolean,
    default: false
  }
})

// Google OAuth
const { isLoading: googleLoading, isGoogleOAuthEnabled, handleGoogleLogin } = useGoogleOAuth()

// Telegram Login
const { isLoading: telegramLoading, isTelegramLoginEnabled, handleTelegramWebLogin } = useTelegram()

// Google 登入處理
const onGoogleLogin = () => {
  handleGoogleLogin()
}

// Telegram 登入處理
const onTelegramLogin = () => {
  handleTelegramWebLogin()
}
</script>

<style lang="scss" scoped>
.thirdparty-login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 0.125rem;
  margin-bottom: 0.25rem;

  .login-buttons {
    display: flex;
    justify-content: center;
    gap: 24px;
  }

  .login-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, opacity 0.2s;
    background-color: rgba(255, 255, 255, 0.1);

    &:hover {
      // transform: scale(1.05);
      opacity: 0.9;
    }

    .icon {
      width: 28px;
      height: 28px;
    }
  }

  .google-btn,
  .telegram-btn {
    background-color: rgb(255 255 255 / 15%);
    color: #fff;
  }

  .tip {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    margin: 0;
    padding: 0 16px;
  }

  .divider {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 16px;

    .divider-line {
      flex: 1;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.3);
    }

    .divider-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      white-space: nowrap;
    }
  }

  // Light theme
  &.theme-light {
    .login-btn {
      background-color: rgba(0, 0, 0, 0.05);

      &:hover {
        // background-color: rgba(0, 0, 0, 0.1);
      }
    }

    .google-btn {
      background-color: rgb(255 255 255 / 15%);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }

    .telegram-btn {
      background-color: #0295e8;
    }

    .tip {
      color: rgba(0, 0, 0, 0.6);
    }

    .divider {
      .divider-line {
        background-color: rgba(0, 0, 0, 0.2);
      }

      .divider-text {
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
}
</style>
