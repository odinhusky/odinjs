import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import type { AgentPaymentGroupDeleteResponseData } from "@shared-lib/api/commonTypes/paymentGroupTypes"

export interface DeleteAgentPaymentGroupParamsType {
  id: number
}

export type DeleteAgentPaymentGroupRequestType = EmptyType
export type DeleteAgentPaymentGroupResponseType = AgentPaymentGroupDeleteResponseData

export const deleteAgentPaymentGroup = (params: DeleteAgentPaymentGroupParamsType) => {
  return requestFn<DeleteAgentPaymentGroupRequestType, DeleteAgentPaymentGroupResponseType>(
    ENDPOINT_PATHS.AGENT_PAYMENT_GROUP.DETAIL({ id: params.id }),
    null,
    {
      name: "deleteAgentPaymentGroup",
      method: "delete"
    }
  )
}
