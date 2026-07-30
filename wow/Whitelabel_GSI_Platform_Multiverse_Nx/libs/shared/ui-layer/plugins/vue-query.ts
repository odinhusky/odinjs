import { defineNuxtPlugin } from "#app"
import { VueQueryPlugin, QueryClient, type VueQueryPluginOptions } from "@tanstack/vue-query"

export default defineNuxtPlugin((nuxtApp) => {
  // 建立 QueryClient 實體
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // 全局預設：資料 1 分鐘後視為過期
        staleTime: 1000 * 60 * 1,
        // 預設緩存時間 5 分鐘 (inactive 之後多久清除)
        gcTime: 1000 * 60 * 5,
        // 視窗聚焦時不自動重抓 (避免切換視窗頻繁 request，視需求開啟)
        refetchOnWindowFocus: false,
        // 失敗重試 1 次
        retry: 1,
        // 避免在 server side 執行 refetch
        refetchOnMount: false
      }
    }
  })

  const options: VueQueryPluginOptions = {
    queryClient
  }

  nuxtApp.vueApp.use(VueQueryPlugin, options)

  // 提供 queryClient 給 Nuxt app context，方便在非 setup 函式中使用
  // 例如: const { $queryClient } = useNuxtApp()
  return {
    provide: {
      queryClient
    }
  }
})
