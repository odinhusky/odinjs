import type { InjectionKey } from "vue"
import type { usePendingOrder } from "./index"

type PendingOrderContext = ReturnType<typeof usePendingOrder>

const PENDING_ORDER_CONTEXT_KEY: InjectionKey<PendingOrderContext> = Symbol("pending-order-context")

export const providePendingOrderContext = (context: PendingOrderContext) => {
  provide(PENDING_ORDER_CONTEXT_KEY, context)
}

export const usePendingOrderContext = () => {
  const context = inject(PENDING_ORDER_CONTEXT_KEY)

  if (!context) {
    throw new Error("usePendingOrderContext must be used under pending-order context provider")
  }

  return context
}
