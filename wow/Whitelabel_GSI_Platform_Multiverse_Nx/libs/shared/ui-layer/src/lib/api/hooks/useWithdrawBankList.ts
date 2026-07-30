import type { ApiResponse } from "@shared-lib/api/types"
import { getBankList, type GetBankListParamsType, type GetBankListResponseType } from "@shared-lib/api/apiFunctions/bank_getBankList"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseWithdrawBankListOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useWithdrawBankList(options: UseWithdrawBankListOptions = {}) {
  const mutation = useApiMutation(getBankList, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const fetchWithdrawBankList = async (params?: GetBankListParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<GetBankListResponseType>
  }

  return {
    fetchWithdrawBankList,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
