/**
 * 基於視窗寬度提供響應式斷點偵測，支援 max-width 和 min-width 兩種媒體查詢模式。
 * 此版本採用單例模式 (Singleton Pattern)，確保在整個應用程式中只有一個事件監聽器和狀態，以達到最佳效能。
 * 並透過節流優化效能。
 *
 * @example
 * ```vue
 * <script setup>
 * const { isMobile, isTablet, isDesk, isDown, isUp, width } = useCustomBreakpoints()
 *
 * // 檢查當前寬度是否為手機
 * console.log(isMobile.value) // boolean
 *
 * // 檢查特定斷點
 * console.log(isDown.pad.value) // 寬度 <= breakpoints.pad
 * console.log(isUp.pc.value)    // 寬度 > breakpoints.pc
 * </script>
 *
 * <template>
 * <div v-if="isMobile">手機版內容</div>
 * <div v-else-if="isTablet">平板版內容</div>
 * <div v-else>桌面版內容</div>
 * </template>
 * ```
 *
 * @returns {Object} 媒體查詢響應式狀態與工具
 * @returns {Readonly<Ref<number>>} width - 目前視窗寬度（像素），為唯讀狀態防止外部修改
 * @returns {ComputedRef<boolean>} isMobile - 寬度是否 <= phone 斷點
 * @returns {ComputedRef<boolean>} isTablet - 寬度是否介於 phone 和 padXl 之間
 * @returns {ComputedRef<boolean>} isDesk - 寬度是否 >= padXl 斷點
 * @returns {Object} isDown - 包含各斷點 max-width 檢查的物件
 * @returns {Object} isUp - 包含各斷點 min-width 檢查的物件
 * @returns {ComputedRef<boolean>} isDesktop - 舊版：isMobile 的相反值（建議逐步棄用）
 * @returns {ComputedRef<boolean>} isLargeTablet - 舊版：寬度 <= 1000px（建議逐步棄用）
 * @returns {ComputedRef<boolean>} isXLargeTablet - 舊版：寬度 <= 1440px（建議逐步棄用）
 *
 * @note 所有響應式數值會在視窗調整大小時自動更新。
 * @note 支援 SSR - 伺服器端回傳 width: 0。
 * @note 全局唯一的 resize 事件使用 100ms 節流以優化效能。
 * @note 舊版屬性（isDesktop, isLargeTablet, isXLargeTablet）已標示為棄用，請逐步替換。
 */
import { ref, computed, readonly, reactive } from "vue";
import { throttle } from "lodash-es"; // 改用 lodash-es
// 修正：引用你剛才定義好的 BREAKPOINTS 常數
import { BREAKPOINTS } from "../constants/breakpoints.js";
const hasWindow = typeof window !== 'undefined';
const width = ref(hasWindow ? window.innerWidth : 0);

const onResize = throttle(() => {
  if (hasWindow) {
    width.value = window.innerWidth;
  }
}, 100);

if (hasWindow) {
  window.addEventListener("resize", onResize);
}

export function cleanupMediaQueryListener() {
  if (hasWindow) {
    window.removeEventListener("resize", onResize);
    onResize.cancel?.();
  }
}

export function useCustomBreakpoints() {
  const isMobile = computed(() => width.value <= BREAKPOINTS.phone);
  const isTablet = computed(() => width.value > BREAKPOINTS.phone && width.value < BREAKPOINTS.padXl);
  const isDesk = computed(() => width.value >= BREAKPOINTS.padXl);

  const createBreakpointComputeds = (comparison: 'max' | 'min') => {
    return Object.fromEntries(
      Object.entries(BREAKPOINTS).map(([key, value]) => [
        key,
        computed(() =>
          comparison === 'max'
            ? width.value <= (value as number)
            : width.value > (value as number)
        )
      ])
    );
  };

  const isDown = reactive(createBreakpointComputeds('max'));
  const isUp = reactive(createBreakpointComputeds('min'));

  const isDesktop = computed(() => !isMobile.value);
  const isLargeTablet = computed(() => width.value <= 1000);
  const isXLargeTablet = computed(() => width.value <= 1440);

  return {
    width: readonly(width),
    isMobile,
    isTablet,
    isDesk,
    isDown,
    isUp,
    isDesktop,
    isLargeTablet,
    isXLargeTablet,
  };
}
