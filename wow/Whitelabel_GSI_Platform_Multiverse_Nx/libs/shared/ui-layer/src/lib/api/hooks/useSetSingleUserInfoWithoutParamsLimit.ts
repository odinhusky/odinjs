import {
  setSingleUserInfoWithoutParamsLimit,
  type SetSingleUserInfoWithoutParamsLimitParamsType,
  type SetSingleUserInfoWithoutParamsLimitRequestType
} from "@shared-lib/api/apiFunctions/userInfo_setSingleUserInfoWithoutParamsLimit"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import type { ApiResponse } from "@shared-lib/api/types"

export interface UseSetSingleUserInfoWithoutParamsLimitOptionsType {
  onSuccess?: (
    response: ApiResponse<unknown>,
    payload: SetSingleUserInfoWithoutParamsLimitParamsType
  ) => void | Promise<void>
  onError?: (error: Error, payload: SetSingleUserInfoWithoutParamsLimitParamsType) => void | Promise<void>
}

export function useSetSingleUserInfoWithoutParamsLimit(
  options: UseSetSingleUserInfoWithoutParamsLimitOptionsType = {}
) {
  const mutation = useApiMutation(setSingleUserInfoWithoutParamsLimit, {
    onSuccess: async (response: ApiResponse<any>, variables: SetSingleUserInfoWithoutParamsLimitRequestType) => {
      await options.onSuccess?.(response as ApiResponse<unknown>, variables)
    },
    onError: async (error: Error, variables: SetSingleUserInfoWithoutParamsLimitRequestType) => {
      if (!variables) return
      await options.onError?.(error, variables)
    }
  })

  const mutateAsync = (payload: SetSingleUserInfoWithoutParamsLimitParamsType) => {
    return mutation.mutateAsync(payload) as Promise<ApiResponse<unknown>>
  }

  return {
    setSingleUserInfoWithoutParamsLimit: mutateAsync,
    mutate: mutation.mutate,
    mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
