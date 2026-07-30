import { requestFn } from "@shared-lib/api/axiosInterceptors"
import type { PostBonusTransferRequest } from "@shared-lib/api/commonTypes/bonusWalletTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export const postBonusTransfer = (params: PostBonusTransferRequest) => {
  return requestFn<PostBonusTransferRequest, null>(ENDPOINT_PATHS.USER_INFO.BONUS_TRANSFER, params, {
    name: "postBonusTransfer",
    method: "post"
  })
}
