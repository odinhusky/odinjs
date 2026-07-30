import type { ApiResponse } from "@shared-lib/api/types"
import { addBankCard, type AddBankCardParamsType } from "@shared-lib/api/apiFunctions/bank_addBankCard"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseBankCardAddOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useBankCardAdd(options: UseBankCardAddOptions = {}) {
  const mutation = useApiMutation(addBankCard, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const createBankCard = async (params: AddBankCardParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<unknown>
  }

  return {
    createBankCard,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
