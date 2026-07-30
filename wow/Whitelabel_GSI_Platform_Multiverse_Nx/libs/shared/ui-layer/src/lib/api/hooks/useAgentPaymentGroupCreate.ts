import { useNuxtApp } from "#imports"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  postAgentPaymentGroup,
  type PostAgentPaymentGroupParamsType,
  type PostAgentPaymentGroupResponseType
} from "@shared-lib/api/apiFunctions/paymentGroup_postAgentPaymentGroup"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import { TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_LIST } from "@shared-lib/constants/tanstackQueryKeys/paymentGroupKeys"

export interface UseAgentPaymentGroupCreateOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useAgentPaymentGroupCreate(options: UseAgentPaymentGroupCreateOptions = {}) {
  const { $queryClient } = useNuxtApp()

  const mutation = useApiMutation(postAgentPaymentGroup, {
    onSuccess: async () => {
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_LIST] })
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const createAgentPaymentGroup = async (params: PostAgentPaymentGroupParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<PostAgentPaymentGroupResponseType>
  }

  return {
    createAgentPaymentGroup,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
