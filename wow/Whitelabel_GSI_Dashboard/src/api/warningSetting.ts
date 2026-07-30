import { get, post, put, deleteData } from "@/utils/request"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"

export const getWarningList = async (params?: Request.getWarningList) => {
  return get<Response.BaseList<Response.getWarningList>>(
    "warning/setting/list",
    {},
    {
      usePlatform: true
    }
  )
}
export const getMemberList = (params: { account: string }) => {
  const payload = {
    account: params.account
  }
  return get<Response.GetMemberList>("/member/list", payload, {
    name: "getMemberList"
  })
}
export const addWarringSetting = async (params: Request.getWarningList) => {
  const times = params.schedule_type === 2 ? `${params.alert_interval_hour}:${params.alert_interval_min}:00` : ""
  const payload: Request.getWarningList = {
    currency_id: params.currency_id,
    schedule_type: params.schedule_type,
    lower_limit: params.lower_limit,
    upper_limit: params.upper_limit,
    notification_message: params.notification_message,
    exclude_list: params.exclude_list.map((id) => ({ member_id: id })),
    ...(params.schedule_type !== 1 && { schedule_trigger_time: times })
  }
  console.log(payload)
  return post(`warning/setting`, payload, {
    usePlatform: true
  })
}
export const getWarringDetail = async (id: number) => {
  return get<Response.getWarningList>(
    `warning/setting`,
    { setting_id: id },
    {
      usePlatform: true
    }
  )
}

export const editWarringSetting = async (params: Request.getWarningList) => {
  const times = params.schedule_type === 2 ? `${params.alert_interval_hour}:${params.alert_interval_min}:00` : ""
  const payload: Request.getWarningList = {
    setting_id: params.setting_id,
    currency_id: params.currency_id,
    schedule_type: params.schedule_type,
    lower_limit: params.lower_limit,
    upper_limit: params.upper_limit,
    notification_message: params.notification_message,
    exclude_list: params.exclude_list.map((id) => ({ member_id: id })),
    ...(params.schedule_type !== 1 && { schedule_trigger_time: times })
  }
  return put(`warning/setting`, payload, {
    usePlatform: true
  })
}

/*更新*/
export const updateWarningEnabled = async (params: Request.getWarningList) => {
  const times = params.schedule_type === 2 ? `${params.alert_interval_hour}:${params.alert_interval_min}:00` : ""
  const payload: Request.getWarningList = {
    setting_id: params.id,
    is_enabled: params.is_enabled
  }

  return put(`warning/setting/partial`, payload, {
    usePlatform: true
  })
}

export const deleteWarning = async (id: number) => {
  return deleteData(`warning/setting/${id}`, null, {
    usePlatform: true
  })
}

//詳細
export const getWarningDetail = async (params: Request.getWarningDetail) => {
  const payload: Request.getWarningDetail = {
    setting_id: params.setting_id,
    member_account: params.memberAccount,
    reason_type: params.reason_type,
    status: params.status,
    created_at: params.start
  }

  return get<Response.BaseList<Response.getWarningDetail>>("/warning/setting/log/list", payload, {
    usePlatform: true
  })
}

export const updateWarningLog = async (params: Request.getWarningDetail) => {
  return put(`warning/setting/log`, params, {
    usePlatform: true
  })
}

export const getWariningAlert = async () => {
  return get<Response.BaseList<Response.getWarningList>>(
    "warning/alert",
    {},
    {
      usePlatform: true
    }
  )
}
