import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface DeletePayoutSettingsParamsType {
  id: number
}

export type DeletePayoutSettingsRequestType = EmptyType

export const deletePayoutSettings = (params: DeletePayoutSettingsParamsType) => {
  return requestFn<DeletePayoutSettingsRequestType, EmptyType>(
    ENDPOINT_PATHS.BANK.PAYOUT_SETTING_DETAIL({ id: params.id }),
    null,
    {
      name: "deletePayoutSettings",
      method: "delete"
    }
  )
}
