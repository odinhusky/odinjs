import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { AgentStatusEnum } from "@shared-lib/constants/enums/AIAgentType"
import type {
  GetAIAgentConfigsRequestType,
  GetAIAgentConfigsResponseType,
  OtherAIAgentActionParamsType
} from "@shared-lib/api/commonTypes/aiAgentTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

// 停止投注
export const stopAIAgentBetting = (params: OtherAIAgentActionParamsType) => {
  return requestFn<GetAIAgentConfigsRequestType, GetAIAgentConfigsResponseType>(
    ENDPOINT_PATHS.AI_AGENT.LAUNCH,
    { ...params, action_type: AgentStatusEnum.STOP_BETTING },
    {
      name: "stopAIAgentBetting",
      method: "post"
    }
  )
}
