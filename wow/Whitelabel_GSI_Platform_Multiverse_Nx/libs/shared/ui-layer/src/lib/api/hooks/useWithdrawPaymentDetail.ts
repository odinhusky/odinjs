import { useQuery } from "@tanstack/vue-query"
import { ref } from "vue"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  withdrawPaymentDetail,
  type WithdrawalPaymentDetailResponseType
} from "@shared-lib/api/apiFunctions/bank_withdrawPaymentDetail"
import { TANSTACK_QUERY_KEY_WITHDRAW_PAYMENT_DETAIL } from "@shared-lib/constants/tanstackQueryKeys/withdrawKeys"

export function useWithdrawPaymentDetail() {
  const idRef = ref(0)

  const query = useQuery<ApiResponse<WithdrawalPaymentDetailResponseType>>({
    queryKey: [TANSTACK_QUERY_KEY_WITHDRAW_PAYMENT_DETAIL, idRef],
    queryFn: () => withdrawPaymentDetail(idRef.value),
    enabled: false
  })

  const fetchWithdrawPaymentDetail = async (id: number) => {
    idRef.value = id
    await nextTick()
    const { data } = await query.refetch()
    return data
  }

  return {
    fetchWithdrawPaymentDetail,
    data: query.data,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error
  }
}
