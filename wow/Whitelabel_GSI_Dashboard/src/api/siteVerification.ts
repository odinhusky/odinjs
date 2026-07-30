import { get, put, deleteData } from "@/utils/request"
import * as Request from "@/api/request.type"
import * as Response from "@/api/response.type"

/** 取得網站驗證 */
export const getSiteVerification = () =>
  get<Response.GetSiteVerification>("site-verification", undefined, {
    name: "getSiteVerification",
    usePlatform: true
  })

/** 修改網站驗證 */
export const putSiteVerification = (payload: Request.PutSiteVerification) => {
  return put("site-verification", payload, {
    name: "putSiteVerification",
    usePlatform: true
  })
}

/** 刪除網站驗證 */
export const deleteSiteVerification = (params: Request.DeleteSiteVerification) => {
  return deleteData(`site-verification/${params.id}`, params, {
    name: "deleteSiteVerification",
    usePlatform: true
  })
}
