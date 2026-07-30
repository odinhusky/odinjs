import { describe, expect, it } from "vitest"
import {
  REFERRAL_REBATE_ALL_GAME_TYPE,
  REFERRAL_REBATE_TARGET,
  buildReferralRebateEventsParams,
  buildReferralRebateEventDetailParams,
  buildReferralRebateStatementParams,
  canAccessReferralRebate,
  getInitialReferralRebateDateRange,
  getReferralRebateOffset
} from "./referralRebateFlowHelpers"

describe("useReferralRebateFlow helpers", () => {
  it("allows access by rebate target and member agent identity", () => {
    expect(canAccessReferralRebate(REFERRAL_REBATE_TARGET.ALL, false)).toBe(true)
    expect(canAccessReferralRebate(REFERRAL_REBATE_TARGET.ALL, true)).toBe(true)
    expect(canAccessReferralRebate(REFERRAL_REBATE_TARGET.MEMBER, false)).toBe(true)
    expect(canAccessReferralRebate(REFERRAL_REBATE_TARGET.MEMBER, true)).toBe(false)
    expect(canAccessReferralRebate(REFERRAL_REBATE_TARGET.AGENT, false)).toBe(false)
    expect(canAccessReferralRebate(REFERRAL_REBATE_TARGET.AGENT, true)).toBe(true)
    expect(canAccessReferralRebate(undefined, true)).toBe(false)
  })

  it("builds the initial seven-day date range in YYYY-MM-DD format", () => {
    expect(getInitialReferralRebateDateRange(new Date("2026-06-16T08:30:00+08:00"))).toEqual({
      from: "2026-06-09",
      to: "2026-06-16"
    })
  })

  it("calculates API offset from one-based page number", () => {
    expect(getReferralRebateOffset(1, 20)).toBe(0)
    expect(getReferralRebateOffset(3, 20)).toBe(40)
    expect(getReferralRebateOffset(0, 20)).toBe(0)
  })

  it("uses the selected currency filter for current statement params", () => {
    expect(
      buildReferralRebateStatementParams({
        currencyId: 12,
        account: "  ",
        gameType: REFERRAL_REBATE_ALL_GAME_TYPE,
        dateRange: { from: "2026-06-09", to: "2026-06-16" },
        page: 2,
        size: 20
      })
    ).toEqual({
      currency_id: 12,
      account: "",
      start_time: "2026-06-09",
      end_time: "2026-06-16",
      offset: 20,
      size: 20
    })
  })

  it("uses the selected currency filter and keeps event id outside event detail query params", () => {
    const params = buildReferralRebateEventDetailParams({
      eventId: 88,
      currencyId: 12,
      account: "alice",
      gameType: 3,
      page: 1,
      size: 20
    })

    expect(params.path).toEqual({ event_id: 88 })
    expect(params.query).toEqual({
      currency_id: 12,
      account: "alice",
      game_type: 3,
      offset: 0,
      size: 20
    })
    expect(params.query).not.toHaveProperty("event_id")
  })

  it("builds revenue detail params with currency, duration and pagination only", () => {
    expect(
      buildReferralRebateEventsParams({
        currencyId: 8,
        dateRange: {
          from: "2026-05-01T00:00:00+07:00",
          to: "2026-05-31T23:59:59+07:00"
        },
        page: 1,
        size: 20
      })
    ).toEqual({
      currency_id: 8,
      start_time: "2026-05-01T00:00:00+07:00",
      end_time: "2026-05-31T23:59:59+07:00",
      offset: 0,
      size: 20
    })
  })
})
