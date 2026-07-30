import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, post, put } from "@/utils/request"

export const getGiftEventlList = (params: Request.GetGiftDetailList) => {
  const payload = {
    member_account: params.memberAccount,
    currency_id: params.currency,
    name: params.giftName,
    status: params.receiveStatus,
    start_time: params.start,
    end_time: params.end,
    time_type: params.dateType,
    offset: params.offset,
    size: params.size,
    wallet_type: params.wallet_type
  }
  return get<Response.GetGiftDetailList>("/gifts/events/list", payload, {
    name: "getGiftEventlList"
  })
}
//禮金明細列表

export const getGiftDetailList = async (params: Request.GetGiftDetailList) => {
  const payload = {
    member_account: params.memberAccount,
    currency_id: params.currency,
    //name: params.giftName,
    status: params.receiveStatus,
    start_time: params.start,
    end_time: params.end,
    time_type: params.dateType
  }
  return await get<Response.GetGiftDetailList>(`/gifts/events/${params.event_id}/details/list`, payload, {
    name: "getGiftDetailList"
  })
}
//取消
export const updateGiftDetailStatus = (gift_id: number) =>
  put<Response.GetGiftDetailList>(
    `/gifts/${gift_id}`,
    {},
    {
      name: "updateGiftDetailStatus"
    }
  )
//全部
export const updateGiftDetailStatusBatch = (event_id: number) =>
  put<Response.GetGiftDetailList>(
    `/gifts/events/${event_id}/details/cancel`,
    {},
    {
      name: "updateGiftDetailBatch"
    }
  )

//檢查會員是否存在
export const MemberCheckAccount = (params: { list: string[] }) =>
  post<Response.GiftQuota>("/gifts/members/exists", params, {
    name: "MemberCheckAccount"
  })

//單次派發
export const GiftDispatch = (params: Response.GiftQuota) =>
  post<Response.GiftQuota>("/gifts/events/dispatch", params, {
    name: "GiftDispatch",
    needToken: true
  })

//批次派發
export const GiftDispatchBatch = (params: Response.GiftQuota) =>
  post<Response.GiftQuota>("/gifts/events/dispatch/batch", params, {
    name: "GiftDispatchBatch",
    needToken: true
  })

//匯出
export const giftDetailExport = async (params: Request.GetGiftDetailList) => {
  const payload = {
    member_account: params.memberAccount,
    currency_id: params.currency,
    //name: params.giftName,
    status: params.receiveStatus,
    start_time: params.start,
    end_time: params.end,
    time_type: params.dateType
  }
  const response = await get<any>(`/gifts/events/${params.event_id}/details/list/export`, payload, {
    name: "giftDetailExport",
    responseType: "blob"
  })
  return response
}
export const getMemberDetail = (id: number) =>
  get<Response.GetMemberList>(
    "/member/" + id + "/info",
    {},
    {
      name: "getMemberDetail"
    }
  )
