import type { ApiResponse } from "@shared-lib/api/types"
import {
  getAvailableCurrencyList,
  type GetAvailCurrencyListResponseType
} from "@shared-lib/api/apiFunctions/bank_getAvailableCurrencyList"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseAvailableCurrencyListOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useAvailableCurrencyList(options: UseAvailableCurrencyListOptions = {}) {
  const mutation = useApiMutation(getAvailableCurrencyList, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const fetchAvailableCurrencyList = async () => {
    return (await mutation.mutateAsync(undefined)) as ApiResponse<GetAvailCurrencyListResponseType>
  }

  return {
    fetchAvailableCurrencyList,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
