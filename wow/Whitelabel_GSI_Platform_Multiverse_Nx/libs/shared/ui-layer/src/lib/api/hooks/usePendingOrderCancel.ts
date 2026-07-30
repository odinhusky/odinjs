import { useNuxtApp } from "#imports"
import { moneyPendingCancel, type MoneyPendingCancelParamTypes as PendingOrderCancelParams } from "@shared-lib/api/apiFunctions/report_moneyPendingCancel"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import type { ApiResponse } from "@shared-lib/api/types"
import { TANSTACK_QUERY_KEY_PENDING_ORDER_LIST } from "@shared-lib/constants/tanstackQueryKeys"

export interface UsePendingOrderCancelOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function usePendingOrderCancel(options: UsePendingOrderCancelOptions = {}) {
  const { $queryClient } = useNuxtApp()

  const mutation = useApiMutation(moneyPendingCancel, {
    onSuccess: async () => {
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_PENDING_ORDER_LIST] })
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const mutateAsync = async (payload: PendingOrderCancelParams) => {
    return (await mutation.mutateAsync(payload)) as ApiResponse<unknown>
  }

  return {
    cancelPendingOrder: mutateAsync,
    mutate: mutation.mutate,
    mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
