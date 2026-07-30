export interface ConditionType {
  // RTP 條件
  mode: string // 觸發模式：Greater(大於) / Less(小於) / Range(區間)
  value: string // Greater / Less 模式使用的單一閥值
  min: string // Range 模式下限
  max: string // Range 模式上限
  agent_bet_area_index: number // 觸發後下注的區域索引
  agent_bet_chip: string // 下著面額
}

interface RuleBase {
  agent_bet_area_index: number
  agent_bet_chip: string
  conditions: ConditionType[]
}

// Response 版本 (補上必填)
export interface RuleResponseType extends RuleBase {
  required_count: number
  bet_area_indices: number[]
}

// Request 版本 (補上可選)
export interface RuleRequestType extends RuleBase {
  required_count?: number
  bet_area_indices?: number[]
}

export interface AIAgentEnabledPattern<T = RuleResponseType> {
  product_name: string
  game_name: string
  pattern_type: string
  is_active: boolean
  rule: T // 這裡使用泛型，動態決定 rule 是哪種型別
}

export interface AgentConfigs<T = RuleResponseType> {
  currency?: string
  balance?: string
  daily_stop_profit?: string
  daily_stop_loss?: string
  enabled_pattern_list?: AIAgentEnabledPattern<T>[]
}

export interface GetAIAgentConfigsRequestType {
  game_type: string
  product_code: number
  platform: string
  currency: string
  language_code: number
  /*
    action_type
    0: 取得投注設定(等於是 GET method 取得列表)
    1: 開始投注(選 1 時，data 必填, status 為 true)
    2: 更新設定資料(選 2 時，data 必填, status 為 false)
    3: 停止投注(選 3 時，data 必填, status 為 false)
  */
  action_type: number
  data?: {
    status: boolean // 是否正在投注
    agent_configs: AgentConfigs<RuleRequestType>[]
  }
}

export interface GetAIAgentConfigsResponseType {
  status: boolean
  agent_configs: Array<{
    currency?: string
    balance?: string
    daily_stop_profit?: string
    daily_stop_loss?: string
    enabled_pattern_list?: AIAgentEnabledPattern<RuleResponseType>[]
  }>
}

export type GetAIAgentConfigsParamsType = Omit<GetAIAgentConfigsRequestType, "action_type" | "data">

export type OtherAIAgentActionParamsType = Omit<GetAIAgentConfigsRequestType, "action_type"> & {
  data: NonNullable<GetAIAgentConfigsRequestType["data"]>
}
