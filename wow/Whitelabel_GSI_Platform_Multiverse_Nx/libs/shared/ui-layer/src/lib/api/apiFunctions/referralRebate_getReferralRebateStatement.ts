import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { TimeStringType } from "@shared-lib/api/commonTypes"
import { ReferralRebateStatementsList } from "@shared-lib/api/commonTypes/referralRebateTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetReferralRebateStatementsParamsType {
  currency_id: number
  account?: string
  game_type?: number
  offset: number
  size: number
  start_time?: TimeStringType
  end_time?: TimeStringType
}

export type GetReferralRebateStatementsRequestType = GetReferralRebateStatementsParamsType

export type GetReferralRebateStatementsResponseType = ReferralRebateStatementsList

export const getReferralRebateStatement = (params: GetReferralRebateStatementsParamsType) => {
  return requestFn<GetReferralRebateStatementsRequestType, GetReferralRebateStatementsResponseType>(
    ENDPOINT_PATHS.REFERRAL_REBATE.STATEMENT,
    params,
    {
      name: "getReferralRebateStatement",
      method: "get"
    }
  )
}
