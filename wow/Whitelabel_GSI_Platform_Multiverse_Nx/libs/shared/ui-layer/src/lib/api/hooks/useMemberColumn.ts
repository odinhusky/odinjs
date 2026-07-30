import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { getMemberColumn, type GetMemberColumnResponseType } from "@shared-lib/api/apiFunctions/userInfo_getMemberColumn"
import { TANSTACK_QUERY_KEY_MEMBER_COLUMN } from "@shared-lib/constants/tanstackQueryKeys"
import type { ApiResponse } from "@shared-lib/api/types"
import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"

function useMemberColumnQuery({
  options = {}
}: {
  options?: Omit<UseQueryOptions<any, Error, GetMemberColumnResponseType, any[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetMemberColumnResponseType, Error> {
  const query = useApiQuery<typeof getMemberColumn, GetMemberColumnResponseType>(
    [TANSTACK_QUERY_KEY_MEMBER_COLUMN],
    getMemberColumn,
    undefined,
    {
      select: (response: ApiResponse<GetMemberColumnResponseType>): GetMemberColumnResponseType => {
        return response.data ?? []
      },
      ...options
    }
  )

  return query
}

export interface UseMemberColumnParams {
  options?: Omit<UseQueryOptions<any, Error, GetMemberColumnResponseType, any[]>, "queryKey" | "queryFn">
}

export function useMemberColumn({ options }: UseMemberColumnParams = {}) {
  const { data: memberColumnList, isLoading, isError, refetch } = useMemberColumnQuery({ options })

  return {
    memberColumnList,
    isLoading,
    isError,
    refetch
  }
}
