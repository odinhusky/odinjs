import { boot } from "quasar/wrappers"
import { registerPwaInstallListeners } from "src/common/hooks/usePwaInstall"

export default boot(() => {
  const register = () => registerPwaInstallListeners()

  if (typeof window === "undefined") return

  // PWA beforeinstallprompt 不必擋住首屏 JS
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => register(), { timeout: 3000 })
  } else {
    window.setTimeout(register, 1)
  }
})
