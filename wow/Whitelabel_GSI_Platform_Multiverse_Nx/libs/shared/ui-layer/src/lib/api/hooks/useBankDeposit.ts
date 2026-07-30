import type { ApiResponse } from "@shared-lib/api/types"
import { deposit, type DepositParamsType } from "@shared-lib/api/apiFunctions/bank_deposit"
import type { DepositResponseType } from "@shared-lib/api/commonTypes/bankTypes"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseBankDepositOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useBankDeposit(options: UseBankDepositOptions = {}) {
  const mutation = useApiMutation(deposit, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const submitDeposit = async (params: DepositParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<DepositResponseType>
  }

  return {
    submitDeposit,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
