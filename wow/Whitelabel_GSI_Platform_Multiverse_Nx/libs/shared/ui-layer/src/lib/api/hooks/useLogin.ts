import { login as loginApi, type LoginParamsType } from "@shared-lib/api/apiFunctions/auth_login"
import type { LoginResponseType } from "@shared-lib/api/commonTypes/authTypes"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import type { ApiResponse } from "@shared-lib/api/types"

export interface UseLoginOptionsType {
  // 登入成功後可串接其他 use* API
  onSuccess?: (response: ApiResponse<LoginResponseType>, payload: LoginParamsType) => void | Promise<void>

  onError?: (error: Error, payload: LoginParamsType) => void | Promise<void>
}

export function useLogin(options: UseLoginOptionsType = {}) {
  const mutation = useApiMutation(loginApi, {
    onSuccess: async (response: ApiResponse<any>, variables: LoginParamsType) => {
      const loginResponse = response as ApiResponse<LoginResponseType>
      const payload = variables

      await options.onSuccess?.(loginResponse, payload)
    },
    onError: async (error: Error, variables: LoginParamsType) => {
      if (!variables) return
      await options.onError?.(error, variables)
    }
  })

  const mutateAsync = (payload: LoginParamsType) => {
    return mutation.mutateAsync(payload) as Promise<ApiResponse<LoginResponseType>>
  }

  return {
    // 主要給 UI 使用的 login action
    login: mutateAsync,

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
