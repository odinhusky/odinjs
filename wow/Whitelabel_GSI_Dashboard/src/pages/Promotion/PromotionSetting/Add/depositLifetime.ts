import type { Composer } from "vue-i18n"
import type * as Request from "@/api/request.type"
import { COUNT_BASIS, CURRENCY_TYPE, EVENT_TYPE, PRIZE_TYPE, PROMOTION_REWARD_TYPE } from "@/utils/constants"
import { normalizeFreeRoundWalletType } from "@/utils/freeRoundWalletType"

export const DEPOSIT_LIFETIME_MODE = {
  SpecifiedCount: "specifiedCount",
  SpecifiedRange: "specifiedRange"
} as const

type DepositLifetimeMode = (typeof DEPOSIT_LIFETIME_MODE)[keyof typeof DEPOSIT_LIFETIME_MODE]

type DepositLifetimeRewardGroup = {
  level?: number
  maxLevel?: number
  repeatable?: boolean
  currencies: Request.DepositLifetimeConditionCurrency[]
  freeGame?: Request.DepositLifetimeConditionFreeGame
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function cloneCurrencies(
  currencies: string[],
  source: Request.DepositLifetimeConditionCurrency[] = []
): Request.DepositLifetimeConditionCurrency[] {
  return currencies.map((currency) => {
    const existing = source.find((item) => item.currency === currency)
    return {
      currency,
      condition: existing?.condition ?? "",
      amount: existing?.amount ?? "",
      limit: existing?.limit ?? ""
    }
  })
}

function createFreeRoundSetting(source?: Partial<Request.FreeRoundSettingItem>): Request.FreeRoundSettingItem {
  return {
    begin_date: Number(source?.begin_date) || 0,
    end_date: Number(source?.end_date) || 0,
    bet_per_line: source?.bet_per_line || "0",
    total_bet_amount: source?.total_bet_amount || "0",
    currency_id: Number(source?.currency_id) || 0,
    game_code: source?.game_code || "",
    product_code: Number(source?.product_code) || 1006,
    remark: source?.remark || "",
    rounds: source?.rounds || "0",
    wallet_type: normalizeFreeRoundWalletType(source?.wallet_type)
  }
}

function isDepositLifetimeConditionFreeGame(
  source: Request.DepositLifetimeConditionFreeGame | Request.PromotionRewardItem
): source is Request.DepositLifetimeConditionFreeGame {
  return "freeRoundSetting" in source
}

function cloneFreeGame(
  source?: Request.DepositLifetimeConditionFreeGame | Request.PromotionRewardItem
): Request.DepositLifetimeConditionFreeGame {
  const freeRoundSetting = source
    ? isDepositLifetimeConditionFreeGame(source)
      ? source.freeRoundSetting
      : source.free_round_setting?.[0]
    : undefined

  return {
    condition: source?.condition ?? "",
    freeRoundSetting: createFreeRoundSetting(freeRoundSetting)
  }
}

function createCountCondition(
  currencies: string[],
  hitCount = 1,
  source: Request.DepositLifetimeConditionCurrency[] = []
): Request.DepositLifetimeCondition {
  return {
    id: createId("count"),
    hitCount,
    repeatable: false,
    expanded: hitCount === 1,
    currencies: cloneCurrencies(currencies, source),
    freeGame: cloneFreeGame()
  }
}

function createRangeCondition(
  currencies: string[],
  minCount: string | number = 1,
  source: Request.DepositLifetimeConditionCurrency[] = []
): Request.DepositLifetimeCondition {
  return {
    id: createId("range"),
    minCount,
    maxCount: "",
    repeatable: true,
    expanded: true,
    currencies: cloneCurrencies(currencies, source),
    freeGame: cloneFreeGame()
  }
}

function isPositiveInteger(value: string | number | undefined) {
  if (value === "" || value === undefined) {
    return false
  }

  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0
}

function getCurrenciesFromReward(reward: Request.PromotionRewardItem[] = []) {
  return Array.from(new Set(reward.map((item) => item.currency).filter((item): item is string => Boolean(item))))
}

function toConditionCurrency(item: Request.PromotionRewardItem): Request.DepositLifetimeConditionCurrency {
  return {
    currency: item.currency,
    condition: item.condition ?? "",
    amount: item.amount ?? "",
    limit: item.limit ?? ""
  }
}

function getCurrencyCode(currencyId: number) {
  const entry = Object.entries(CURRENCY_TYPE.Enums).find(([, value]) => value === currencyId)
  return entry?.[0] || ""
}

function toPositiveInteger(value: string | number | undefined) {
  if (value === "" || value === undefined) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

function getRewardLevel(item: Request.PromotionRewardItem) {
  return toPositiveInteger(item.level)
}

function getRewardMaxLevel(item: Request.PromotionRewardItem) {
  if (item.max_level === 0) {
    return 0
  }

  return toPositiveInteger(item.max_level)
}

function isSpecifiedCountRewardItem(item: Request.PromotionRewardItem) {
  const rewardLevel = getRewardLevel(item)
  const rewardMaxLevel = getRewardMaxLevel(item)

  return rewardLevel !== undefined && rewardMaxLevel !== undefined && rewardLevel === rewardMaxLevel
}

function normalizeRewardForLifetimeHydration(reward: Request.PromotionRewardItem[] = []) {
  return reward.map((item) => {
    const normalizedItem = { ...item }

    const rewardLevel = getRewardLevel(normalizedItem)
    if (
      rewardLevel !== undefined &&
      normalizedItem.repeatable === undefined &&
      (normalizedItem.max_level === undefined || normalizedItem.max_level === null || normalizedItem.max_level === 0)
    ) {
      normalizedItem.max_level = rewardLevel
    }

    return normalizedItem
  })
}

function inferDepositLifetimeMode(reward: Request.PromotionRewardItem[] = []): DepositLifetimeMode {
  return reward.length > 0 && reward.every(isSpecifiedCountRewardItem)
    ? DEPOSIT_LIFETIME_MODE.SpecifiedCount
    : DEPOSIT_LIFETIME_MODE.SpecifiedRange
}

function compareOptionalNumber(a?: number, b?: number) {
  if (a === undefined && b === undefined) {
    return 0
  }
  if (a === undefined) {
    return 1
  }
  if (b === undefined) {
    return -1
  }
  return a - b
}

function groupRewardsByLifetimeKey(
  reward: Request.PromotionRewardItem[] = [],
  mode: DepositLifetimeMode
): DepositLifetimeRewardGroup[] {
  const rewardGroups = new Map<string, DepositLifetimeRewardGroup>()

  reward.forEach((item, index) => {
    const rewardLevel = getRewardLevel(item)
    const rewardMaxLevel = getRewardMaxLevel(item)
    const repeatableKey = mode === DEPOSIT_LIFETIME_MODE.SpecifiedRange ? String(Boolean(item.repeatable)) : "count"
    const key =
      mode === DEPOSIT_LIFETIME_MODE.SpecifiedRange
        ? `${rewardLevel ?? `fallback-start-${index}`}-${rewardMaxLevel ?? "open"}-${repeatableKey}`
        : `${rewardLevel ?? rewardMaxLevel ?? `fallback-count-${index}`}-${repeatableKey}`

    if (!rewardGroups.has(key)) {
      rewardGroups.set(key, {
        level: rewardLevel,
        maxLevel: rewardMaxLevel,
        repeatable: item.repeatable,
        currencies: []
      })
    }

    rewardGroups.get(key)?.currencies.push(toConditionCurrency(item))
  })

  return Array.from(rewardGroups.values()).sort((a, b) => {
    if (mode === DEPOSIT_LIFETIME_MODE.SpecifiedRange) {
      const compareLevel = compareOptionalNumber(a.level, b.level)
      return compareLevel !== 0 ? compareLevel : compareOptionalNumber(a.maxLevel, b.maxLevel)
    }

    return compareOptionalNumber(a.level ?? a.maxLevel, b.level ?? b.maxLevel)
  })
}

function buildSpecifiedCountConditions(reward: Request.PromotionRewardItem[] = []): Request.DepositLifetimeCondition[] {
  const countReward = reward.filter(isSpecifiedCountRewardItem)
  const currencies = getCurrenciesFromReward(countReward)

  return groupRewardsByLifetimeKey(countReward, DEPOSIT_LIFETIME_MODE.SpecifiedCount).map((group, index) => ({
    id: createId("count"),
    hitCount: group.level ?? group.maxLevel ?? index + 1,
    repeatable: false,
    expanded: index === 0,
    currencies: cloneCurrencies(currencies, group.currencies)
  }))
}

function buildSpecifiedRangeConditions(reward: Request.PromotionRewardItem[] = []): Request.DepositLifetimeCondition[] {
  const rangeReward = reward.filter((item) => !isSpecifiedCountRewardItem(item))
  const currencies = getCurrenciesFromReward(rangeReward)

  return groupRewardsByLifetimeKey(rangeReward, DEPOSIT_LIFETIME_MODE.SpecifiedRange).map((group, index) => {
    const minCount = group.level ?? index + 1
    const maxCount = group.maxLevel === 0 ? "" : group.maxLevel

    return {
      id: createId("range"),
      minCount,
      maxCount: maxCount ?? "",
      repeatable: group.repeatable ?? true,
      expanded: index === 0,
      currencies: cloneCurrencies(currencies, group.currencies)
    }
  })
}

function buildFreeGameSpecifiedCountConditions(
  reward: Request.PromotionRewardItem[] = []
): Request.DepositLifetimeCondition[] {
  const countReward = reward.filter(isSpecifiedCountRewardItem)

  return countReward.map((item, index) => ({
    id: createId("free-game-count"),
    hitCount: getRewardLevel(item) ?? getRewardMaxLevel(item) ?? index + 1,
    repeatable: false,
    expanded: index === 0,
    currencies: [],
    freeGame: cloneFreeGame(item)
  }))
}

function buildFreeGameSpecifiedRangeConditions(
  reward: Request.PromotionRewardItem[] = []
): Request.DepositLifetimeCondition[] {
  const rangeReward = reward.filter((item) => !isSpecifiedCountRewardItem(item))

  return rangeReward.map((item, index) => {
    const maxLevel = getRewardMaxLevel(item)

    return {
      id: createId("free-game-range"),
      minCount: getRewardLevel(item) ?? index + 1,
      maxCount: maxLevel === 0 ? "" : (maxLevel ?? ""),
      repeatable: item.repeatable ?? true,
      expanded: index === 0,
      currencies: [],
      freeGame: cloneFreeGame(item)
    }
  })
}

export function isDepositLifetimeCashFlow(form: Request.UpdatePromotionItem) {
  return (
    form.type === EVENT_TYPE.Enums.DepositBonus &&
    form.prize_type === PRIZE_TYPE.Enums.CASH &&
    (form.count_basis === COUNT_BASIS.Enums.LIFETIME || form.count_basis === COUNT_BASIS.Enums.CUSTOM_PERIOD)
  )
}

export function isDepositLifetimeFreeGameFlow(form: Request.UpdatePromotionItem) {
  return (
    form.type === EVENT_TYPE.Enums.DepositBonus &&
    form.prize_type === PRIZE_TYPE.Enums.FREE_GAME &&
    (form.count_basis === COUNT_BASIS.Enums.LIFETIME || form.count_basis === COUNT_BASIS.Enums.CUSTOM_PERIOD)
  )
}

export function isDepositLifetimeFlow(form: Request.UpdatePromotionItem) {
  return isDepositLifetimeCashFlow(form) || isDepositLifetimeFreeGameFlow(form)
}

export function resolveRewardRangeMode(form: Request.UpdatePromotionItem) {
  return isDepositLifetimeFlow(form) && form.depositLifetimeMode === DEPOSIT_LIFETIME_MODE.SpecifiedRange
}

export function syncRewardRangeMode(form: Request.UpdatePromotionItem) {
  form.reward_range_mode = resolveRewardRangeMode(form)
  return form.reward_range_mode
}

export function ensureDepositLifetimeState(form: Request.UpdatePromotionItem) {
  const selectedCurrencies = getCurrenciesFromReward(form.reward || [])
  const initialCurrencies = (form.reward || []).map(toConditionCurrency)

  if (!form.rewardType) {
    form.rewardType = PROMOTION_REWARD_TYPE.Enums.FixedAmount
  }

  if (!form.depositLifetimeMode) {
    form.depositLifetimeMode = DEPOSIT_LIFETIME_MODE.SpecifiedCount
  }

  if (!form.depositLifetimeSpecifiedCount || form.depositLifetimeSpecifiedCount.length === 0) {
    form.depositLifetimeSpecifiedCount = [
      createCountCondition(selectedCurrencies, 1, initialCurrencies.length ? initialCurrencies : [])
    ]
  }

  if (!form.depositLifetimeSpecifiedRange || form.depositLifetimeSpecifiedRange.length === 0) {
    const firstReward = form.reward?.[0]
    const firstRewardIsSpecifiedCount = firstReward ? isSpecifiedCountRewardItem(firstReward) : false
    form.depositLifetimeSpecifiedRange = [
      {
        ...createRangeCondition(
          selectedCurrencies,
          firstReward?.level ?? 1,
          initialCurrencies.length ? initialCurrencies : []
        ),
        maxCount: firstRewardIsSpecifiedCount ? "" : ((firstReward?.max_level || "") as string | number),
        repeatable: firstRewardIsSpecifiedCount ? true : (firstReward?.repeatable ?? true)
      }
    ]
  }

  if (isDepositLifetimeFreeGameFlow(form)) {
    const firstReward = form.reward?.[0]
    const freeGameSource = firstReward ? cloneFreeGame(firstReward) : cloneFreeGame()

    form.depositLifetimeSpecifiedCount.forEach((condition) => {
      if (!condition.freeGame) {
        condition.freeGame = cloneFreeGame(freeGameSource)
      }
    })

    form.depositLifetimeSpecifiedRange.forEach((condition) => {
      if (!condition.freeGame) {
        condition.freeGame = cloneFreeGame(freeGameSource)
      }
    })
  }

  syncDepositLifetimeCurrencies(form)
  syncRewardRangeMode(form)
}

export function hydrateDepositLifetimeState(form: Request.UpdatePromotionItem, rewardRangeMode?: boolean) {
  if (!isDepositLifetimeFlow(form)) {
    form.reward_range_mode = false
    return
  }

  if (!form.rewardType && (form.reward || []).length > 0) {
    form.rewardType = form.reward[0].type
  }

  const reward = normalizeRewardForLifetimeHydration(form.reward || [])
  if (reward.length === 0) {
    ensureDepositLifetimeState(form)
    return
  }

  form.reward = reward
  const mode = inferDepositLifetimeMode(reward)
  form.depositLifetimeMode = mode
  form.depositLifetimeSpecifiedCount = isDepositLifetimeFreeGameFlow(form)
    ? buildFreeGameSpecifiedCountConditions(reward)
    : buildSpecifiedCountConditions(reward)
  form.depositLifetimeSpecifiedRange = isDepositLifetimeFreeGameFlow(form)
    ? buildFreeGameSpecifiedRangeConditions(reward)
    : buildSpecifiedRangeConditions(reward)

  if (typeof rewardRangeMode === "boolean") {
    form.depositLifetimeMode = rewardRangeMode
      ? DEPOSIT_LIFETIME_MODE.SpecifiedRange
      : DEPOSIT_LIFETIME_MODE.SpecifiedCount
  }

  ensureDepositLifetimeState(form)
}

export function syncDepositLifetimeCurrencies(form: Request.UpdatePromotionItem) {
  const selectedCurrencies = getCurrenciesFromReward(form.reward || [])
  const syncConditions = (conditions: Request.DepositLifetimeCondition[] = []) =>
    conditions.forEach((condition) => {
      condition.currencies = cloneCurrencies(selectedCurrencies, condition.currencies)
    })

  syncConditions(form.depositLifetimeSpecifiedCount)
  syncConditions(form.depositLifetimeSpecifiedRange)
}

export function addDepositLifetimeCondition(form: Request.UpdatePromotionItem, mode: DepositLifetimeMode) {
  ensureDepositLifetimeState(form)
  const selectedCurrencies = getCurrenciesFromReward(form.reward || [])
  if (mode === DEPOSIT_LIFETIME_MODE.SpecifiedCount) {
    const nextHitCount = (form.depositLifetimeSpecifiedCount?.length || 0) + 1
    form.depositLifetimeSpecifiedCount?.push(createCountCondition(selectedCurrencies, nextHitCount))
    return
  }

  form.depositLifetimeSpecifiedRange?.push(createRangeCondition(selectedCurrencies))
}

export function removeDepositLifetimeCondition(
  form: Request.UpdatePromotionItem,
  mode: DepositLifetimeMode,
  id: string
) {
  if (mode === DEPOSIT_LIFETIME_MODE.SpecifiedCount) {
    const conditions = form.depositLifetimeSpecifiedCount || []
    if (conditions.length <= 1) {
      return
    }
    form.depositLifetimeSpecifiedCount = conditions.filter((condition) => condition.id !== id)
    return
  }

  const conditions = form.depositLifetimeSpecifiedRange || []
  if (conditions.length <= 1) {
    return
  }
  form.depositLifetimeSpecifiedRange = conditions.filter((condition) => condition.id !== id)
}

export function getActiveDepositLifetimeConditions(form: Request.UpdatePromotionItem) {
  return form.depositLifetimeMode === DEPOSIT_LIFETIME_MODE.SpecifiedRange
    ? form.depositLifetimeSpecifiedRange || []
    : form.depositLifetimeSpecifiedCount || []
}

export function buildDepositLifetimeRewards(form: Request.UpdatePromotionItem): Request.PromotionRewardItem[] {
  if (isDepositLifetimeFreeGameFlow(form)) {
    ensureDepositLifetimeState(form)
    const conditions = getActiveDepositLifetimeConditions(form)
    const isSpecifiedRange = form.depositLifetimeMode === DEPOSIT_LIFETIME_MODE.SpecifiedRange

    return conditions.map((row) => {
      const freeGame = cloneFreeGame(row.freeGame)
      const freeRoundSetting = createFreeRoundSetting(freeGame.freeRoundSetting)

      return {
        currency: getCurrencyCode(freeRoundSetting.currency_id),
        condition: Number(freeGame.condition) || 0,
        amount: 0,
        type: PROMOTION_REWARD_TYPE.Enums.FreeGame,
        level: isSpecifiedRange ? Number(row.minCount) || undefined : Number(row.hitCount) || undefined,
        max_level: isSpecifiedRange
          ? row.maxCount !== ""
            ? Number(row.maxCount) || 0
            : 0
          : Number(row.hitCount) || undefined,
        repeatable: isSpecifiedRange ? Boolean(row.repeatable) : undefined,
        free_round_setting: [
          {
            ...freeRoundSetting,
            rounds: Number.parseInt(String(freeRoundSetting.rounds || 0), 10) || 0,
            bet_per_line: freeRoundSetting.bet_per_line || "0",
            total_bet_amount: freeRoundSetting.total_bet_amount || "0",
            wallet_type: normalizeFreeRoundWalletType(freeRoundSetting.wallet_type)
          }
        ]
      }
    })
  }

  ensureDepositLifetimeState(form)
  const conditions = getActiveDepositLifetimeConditions(form)
  const rewardType = form.rewardType || PROMOTION_REWARD_TYPE.Enums.FixedAmount
  const isSpecifiedRange = form.depositLifetimeMode === DEPOSIT_LIFETIME_MODE.SpecifiedRange

  return conditions.flatMap((row) =>
    row.currencies.map((currency) => ({
      currency: currency.currency,
      condition: Number(currency.condition) || 0,
      amount: Number(currency.amount) || 0,
      type: rewardType,
      limit:
        rewardType === PROMOTION_REWARD_TYPE.Enums.Magnification && currency.limit !== ""
          ? Number(currency.limit) || 0
          : undefined,
      level: isSpecifiedRange ? Number(row.minCount) || undefined : Number(row.hitCount) || undefined,
      max_level: isSpecifiedRange
        ? row.maxCount !== ""
          ? Number(row.maxCount) || 0
          : 0
        : Number(row.hitCount) || undefined,
      repeatable: isSpecifiedRange ? Boolean(row.repeatable) : undefined,
      free_round_setting: []
    }))
  )
}

export function validateDepositLifetimeRewardConfig(form: Request.UpdatePromotionItem, t: Composer["t"]) {
  if (!isDepositLifetimeFlow(form)) {
    return { valid: true, message: "" }
  }

  ensureDepositLifetimeState(form)

  if (isDepositLifetimeCashFlow(form) && (form.reward || []).length === 0) {
    return { valid: false, message: "請選擇幣種" }
  }

  const conditions = getActiveDepositLifetimeConditions(form)
  if (conditions.length === 0) {
    return { valid: false, message: "請至少新增一個條件" }
  }

  if (form.depositLifetimeMode === DEPOSIT_LIFETIME_MODE.SpecifiedCount) {
    const uniqueHitCounts = new Set<number>()
    for (const [index, row] of conditions.entries()) {
      if (!isPositiveInteger(row.hitCount)) {
        return { valid: false, message: `第 ${index + 1} 筆指定次數需為大於 0 的整數` }
      }

      const hitCount = Number(row.hitCount)
      if (uniqueHitCounts.has(hitCount)) {
        return { valid: false, message: "指定次數不可重複" }
      }
      uniqueHitCounts.add(hitCount)
    }
  } else {
    const normalizedRanges: Array<{ min: number; max: number; originalIndex: number }> = []

    for (const [index, row] of conditions.entries()) {
      if (!isPositiveInteger(row.minCount)) {
        return { valid: false, message: `第 ${index + 1} 筆最小值需為大於 0 的整數` }
      }

      if (row.maxCount !== "" && !isPositiveInteger(row.maxCount)) {
        return { valid: false, message: `第 ${index + 1} 筆最大值需為大於 0 的整數` }
      }

      const minCount = Number(row.minCount)
      const maxCount = row.maxCount === "" ? Number.POSITIVE_INFINITY : Number(row.maxCount)

      if (Number.isFinite(maxCount) && maxCount < minCount) {
        return { valid: false, message: "最大值不可小於最小值" }
      }

      normalizedRanges.push({
        min: minCount,
        max: maxCount,
        originalIndex: index
      })
    }

    const sortedRanges = [...normalizedRanges].sort((a, b) => a.min - b.min)
    for (let index = 1; index < sortedRanges.length; index += 1) {
      const previous = sortedRanges[index - 1]
      const current = sortedRanges[index]
      if (current.min <= previous.max) {
        return {
          valid: false,
          message: `指定區間不可重疊（第 ${previous.originalIndex + 1} 筆與第 ${current.originalIndex + 1} 筆）`
        }
      }
    }
  }

  if (isDepositLifetimeFreeGameFlow(form)) {
    for (const [index, row] of conditions.entries()) {
      const freeGame = row.freeGame
      const freeRoundSetting = freeGame?.freeRoundSetting

      if (!freeGame || !freeRoundSetting) {
        return { valid: false, message: `第 ${index + 1} 筆免費轉設定不完整` }
      }

      if (freeGame.condition === "" || Number(freeGame.condition) <= 0) {
        return { valid: false, message: `第 ${index + 1} 筆單次存款門檻不可為 0` }
      }

      if (!freeRoundSetting.wallet_type) {
        return { valid: false, message: `第 ${index + 1} 筆請選擇錢包類型` }
      }

      if (!freeRoundSetting.currency_id) {
        return { valid: false, message: `第 ${index + 1} 筆請選擇幣別` }
      }

      if (!freeRoundSetting.product_code) {
        return { valid: false, message: `第 ${index + 1} 筆請選擇產品` }
      }

      if (!freeRoundSetting.game_code) {
        return { valid: false, message: `第 ${index + 1} 筆請選擇遊戲` }
      }

      if (Number(freeRoundSetting.product_code) === 1006 && Number(freeRoundSetting.bet_per_line) <= 0) {
        return { valid: false, message: `第 ${index + 1} 筆請選擇每線投注金額` }
      }

      if (Number(freeRoundSetting.product_code) === 1148 && Number(freeRoundSetting.total_bet_amount) <= 0) {
        return { valid: false, message: `第 ${index + 1} 筆請選擇總投注額` }
      }

      if (!freeRoundSetting.begin_date || !freeRoundSetting.end_date) {
        return { valid: false, message: `第 ${index + 1} 筆請選擇活動時間` }
      }

      if (Number(freeRoundSetting.begin_date) >= Number(freeRoundSetting.end_date)) {
        return { valid: false, message: `第 ${index + 1} 筆活動開始時間不可大於或等於結束時間` }
      }

      if (!Number.isInteger(Number(freeRoundSetting.rounds)) || Number(freeRoundSetting.rounds) <= 0) {
        return { valid: false, message: `第 ${index + 1} 筆贈送次數需為大於 0 的整數` }
      }
    }

    return { valid: true, message: "" }
  }

  for (const row of conditions) {
    for (const currency of row.currencies) {
      if (currency.condition === "" || Number(currency.condition) <= 0) {
        return { valid: false, message: `${currency.currency} 的單次存款門檻不可為 0` }
      }
      if (currency.amount === "" || Number(currency.amount) <= 0) {
        const amountValidationMessage =
          form.rewardType === PROMOTION_REWARD_TYPE.Enums.Magnification
            ? t("promotion_hint_greater_than_0_percentage", { currency: currency.currency })
            : t("promotion_hint_greater_than_0", { currency: currency.currency })
        return { valid: false, message: amountValidationMessage }
      }
    }
  }

  return { valid: true, message: "" }
}

export function validateDepositLifetimeConfig(form: Request.UpdatePromotionItem, t: Composer["t"]) {
  if (!isDepositLifetimeFlow(form)) {
    return { valid: true, message: "" }
  }

  const rewardValidation = validateDepositLifetimeRewardConfig(form, t)
  if (!rewardValidation.valid) {
    return rewardValidation
  }

  if ((form.filteredGatewayList?.length || 0) > 0 && (form.payment_gateway?.length || 0) < 1) {
    return { valid: false, message: "請選擇支付方式" }
  }

  return { valid: true, message: "" }
}
