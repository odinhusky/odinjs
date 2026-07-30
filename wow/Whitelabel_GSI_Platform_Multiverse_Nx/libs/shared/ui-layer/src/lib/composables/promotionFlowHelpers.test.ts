import { describe, expect, it } from "vitest"
import type { PromotionResponseItem } from "../api/commonTypes/promotionTypes"
import { PROMOTION_TYPE_ENUMS } from "../constants/enums/promotionType"
import {
  buildPromotionContentHtml,
  buildPromotionImageUrl,
  getPromotionDetailById,
  mapPromotionDisplayItems
} from "./promotionFlowHelpers"

const promotions: PromotionResponseItem[] = [
  {
    id: 1,
    type: PROMOTION_TYPE_ENUMS.DEPOSIT_BONUS,
    category: 1,
    image: "/root-a.png",
    updated_time: 1718000000,
    details: [
      {
        promotion_id: 101,
        lang: "en",
        title: "Deposit bonus",
        content: '<img src="https://api.example.com/a.png">',
        image: "/promotion/a.png"
      },
      {
        promotion_id: 102,
        lang: "zh-tw",
        title: "存款優惠",
        content: "繁中內容",
        image: "https://cdn.example.com/promotion-tw.png?v=1"
      }
    ]
  },
  {
    id: 2,
    type: PROMOTION_TYPE_ENUMS.BET_BONUS,
    category: 1,
    image: "/root-b.png",
    updated_time: 1718000001,
    details: [
      {
        promotion_id: 201,
        lang: "en",
        title: "Bet bonus",
        content: "English content",
        image: "/promotion/b.png"
      }
    ]
  }
]

describe("promotion flow helpers", () => {
  it("filters promotions by locale and active type", () => {
    const result = mapPromotionDisplayItems({
      promotions,
      locale: "en",
      activeType: PROMOTION_TYPE_ENUMS.DEPOSIT_BONUS,
      resourceConfig: {
        apiBase: "https://api.example.com",
        staticResourceUrl: "https://static.example.com"
      }
    })

    expect(result).toHaveLength(1)
    expect(result[0].detail.promotion_id).toBe(101)
    expect(result[0].details).toEqual([result[0].detail])
  })

  it("matches locale details case-insensitively", () => {
    const result = mapPromotionDisplayItems({
      promotions,
      locale: "zh-TW",
      activeType: PROMOTION_TYPE_ENUMS.ALL,
      resourceConfig: {}
    })

    expect(result).toHaveLength(1)
    expect(result[0].detail.title).toBe("存款優惠")
  })

  it("finds detail by PromotionDetail promotion_id", () => {
    expect(getPromotionDetailById(promotions, "201")?.detail.title).toBe("Bet bonus")
    expect(getPromotionDetailById(promotions, "999")).toBeNull()
  })

  it("builds promotion image URLs with resource base and cache busting", () => {
    expect(
      buildPromotionImageUrl("uploads/promotions/87_en.jpeg", 1741680403, {
        apiBase: "https://api-devm-dev.gsiwl.com",
        staticResourceUrl: "/statics/staging"
      })
    ).toBe("https://api-devm-dev.gsiwl.com/uploads/promotions/87_en.jpeg?v=1741680403")

    expect(
      buildPromotionImageUrl("/promotion/a.png", 1718000000, {
        imageBase: "https://static.example.com/"
      })
    ).toBe("https://static.example.com/promotion/a.png?v=1718000000")

    expect(buildPromotionImageUrl("https://cdn.example.com/a.png?v=1", 2, {})).toBe("https://cdn.example.com/a.png?v=2")
    expect(buildPromotionImageUrl("https://cdn.example.com/a.png?updateTime=1", 2, {})).toBe(
      "https://cdn.example.com/a.png?updateTime=1"
    )
  })

  it("replaces API domain in detail content with the static resource domain", () => {
    expect(
      buildPromotionContentHtml('<img src="https://api.example.com/promotion/a.png">', {
        apiBase: "https://api.example.com",
        imageBase: "https://static.example.com"
      })
    ).toBe('<img src="https://static.example.com/promotion/a.png">')
  })
})
