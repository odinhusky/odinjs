import type { ApiResponse } from "@shared-lib/api/types"
import { getMailDetail, type MailDetailResponseType } from "@shared-lib/api/apiFunctions/mail_getMailDetail"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseMailDetailOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useMailDetail(options: UseMailDetailOptions = {}) {
  const mutation = useApiMutation(getMailDetail, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const fetchMailDetail = async (id: number) => {
    return (await mutation.mutateAsync(id)) as ApiResponse<MailDetailResponseType>
  }

  return {
    fetchMailDetail,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
