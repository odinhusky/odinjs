import { useNuxtApp } from "#imports"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  deleteAgentPaymentGroup,
  type DeleteAgentPaymentGroupParamsType,
  type DeleteAgentPaymentGroupResponseType
} from "@shared-lib/api/apiFunctions/paymentGroup_deleteAgentPaymentGroup"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import {
  TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_DETAIL,
  TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_LIST
} from "@shared-lib/constants/tanstackQueryKeys/paymentGroupKeys"

export interface UseAgentPaymentGroupDeleteOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useAgentPaymentGroupDelete(options: UseAgentPaymentGroupDeleteOptions = {}) {
  const { $queryClient } = useNuxtApp()

  const mutation = useApiMutation(deleteAgentPaymentGroup, {
    onSuccess: async (_response, variables) => {
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_LIST] })
      await $queryClient.removeQueries({ queryKey: [TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_DETAIL, variables.id] })
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const deletePaymentGroup = async (params: DeleteAgentPaymentGroupParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<DeleteAgentPaymentGroupResponseType>
  }

  return {
    deletePaymentGroup,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
