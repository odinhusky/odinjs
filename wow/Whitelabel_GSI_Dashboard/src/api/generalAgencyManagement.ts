import { get, put, post } from "@/utils/request"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"

export const getGeneralAgencyManagement = async (params: Request.GetGeneralAgencyManagementList) => {
  const payload = {
    display_name: params.genaralAgentAccount,
    title: params.masterAgentName,
    enabled: params.enable,
    is_ban: params.accountStatus,
    email: params.email,
    mobile: params.phone,
    offset: params.offset,
    size: params.size
  }

  return await get<Response.GetGeneralAgencyManagementList>("/master/list", payload, {
    name: "getGeneralAgencyManagement"
  })
}

export const getSingleGeneralAgencyManagement = async (params: Request.GetSingleGeneralAgencyManagement) => {
  return await get<Response.GetSingleGeneralAgencyManagementItem>(`/master/${params.id}`, params, {
    name: "getSingleGeneralAgencyManagement"
  })
}

export const UpdateSingleGeneralAgencyManagement = (params: Request.UpdateSingleGeneralAgencyManagement) => {
  const payload = {
    password: params.password,
    confirm_password: params.confirm_password,
    title: params.master_agent_name,
    contact: params.contact_person,
    email: params.email,
    mobile: params.phone,
    remark: params.remark,
    enabled: params.enable_or_disable,
    is_ban: params.account_frozen,
    unbind_2fa: params.binding,
    currency_list: params.currency,
    product_code_list: params.product
  }
  return put<Response.GetSingleGeneralAgencyManagementItem>("/master/" + params.id, payload, {
    name: "UpdateSingleGeneralAgencyManagement"
  })
}

export const AddSingleGeneralAgencyManagement = (params: Request.GetSingleGeneralAgencyManagement) => {
  return post<Response.GetGeneralAgencyManagementList>("/master", params, {
    name: "addAgencyManagement",
    needToken: true
  })
}
