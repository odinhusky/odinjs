import { ref } from "vue"
import { injectStrict } from "@/utils/injectTyped"
import { EventBusKey } from "@/symbols"

export function useStepper() {
  const eventbus = injectStrict(EventBusKey)
  const selector = ref(1)

  /**
   * 切換上一步、下一步
   * @param arrow (true: 下一步；false: 上一步)
   */
  function nextPrevStep(arrow: boolean) {
    eventbus.emit("nextPrevSteps", arrow)
  }

  return {
    selector,
    nextPrevStep
  }
}

export default useStepper
