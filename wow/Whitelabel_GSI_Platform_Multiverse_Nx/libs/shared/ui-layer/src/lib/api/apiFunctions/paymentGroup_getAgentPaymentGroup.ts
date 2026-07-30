import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import type { AgentPaymentGroupDetail } from "@shared-lib/api/commonTypes/paymentGroupTypes"

export interface GetAgentPaymentGroupParamsType {
  id: number
}

export type GetAgentPaymentGroupRequestType = EmptyType

export type GetAgentPaymentGroupResponseType = AgentPaymentGroupDetail

export const getAgentPaymentGroup = (params: GetAgentPaymentGroupParamsType) => {
  return requestFn<GetAgentPaymentGroupRequestType, GetAgentPaymentGroupResponseType>(
    ENDPOINT_PATHS.AGENT_PAYMENT_GROUP.DETAIL({ id: params.id }),
    null,
    {
      name: "getAgentPaymentGroup",
      method: "get"
    }
  )
}
