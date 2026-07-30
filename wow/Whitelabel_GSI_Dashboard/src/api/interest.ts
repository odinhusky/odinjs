import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, post, put, deleteData } from "@/utils/request"

export const getInterestActivityList = async (params: Request.GetInterestActivityList) => {
  const payload: any = {
    offset: params.offset,
    size: params.size
  }

  // 添加可選參數
  if (params.name || params.title) {
    payload.name = params.name || params.title
  }
  if (params.is_auto_dispatch != null) {
    payload.is_auto_dispatch = params.is_auto_dispatch
  }
  if (params.start && params.end) {
    payload.start_time = params.start
    payload.end_time = params.end
  }

  return get<Response.GetInterestActivityList>("/interest/activity", payload, {
    name: "getInterestActivityList",
    usePlatform: true
  })
}

export const addInterestActivity = async (params: Request.AddInterestActivity) => {
  return post("/interest/activity", params, {
    name: "addInterestActivity",
    usePlatform: true
  })
}

export const getInterestActivityDetail = async (id: number) => {
  return get<Response.GetInterestActivityDetail>(
    `/interest/activity/${id}`,
    {},
    {
      name: "getInterestActivityDetail",
      usePlatform: true
    }
  )
}

export const updateInterestActivity = async (id: number, body: Request.UpdateInterestActivity) => {
  return put(`/interest/activity/${id}`, body, {
    name: "updateInterestActivity",
    usePlatform: true
  })
}

export const deleteInterestActivity = async (id: number) => {
  return deleteData(
    `/interest/activity/${id}`,
    {},
    {
      name: "deleteInterestActivity",
      usePlatform: true
    }
  )
}

export const getInterestApplicationAuditing = async (params: Request.GetInterestApplicationAuditing) => {
  const payload: any = {
    offset: params.offset,
    size: params.size
  }

  if (params.name || params.title) {
    payload.name = params.name || params.title
  }
  if (params.currency) {
    payload.currency_id = params.currency
  }
  if (params.start && params.end) {
    payload.start_time = params.start
    payload.end_time = params.end
  }

  return get<Response.GetInterestApplicationAuditing>("/interest/application/auditing", payload, {
    name: "getInterestApplicationAuditing",
    usePlatform: true
  })
}

export const dispatchInterestApplication = async (params: Request.DispatchInterestApplication) => {
  return post("/interest/application/dispatch", params, {
    name: "dispatchInterestApplication",
    usePlatform: true
  })
}

export const rejectInterestApplication = async (params: Request.RejectInterestApplication, application_id: number) => {
  return post(`/interest/application/${application_id}/reject`, params, {
    name: "rejectInterestApplication",
    usePlatform: true
  })
}

export const getInterestActivityApplicationAuditing = async (
  activity_id: number,
  params?: { offset?: number; size?: number }
) => {
  return get<Response.GetInterestActivityApplicationAuditing>(
    `/interest/activity/${activity_id}/application/auditing`,
    params ?? {},
    {
      name: "getInterestActivityApplicationAuditing",
      usePlatform: true
    }
  )
}

export const getInterestApplicationRefunded = async (params: Request.GetInterestApplicationRefunded) => {
  const payload: any = {
    offset: params.offset,
    size: params.size
  }

  if (params.name || params.title) {
    payload.name = params.name || params.title
  }
  if (params.currency) {
    payload.currency_id = params.currency
  }
  if (params.start && params.end) {
    payload.start_time = params.start
    payload.end_time = params.end
  }

  return get<Response.GetInterestApplicationRefunded>("/interest/application/refunded", payload, {
    name: "getInterestApplicationRefunded",
    usePlatform: true
  })
}

export const getInterestActivityApplicationRefunded = async (
  activity_id: number,
  params?: { offset?: number; size?: number }
) => {
  return get<Response.GetInterestActivityApplicationRefunded>(
    `/interest/activity/${activity_id}/application/refunded`,
    params ?? {},
    {
      name: "getInterestActivityApplicationRefunded",
      usePlatform: true
    }
  )
}

export const postInterestDescription = async (params: Request.PostInterestDescription) => {
  return post("/interest/description", params, {
    name: "postInterestDescription",
    usePlatform: true
  })
}

export const getInterestDescription = async () => {
  return get<Response.GetInterestDescription>(
    "/interest/description",
    {},
    {
      name: "getInterestDescription",
      usePlatform: true
    }
  )
}
