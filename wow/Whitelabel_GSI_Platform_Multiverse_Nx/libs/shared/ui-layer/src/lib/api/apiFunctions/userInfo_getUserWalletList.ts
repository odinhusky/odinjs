import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"

export interface UserWalletItem {
  currency_id: number
  currency_code: string
  remaining_turnover: string
  balance: string
  in_use: boolean
  label?: string
  wallet_type: WALLET_TYPE_ENUMS
  withdrawable_balance: string
}

export type UserWalletList = UserWalletItem[]
export type GetUserWalletListResponseType = UserWalletList

export const getUserWalletList = () => {
  return requestFn<EmptyType, GetUserWalletListResponseType>(ENDPOINT_PATHS.USER_INFO.USER_WALLET_LIST, null, {
    name: "getUserWalletList",
    method: "get"
  })
}
