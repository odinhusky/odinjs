import {
  getMemberAgentWagerDetail,
  type GetMemberAgentWagerDetailParamsType,
  type GetMemberAgentWagerDetailResponseType
} from "../apiFunctions/userInfo_getMemberAgentWagerDetail"
import type { ApiResponse } from "../types"
import { useApiMutation } from "../useApiMutation"

export function useMemberAgentWagerDetail() {
  const mutation = useApiMutation<typeof getMemberAgentWagerDetail>(getMemberAgentWagerDetail)

  const fetchWagerDetail = async (
    params: GetMemberAgentWagerDetailParamsType
  ): Promise<GetMemberAgentWagerDetailResponseType | null> => {
    const response = (await mutation.mutateAsync(
      params
    )) as ApiResponse<GetMemberAgentWagerDetailResponseType>
    return response?.data ?? null
  }

  return {
    fetchWagerDetail,
    isPending: mutation.isPending
  }
}
