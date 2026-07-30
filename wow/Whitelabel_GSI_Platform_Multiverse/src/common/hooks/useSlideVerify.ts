import { injectStrict } from "src/common/utils/injectTyped"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, ref } from "vue"

export function useSlideVerify() {
  const eventbus = injectStrict(EventBusKey)
  const envStore = useEnvInfoStore()
  const verifyStatus = ref(false)
  let callbackList: (() => void | Promise<void>)[] = []
  const isSlideCaptchaEnabled = computed(() => envStore.envInfo.slide_captcha_enabled === 1)

  // 不走callback使用狀態判斷
  const isVerify = computed(() => verifyStatus.value)
  function setVerifyFalse() {
    verifyStatus.value = false
  }

  function showVerifyModal(callback?: (() => void | Promise<void>)[]) {
    if (callback && callback.length) {
      callbackList = callback
    }

    if (!isSlideCaptchaEnabled.value) {
      if (!callbackList.length) {
        return
      }
      runCallbackList()
      return
    }

    eventbus.emit("openSlideVerify", true)
  }

  function initVerify() {
    verifyStatus.value = false
    callbackList.length = 0
  }

  function runCallbackList() {
    Promise.all(callbackList.map((func) => func()))
      .finally(() => {
        initVerify()
      })
      .catch((error) => {
        console.error(error)
        initVerify()
      })
  }

  onMounted(() => {
    eventbus.on("verifyResult", (status: boolean) => {
      verifyStatus.value = status
      if (status && callbackList.length) {
        runCallbackList()
      }
    })
  })

  return {
    isVerify,
    setVerifyFalse,
    showVerifyModal
  }
}
