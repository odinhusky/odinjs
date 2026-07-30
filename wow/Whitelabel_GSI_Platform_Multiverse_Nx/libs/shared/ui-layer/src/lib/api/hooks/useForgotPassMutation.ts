import {
  forgotPassword,
  type ForgotPasswordParamsType,
  type ForgotPasswordResponseType
} from "@shared-lib/api/apiFunctions/auth_forgotPassword"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import type { ApiResponse } from "@shared-lib/api/types"

export interface UseForgotPassOptionsType {
  onSuccess?: (
    response: ApiResponse<ForgotPasswordResponseType>,
    payload: ForgotPasswordParamsType
  ) => void | Promise<void>
  onError?: (error: Error, payload: ForgotPasswordParamsType) => void | Promise<void>
}

export function useForgotPassMutation(options: UseForgotPassOptionsType = {}) {
  const mutation = useApiMutation(forgotPassword, {
    onSuccess: async (response: ApiResponse<any>, variables: ForgotPasswordParamsType) => {
      await options.onSuccess?.(response as ApiResponse<ForgotPasswordResponseType>, variables)
    },
    onError: async (error: Error, variables: ForgotPasswordParamsType) => {
      if (!variables) return
      await options.onError?.(error, variables)
    }
  })

  const mutateAsync = (payload: ForgotPasswordParamsType) => {
    return mutation.mutateAsync(payload) as Promise<ApiResponse<ForgotPasswordResponseType>>
  }

  return {
    forgotPass: mutateAsync,
    mutate: mutation.mutate,
    mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
