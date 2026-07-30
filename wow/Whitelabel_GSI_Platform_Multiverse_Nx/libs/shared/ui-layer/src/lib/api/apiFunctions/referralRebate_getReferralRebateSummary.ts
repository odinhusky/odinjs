import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { TimeStringType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetReferralRebateSummaryParamsType {
  currency_id: number
  start_time?: TimeStringType
  end_time?: TimeStringType
}

export type GetReferralRebateSummaryRequestType = GetReferralRebateSummaryParamsType

export interface ReferralRebateSummaryResponseType {
  calculate_type: number
  profit: string
  valid_bet_amount: string
  revenue_amount: string
}

// 當期總計
export const getReferralRebateSummary = (params: GetReferralRebateSummaryParamsType) => {
  return requestFn<GetReferralRebateSummaryRequestType, ReferralRebateSummaryResponseType>(
    ENDPOINT_PATHS.REFERRAL_REBATE.SUMMARY,
    params,
    {
      name: "getReferralRebateSummary",
      method: "get"
    }
  )
}
