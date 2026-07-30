import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, put, post, deleteData } from "@/utils/request"
import { SERVICE_TYPE } from "@/utils/constants"
import { useEnv } from "@/hook/useEnv"

const { isAdminMode, isGeneralAgentMode, isAgentMode } = useEnv()

export const getGatewayList = async (params: Request.GetGatewayList) => {
  console.log("params", params)
  const payload: Request.GetGatewayList = {
    name: params.name,
    type: params.type,
    currency: params.currency,
    offset: params.offset,
    size: params.size
  }
  payload.support_method_type = params.service

  if (isAdminMode) {
    payload.master_id = params.adminAgentAccount
    payload.enable = params.enable
  }
  if (isGeneralAgentMode) {
    payload.agent_id = params.agentAccount
    payload.enable = params.enable
  }
  if (isAgentMode) {
    payload.display = params.enable
  }
  return get<Response.BaseList<Response.GetGatewayList>>("payment/gateway/list", payload, { name: "getGatewayList" })
}

export const getGatewayDetail = async (params: Request.GetGatewayDetail) => {
  return get<Response.GatewatItemDetail>(`payment/gateway/${params.id}`, null, { name: "getGatewayDetail" })
}

export const setGatewayInfo = async (params: Request.SetGatewayInfo) => {
  return put(`payment/gateway/${params.id}/edit`, params, { name: "setGatewayInfo" })
}

export const setGatewayMasterIds = async (params: Request.SetGatewayMasterIds) => {
  return put(`payment/gateway/${params.id}/master/edit`, params, { name: "setGatewayMasterIds" })
}

export const setGatewayAgentIds = async (params: Request.SetGatewayMasterIds) => {
  return put(`payment/gateway/${params.id}/agent/edit`, params, { name: "setGatewayAgentIds" })
}

export const uploadPaymentImage = async (params: Request.UploadPaymentImage) => {
  return post<Response.PaymentImage>("payment/upload/image", params, { useFormData: true, name: "uploadPaymentImage" })
}

export const addGatewayItem = async (params: Request.GatewayItemDetail) => {
  return post("payment/gateway", params, { name: "addGatewayItem" })
}

export const setAgentGatewayInfo = async (params: Request.SetAgentGatewayInfo) => {
  const { id, ...payload } = params
  return put(`payment/gateway/${id}/edit`, payload, { name: "setAgentGatewayInfo" })
}

export const setGatewayConfig = async (params: Request.GatewayConfig) => {
  return put(`payment/gateway/${params.id}/edit/config`, params, { name: "setGatewayConfig" })
}

export const setGatewayBank = async (params: Request.GatewayBankInfo) => {
  return put(`payment/gateway/${params.id}/edit/bank`, params, { name: "setGatewayBank" })
}

export const getPaymentImage = async (id: number) => {
  return get<string>(`payment/image/${id}`, null, { name: "getPaymentImage" })
}

export const deletePaymentGateway = async (id: number) => {
  return deleteData(`payment/gateway/${id}`, null, { name: "deletePaymentGateway" })
}

export const setGatewayCrypto = async (params: Request.GatewayCryptoInfo) => {
  return put(`payment/gateway/${params.id}/edit/crypto`, params, { name: "setGatewayCrypto" })
}

export const getCryptoList = async () => {
  return get<{ id: number; code: string | number }[]>(`payment/crypto`, null, { name: "getCryptoList" })
}

export const getGatewayRemark = async (params: { trans_code: string; lang: string }) => {
  return get<{ content: { title: string; content: string }[]; images: string[] }>(
    `deposit_entry/remark/${params.trans_code}`,
    params,
    {
      name: "getGatewayRemark"
    }
  )
}

export const getThirdGatewayList = async (params?: Request.GetThirdGatewayBankQuery) => {
  const query: Record<string, string> = {}
  if (params?.payment_gateway_id != null && params.payment_gateway_id !== "") {
    query.payment_gateway_id = String(params.payment_gateway_id)
  }
  if (params?.payment_type_id != null && params.payment_type_id !== "") {
    query.payment_type_id = String(params.payment_type_id)
  }
  return get(`payment/gateway/bank`, query, { name: "getThirdGatewayList" })
}

export const getCryptoExchangeRateList = async (params: Request.GetCryptoExchangeRateList) => {
  return get<Response.GetCryptoExchangeRateList>(`payment/crypto/exchange/list`, params, {
    name: "getCryptoExchangeRateList"
  })
}

export const setCryptoExchangeRate = async (params: Request.SetCryptoExchangeRate) => {
  return put(`payment/crypto/exchange`, params, { name: "setCryptoExchangeRate" })
}

export const getGatewaySetting = async (params: Request.GetGatewaySetting) => {
  return get<Response.GetGatewaySetting>(`payment/gateway/setting`, params, { name: "getGatewaySetting" })
}

export const getGatewayConnection = async (params: Request.GetGatewayConnection) => {
  return get<Response.GetGatewayConnection>(`payment/gateway/connection`, params, { name: "getGatewayConnection" })
}

export const getGatewayMerchant = async (params: Request.GetGatewayMerchant) => {
  return get<Response.GetGatewayMerchant>(`payment/gateway/merchant`, params, { name: "getGatewayMerchant" })
}

export const getGatewayConfig = async (params: Request.GetGatewayConfig) => {
  // 手动构建查询字符串，避免数组参数被转换为 payment_gateway_name[]
  const queryParams = params.payment_gateway_name ? { payment_gateway_name: params.payment_gateway_name.join(",") } : {}
  return get<Response.GetGatewayConfig>(`payment/gateway/config`, queryParams, { name: "getGatewayConfig" })
}

export const postGatewayConnection = async (params: Request.PostGatewayConnection) => {
  return post(`payment/gateway/connection`, params, { name: "postGatewayConnection" })
}

export const putGatewayConnection = async (params: Request.PutGatewayConnection) => {
  const { payment_gateway_name, ...requestBody } = params
  return put(`payment/gateway/connection/${payment_gateway_name}`, requestBody, {
    name: "putGatewayConnection"
  })
}

export const getGatewayConnectionByPaymentGatewayName = async (
  params: Request.GetGatewayConnectionByPaymentGatewayName
) => {
  return get(
    `payment/gateway/connection/${params.payment_gateway_name}`,
    { payment_gateway_channel_code: params.payment_gateway_channel_code },
    {
      name: "getGatewayConnectionByPaymentGatewayName"
    }
  )
}

export const deleteGatewayConnection = async (params: Request.DeleteGatewayConnection) => {
  return post(`payment/gateway/connection/delete`, params, {
    name: "deleteGatewayConnection"
  })
}
export const getGatewayChannel = async (params: { payment_gateway_name: string }) => {
  return get<Response.GetGatewayChannel>(`payment/gateway/channel`, params, { name: "getGatewayChannel" })
}
