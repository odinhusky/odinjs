import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import{ LaunchGameRequest, LaunchGameResponse } from "@shared-lib/api/commonTypes/gameTypes"

export type LaunchGuestGameParamsType = LaunchGameRequest
export type LaunchGuestGameRequestType = LaunchGameRequest
export type LaunchGuestGameResponseType = LaunchGameResponse

export const launchGuestGame = (params: LaunchGuestGameParamsType) => {
  return requestFn<LaunchGuestGameRequestType, LaunchGuestGameResponseType>(ENDPOINT_PATHS.GAME.LAUNCH_GUEST, params, {
    name: "launchGuestGame",
    method: "post"
  })
}
