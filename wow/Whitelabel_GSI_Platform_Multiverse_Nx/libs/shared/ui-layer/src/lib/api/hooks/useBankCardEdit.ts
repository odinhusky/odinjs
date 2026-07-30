import type { ApiResponse } from "@shared-lib/api/types"
import { editBankCard, type EditBankCardParamsType } from "@shared-lib/api/apiFunctions/bank_editBankCard"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseBankCardEditOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useBankCardEdit(options: UseBankCardEditOptions = {}) {
  const mutation = useApiMutation(editBankCard, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const updateBankCard = async (params: EditBankCardParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<unknown>
  }

  return {
    updateBankCard,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
