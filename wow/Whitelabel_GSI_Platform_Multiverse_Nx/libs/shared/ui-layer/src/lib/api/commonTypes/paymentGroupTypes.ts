export type AgentPaymentGroupCurrencyType = 1 | 2 //1: 法幣, 2: 虛擬幣

export type AgentPaymentGroupPaymentMethod = 1 | 2 //1: 充值; 2: 提現

export interface AgentPaymentGroupListItem {
  agent_id?: number
  currency?: number
  currency_type?: AgentPaymentGroupCurrencyType
  icon_path?: string
  id?: number
  name?: string
  payment_method?: AgentPaymentGroupPaymentMethod
  sort_priority?: number
}

export interface AgentPaymentGroupDetail {
  id: number
  agent_id: number
  currency_type: AgentPaymentGroupCurrencyType
  name: string
  currency: number
  payment_method: AgentPaymentGroupPaymentMethod
  sort_priority: number
  icon_path: string | null
}

export type AgentPaymentGroupEmptyResponseData = null

export type AgentPaymentGroupDeleteResponseData = unknown[] | boolean | number | Record<string, unknown> | null | string
