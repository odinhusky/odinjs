import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import { getMailList, type MailListParamsType, type MailListResponseType } from "@shared-lib/api/apiFunctions/mail_getMailList"
import { TANSTACK_QUERY_KEY_MAIL_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function useMailListQuery({
  params,
  options = {}
}: {
  params: MailListParamsType
  options?: Omit<UseQueryOptions<unknown, Error, MailListResponseType, unknown[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<MailListResponseType, Error> {
  const defaultResponse: MailListResponseType = {
    list: [],
    pagination: {
      offset: params.offset || 0,
      size: params.size,
      total: 0
    }
  }

  return useApiQuery<typeof getMailList, MailListResponseType>([TANSTACK_QUERY_KEY_MAIL_LIST], getMailList, params, {
    enabled: false,
    select: (response: ApiResponse<MailListResponseType>): MailListResponseType => {
      return response.data ?? defaultResponse
    },
    ...options
  })
}

export interface UseMailListParams {
  params: MailListParamsType
  options?: Omit<UseQueryOptions<unknown, Error, MailListResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function useMailList({ params, options }: UseMailListParams) {
  const { data: mailList, isLoading, isError, refetch, isFetching } = useMailListQuery({ params, options })

  return {
    mailList,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
