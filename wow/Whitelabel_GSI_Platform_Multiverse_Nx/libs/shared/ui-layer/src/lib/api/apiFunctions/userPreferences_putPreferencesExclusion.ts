import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface PutPreferencesExclusionParamsType {
  exclusion_at: number
}

export type PutPreferencesExclusionRequestType = PutPreferencesExclusionParamsType

export const putPreferencesExclusion = (params: PutPreferencesExclusionParamsType) => {
  return requestFn<PutPreferencesExclusionRequestType, EmptyType>(ENDPOINT_PATHS.USER_PREFERENCES.EXCLUSION, params, {
    name: "putPreferencesExclusion",
    method: "put"
  })
}
