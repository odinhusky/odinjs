import { register as registerApi, type RegisterParamsType } from "@shared-lib/api/apiFunctions/auth_register"
import type { RegisterResponseType } from "@shared-lib/api/apiFunctions/auth_register"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import type { ApiResponse } from "@shared-lib/api/types"

export interface UseRegisterOptionsType {
  onSuccess?: (response: ApiResponse<RegisterResponseType>, payload: RegisterParamsType) => void | Promise<void>
  onError?: (error: Error, payload: RegisterParamsType) => void | Promise<void>
}

export function useRegister(options: UseRegisterOptionsType = {}) {
  const mutation = useApiMutation(registerApi, {
    onSuccess: async (response: ApiResponse<any>, variables: RegisterParamsType) => {
      await options.onSuccess?.(response as ApiResponse<RegisterResponseType>, variables)
    },
    onError: async (error: Error, variables: RegisterParamsType) => {
      if (!variables) return
      await options.onError?.(error, variables)
    }
  })

  const mutateAsync = (payload: RegisterParamsType) => {
    return mutation.mutateAsync(payload) as Promise<ApiResponse<RegisterResponseType>>
  }

  return {
    register: mutateAsync,
    mutate: mutation.mutate,
    mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
