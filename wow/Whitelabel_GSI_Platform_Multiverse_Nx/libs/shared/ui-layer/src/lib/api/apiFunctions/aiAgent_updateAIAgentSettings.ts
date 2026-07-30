import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { AgentStatusEnum } from "@shared-lib/constants/enums/AIAgentType"
import type {
  GetAIAgentConfigsRequestType,
  GetAIAgentConfigsResponseType,
  OtherAIAgentActionParamsType
} from "@shared-lib/api/commonTypes/aiAgentTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

// 更新設定資料
export const updateAIAgentSettings = (params: OtherAIAgentActionParamsType) => {
  return requestFn<GetAIAgentConfigsRequestType, GetAIAgentConfigsResponseType>(
    ENDPOINT_PATHS.AI_AGENT.LAUNCH,
    { ...params, action_type: AgentStatusEnum.UPDATE_CONFIG },
    {
      name: "updateAIAgentSettings",
      method: "post"
    }
  )
}
