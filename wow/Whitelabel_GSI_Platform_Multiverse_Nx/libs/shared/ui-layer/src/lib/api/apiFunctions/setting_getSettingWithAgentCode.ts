import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { ISetting } from "@shared-lib/api/commonTypes/settingType"

export type GetSettingWithAgentCodeResponseType = ISetting

export const getSettingWithAgentCode = (code: string) => {
  return requestFn<EmptyType, GetSettingWithAgentCodeResponseType>(
    `${ENDPOINT_PATHS.SETTING.GET_SETTING}/${code}`,
    null,
    {
      name: "getSettingWithAgentCode",
      method: "get"
    }
  )
}
