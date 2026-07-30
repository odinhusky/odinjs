import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

//活動清單
export const getInterestActivityList = () => {
  return requestApi<null, Response.GetInterestActivityList>("/platform/v1/player/interest/activity", null, {
    name: "getInterestActivityList",
    method: "get",
    needToken: true
  })
}

//活動廣宣
export const getInterestActivityDescription = () => {
  return requestApi<null, Response.GetInterestActivityDescription>(
    "/platform/v1/player/interest/activity/description",
    null,
    {
      name: "getInterestActivityDescription",
      method: "get",
      needToken: true
    }
  )
}

//申請參加活動
export const applyInterestActivity = (data: Request.ApplyInterestActivityData) => {
  return requestApi<Request.ApplyInterestActivityData, object>(
    "/platform/v1/player/interest/application/submit",
    data,
    {
      name: "applyInterestActivity",
      method: "post",
      needToken: true
    }
  )
}

//申請領回活動
export const applyInterestActivityRedemption = (data: Request.ApplyInterestActivityRedemptionData) => {
  return requestApi<Request.ApplyInterestActivityRedemptionData, object>(
    "/platform/v1/player/interest/application/apply-redemption",
    data,
    {
      name: "applyInterestActivityRedemption",
      method: "post",
      needToken: true
    }
  )
}

//詳情清單
export const getInterestActivityDetailList = (data: Request.GetInterestActivityDetailListData) => {
  return requestApi<Request.GetInterestActivityDetailListData, Response.GetInterestActivityDetailList>(
    "/platform/v1/player/interest/member/application",
    data,
    {
      name: "getInterestActivityDetailList",
      method: "get",
      needToken: true
    }
  )
}
