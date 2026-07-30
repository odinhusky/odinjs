import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { CLAIM_GIFT_TYPE_ENUMS } from "@shared-lib/constants/enums/claimGiftType"
import { PENDING_STATUS_ENUMS } from "@shared-lib/constants/enums/pendingStatus"
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"

export interface GiftOptions {
  amount: string
  currency_id: number
  currency_code: string
}

export interface Gift {
  id: number
  type: CLAIM_GIFT_TYPE_ENUMS
  wallet_type: WALLET_TYPE_ENUMS
  status: PENDING_STATUS_ENUMS
  options: GiftOptions[]
}

export type GiftList = Gift[]

export type GetGiftListResponseType = GiftList


export const giftsList = () => {
  return requestFn<EmptyType, GetGiftListResponseType>(ENDPOINT_PATHS.GIFT.LIST, null, {
    name: "getGiftsList",
    method: "get",
    needToken: true
  })
}
