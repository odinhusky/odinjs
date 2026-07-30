import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface WithdrawCrypto {
  currency: string
}

export interface WithdrawCryptoCurrency {
  id: number
  code: string
}

export type GetWithdrawCryptoCurrencyParamsType = WithdrawCrypto
export type GetWithdrawCryptoCurrencyRequestType = WithdrawCrypto
export type GetWithdrawCryptoCurrencyResponseType = WithdrawCryptoCurrency[]

export const getWithdrawCryptoCurrency = (params: GetWithdrawCryptoCurrencyParamsType) => {
  return requestFn<GetWithdrawCryptoCurrencyRequestType, GetWithdrawCryptoCurrencyResponseType>(
    ENDPOINT_PATHS.BANK.WITHDRAW_CRYPTO_CURRENCY,
    params,
    {
      name: "getWithdrawCryptoCurrency",
      method: "get"
    }
  )
}
