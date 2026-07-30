import {
  setUserWithdrawalPassword,
  type SetUserWithdrawalPasswordParamsType,
  type SetUserWithdrawalPasswordRequestType
} from "@shared-lib/api/apiFunctions/userInfo_setUserWithdrawalPassword"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import type { ApiResponse } from "@shared-lib/api/types"

export interface UseSetUserWithdrawalPasswordOptionsType {
  onSuccess?: (response: ApiResponse<unknown>, payload: SetUserWithdrawalPasswordParamsType) => void | Promise<void>
  onError?: (error: Error, payload: SetUserWithdrawalPasswordParamsType) => void | Promise<void>
}

export function useSetUserWithdrawalPassword(options: UseSetUserWithdrawalPasswordOptionsType = {}) {
  const mutation = useApiMutation(setUserWithdrawalPassword, {
    onSuccess: async (response: ApiResponse<any>, variables: SetUserWithdrawalPasswordRequestType) => {
      await options.onSuccess?.(response as ApiResponse<unknown>, variables)
    },
    onError: async (error: Error, variables: SetUserWithdrawalPasswordRequestType) => {
      if (!variables) return
      await options.onError?.(error, variables)
    }
  })

  const mutateAsync = (payload: SetUserWithdrawalPasswordParamsType) => {
    return mutation.mutateAsync(payload) as Promise<ApiResponse<unknown>>
  }

  return {
    setUserWithdrawalPassword: mutateAsync,
    mutate: mutation.mutate,
    mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
