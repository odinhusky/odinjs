import { boot } from "quasar/wrappers"

/**
 * DMSans / Century Gothic 不進首屏關鍵 CSS；idle 後再載入對應 chunk。
 * 使用這些字型的頁面可能有短暫 fallback → swap，但不擋 FCP。
 */
export default boot(() => {
  if (typeof window === "undefined") return

  const loadOptionalFonts = () => {
    void import("src/css/_font-optional.scss")
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadOptionalFonts, { timeout: 3000 })
  } else {
    window.setTimeout(loadOptionalFonts, 1500)
  }
})
