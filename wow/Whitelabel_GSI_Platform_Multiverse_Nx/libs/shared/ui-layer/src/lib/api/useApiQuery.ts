import { useQuery, type UseQueryOptions, type UseQueryReturnType } from "@tanstack/vue-query"
import { useAuth } from "@shared-lib/composables/useAuth"
import { ApiResponse, ErrorHandlerDependencies } from "@shared-lib/api/types"
import { handleApiError } from "@shared-lib/api/handleApiError"
import { TOAST_SEVERITY_ENUMS } from "@shared-lib/constants/enums/toast"
import { toValue } from "vue"
import { useI18n, useNuxtApp, useRouter } from "#imports"

/**
 * 使用 TanStack Query 的 useQuery，並整合原有的 error handling
 *
 * @param queryKey - Query key for caching
 * @param apiFunction - API function to call
 * @param payload - Parameters for the API function
 * @param options - Additional TanStack Query options
 */
export function useApiQuery<
  T extends (...args: any[]) => Promise<ApiResponse<any>>, // 使用 any[] 提升參數相容性
  TResponse = Awaited<ReturnType<T>>, // 捕捉 API 回傳的具體 ApiResponse 型別
  TData = TResponse // 預設顯示型別
>(
  queryKey: any[],
  apiFunction: T,
  payload?: Parameters<T>[0],
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<T>>, // TQueryFnData (e.g., ApiResponse<CmsItem[]>)
      Error, // TError
      TData, // TData (將由 select 推導)
      any[] // TQueryKey
    >,
    "queryKey" | "queryFn"
  >
): UseQueryReturnType<TData, Error> {
  const { reset: resetAuth } = useAuth()
  const { t, te } = useI18n()
  const router = useRouter()
  const nuxtApp = useNuxtApp()

  const notify = (message: string) => {
    ;(nuxtApp as any).$appToast?.(message, {
      severity: TOAST_SEVERITY_ENUMS.ERROR,
      summary: "API Request Failed",
      life: 2500
    })
  }

  const errorDeps: ErrorHandlerDependencies = { resetAuth, t, te, router, notify }

  const query = useQuery<Awaited<ReturnType<T>>, Error, TData, any[]>({
    queryKey,
    queryFn: async (): Promise<Awaited<ReturnType<T>>> => {
      try {
        // 💡 payload 可能是 ref / computed，這裡 unwrap 避免 axios 把 Vue 內部欄位序列化到 URL
        const response = await apiFunction(toValue(payload as any))

        // 如果 API 返回失敗狀態,處理錯誤
        if (response.status !== true) {
          handleApiError(response, errorDeps)
          throw new Error(response.msg || `API Error Code: ${response.code}`)
        }

        return response as Awaited<ReturnType<T>>
      } catch (err) {
        console.error("Failed to fetch data:", err)
        throw err
      }
    },
    ...options
  })

  return query
}
