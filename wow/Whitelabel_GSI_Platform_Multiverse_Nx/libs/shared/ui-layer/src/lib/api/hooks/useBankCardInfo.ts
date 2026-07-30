import type { ApiResponse } from "@shared-lib/api/types"
import {
  getBankCardInfo,
  type GetBankCardInfoResponseType,
  type GetUserBankInfoParamsType
} from "@shared-lib/api/apiFunctions/bank_getBankCardInfo"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseBankCardInfoOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useBankCardInfo(options: UseBankCardInfoOptions = {}) {
  const mutation = useApiMutation(getBankCardInfo, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const fetchBankCardInfo = async (params: GetUserBankInfoParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<GetBankCardInfoResponseType>
  }

  return {
    fetchBankCardInfo,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
