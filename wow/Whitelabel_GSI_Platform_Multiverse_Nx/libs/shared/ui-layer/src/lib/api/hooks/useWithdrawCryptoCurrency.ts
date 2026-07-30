import type { ApiResponse } from "@shared-lib/api/types"
import {
  getWithdrawCryptoCurrency,
  type GetWithdrawCryptoCurrencyRequestType,
  type GetWithdrawCryptoCurrencyResponseType
} from "@shared-lib/api/apiFunctions/bank_getWithdrawCryptoCurrency"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseWithdrawCryptoCurrencyOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useWithdrawCryptoCurrency(options: UseWithdrawCryptoCurrencyOptions = {}) {
  const mutation = useApiMutation(getWithdrawCryptoCurrency, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const fetchWithdrawCryptoCurrency = async (params: GetWithdrawCryptoCurrencyRequestType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<GetWithdrawCryptoCurrencyResponseType>
  }

  return {
    fetchWithdrawCryptoCurrency,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
