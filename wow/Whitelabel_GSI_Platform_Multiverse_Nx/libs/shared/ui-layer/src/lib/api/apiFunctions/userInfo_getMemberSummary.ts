import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { BaseCurrencyIDDurationType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetMemberSummaryParamsType = BaseCurrencyIDDurationType
export type GetMemberSummaryRequestType = BaseCurrencyIDDurationType

export interface GetMemberSummaryResponseType {
  bet_count: number
  bet_amount: string
  bonus: string
  deposit: string
  login_at: string
  member_id: number
  prize: string
  profit: string
  valid_bet: string
  withdraw: string
  metrics: {
    date: string
    deposit: string
    withdraw: string
  }[]
}

export const getMemberSummary = (params: GetMemberSummaryParamsType) => {
  return requestFn<GetMemberSummaryRequestType, GetMemberSummaryResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_SUMMARY,
    params,
    {
      name: "getMemberSummary",
      method: "get"
    }
  )
}
