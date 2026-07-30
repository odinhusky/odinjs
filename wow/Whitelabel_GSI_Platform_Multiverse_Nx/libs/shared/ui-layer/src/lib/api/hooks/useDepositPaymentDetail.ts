import { useQuery } from "@tanstack/vue-query"
import { ref } from "vue"
import type { ApiResponse } from "@shared-lib/api/types"
import { depositPaymentDetail, type DepositPaymentDetailResponseType } from "@shared-lib/api/apiFunctions/bank_depositPaymentDetail"
import { TANSTACK_QUERY_KEY_DEPOSIT_PAYMENT_DETAIL } from "@shared-lib/constants/tanstackQueryKeys/depositKeys"

/**
 * useApiQuery 不支援動態 payload，改以 useQuery + 內部 reactive ref 的方式
 * 實現「可指定不同 id 的 lazy GET query」，語意上仍是 query（有快取），而非 mutation。
 */
export function useDepositPaymentDetail() {
  const idRef = ref(0)

  const query = useQuery<ApiResponse<DepositPaymentDetailResponseType>>({
    queryKey: [TANSTACK_QUERY_KEY_DEPOSIT_PAYMENT_DETAIL, idRef],
    queryFn: () => depositPaymentDetail(idRef.value),
    enabled: false
  })

  const fetchDepositPaymentDetail = async (id: number) => {
    idRef.value = id
    await nextTick()
    const { data } = await query.refetch()
    return data
  }

  return {
    fetchDepositPaymentDetail,
    data: query.data,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error
  }
}
