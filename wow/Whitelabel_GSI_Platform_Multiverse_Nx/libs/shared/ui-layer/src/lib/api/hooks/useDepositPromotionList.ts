import { useQuery } from "@tanstack/vue-query"
import { ref } from "vue"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getDepositPromotionList,
  type GetDepositPromotionListResponseType
} from "@shared-lib/api/apiFunctions/bank_getDepositPromotionList"
import type { DepositRequestType } from "@shared-lib/api/commonTypes/bankTypes"
import { TANSTACK_QUERY_KEY_DEPOSIT_PROMOTION_LIST } from "@shared-lib/constants/tanstackQueryKeys/depositKeys"

/**
 * useApiQuery 不支援動態 payload，改以 useQuery + 內部 reactive ref 的方式
 * 實現「可帶不同 params 的 lazy GET query」，語意上仍是 query（有快取），而非 mutation。
 */
export function useDepositPromotionList() {
  const paramsRef = ref<DepositRequestType | null>(null)

  const query = useQuery<ApiResponse<GetDepositPromotionListResponseType>>({
    queryKey: [TANSTACK_QUERY_KEY_DEPOSIT_PROMOTION_LIST, paramsRef],
    queryFn: () => getDepositPromotionList(paramsRef.value!),
    enabled: false
  })

  const fetchDepositPromotionList = async (params: DepositRequestType) => {
    paramsRef.value = params
    await nextTick()
    const { data } = await query.refetch()
    return data
  }

  return {
    fetchDepositPromotionList,
    data: query.data,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error
  }
}
