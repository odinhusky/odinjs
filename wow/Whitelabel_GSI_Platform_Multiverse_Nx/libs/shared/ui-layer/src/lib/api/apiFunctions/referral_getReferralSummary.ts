import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetReferralSummaryRequestType = { currency_id?: string }

export interface ReferralSummaryResponseType {
  member_count: number
  total_valid_betted_amount: string
  total_profit: string
}

export const getReferralSummary = (currency_id?: string) => {
  return requestFn<GetReferralSummaryRequestType, ReferralSummaryResponseType>(
    ENDPOINT_PATHS.REFERRAL.SUMMARY,
    { currency_id },
    {
      name: "getReferralSummary",
      method: "get"
    }
  )
}
