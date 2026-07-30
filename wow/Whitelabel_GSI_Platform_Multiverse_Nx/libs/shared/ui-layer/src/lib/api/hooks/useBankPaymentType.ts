import type { ApiResponse } from "@shared-lib/api/types"
import {
  getPaymentTypeList,
  type GetPaymentTypeListRequestType,
  type GetPaymentTypeListResponseType
} from "@shared-lib/api/apiFunctions/bank_getPaymentTypeList"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseBankPaymentTypeOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useBankPaymentType(options: UseBankPaymentTypeOptions = {}) {
  const mutation = useApiMutation(getPaymentTypeList, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const fetchBankPaymentType = async (params?: GetPaymentTypeListRequestType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<GetPaymentTypeListResponseType>
  }

  return {
    fetchBankPaymentType,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
