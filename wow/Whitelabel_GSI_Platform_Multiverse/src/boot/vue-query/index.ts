import { boot } from "quasar/wrappers"
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query"
import { persistQueryClient } from "@tanstack/query-persist-client-core"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { FIVE_MINUTES, DAY } from "src/common/utils/constants/durationTime"

export const queryClient = new QueryClient({
  // 全域預設選項
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES, // 5 分鐘 (可透過 useApiQuery 傳入 options 複寫)
      gcTime: DAY * 7, // 7 天 (記憶體快取保留時間，也影響持久化)
      refetchOnWindowFocus: false // 可選：關閉視窗重新聚焦時的 refetch
    }
  }
})

export default boot(({ app }) => {
  app.use(VueQueryPlugin, { queryClient })

  // 確保在 Client 端才執行
  if (window && typeof window !== undefined) {
    const localStoragePersister = createAsyncStoragePersister({
      storage: window.localStorage
    })

    persistQueryClient({
      queryClient,
      persister: localStoragePersister,
      maxAge: DAY * 7,

      dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
          const queryMeta = query.meta as { persist?: boolean } | undefined
          // 只有當 meta 中明確包含 persist: true 時，才進行持久化
          return queryMeta?.persist === true
        }
      }
    })
  }
})
