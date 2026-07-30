import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { ISetting } from "@shared-lib/api/commonTypes/settingType"

export type GetSettingResponseType = ISetting

export const getSetting = () => {
  return requestFn<EmptyType, GetSettingResponseType>(ENDPOINT_PATHS.SETTING.GET_SETTING, null, {
    name: "getSetting",
    method: "get"
  })
}
