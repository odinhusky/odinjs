import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { PIXEL_CODE_TYPE_ENUMS } from "@shared-lib/constants/enums/pixelCodeType"

export type PixelCodeItem = {
  type: PIXEL_CODE_TYPE_ENUMS
  content: string
}

export type PixelCodeList = PixelCodeItem[]

export type GetPixelCodesResponseType = {
  list: PixelCodeList
}

export const getPixelCodes = () => {
  return requestFn<EmptyType, GetPixelCodesResponseType>(ENDPOINT_PATHS.PIXEL_CODE.LIST, null, {
    name: "getPixelCodes",
    method: "get"
  })
}
