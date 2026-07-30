import type { AgentCommissionDetailStatusI18nMap } from "./type"

export enum AgentCommissionDetailStatusEnum {
  Pending = 0,
  Distributed = 2,
  Cancelled = 4
}

export const agentCommissionDetailStatusI18nKeys: AgentCommissionDetailStatusI18nMap = {
  [AgentCommissionDetailStatusEnum.Pending]: "common.send_pending",
  [AgentCommissionDetailStatusEnum.Distributed]: "distribution_type.distributed",
  [AgentCommissionDetailStatusEnum.Cancelled]: "common.deny"
}
