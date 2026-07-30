import { inject, type InjectionKey } from "vue"
import type { UseAgentReportReturn } from "src/common/composables/useAgentReport"

export type AgentReportContext = UseAgentReportReturn

export const AGENT_REPORT_KEY: InjectionKey<AgentReportContext> = Symbol("agentReport")

export function useAgentReportContext() {
  const report = inject(AGENT_REPORT_KEY)

  if (!report) {
    throw new Error("useAgentReportContext() must be used within AgentReport")
  }

  return report
}
