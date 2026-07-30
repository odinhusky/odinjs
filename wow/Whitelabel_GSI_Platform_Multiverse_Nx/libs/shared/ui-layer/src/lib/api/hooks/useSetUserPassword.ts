import {
  setUserPassword,
  type SetUserPasswordParamsType,
  type SetUserPasswordRequestType
} from "@shared-lib/api/apiFunctions/userInfo_setUserPassword"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import type { ApiResponse } from "@shared-lib/api/types"

export interface UseSetUserPasswordOptionsType {
  onSuccess?: (response: ApiResponse<unknown>, payload: SetUserPasswordParamsType) => void | Promise<void>
  onError?: (error: Error, payload: SetUserPasswordParamsType) => void | Promise<void>
}

export function useSetUserPassword(options: UseSetUserPasswordOptionsType = {}) {
  const mutation = useApiMutation(setUserPassword, {
    onSuccess: async (response: ApiResponse<any>, variables: SetUserPasswordRequestType) => {
      await options.onSuccess?.(response as ApiResponse<unknown>, variables)
    },
    onError: async (error: Error, variables: SetUserPasswordRequestType) => {
      if (!variables) return
      await options.onError?.(error, variables)
    }
  })

  const mutateAsync = (payload: SetUserPasswordParamsType) => {
    return mutation.mutateAsync(payload) as Promise<ApiResponse<unknown>>
  }

  return {
    setUserPassword: mutateAsync,
    mutate: mutation.mutate,
    mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
