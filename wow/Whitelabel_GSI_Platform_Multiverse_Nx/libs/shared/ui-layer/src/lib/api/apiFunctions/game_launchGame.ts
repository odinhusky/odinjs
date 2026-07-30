import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import{ LaunchGameRequest, LaunchGameResponse } from "@shared-lib/api/commonTypes/gameTypes"

export type LaunchGameParamsType = LaunchGameRequest
export type LaunchGameRequestType = LaunchGameRequest
export type LaunchGameResponseType = LaunchGameResponse

export const launchGame = (params: LaunchGameParamsType) => {
  return requestFn<LaunchGameRequestType, LaunchGameResponseType>(ENDPOINT_PATHS.GAME.LAUNCH, params, {
    name: "launchGame",
    method: "post"
  })
}
