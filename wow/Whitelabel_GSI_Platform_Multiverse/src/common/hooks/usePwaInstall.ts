import { Platform, useQuasar } from "quasar"
import PwaInstallGuideDialog, {
  type PwaInstallGuideDialogStep,
} from "src/common/components/dialog/PwaInstallGuideDialog.vue"
import { useEnv } from "src/common/hooks/useEnv"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

export type PwaInstallGuideDialogOptions = {
  title?: string
  steps?: PwaInstallGuideDialogStep[]
  tipTitle?: string
  tipDesc?: string
  footerLabel?: string
}

type InstallGuidePlatform = "ios" | "android"

function resolveInstallGuidePlatform(): InstallGuidePlatform {
  if (Platform.is.android) return "android"
  return "ios"
}

function buildInstallGuideSteps(
  t: (key: string) => string,
  platform: InstallGuidePlatform
): PwaInstallGuideDialogStep[] {
  const sharedStep2: PwaInstallGuideDialogStep = {
    label: t("pwa.install.dialog.step2"),
    iconify: "fluent:phone-add-20-filled",
  }

  if (platform === "android") {
    return [
      { label: t("pwa.install.dialog.android.step1"), iconify: "mdi:dots-vertical" },
      sharedStep2,
      { label: t("pwa.install.dialog.android.step3"), iconify: "icon-park-solid:add" },
    ]
  }

  return [
    { label: t("pwa.install.dialog.step1"), iconify: "mingcute:upload-line" },
    sharedStep2,
    { label: t("pwa.install.dialog.step3"), iconify: "icon-park-solid:add" },
  ]
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const isInstalled = ref(detectPwaInstalled())
let listenersRegistered = false

function detectPwaInstalled(): boolean {
  if (typeof window === "undefined") return false

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
  const isIosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true

  return isStandalone || isIosStandalone
}

export function registerPwaInstallListeners() {
  if (listenersRegistered || typeof window === "undefined") return
  listenersRegistered = true

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault()
    deferredPrompt.value = event as BeforeInstallPromptEvent
  })

  window.addEventListener("appinstalled", () => {
    deferredPrompt.value = null
    isInstalled.value = true
  })
}

export type PwaInstallResult = "accepted" | "dismissed" | "unavailable" | "already_installed"

export function usePwaInstall() {
  const $q = useQuasar()
  const { t } = useI18n()
  const { isCordovaMode } = useEnv()

  const canInstall = computed(() => {
    if (isCordovaMode.value || isInstalled.value) return false
    return deferredPrompt.value != null
  })

  const canShowInstallGuide = computed(() => {
    if (isCordovaMode.value || isInstalled.value) return false
    return deferredPrompt.value == null
  })

  const installGuideSteps = computed(() => buildInstallGuideSteps(t, resolveInstallGuidePlatform()))

  const installGuideDialogDefaults = computed(() => ({
    title: t("pwa.install.dialog.title"),
    steps: installGuideSteps.value,
    tipTitle: t("pwa.install.dialog.tipTitle"),
    tipDesc: t("pwa.install.dialog.tipDesc"),
    footerLabel: t("pwa.install.dialog.footerBtn"),
  }))

  function showInstallGuide(options: PwaInstallGuideDialogOptions = {}) {
    const defaults = installGuideDialogDefaults.value

    $q.dialog({
      component: PwaInstallGuideDialog,
      componentProps: {
        title: options.title ?? defaults.title,
        steps: options.steps ?? defaults.steps,
        tipTitle: options.tipTitle ?? defaults.tipTitle,
        tipDesc: options.tipDesc ?? defaults.tipDesc,
        footerLabel: options.footerLabel ?? defaults.footerLabel,
      },
    })
  }

  async function promptInstall(installGuideOptions?: PwaInstallGuideDialogOptions): Promise<PwaInstallResult> {
    if (isCordovaMode.value) {
      return "unavailable"
    }

    if (detectPwaInstalled()) {
      isInstalled.value = true
      $q.notify({
        type: "info",
        message: t("pwa.install.notify.alreadyInstalled"),
        position: "top",
      })
      return "already_installed"
    }

    const promptEvent = deferredPrompt.value
    if (!promptEvent) {
      showInstallGuide(installGuideOptions)
      return "unavailable"
    }

    await promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice
    deferredPrompt.value = null

    if (outcome === "accepted") {
      isInstalled.value = true
      $q.notify({
        type: "positive",
        message: t("pwa.install.notify.success"),
        position: "top",
      })
      return "accepted"
    }

    return "dismissed"
  }

  return {
    canInstall,
    canShowInstallGuide,
    installGuideSteps,
    isInstalled,
    promptInstall,
    showInstallGuide,
  }
}
