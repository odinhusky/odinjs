import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { BaseList, EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import type { AgentPaymentGroupListItem } from "@shared-lib/api/commonTypes/paymentGroupTypes"

export type AgentPaymentGroupItem = AgentPaymentGroupListItem

export type AgentPaymentGroupList = AgentPaymentGroupListItem[]

export type GetAgentPaymentGroupListResponseType = BaseList<AgentPaymentGroupList>

export const getAgentPaymentGroupList = () => {
  return requestFn<EmptyType, GetAgentPaymentGroupListResponseType>(ENDPOINT_PATHS.AGENT_PAYMENT_GROUP.LIST, null, {
    name: "getAgentPaymentGroupList",
    method: "get"
  })
}
