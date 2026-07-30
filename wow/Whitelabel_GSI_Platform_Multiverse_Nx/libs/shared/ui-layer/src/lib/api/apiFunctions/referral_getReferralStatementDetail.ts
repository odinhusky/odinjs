import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { PaginatedList } from "@shared-lib/api/commonTypes"
import { GetReferralSettingBase, Revenue } from "@shared-lib/api/commonTypes/referralTypes"

export type GetReferralStatementDetailListParamTypes = GetReferralSettingBase
export type GetReferralStatementDetailListRequestTypes = GetReferralSettingBase

export interface ReferralStatementDetailListResponseType
  extends PaginatedList<{
    member_account: string
    cashback_count: number
    revenues: Revenue
  }> {
  page_summary: {
    cashback_count: number
    revenue_total: Revenue
  }
}

export const getReferralStatementDetail = (statement_id: number, params?: GetReferralStatementDetailListParamTypes) => {
  return requestFn<GetReferralStatementDetailListRequestTypes, ReferralStatementDetailListResponseType>(
    ENDPOINT_PATHS.REFERRAL.STATEMENT_DETAIL({ statement_id }),
    params ?? {},
    {
      name: "getReferralStatementDetail",
      method: "get"
    }
  )
}
