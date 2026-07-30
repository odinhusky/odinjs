import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface ClaimGiftParamsType {
  gift_id: number
  amount: number
  currency: number
}

export type ClaimGiftRequestType = ClaimGiftParamsType
export type ClaimGiftResponseType = EmptyType
export type ClaimGiftDataParamsType = ClaimGiftParamsType
export type ClaimGiftDataRequestType = ClaimGiftRequestType

export const claimGift = (params: ClaimGiftParamsType) => {
  return requestFn<ClaimGiftRequestType, ClaimGiftResponseType>(ENDPOINT_PATHS.GIFT.CLAIM, params, {
    name: "claimGift",
    method: "post",
    needToken: true
  })
}
