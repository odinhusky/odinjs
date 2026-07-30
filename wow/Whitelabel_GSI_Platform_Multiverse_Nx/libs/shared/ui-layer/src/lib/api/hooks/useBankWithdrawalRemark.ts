import type { ApiResponse } from "@shared-lib/api/types"
import { withdrawalRemark } from "@shared-lib/api/apiFunctions/bank_withdrawalRemark"
import type { UploadRemark } from "@shared-lib/api/commonTypes/bankTypes"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseBankWithdrawalRemarkOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useBankWithdrawalRemark(options: UseBankWithdrawalRemarkOptions = {}) {
  const mutation = useApiMutation(withdrawalRemark, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const fetchWithdrawalRemark = async (transCode: string) => {
    return (await mutation.mutateAsync(transCode)) as ApiResponse<UploadRemark>
  }

  return {
    fetchWithdrawalRemark,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
