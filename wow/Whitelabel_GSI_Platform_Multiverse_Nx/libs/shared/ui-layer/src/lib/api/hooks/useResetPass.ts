import {
  resetPassword,
  type ResetPasswordParamsType,
  type ResetPasswordResponseType
} from "@shared-lib/api/apiFunctions/auth_resetPassword"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import type { ApiResponse } from "@shared-lib/api/types"

export interface UseResetPassOptionsType {
  onSuccess?: (
    response: ApiResponse<ResetPasswordResponseType>,
    payload: ResetPasswordParamsType
  ) => void | Promise<void>
  onError?: (error: Error, payload: ResetPasswordParamsType) => void | Promise<void>
}

export function useResetPass(options: UseResetPassOptionsType = {}) {
  const mutation = useApiMutation(resetPassword, {
    onSuccess: async (response: ApiResponse<any>, variables: ResetPasswordParamsType) => {
      await options.onSuccess?.(response as ApiResponse<ResetPasswordResponseType>, variables)
    },
    onError: async (error: Error, variables: ResetPasswordParamsType) => {
      if (!variables) return
      await options.onError?.(error, variables)
    }
  })

  const mutateAsync = (payload: ResetPasswordParamsType) => {
    return mutation.mutateAsync(payload) as Promise<ApiResponse<ResetPasswordResponseType>>
  }

  return {
    resetPass: mutateAsync,
    mutate: mutation.mutate,
    mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
