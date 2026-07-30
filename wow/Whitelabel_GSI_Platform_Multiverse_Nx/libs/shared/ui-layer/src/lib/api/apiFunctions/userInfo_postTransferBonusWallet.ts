import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export interface PostTransferBonusWalletParamsType {
  amount: number
  currency_id?: number
}

export type PostTransferBonusWalletRequestType = PostTransferBonusWalletParamsType

export const postTransferBonusWallet = (params: PostTransferBonusWalletParamsType) => {
  return requestFn<PostTransferBonusWalletRequestType, EmptyType>(
    ENDPOINT_PATHS.USER_INFO.TRANSFER_BONUS_WALLET,
    params,
    {
      name: "postTransferBonusWallet",
      method: "post"
    }
  )
}
