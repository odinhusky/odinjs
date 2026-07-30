import type { ApiResponse } from "@shared-lib/api/types"
import { deleteBankCard, type DeleteBankCardParamsType } from "@shared-lib/api/apiFunctions/bank_deleteBankCard"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseBankCardDeleteOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useBankCardDelete(options: UseBankCardDeleteOptions = {}) {
  const mutation = useApiMutation(deleteBankCard, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const removeBankCard = async (params: DeleteBankCardParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<unknown>
  }

  return {
    removeBankCard,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
