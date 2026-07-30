import { useNuxtApp } from "#imports"
import type { ApiResponse } from "@shared-lib/api/types"
import { postPayoutSettings, type PostPayoutSettingsParamsType } from "@shared-lib/api/apiFunctions/bank_postPayoutSettings"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import { TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_LIST } from "@shared-lib/constants/tanstackQueryKeys/payoutSettingsKeys"

export interface UsePayoutSettingsCreateOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function usePayoutSettingsCreate(options: UsePayoutSettingsCreateOptions = {}) {
  const { $queryClient } = useNuxtApp()

  const mutation = useApiMutation(postPayoutSettings, {
    onSuccess: async () => {
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_LIST] })
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const createPayoutSettings = async (params: PostPayoutSettingsParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<unknown>
  }

  return {
    createPayoutSettings,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
