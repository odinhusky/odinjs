import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import type {
  AgentPaymentGroupCurrencyType,
  AgentPaymentGroupEmptyResponseData,
  AgentPaymentGroupPaymentMethod
} from "@shared-lib/api/commonTypes/paymentGroupTypes"

export interface PostAgentPaymentGroupParamsType {
  currency: number
  currency_type: AgentPaymentGroupCurrencyType
  icon_path?: string | null
  name: string
  payment_method: AgentPaymentGroupPaymentMethod
  sort_priority?: number
}

export type PostAgentPaymentGroupRequestType = PostAgentPaymentGroupParamsType
export type PostAgentPaymentGroupResponseType = AgentPaymentGroupEmptyResponseData

export const postAgentPaymentGroup = (params: PostAgentPaymentGroupParamsType) => {
  return requestFn<PostAgentPaymentGroupRequestType, PostAgentPaymentGroupResponseType>(
    ENDPOINT_PATHS.AGENT_PAYMENT_GROUP.CREATE,
    params,
    {
      name: "postAgentPaymentGroup",
      method: "post"
    }
  )
}
