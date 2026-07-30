import { get, put, patch } from "@/utils/request"
import * as Request from "@/api/request.type"
import * as Response from "@/api/response.type"

/** 取得像素代碼 */
export const getPixelCodes = () =>
  get<Response.GetPixelCodes>("pixel-codes", undefined, {
    name: "getSettgetPixelCodesings",
    usePlatform: true
  })

/** 更新像素代碼 */
export const putPixelCodes = (payload: Request.PutPixelCodes) => {
  return put("pixel-codes", payload, {
    name: "putPixelCodes",
    usePlatform: true
  })
}

/** 更新像素代碼狀態 */
export const patchPixelCodes = (params: Request.PatchPixelCodes) => {
  return patch(`pixel-codes/${params.type}/status`, params, {
    name: "patchPixelCodes",
    usePlatform: true
  })
}
