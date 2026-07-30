import AdminRequest from "../utils/adminRequest"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"

import { ERROR_CODE } from "@/utils/constants"
import * as fakeData from "@/api/fakeData/adminAccount"
import { get, post, put, deleteData } from "@/utils/request"

export const getAdminAccount = (params: Request.GetAdminAccount) => {
  const payload = {
    account: params.account,
    enabled: params.enable,
    is_ban: params.frozenStatus,
    role: params.permissionLevel,
    name: params.name,
    phone: params.phone,
    email: params.email,
    offset: params.offset,
    size: params.size
  }

  return get<Response.GetAdminAccount>("/subaccount/list", payload, {
    name: "getAdminAccount"
  })
}
export const deleteAdminAccount = (params: Request.GetAdminAccountDetail) =>
  deleteData<Response.GetAdminAccount>(
    `/subaccount/user/${params.id}`,
    {},
    {
      name: "deleteAdminAccount"
    }
  )
export const addAdminAccount = (params: Request.AddAdminAccount) =>
  post<Response.GetAdminAccount>("/subaccount", params, {
    name: "addAdminAccount"
  })

export const getAccountAdminDetail = (params: Request.GetAdminAccountDetail) =>
  get<Response.GetAdminAccountDetail>(`/subaccount/user/${params.id}/info`, params, {
    name: "getAccountAdminDetail"
  })

export const updateAccountAdminDetail = (params: Request.GetAdminAccountDetail) =>
  put<Response.GetAdminAccountDetail>(`/subaccount/user/${params.id}`, params, {
    name: "updateAccountAdminDetail"
  })
export const updateAccountAdminUnBind = (params: Request.GetAdminAccountDetail) =>
  put<Response.GetAdminAccountDetail>(`/subaccount/user/${params.id}/unbind`, params, {
    name: "updateAccountAdminUnBind"
  })
/*
export const UpdateAdminAccountEnabled = (params: Request.GetAdminAccount) =>
  put<Response.GetAdminAccount>(
    "/agent/" + params.id + "/enabled",
    {},
    {
      name: "updateAgencyManagementStatue",
      needToken: true
    }
  )
*/
export const getAdminAccountPermission = (params: Request.GetAdminAccountPermission) =>
  get<Response.GetAdminAccountPermission & { list: object }>("/permission/role/list", params, {
    name: "getAdminAccountPermission"
  })

export const getUserActionLog = (params: Request.GetUserActionLog) => {
  const payload = {
    username: params.username,
    display_name: params.name,
    page_id: params.pageLog,
    start_date: params.start as any,
    end_date: params.end as any,
    keyword: params.keyword,
    offset: params.offset,
    size: params.size
  }

  return get<Response.GetUserActionLog>("/operation_log/list", payload, {
    name: "getUserActionLog"
  })
}

export const getAdminAccountPermissionList = (params: Request.GetAdminAccountPermission) =>
  get<Response.GetAdminAccountPermission & { list: object; parent_permission: object }>("/permission/all", params, {
    name: "getAdminAccountPermissionList"
  })

export type permissionData = {
  id?: number
}

export const getAdminAccountPermissionDetail = async (params: permissionData) => {
  return get<Response.GetAdminAccountPermission & { parent_permission: [] }>(
    `/permission/role/${params.id}/permission`,
    params,
    {
      name: "getAdminAccountPermissionDetail"
    }
  )
}
export const getAccountPermissionDetail = async () => {
  return get<Response.GetAdminAccountPermission & { parent_permission: [] }>(
    `/permission/user`,
    {},
    {
      name: "getAccountPermissionDetail"
    }
  )
}

export const updateAdminAccountPermissionDetail = (params: permissionData) =>
  put<Response.GetAdminAccountPermission>(`/permission/role/${params.id}`, params, {
    name: "updateAdminAccountPermissionDetail"
  })

export type permissionStatueData = {
  id: number
  mode: string
}
export const updateAdminAccountPermissionStatue = (params: permissionStatueData) =>
  put<Response.GetAdminAccountPermission>(
    `/permission/role/${params.id}/${params.mode}`,
    {},
    {
      name: "updateAdminAccountPermissionStatue"
    }
  )

export type permissionAddData = {
  name: string
  remark: string
  permission: any
}
export const addAdminAccountPermission = (params: permissionAddData) =>
  post<Response.GetAdminAccountPermission>("/permission/role", params, {
    name: "addAdminAccountPermission"
  })

export const deleteAdminAccountPermission = (params: permissionData) =>
  deleteData<Response.GetAdminAccountPermission>(
    `/permission/role/${params.id}`,
    {},
    {
      name: "deleteAdminAccountPermission"
    }
  )
