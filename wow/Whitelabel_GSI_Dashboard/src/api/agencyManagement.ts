import AdminRequest from "../utils/adminRequest"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, post, put } from "@/utils/request"

export const getAgencyManagementList = (params: Request.GetAgencyManagementList) => {
  const payload = {
    display_name: params.agentName,
    agent_code: params.agentId,
    user_account: params.agentAccount,
    enabled: params.enable,
    is_running: params.siteOperationType,
    is_ban: params.accountStatus,
    email: params.email,
    mobile: params.phone,
    offset: params.offset,
    size: params.size
  }

  return get<Response.GetGeneralAgencyManagementList>("/agent/list", payload, {
    name: "getGeneralAgencyManagementList"
  })
}

export type statueData = {
  id: number
}
export const UpdateAgencyManagementStatue = (params: statueData) =>
  put<Response.GetGeneralAgencyManagementList>("/agent/" + params.id + "/enabled", params, {
    name: "updateAgencyManagementStatue",
    needToken: true
  })

export const UpdateAgencyManagementIsBand = (params: statueData) =>
  put<Response.GetGeneralAgencyManagementList>("/agent/" + params.id + "/is_banned", params, {
    name: "UpdateAgencyManagementIsBand",
    needToken: true
  })

export const UpdateAgencyManagementExternalCdn = (params: { id: number; external_cdn: boolean }) =>
  put<Response.GetGeneralAgencyManagementList>(
    "/agent/" + params.id + "/external_cdn",
    { external_cdn: params.external_cdn },
    {
      name: "UpdateAgencyManagementExternalCdn",
      needToken: true
    }
  )

export const UpdateAgencyManagementSiteOperation = (params: statueData) =>
  put<Response.GetGeneralAgencyManagementList>("/agent/" + params.id + "/is_running", params, {
    name: "updateAgencyManagementSiteOperation",
    needToken: true
  })

export const GetAgencyManagementDetail = (params: statueData) =>
  get<Response.GetGeneralAgencyManagementList>(
    "/agent/" + params.id,
    {},
    {
      name: "getAgencyManagementDetail",
      needToken: true
    }
  )
export const UpdateAgencyManagementDetail = (params: Request.GetAgencyManagementDetail) =>
  put<Response.GetGeneralAgencyManagementList>("/agent/" + params.id, params, {
    name: "updateAgencyManagementDetail",
    needToken: true
  })

export const AddAgencyManagement = (params: statueData) =>
  post<Response.GetGeneralAgencyManagementList>("/agent/create", params, {
    name: "addAgencyManagement",
    needToken: true
  })

export const UpdateAgencyManagementUnbind = (params: Request.statueData) =>
  put<Response.GetGeneralAgencyManagementList>(`/agent/${params.id}/unbind`, params, {
    name: "updateAgencyManagementUnbind"
  })

export const addAuroraAgent = (params: Request.AddAuroraAgent) =>
  post<Response.GetAdminAccount>("/aurora_agent", params, {
    name: "addAuroraAgent"
  })

export const getAuroraAgentList = (params: Request.GetAuroraAgentList) => {
  const payload = {
    agent_code: params.auroraAdminAgentAccount,
    offset: params.offset,
    size: params.size
  }

  return get<Response.GetGeneralAgencyManagementList>("/aurora_agent", payload, {
    name: "getAuroraAgentList"
  })
}

//佔成設定
export const getCommissionSetting = async (params: Request.GetCommissionSettingList) => {
  const payload = {
    agent_id: params.id
  }
  return await get<Response.GetCommissionSettingList>(`/agent/commission/settings`, payload, {
    usePlatform: true
  })
}

export const getGameType = async () => {
  return get<Response.ProductDropdownList>(
    "/agent/commission/game-types",
    {},
    {
      usePlatform: true
    }
  )
}

export const updateCommssionSetting = async (params: {
  id: number
  rebate_rate_config: Request.GetCommissionSettingList
}) => {
  const payload = {
    agent_id: params.id,
    settings: params.rebate_rate_config
  }
  return await put<Response.GetCommissionSettingList>(`/agent/commission/settings`, payload, {
    usePlatform: true
  })
}
