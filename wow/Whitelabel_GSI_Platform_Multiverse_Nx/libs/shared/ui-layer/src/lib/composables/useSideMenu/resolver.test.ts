import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { AUTH_ROUTE_GROUPS, ROUTE_PATH } from "../../constants/routePath"
import { resolveDidRoute } from "./resolver"

const readSource = (url: URL) => readFileSync(url, "utf8")

describe("side menu resolver DID route wiring", () => {
  it("resolves CMS referral_rebate did to Nuxt referralRebate route", () => {
    const source = readSource(new URL("./resolver.ts", import.meta.url))

    expect(source).toContain("referral_rebate: ROUTE_PATH.REFERRAL_REBATE")
    expect(ROUTE_PATH.REFERRAL_REBATE).toBe("/referralRebate")
  })

  it("marks referralRebate as an auth-required route", () => {
    expect(AUTH_ROUTE_GROUPS.AUTH_REQUIRED_ROUTES).toContain(ROUTE_PATH.REFERRAL_REBATE)
  })

  it("resolves CMS cashier did routes to Nuxt dialog routes", () => {
    expect(resolveDidRoute("deposit")).toBe(ROUTE_PATH.DEPOSIT)
    expect(resolveDidRoute("withdrawal")).toBe(ROUTE_PATH.WITHDRAW)
  })

  it("marks cashier dialog routes as auth-required routes", () => {
    expect(AUTH_ROUTE_GROUPS.AUTH_REQUIRED_ROUTES).toContain(ROUTE_PATH.DEPOSIT)
    expect(AUTH_ROUTE_GROUPS.AUTH_REQUIRED_ROUTES).toContain(ROUTE_PATH.WITHDRAW)
  })
})
