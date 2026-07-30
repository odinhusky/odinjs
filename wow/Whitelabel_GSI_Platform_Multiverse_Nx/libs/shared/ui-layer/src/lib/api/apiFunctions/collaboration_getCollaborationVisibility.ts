import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export const getCollaborationVisibility = () => {
  return requestFn<EmptyType, number>(ENDPOINT_PATHS.COLLABORATION.VISIBILITY, null, {
    name: "getCollaborationVisibility",
    method: "get"
  })
}
