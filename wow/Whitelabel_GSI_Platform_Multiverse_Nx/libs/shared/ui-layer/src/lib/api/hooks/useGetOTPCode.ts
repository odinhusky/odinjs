import { getOTP as getOTPApi, type GetOTPParmasType,  type GetOTPResponseType } from "@shared-lib/api/apiFunctions/auth_getOTP"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import type { ApiResponse } from "@shared-lib/api/types"

export interface GetOptCodeOptionsType {
  // 登入成功後可串接其他 use* API
  onSuccess?: (response: ApiResponse<GetOTPResponseType>, payload: GetOTPParmasType) => void | Promise<void>

  onError?: (error: Error, payload: GetOTPParmasType) => void | Promise<void>
}

export function useGetOptCode(options: GetOptCodeOptionsType = {}) {
  const mutation = useApiMutation(getOTPApi, {
    onSuccess: async (response: ApiResponse<any>, variables: GetOTPParmasType) => {
      const loginResponse = response as ApiResponse<GetOTPResponseType>
      const payload = variables

      await options.onSuccess?.(loginResponse, payload)
    },
    onError: async (error: Error, variables: GetOTPParmasType) => {
      if (!variables) return
      await options.onError?.(error, variables)
    }
  })

  const mutateAsync = (payload: GetOTPParmasType) => {
    return mutation.mutateAsync(payload) as Promise<ApiResponse<GetOTPResponseType>>
  }

  return {
    // 主要給 UI 使用的 getOTPCode action
    getOTPCode: mutateAsync,

    // 保留 mutation 原生能力
    mutate: mutation.mutate,
    mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
