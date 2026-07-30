import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export interface ReferralStatementDetailTotalResponseType {
  cashback_count: number
  revenue_total: {
    [key: string]: string
  }
}

export const getReferralStatementDetailTotal = (statement_id: number) => {
  return requestFn<EmptyType, ReferralStatementDetailTotalResponseType>(
    ENDPOINT_PATHS.REFERRAL.STATEMENT_DETAIL_TOTAL({ statement_id }),
    null,
    {
      name: "getReferralStatementDetailTotal",
      method: "get"
    }
  )
}
