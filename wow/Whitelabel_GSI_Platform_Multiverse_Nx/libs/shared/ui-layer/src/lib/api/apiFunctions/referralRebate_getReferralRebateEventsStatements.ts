import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ReferralRebateStatementsList } from "@shared-lib/api/commonTypes/referralRebateTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetReferralRebateEventsStatementsParamsType {
  account?: string
  game_type?: number
  currency_id: number
  offset: number
  size: number
}

export type GetReferralRebateEventsStatementsRequestType = GetReferralRebateEventsStatementsParamsType

export type GetReferralRebateEventsStatementsResponseType = ReferralRebateStatementsList

// 反佣結算明細
export const getReferralRebateEventsStatements = (
  eventId: number,
  params: GetReferralRebateEventsStatementsParamsType
) => {
  return requestFn<GetReferralRebateEventsStatementsRequestType, GetReferralRebateEventsStatementsResponseType>(
    ENDPOINT_PATHS.REFERRAL_REBATE.EVENTS_STATEMENTS({ event_id: eventId }),
    params,
    {
      name: "getReferralRebateEventsStatements",
      method: "get"
    }
  )
}
