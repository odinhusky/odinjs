import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import { depositPaymentList } from "@shared-lib/api/apiFunctions/bank_depositPaymentList"
import type { DepositPaymentListResponseType } from "@shared-lib/api/apiFunctions/bank_depositPaymentList"
import { TANSTACK_QUERY_KEY_DEPOSIT_PAYMENT_LIST } from "@shared-lib/constants/tanstackQueryKeys/depositKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function useDepositPaymentListQuery(
  options: Omit<
    UseQueryOptions<unknown, Error, ApiResponse<DepositPaymentListResponseType>, unknown[]>,
    "queryKey" | "queryFn"
  > = {}
): UseQueryReturnType<ApiResponse<DepositPaymentListResponseType>, Error> {
  return useApiQuery<typeof depositPaymentList, ApiResponse<DepositPaymentListResponseType>>(
    [TANSTACK_QUERY_KEY_DEPOSIT_PAYMENT_LIST],
    depositPaymentList,
    undefined,
    { enabled: false, ...options }
  )
}

export function useDepositPaymentList() {
  const query = useDepositPaymentListQuery()

  const fetchDepositPaymentList = async () => {
    const { data } = await query.refetch()
    return data
  }

  return {
    fetchDepositPaymentList,
    data: query.data,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error
  }
}
