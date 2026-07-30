import { useMutation, type UseMutationOptions } from "@tanstack/vue-query"
import { useAuth } from "@shared-lib/composables/useAuth"
import { ApiResponse, ErrorHandlerDependencies } from "@shared-lib/api/types"
import { handleApiError } from "@shared-lib/api/handleApiError"
import { TOAST_SEVERITY_ENUMS } from "@shared-lib/constants/enums/toast"
import { useI18n, useNuxtApp, useRouter } from "#imports"

/**
 * 使用 TanStack Query 的 useMutation，並整合原有的 error handling
 *
 * @param apiFunction - API function to call
 * @param options - Additional TanStack Query options
 */
export function useApiMutation<T extends (...args: any) => Promise<ApiResponse<any>>>(
  apiFunction: T,
  options?: Omit<UseMutationOptions<ApiResponse<any>, Error, Parameters<T>[0]>, "mutationFn">
) {
  const { reset: resetAuth } = useAuth()
  const { t, te } = useI18n()
  const router = useRouter()
  const nuxtApp = useNuxtApp()

  const mutationFailedSummary = apiFunction.name === "login" ? "Login Failed" : "API Request Failed"

  const notify = (message: string) => {
    ;(nuxtApp as any).$appToast?.(message, {
      severity: TOAST_SEVERITY_ENUMS.ERROR,
      summary: mutationFailedSummary,
      life: 2500
    })
  }

  const errorDeps: ErrorHandlerDependencies = { resetAuth, t, te, router, notify }

  const mutation = useMutation({
    mutationFn: async (payload: Parameters<T>[0]) => {
      try {
        const response = await apiFunction(payload)

        // 如果 API 返回失敗狀態，處理錯誤(待釐清)
        if (response.status === false) {
          handleApiError(response, errorDeps)
          throw new Error(response.msg || `API Error Code: ${response.code}`)
        }

        return response
      } catch (err) {
        console.error("Failed to fetch data:", err)
        throw err
      }
    },
    onError: (error) => {
      console.error("!! [tanstack-vue-query] useApiMutation caught an exception:", error)
    },
    ...options
  })

  return mutation
}
