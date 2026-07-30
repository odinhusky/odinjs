import type { ApiResponse } from "@shared-lib/api/types"
import { depositRemark } from "@shared-lib/api/apiFunctions/bank_depositRemark"
import type { UploadRemark } from "@shared-lib/api/commonTypes/bankTypes"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseBankDepositRemarkOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useBankDepositRemark(options: UseBankDepositRemarkOptions = {}) {
  const mutation = useApiMutation(depositRemark, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const fetchDepositRemark = async (transCode: string) => {
    return (await mutation.mutateAsync(transCode)) as ApiResponse<UploadRemark>
  }

  return {
    fetchDepositRemark,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
