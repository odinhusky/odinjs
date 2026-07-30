import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import type {
  AgentPaymentGroupCurrencyType,
  AgentPaymentGroupEmptyResponseData,
  AgentPaymentGroupPaymentMethod
} from "@shared-lib/api/commonTypes/paymentGroupTypes"

export interface PutAgentPaymentGroupParamsType {
  id: number
  currency?: number
  currency_type?: AgentPaymentGroupCurrencyType
  icon_path?: string | null
  name?: string
  payment_method?: AgentPaymentGroupPaymentMethod
  sort_priority?: number
}

export type PutAgentPaymentGroupRequestType = Omit<PutAgentPaymentGroupParamsType, "id">
export type PutAgentPaymentGroupResponseType = AgentPaymentGroupEmptyResponseData

export const putAgentPaymentGroup = (params: PutAgentPaymentGroupParamsType) => {
  const { id, ...requestBody } = params

  return requestFn<PutAgentPaymentGroupRequestType, PutAgentPaymentGroupResponseType>(
    ENDPOINT_PATHS.AGENT_PAYMENT_GROUP.DETAIL({ id }),
    requestBody,
    {
      name: "putAgentPaymentGroup",
      method: "put"
    }
  )
}
