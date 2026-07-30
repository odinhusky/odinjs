import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetInterestActivityDescriptionContent = {
  description: string
  image_path: string
  lang: string
}

export type GetInterestActivityDescriptionList = GetInterestActivityDescriptionContent[]

export type GetInterestActivityDescriptionResponseType = GetInterestActivityDescriptionList

//活動廣宣
export const getInterestActivityDescription = () => {
  return requestFn<EmptyType, GetInterestActivityDescriptionResponseType>(
    ENDPOINT_PATHS.INTEREST.ACTIVITY_DESCRIPTION,
    null,
    {
      name: "getInterestActivityDescription",
      method: "get",
      needToken: true
    }
  )
}
