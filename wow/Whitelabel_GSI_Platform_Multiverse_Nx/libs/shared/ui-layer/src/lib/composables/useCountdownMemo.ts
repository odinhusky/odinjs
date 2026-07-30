import { ref, computed, onMounted } from "vue"
import { useStorage, useIntervalFn } from "@vueuse/core"

/**
 * 倒數計時器的設定選項
 */
export interface UseCountdownMemoOptions {
  /** * 儲存在 localStorage 中的唯一識別碼 (Key)，用來確保重新整理後能恢復計時
   */
  key: string
  /** * 預設的倒數時間。可傳入秒數 (number) 或明確的結束時間點 (Date)。
   * 若不傳此值，則必須在呼叫 start() 時動態傳入。
   */
  time?: number | Date
  /** * 倒數結束時觸發的回呼函式 (Callback)
   */
  onFinish?: () => void
}

/**
 * 持久化倒數計時器 Composable
 * 支援跨頁面、重新整理不中斷，並具備無痕模式降級防護。
 * * @param options UseCountdownMemoOptions 設定物件
 */
export const useCountdownMemo = (options: UseCountdownMemoOptions) => {
  const targetTime = useStorage<number | null>(options.key, null)
  const remainingMs = ref(0)

  const { pause, resume, isActive } = useIntervalFn(
    () => {
      if (!targetTime.value) {
        stop()
        return
      }

      const now = Date.now()
      const diff = targetTime.value - now

      if (diff <= 0) {
        stop()
        if (options.onFinish) options.onFinish()
      } else {
        remainingMs.value = diff
      }
    },
    1000,
    { immediate: false }
  )

  const start = (input?: number | Date) => {
    // 防呆機制，如果正在倒數中，直接擋下並提示
    if (isActive.value || (targetTime.value && targetTime.value > Date.now())) {
      console.warn("目前計時器正在倒數，無法重新啟動")
      return
    }

    // 決定時間。優先使用 start(input) 傳入的值，如果沒傳，就用 options.time 的值
    const finalInput = input ?? options.time

    // 如果兩個都沒給，就報錯退出
    if (finalInput === undefined) {
      console.error("請提供倒數時間 (秒數 或 Date 物件)")
      return
    }

    // 判斷是 Date 還是 秒數，並換算成目標時間戳 (Timestamp)
    if (finalInput instanceof Date) {
      targetTime.value = finalInput.getTime()
    } else {
      targetTime.value = Date.now() + finalInput * 1000
    }

    // 立即更新畫面剩餘時間，並啟動計時器
    remainingMs.value = targetTime.value - Date.now()
    resume()
  }

  const stop = () => {
    pause()
    targetTime.value = null
    remainingMs.value = 0
  }

  onMounted(() => {
    if (targetTime.value) {
      const now = Date.now()
      if (targetTime.value > now) {
        remainingMs.value = targetTime.value - now
        resume()
      } else {
        // 確保過期的時間戳被清除
        stop()
        if (options.onFinish) options.onFinish()
      }
    }
  })

  const remainingSeconds = computed(() => Math.ceil(remainingMs.value / 1000))

  return { start, stop, isActive, remainingMs, remainingSeconds }
}

export type UseCountdownMemoMemoOptions = UseCountdownMemoOptions
export const useCountdownMemoMemo = useCountdownMemo
