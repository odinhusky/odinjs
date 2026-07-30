import type { ApiResponse } from "@shared-lib/api/types"
import { withdraw, type WithdrawRequestType } from "@shared-lib/api/apiFunctions/bank_withdraw"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseBankWithdrawOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useBankWithdraw(options: UseBankWithdrawOptions = {}) {
  const mutation = useApiMutation(withdraw, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const submitWithdraw = async (params: WithdrawRequestType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<unknown>
  }

  return {
    submitWithdraw,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
