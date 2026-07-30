export type AgentCommissionDetailStatus = 0 | 2 | 4

export type AgentCommissionDetailStatusI18nKey = "common.send_pending" | "distribution_type.distributed" | "common.deny"

export type AgentCommissionDetailStatusI18nMap = Record<AgentCommissionDetailStatus, AgentCommissionDetailStatusI18nKey>
