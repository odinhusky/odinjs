import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetPlayerPaymentGatewayGroupsParamsType {
  payment_method: number
}

export interface AgentPaymentGatewayItem {
  audit_rate: string
  available_amount: string
  fee_amount: string
  fee_rate: string
  fee_type: number
  id: number
  max_amount: string
  min_amount: string
  name: string
  sort_priority: number
  third_party_balance: string
  usdt_rate: string
  currency_type?: number
  icon_path?: string | null
  logo_image_id?: number
  method_type?: number
  payment_gateway_id?: number
  payment_gateway_name?: string
  payment_type_id?: number
  payout_method_id?: number
  pg_code?: string
  type?: number
}

export interface PlayerPaymentGatewayGroupItem {
  agent_payment_gateways: AgentPaymentGatewayItem[]
  currency: number
  currency_type: number
  id: number
  icon_path: string | null
  name: string
  sort_priority: number
  logo_image_id?: number
  max_amount?: string
  method_type?: number
  min_amount?: string
  payment_type_id?: number
  payout_method_id?: number
  type?: number
}

export type GetPlayerPaymentGatewayGroupsRequestType = GetPlayerPaymentGatewayGroupsParamsType
export type GetPlayerPaymentGatewayGroupsResponseType = PlayerPaymentGatewayGroupItem[]

export const getPlayerPaymentGatewayGroups = (params: GetPlayerPaymentGatewayGroupsParamsType) => {
  return requestFn<GetPlayerPaymentGatewayGroupsRequestType, GetPlayerPaymentGatewayGroupsResponseType>(
    ENDPOINT_PATHS.PLAYER_PAYMENT_GATEWAY.GROUPS,
    params,
    {
      name: "getPlayerPaymentGatewayGroups",
      method: "get"
    }
  )
}
