import type { ApiResponse } from "@shared-lib/api/types"
import {
  getBankCardList,
  type GetBankCardListParamsType,
  type GetBankCardListResponseType
} from "@shared-lib/api/apiFunctions/bank_getBankCardList"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseBankCardListOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useBankCardList(options: UseBankCardListOptions = {}) {
  const mutation = useApiMutation(getBankCardList, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const fetchBankCardList = async (params?: GetBankCardListParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<GetBankCardListResponseType>
  }

  return {
    fetchBankCardList,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
