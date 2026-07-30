import {
  forgotPasswordSms,
  type ForgotPasswordSmsParamsType,
  type ForgotPasswordSmsResponseType
} from "@shared-lib/api/apiFunctions/auth_forgotPasswordSms"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import type { ApiResponse } from "@shared-lib/api/types"

export interface UseForgotPassSmsOptionsType {
  onSuccess?: (
    response: ApiResponse<ForgotPasswordSmsResponseType>,
    payload: ForgotPasswordSmsParamsType
  ) => void | Promise<void>
  onError?: (error: Error, payload: ForgotPasswordSmsParamsType) => void | Promise<void>
}

export function useForgotPassSms(options: UseForgotPassSmsOptionsType = {}) {
  const mutation = useApiMutation(forgotPasswordSms, {
    onSuccess: async (response: ApiResponse<any>, variables: ForgotPasswordSmsParamsType) => {
      await options.onSuccess?.(response as ApiResponse<ForgotPasswordSmsResponseType>, variables)
    },
    onError: async (error: Error, variables: ForgotPasswordSmsParamsType) => {
      if (!variables) return
      await options.onError?.(error, variables)
    }
  })

  const mutateAsync = (payload: ForgotPasswordSmsParamsType) => {
    return mutation.mutateAsync(payload) as Promise<ApiResponse<ForgotPasswordSmsResponseType>>
  }

  return {
    forgotPassSms: mutateAsync,
    mutate: mutation.mutate,
    mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
