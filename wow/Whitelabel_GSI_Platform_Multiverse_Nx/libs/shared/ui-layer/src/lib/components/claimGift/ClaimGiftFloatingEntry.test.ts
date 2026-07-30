import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const readSource = (url: URL) => readFileSync(url, "utf8")

describe("ClaimGift i18n text bindings", () => {
  it("uses i18n keys for dialog text instead of hard-coded copy", () => {
    const source = readSource(new URL("./ClaimGiftFloatingEntry.vue", import.meta.url))

    expect(source).toContain('claim: t("common.btn.claim")')
    expect(source).toContain('successTitle: t("promotion.congratulations")')
    expect(source).toContain('rewardPrefix: t("promotion.you_get")')
    expect(source).toContain('pickTitle: t("promotion.pick_and_win")')
    expect(source).not.toContain('claim: "Claim"')
    expect(source).not.toContain('successTitle: "Congratulations"')
    expect(source).not.toContain('rewardPrefix: "You get"')
    expect(source).not.toContain('pickTitle: "PICK AND WIN"')
  })

  it("uses an i18n key for vault wallet label", () => {
    const source = readSource(new URL("../../composables/useClaimGiftFlow.ts", import.meta.url))

    expect(source).toContain('return t("walletType.vault")')
    expect(source).not.toContain('return "Vault Wallet"')
  })

  it("uses an i18n key for claim success toast", () => {
    const source = readSource(new URL("../../composables/useClaimGiftFlow.ts", import.meta.url))

    expect(source).toContain('summary: t("process_status.success")')
    expect(source).toContain('t("common.alarm.successfullyClaimed")')
    expect(source).not.toContain('"成功"')
    expect(source).not.toContain('"Success"')
    expect(source).not.toContain('"領取成功"')
    expect(source).not.toContain('"Claim Successful"')
  })
})
