<template>
  <template v-if="isAIHelperShow">
    <div class="ai-helper-content" :class="{ active: isAIHelperIframeShow }" v-draggable>
      <div class="ai-helper-top">
        <q-img :src="commonImg('close-black.svg')" loading="lazy" class="btn-close" @click="closeAIHelper"></q-img>
      </div>
      <div class="ai-helper-middle" @click="isAIHelperIframeShow = !isAIHelperIframeShow">
        <div class="spinner">
          <div class="spinner1"></div>
        </div>
        <q-img :src="aiImg('helper2.webp')" loading="lazy" class="ai-img"></q-img>
      </div>
      <div class="ai-helper-bottom">
        <div v-show="isAIHelperNewMessage" class="ai-helper-new-message" />
        <span class="ai-name">AI {{ $t("menu.sales_assistant") }}</span>
      </div>
    </div>
    <div class="iframe-content" :class="{ active: isAIHelperIframeShow }">
      <q-btn class="absolute top-7 right-2" flat rounded size="lg" @click="isAIHelperIframeShow = false">X</q-btn>
      <iframe
        v-if="iframeUrl"
        :src="iframeUrl"
        ref="aiHelperIframeRef"
        allow="camera; microphone"
        allowfullscreen
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
      ></iframe>
    </div>
  </template>
</template>

<script setup lang="ts">
  import { onMounted } from "vue"
  import { useAIHelperEvent } from "src/hook/useAIHelperEvent"
  import { useImage } from "src/hook/useImage"
  import { useEnv } from "src/hook/useEnv"

  const { commonImg, aiImg } = useImage()
  const { envData } = useEnv()
  const {
    iframeOrigin,
    iframeUrl,
    isAIHelperShow,
    isAIHelperIframeShow,
    aiHelperIframeRef,
    isAIHelperNewMessage,
    closeAIHelper
  } = useAIHelperEvent()

  const AI_HELPER_USER_ID = "f6e6a2c3-63aa-4328-8576-c3c2930bc280"
  const AI_HELPER_WIDGET_PATH = "/widget/assistant.html"

  const getAiHelperIframeUrls = (useDevOiHost: boolean) => {
    const host = useDevOiHost ? "dev-oi.aimate.am" : "oi.aimate.am"
    const baseUrl = `https://${host}`
    return {
      iframeOrigin: baseUrl,
      iframeUrl: `${baseUrl}${AI_HELPER_WIDGET_PATH}?user_id=${AI_HELPER_USER_ID}`
    }
  }

  onMounted(() => {
    const { VITE_IS_DEV, VITE_IS_STG } = envData()
    const useDevOiHost = VITE_IS_DEV || VITE_IS_STG
    const { iframeOrigin: origin, iframeUrl: url } = getAiHelperIframeUrls(useDevOiHost)
    iframeOrigin.value = origin
    iframeUrl.value = url
  })
</script>

<style scoped lang="scss">
  .ai-helper-content {
    @apply fixed flex flex-col justify-center items-center;
    width: 5rem;
    z-index: 10002;
    top: 9.125rem;
    left: calc(100vw - 7rem);

    .ai-helper-top {
      @apply flex justify-end items-center w-full;
      .btn-close {
        @apply w-6 h-6 cursor-pointer;
      }
    }

    .ai-helper-middle {
      @apply relative cursor-pointer flex justify-center;
      width: 4.625rem;
      height: 4.625rem;

      .spinner {
        position: absolute;
        left: 0;
        top: 0;

        background-image: linear-gradient(rgb(186, 66, 255) 35%, rgb(0, 225, 255));
        width: 4.625rem;
        height: 4.625rem;
        animation: spinning 1.7s linear infinite;
        text-align: center;
        border-radius: 50px;
        filter: blur(1px);
        box-shadow:
          0px -5px 20px 0px rgb(186, 66, 255),
          0px 5px 20px 0px rgb(0, 225, 255);

        .spinner1 {
          background-color: rgb(36, 36, 36);
          width: 4.625rem;
          height: 4.625rem;
          border-radius: 50px;
          filter: blur(10px);
        }

        @keyframes spinning {
          to {
            transform: rotate(360deg);
          }
        }
      }

      .ai-img {
        position: absolute;
        bottom: 50%;
        left: 50%;
        transform: translate(-50%, 50%);
        width: 3.21875rem;
      }
    }

    .ai-helper-bottom {
      @apply flex justify-center items-center relative z-10;
      margin-top: 0.4375rem;

      .ai-helper-new-message {
        position: absolute;
        top: -0.1875rem;
        right: 0;
        width: 0.7rem;
        height: 0.7rem;
        background-color: #ff0000;
        border-radius: 50%;
        z-index: 11;
      }

      .ai-name {
        padding: 0.125rem 0.375rem;
        background: #000;
        border-radius: 62.4375rem;
        font-family: NotoSans;
        font-weight: 700;
        font-size: 0.75rem;
        line-height: 1.1875rem;
        color: #fff;
        white-space: nowrap;
      }
    }

    &.active {
      visibility: hidden;
    }
  }

  .iframe-content {
    @apply fixed;
    width: 30.1875rem;
    height: 37.5rem;
    max-width: 90vw;
    max-height: 81vh !important;
    z-index: 10001;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    transition: transform 0.3s ease;

    &.active {
      transform: translate(0%, -50%);
    }

    iframe {
      width: 100%;
      height: 100%;
    }
  }
</style>
