<template>
  <div class="telegram-callback-page">
    <div class="loading-container">
      <q-spinner-dots color="primary" size="50px" />
      <p class="loading-text">{{ $t("common.tip.processing") || "Processing..." }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"

const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()
const { handleTelegramCallback } = useTelegram()

onMounted(async () => {
  // Telegram OAuth callback redirect page
  const success = await handleTelegramCallback()

  if (!success) {
    // 登入失敗，顯示錯誤並跳轉回首頁或登入頁
    $q.notify({
      type: "negative",
      message: t("error_message.telegramNotConfigured"),
      position: "top"
    })

    // 延遲跳轉，讓用戶看到錯誤訊息
    setTimeout(() => {
      router.replace("/")
    }, 1500)
  }
})
</script>

<style lang="scss" scoped>
.telegram-callback-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--q-dark, #121212);

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .loading-text {
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      margin: 0;
    }
  }
}
</style>
