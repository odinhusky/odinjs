import type {
  GetWithdrawRiskResponse,
  WithdrawRiskGlobalRules,
  WithdrawRiskGroup,
  WithdrawRiskGroupPayload
} from "@/api/withdrawRisk"

export const RISK_CONDITION_KEYS = [
  "is_first_withdrawal",
  "is_bonus_before",
  "is_withdrawal_gt_deposit",
  "is_amount_threshold"
] as const

export type RiskConditionKey = (typeof RISK_CONDITION_KEYS)[number]

export const RISK_CONDITION_I18N: Record<RiskConditionKey, string> = {
  is_first_withdrawal: "risk_control_settings.first_withdrawal",
  is_bonus_before: "risk_control_settings.bonus_claimed",
  is_withdrawal_gt_deposit: "risk_control_settings.total_withdrawal",
  is_amount_threshold: "risk_control_settings.withdrawal_amount_than"
}

export type RiskFormState = {
  currency_id: number
  is_enabled: boolean
  global_rules: WithdrawRiskGlobalRules
  groups: WithdrawRiskGroup[]
}

export function defaultGlobalRules(): WithdrawRiskGlobalRules {
  return {
    is_first_withdrawal: false,
    is_bonus_before: false,
    is_withdrawal_gt_deposit: false,
    is_amount_threshold: false,
    withdrawal_amount_threshold: "0"
  }
}

export function defaultRiskForm(currencyId: number): RiskFormState {
  return {
    currency_id: currencyId,
    is_enabled: false,
    global_rules: defaultGlobalRules(),
    groups: []
  }
}

export function sanitizeAmountInput(value: string | number | null | undefined): string {
  const digits = String(value ?? "").replace(/\D/g, "")
  if (!digits) return ""

  return String(Number.parseInt(digits, 10))
}

export function onlyAllowAmountInput(event: KeyboardEvent) {
  if (/[0-9]/.test(event.key)) return

  event.preventDefault()
}

export function isAmountThresholdInvalid(rules: WithdrawRiskGlobalRules) {
  if (!rules.is_amount_threshold) return false

  const raw = String(rules.withdrawal_amount_threshold ?? "").trim()
  if (!raw) return true

  return !/^\d+$/.test(raw)
}

export function normalizeGlobalRules(rules: WithdrawRiskGlobalRules): WithdrawRiskGlobalRules {
  const threshold = Number.parseInt(sanitizeAmountInput(rules.withdrawal_amount_threshold), 10)
  return {
    ...rules,
    withdrawal_amount_threshold: String(Number.isFinite(threshold) && threshold >= 0 ? threshold : 0)
  }
}

export function riskConditionKeysFromItem(
  item: Partial<Record<RiskConditionKey, boolean | undefined>>
): RiskConditionKey[] {
  return RISK_CONDITION_KEYS.filter((k) => !!item[k])
}

export function riskConditionFlagsFromKeys(keys: readonly RiskConditionKey[]): Record<RiskConditionKey, boolean> {
  const active = new Set(keys)
  return Object.fromEntries(RISK_CONDITION_KEYS.map((k) => [k, active.has(k)])) as Record<RiskConditionKey, boolean>
}

export function normalizeRiskForm(data: GetWithdrawRiskResponse): RiskFormState {
  return {
    currency_id: data.currency_id,
    is_enabled: data.is_enabled,
    global_rules: normalizeGlobalRules(data.global_rules ?? defaultGlobalRules()),
    groups: (data.groups ?? []).map((group) => ({
      ...group,
      rules: normalizeGlobalRules(group.rules)
    }))
  }
}

export function toGroupPayload(group: WithdrawRiskGroup): WithdrawRiskGroupPayload {
  return {
    level_ids: group.level_ids,
    label_ids: group.label_ids,
    rules: normalizeGlobalRules(group.rules)
  }
}

export function groupsFromPayload(groups: WithdrawRiskGroupPayload[]): WithdrawRiskGroup[] {
  return groups.map((group, index) => ({
    id: -(index + 1),
    level_ids: group.level_ids,
    label_ids: group.label_ids,
    rules: normalizeGlobalRules(group.rules)
  }))
}

export type GroupExcludedSelection = {
  levelIds: number[]
  labelIds: number[]
}

export function buildExcludedByGroupId(groups: WithdrawRiskGroup[]): Map<number, GroupExcludedSelection> {
  const result = new Map<number, GroupExcludedSelection>()

  for (const current of groups) {
    const levelIds: number[] = []
    const labelIds: number[] = []

    for (const group of groups) {
      if (group.id === current.id) continue
      levelIds.push(...group.level_ids)
      labelIds.push(...group.label_ids)
    }

    result.set(current.id, { levelIds, labelIds })
  }

  return result
}

export function hasGroupLevelOrTag(group: WithdrawRiskGroup) {
  return group.level_ids.length > 0 || group.label_ids.length > 0
}

export function hasGroupConditions(group: WithdrawRiskGroup) {
  return riskConditionKeysFromItem(group.rules).length > 0
}

export function isGroupRowComplete(group: WithdrawRiskGroup) {
  return hasGroupLevelOrTag(group) && hasGroupConditions(group) && !isAmountThresholdInvalid(group.rules)
}

export function areGroupsValid(groups: WithdrawRiskGroup[]) {
  return groups.every(isGroupRowComplete)
}

export function isGroupFieldInvalid(
  group: WithdrawRiskGroup,
  field: "levelAndTag" | "conditions",
  additionalConfigEnabled: boolean
) {
  if (!additionalConfigEnabled) return false

  const hasLevelOrTag = hasGroupLevelOrTag(group)
  const hasConditions = hasGroupConditions(group)

  if (isGroupRowComplete(group)) return false

  if (field === "levelAndTag") {
    return !hasLevelOrTag
  }

  return !hasConditions
}
