import { useNuxtApp } from "#imports"
import type { ApiResponse } from "@shared-lib/api/types"
import { deletePayoutSettings, type DeletePayoutSettingsParamsType } from "@shared-lib/api/apiFunctions/bank_deletePayoutSettings"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import {
  TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_DETAIL,
  TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_LIST
} from "@shared-lib/constants/tanstackQueryKeys/payoutSettingsKeys"

export interface UsePayoutSettingsDeleteOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function usePayoutSettingsDelete(options: UsePayoutSettingsDeleteOptions = {}) {
  const { $queryClient } = useNuxtApp()

  const mutation = useApiMutation(deletePayoutSettings, {
    onSuccess: async (_response, variables) => {
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_LIST] })
      await $queryClient.removeQueries({ queryKey: [TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_DETAIL, variables.id] })
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const removePayoutSettings = async (params: DeletePayoutSettingsParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<unknown>
  }

  return {
    removePayoutSettings,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
