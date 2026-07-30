import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"

export interface SetUserActiveWalletRequest {
  currency_id: number
  wallet_type: WALLET_TYPE_ENUMS
}

export const setUserActiveWallet = (params: SetUserActiveWalletRequest) => {
  return requestFn<SetUserActiveWalletRequest, EmptyType>(ENDPOINT_PATHS.USER_INFO.USER_ACTIVE_WALLET, params, {
    name: "setUserActiveWallet",
    method: "put"
  })
}
