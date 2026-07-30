import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface TrafficViewParamsType {
  agent_code: string
}

export type TrafficViewRequestType = TrafficViewParamsType

export const trafficView = (params: TrafficViewParamsType) => {
  return requestFn<TrafficViewRequestType, EmptyType>(ENDPOINT_PATHS.SITE.TRAFFIC_VIEW, params, {
    name: "trafficView",
    method: "post"
  })
}
