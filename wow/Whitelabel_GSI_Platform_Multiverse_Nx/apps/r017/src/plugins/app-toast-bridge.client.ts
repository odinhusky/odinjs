import { TOAST_SEVERITY_ENUMS } from "@shared-lib/constants/enums/toast"

interface AppToastOptions {
  severity?: string
  summary?: string
  life?: number
}

export default defineNuxtPlugin(() => {
  const { pushToast } = useToastQueue()

  const appToast = (message: string, options: AppToastOptions = {}) => {
    if (!message) return

    pushToast({
      severity: options.severity ?? TOAST_SEVERITY_ENUMS.ERROR,
      summary: options.summary ?? "API Request Failed",
      detail: message,
      life: options.life ?? 2500
    })
  }

  return {
    provide: {
      appToast
    }
  }
})
