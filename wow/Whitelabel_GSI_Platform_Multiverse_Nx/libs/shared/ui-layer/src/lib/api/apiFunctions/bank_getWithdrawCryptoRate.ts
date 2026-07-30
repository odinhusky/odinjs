import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"

export interface WithdrawCryptoRate {
  currency: string
  crypto_id?: number | string
}

export type GetWithdrawCryptoRateParamsType = WithdrawCryptoRate
export type GetWithdrawCryptoRateRequestType = WithdrawCryptoRate

export interface GetWithdrawCryptoRateResponseType {
  rate: number
}

export const getWithdrawCryptoRate = (params: GetWithdrawCryptoRateParamsType) => {
  return requestFn<GetWithdrawCryptoRateRequestType, GetWithdrawCryptoRateResponseType>(
    ENDPOINT_PATHS.BANK.WITHDRAW_CRYPTO_RATE,
    params,
    {
      name: "getWithdrawCryptoRate",
      method: "get"
    }
  )
}
