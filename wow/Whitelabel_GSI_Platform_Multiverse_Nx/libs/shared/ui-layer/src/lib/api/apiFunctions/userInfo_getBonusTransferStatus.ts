import { requestFn } from "@shared-lib/api/axiosInterceptors"
import type {
  BonusTransferStatus,
  GetBonusTransferStatusRequest
} from "@shared-lib/api/commonTypes/bonusWalletTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export const getBonusTransferStatus = (params: GetBonusTransferStatusRequest) => {
  return requestFn<GetBonusTransferStatusRequest, BonusTransferStatus>(
    ENDPOINT_PATHS.USER_INFO.BONUS_TRANSFER_STATUS,
    params,
    {
      name: "getBonusTransferStatus",
      method: "get"
    }
  )
}
