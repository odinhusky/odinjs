import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface AllTransferOutItem {
  product_code?: number
  code?: number
  message?: string
}

export type AllTransferOutResponse = AllTransferOutItem[]

export const postAllTransferOut = () => {
  return requestFn<EmptyType, AllTransferOutResponse>(ENDPOINT_PATHS.GAME.ALL_TRANSFER_OUT, null, {
    name: "postAllTransferOut",
    method: "post"
  })
}
