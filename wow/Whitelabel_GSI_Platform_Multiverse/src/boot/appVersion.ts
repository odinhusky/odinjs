import { boot } from "quasar/wrappers"

/**
 * 將打包資訊寫進 <body> 的 data 屬性，方便部署後查版本：
 * - data-commit：打包當下的 git commit short hash
 * - data-build-time：打包時間（台北時間，由 quasar.config.js 注入）
 * 值在 build 時由 build.env 注入；純拿 dist 重打包則為 "unknown"。
 */
export default boot(() => {
  const apply = () => {
    if (typeof document === "undefined") return
    document.body.dataset.commit = process.env.VITE_APP_GIT_COMMIT || "unknown"
    document.body.dataset.buildTime = process.env.VITE_APP_BUILD_TIME || "unknown"
  }

  if (typeof window === "undefined") return

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => apply(), { timeout: 2000 })
  } else {
    window.setTimeout(apply, 0)
  }
})
