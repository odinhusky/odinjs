import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import { withdrawPaymentList } from "@shared-lib/api/apiFunctions/bank_withdrawPaymentList"
import type { WithdrawalPaymentListResponseType } from "@shared-lib/api/apiFunctions/bank_withdrawPaymentList"
import { TANSTACK_QUERY_KEY_WITHDRAW_PAYMENT_LIST } from "@shared-lib/constants/tanstackQueryKeys/withdrawKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function useWithdrawPaymentListQuery(
  options: Omit<
    UseQueryOptions<unknown, Error, ApiResponse<WithdrawalPaymentListResponseType>, unknown[]>,
    "queryKey" | "queryFn"
  > = {}
): UseQueryReturnType<ApiResponse<WithdrawalPaymentListResponseType>, Error> {
  return useApiQuery<typeof withdrawPaymentList, ApiResponse<WithdrawalPaymentListResponseType>>(
    [TANSTACK_QUERY_KEY_WITHDRAW_PAYMENT_LIST],
    withdrawPaymentList,
    undefined,
    { enabled: false, ...options }
  )
}

export function useWithdrawPaymentList() {
  const query = useWithdrawPaymentListQuery()

  const fetchWithdrawPaymentList = async () => {
    const { data } = await query.refetch()
    return data
  }

  return {
    fetchWithdrawPaymentList,
    data: query.data,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error
  }
}
