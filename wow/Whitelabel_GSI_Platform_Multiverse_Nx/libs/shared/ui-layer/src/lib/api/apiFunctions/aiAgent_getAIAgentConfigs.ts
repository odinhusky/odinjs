import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { AgentStatusEnum } from "@shared-lib/constants/enums/AIAgentType"
import type {
  GetAIAgentConfigsParamsType,
  GetAIAgentConfigsRequestType,
  GetAIAgentConfigsResponseType
} from "@shared-lib/api/commonTypes/aiAgentTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

// 取得 AI Agent 列表
export const getAIAgentConfigs = (params: GetAIAgentConfigsParamsType) => {
  return requestFn<GetAIAgentConfigsRequestType, GetAIAgentConfigsResponseType>(
    ENDPOINT_PATHS.AI_AGENT.LAUNCH,
    { ...params, action_type: AgentStatusEnum.GET_CONFIG },
    {
      name: "getAIAgentConfigs",
      method: "post"
    }
  )
}
