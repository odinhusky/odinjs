import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { ENDPOINT_PATHS } from "../endpointPaths"
import { TANSTACK_QUERY_KEY_REFERRAL_REBATE_GROUP } from "../../constants/tanstackQueryKeys/referralRebateKeys"

const readSource = (url: URL) => readFileSync(url, "utf8")

describe("referral rebate group API contract", () => {
  it("defines the referral rebate group endpoint", () => {
    expect(ENDPOINT_PATHS.REFERRAL_REBATE.GROUP).toBe("/v1/player/referral_rebate/group")
  })

  it("defines the current statement endpoint used by the subordinate betting report", () => {
    expect(ENDPOINT_PATHS.REFERRAL_REBATE.STATEMENT).toBe(
      "/v1/player/referral_rebate/events/current/statement"
    )
  })

  it("exports a focused query key for access gate checks", () => {
    expect(TANSTACK_QUERY_KEY_REFERRAL_REBATE_GROUP).toBe("referralRebateGroup")
  })

  it("exports the group wrapper function", () => {
    const source = readSource(new URL("./referralRebate_getReferralRebateGroup.ts", import.meta.url))

    expect(source).toContain("export const getReferralRebateGroup")
    expect(source).toContain("ENDPOINT_PATHS.REFERRAL_REBATE.GROUP")
    expect(source).toContain('name: "getReferralRebateGroup"')
    expect(source).toContain('method: "get"')
  })
})
