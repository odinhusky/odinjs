import { useNuxtApp } from "#imports"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  putAgentPaymentGroup,
  type PutAgentPaymentGroupParamsType,
  type PutAgentPaymentGroupResponseType
} from "@shared-lib/api/apiFunctions/paymentGroup_putAgentPaymentGroup"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import {
  TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_DETAIL,
  TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_LIST
} from "@shared-lib/constants/tanstackQueryKeys/paymentGroupKeys"

export interface UseAgentPaymentGroupUpdateOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useAgentPaymentGroupUpdate(options: UseAgentPaymentGroupUpdateOptions = {}) {
  const { $queryClient } = useNuxtApp()

  const mutation = useApiMutation(putAgentPaymentGroup, {
    onSuccess: async (_response, variables) => {
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_LIST] })
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_DETAIL, variables.id] })
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const updateAgentPaymentGroup = async (params: PutAgentPaymentGroupParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<PutAgentPaymentGroupResponseType>
  }

  return {
    updateAgentPaymentGroup,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
