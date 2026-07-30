import type { ApiResponse } from "../types"
import { claimGift, type ClaimGiftParamsType, type ClaimGiftResponseType } from "../apiFunctions/gift_claimGift"
import { useApiMutation } from "../useApiMutation"

export interface UseClaimGiftOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useClaimGift(options: UseClaimGiftOptions = {}) {
  const mutation = useApiMutation(claimGift, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const claim = async (params: ClaimGiftParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<ClaimGiftResponseType>
  }

  return {
    claim,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
