import { ref, computed, onUnmounted } from "vue"

/**
 * 冷卻計時器 composable
 * @param durationSeconds 冷卻時間（秒）
 * @returns remainingSeconds, start, isCoolingDown, reset
 */
export function useCooldown(durationSeconds: number) {
  // 內部轉換為毫秒
  const durationMs = durationSeconds * 1000

  // 內部使用毫秒追蹤剩餘時間
  const remainingMs = ref(0)
  let timer: number | null = null

  /**
   * 啟動冷卻計時器
   */
  const start = () => {
    // 已在倒數中就不重啟（避免重複 interval）
    if (isCoolingDown.value) return

    remainingMs.value = durationMs

    timer = window.setInterval(() => {
      remainingMs.value -= 1000

      if (remainingMs.value <= 0) {
        remainingMs.value = 0
        clear()
      }
    }, 1000)
  }

  /**
   * 計算剩餘時間（秒）
   */
  const remainingSeconds = computed(() => {
    return Math.ceil(remainingMs.value / 1000)
  })

  /**
   * 檢查是否在冷卻期間
   */
  const isCoolingDown = computed(() => {
    return remainingMs.value > 0
  })

  /**
   * 清理計時器
   */
  const clear = () => {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  /**
   * 重置冷卻計時器
   */
  const reset = () => {
    clear()
    remainingMs.value = 0
  }

  // 組件卸載時重置計時器
  onUnmounted(() => {
    clear()
  })

  return {
    remainingSeconds,
    start,
    isCoolingDown,
    reset
  }
}
