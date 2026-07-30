import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetPreferencesExclusionResponseType {
  exclusion_at: number | null
}

//#region 投注限制
export const getPreferencesExclusion = () => {
  return requestFn<EmptyType, GetPreferencesExclusionResponseType>(ENDPOINT_PATHS.USER_PREFERENCES.EXCLUSION, null, {
    name: "getPreferencesExclusion",
    method: "get"
  })
}
