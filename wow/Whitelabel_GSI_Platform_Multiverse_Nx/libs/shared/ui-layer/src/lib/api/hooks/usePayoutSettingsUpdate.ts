import { useNuxtApp } from "#imports"
import type { ApiResponse } from "@shared-lib/api/types"
import { putPayoutSettings, type PutPayoutSettingsParamsType } from "@shared-lib/api/apiFunctions/bank_putPayoutSettings"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import {
  TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_DETAIL,
  TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_LIST
} from "@shared-lib/constants/tanstackQueryKeys/payoutSettingsKeys"

export interface UsePayoutSettingsUpdateOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function usePayoutSettingsUpdate(options: UsePayoutSettingsUpdateOptions = {}) {
  const { $queryClient } = useNuxtApp()

  const mutation = useApiMutation(putPayoutSettings, {
    onSuccess: async (_response, variables) => {
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_LIST] })
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_DETAIL, variables.id] })
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const updatePayoutSettings = async (params: PutPayoutSettingsParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<unknown>
  }

  return {
    updatePayoutSettings,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
