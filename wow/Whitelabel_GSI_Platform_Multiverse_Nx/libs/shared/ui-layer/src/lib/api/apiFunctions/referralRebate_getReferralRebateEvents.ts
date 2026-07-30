import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { BaseCurrencyIDDurationWithOffsetAndSizeType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetReferralRebateEventsParamsType = BaseCurrencyIDDurationWithOffsetAndSizeType

export type GetReferralRebateEventsRequestType = BaseCurrencyIDDurationWithOffsetAndSizeType

export interface ReferralRebateEventsItem {
  id: number
  settlement_time: string
  currency_id: number
  valid_bet_amount: string
  game_type: number
  profit: string
  revenue_amount: string
  distribution_time: string
}

export interface ReferralRebateEventsList {
  list: ReferralRebateEventsItem[]
  pagination: {
    page: number
    offset: number
    size: number
    total: number
  }
}

export type GetReferralRebateEventsResponseType = ReferralRebateEventsList

// 反佣明細
export const getReferralRebateEvents = (params: GetReferralRebateEventsParamsType) => {
  return requestFn<GetReferralRebateEventsRequestType, GetReferralRebateEventsResponseType>(
    ENDPOINT_PATHS.REFERRAL_REBATE.EVENTS,
    params,
    {
      name: "getReferralRebateEvents",
      method: "get"
    }
  )
}
