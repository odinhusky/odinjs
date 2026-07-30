import type * as Response from "src/api/response.type"

export type AgentReportTeamRowDetailState = {
  expanded: boolean
  loading: boolean
  list: Response.GetMemberAgentTeamDetailList[]
}

export const collapseAgentReportTeamRowDetails = (
  details: Record<number, AgentReportTeamRowDetailState>
) => {
  const nextDetails: Record<number, AgentReportTeamRowDetailState> = {}
  let changed = false

  for (const [memberId, current] of Object.entries(details)) {
    const id = Number(memberId)

    if (current.expanded || current.loading) {
      nextDetails[id] = { ...current, expanded: false, loading: false }
      changed = true
      continue
    }

    nextDetails[id] = current
  }

  return { nextDetails, changed }
}
