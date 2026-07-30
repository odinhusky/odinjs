<script setup lang="ts">
import { TOAST_SEVERITY_ENUMS } from "@shared-lib/constants/enums/toast"

const { state, closeAllTransferOutDialog, submitAllTransferOut } = useTransferWalletAllTransferOut()
const { pushToast } = useToastQueue()
const { t, te } = useI18n()

const safeT = (key: string, fallback: string, params?: Record<string, unknown>) => {
  if (!te(key)) return fallback
  return params ? t(key, params) : t(key)
}

const visible = computed({
  get: () => state.value.visible,
  set: (value) => {
    if (!value) closeAllTransferOutDialog()
  }
})

const handleConfirm = async () => {
  const result = await submitAllTransferOut()

  switch (result.kind) {
    case "all_success":
      pushToast({
        severity: TOAST_SEVERITY_ENUMS.SUCCESS,
        detail: safeT("wallet.oneClickTransferBack.success", "轉回成功"),
        life: 2200
      })
      break
    case "partial_failed": {
      const suffix = result.message ? `：${result.message}` : ""
      pushToast({
        severity: TOAST_SEVERITY_ENUMS.WARN,
        detail: safeT(
          "wallet.oneClickTransferBack.partialFailed",
          `部分遊戲錢包轉回失敗（${result.failedCount} 個）${suffix}`,
          { count: result.failedCount, suffix }
        ),
        life: 3000
      })
      break
    }
    case "all_failed":
      pushToast({
        severity: TOAST_SEVERITY_ENUMS.ERROR,
        detail:
          result.message ||
          safeT("wallet.oneClickTransferBack.failed", "轉回失敗"),
        life: 3000
      })
      break
    case "empty":
      pushToast({
        severity: TOAST_SEVERITY_ENUMS.INFO,
        detail: safeT("wallet.oneClickTransferBack.empty", "目前沒有可轉回餘額"),
        life: 2200
      })
      break
    case "request_failed":
    default:
      pushToast({
        severity: TOAST_SEVERITY_ENUMS.ERROR,
        detail: result.message || `Error code: ${String(result.code || "")}`,
        life: 2500
      })
      break
  }

  closeAllTransferOutDialog()
}
</script>

<template>
  <BaseDialog
    v-model:visible="visible"
    :class-obj="{
      root: cx(
        'max-w-[480px]',
        'phone:!w-[calc(100%-32px)] phone:!max-w-[440px] phone:!h-auto phone:!max-h-[90vh] phone:!rounded-2xl phone:!m-0'
      ),
      header: cx('py-3 bg-[var(--dialog-dialog-bg-header)]'),
      title: cx('text-xl'),
      body: cx('p-6'),
      closeBtn: cx('top-4 right-4')
    }"
    @close="closeAllTransferOutDialog"
  >
    <template #header>
      <h3 class="text-xl text-[var(--dialog-dialog-title-content)] font-bold leading-7">
        {{ safeT("wallet.oneClickTransferBack", "一鍵轉回") }}
      </h3>
    </template>

    <p class="text-base text-[var(--text-text-primary)] leading-6 text-center">
      {{
        safeT("wallet.oneClickTransferBack.confirmMessage", "確認轉回所有餘額至現金錢包?")
      }}
    </p>

    <template #footer>
      <div class="grid grid-cols-2 gap-2 py-2">
        <BaseBtn
          class="w-full"
          size="xl"
          theme="primary"
          category="outline"
          :disabled="state.isSubmitting"
          @click="closeAllTransferOutDialog"
        >
          {{ safeT("common.btn.cancel", "取消") }}
        </BaseBtn>
        <BaseBtn class="w-full" size="xl" :loading="state.isSubmitting" @click="handleConfirm">
          {{ safeT("common.btn.confirm2", "確定") }}
        </BaseBtn>
      </div>
    </template>
  </BaseDialog>
</template>
