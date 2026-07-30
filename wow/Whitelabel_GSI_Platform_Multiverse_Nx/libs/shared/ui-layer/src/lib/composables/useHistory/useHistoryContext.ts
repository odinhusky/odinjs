import type { InjectionKey } from "vue"
import { useHistory } from "./index"

type HistoryContext = ReturnType<typeof useHistory>

const HISTORY_CONTEXT_KEY: InjectionKey<HistoryContext> = Symbol("history-context")

export const provideHistoryContext = (context: HistoryContext) => {
  provide(HISTORY_CONTEXT_KEY, context)
}

export const useHistoryContext = () => {
  const context = inject(HISTORY_CONTEXT_KEY)

  if (!context) {
    throw new Error("useHistoryContext must be used under history context provider")
  }

  return context
}