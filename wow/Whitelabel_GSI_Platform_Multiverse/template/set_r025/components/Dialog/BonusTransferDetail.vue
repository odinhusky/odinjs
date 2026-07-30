<template>
  <q-dialog v-model="dialog" persistent transition-show="fade" transition-hide="fade">
    <q-card class="bonus-transfer-dialog" :class="{ h5: isMobile }">
      <q-card-section class="bonus-transfer-header">
        <h3 class="bonus-transfer-title">{{ $t("cash.transferOutBonusWallet") }}</h3>
        <q-btn class="bonus-transfer-close" flat round dense icon="close" @click="closeDialog" />
      </q-card-section>

      <q-card-section class="bonus-transfer-body">
        <div v-if="isLoading" class="bonus-transfer-loading">
          <q-spinner size="32px" color="primary" />
        </div>

        <template v-else-if="bonusTransferStatus">
          <div class="bonus-transfer-summary">
            <div class="summary-card">
              <span class="summary-card__icon">
                <span class="summary-card__icon-mask" :style="getBonusTransferIconStyle('bonusTransferBalance')"></span>
              </span>
              <span class="summary-card__content">
                <span class="summary-card__label">{{ $t("cash.bonusWalletBalance") }}</span>
                <span class="summary-card__amount">
                  <span class="summary-card__currency">{{ statusCurrencyCode }}</span>
                  {{ rewardWalletBalanceLabel }}
                </span>
              </span>
            </div>

            <div class="summary-card">
              <span class="summary-card__icon">
                <span class="summary-card__icon-mask" :style="getBonusTransferIconStyle('bonusTransferMax')"></span>
              </span>
              <span class="summary-card__content">
                <span class="summary-card__label">{{ $t("cash.maxTransferableAmount") }}</span>
                <span class="summary-card__amount">
                  <span class="summary-card__currency">{{ statusCurrencyCode }}</span>
                  {{ maxTransferAmountLabel }}
                </span>
              </span>
            </div>
          </div>

          <div class="bonus-progress-panel">
            <div class="bonus-progress-panel__title">{{ $t("cash.completeTasksToTransfer") }}</div>
            <div class="bonus-progress-panel__main">
              <img class="bonus-progress-panel__gift" :src="pngIcon('bonusTransferGift')" alt="" />
              <div class="bonus-progress-panel__content">
                <div class="bonus-progress-panel__status">
                  <span class="bonus-progress-panel__label">{{ $t("cash.overallProgress") }}</span>
                  <span class="bonus-progress-panel__count">
                    <strong>{{ passedConditionCount }}</strong>
                    / {{ totalConditionCount }}
                  </span>
                  <div class="bonus-progress-track">
                    <div class="bonus-progress-track__fill" :style="{ width: `${overallProgress}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              class="bonus-transfer-all-btn"
              :disabled="!canTransferAll"
              @click.stop.prevent="handleTransferAll"
            >
              <q-spinner v-if="isTransferring" size="16px" color="white" />
              <span v-else>{{ $t("cash.transferAllToCashWallet") }}</span>
            </button>
          </div>

          <div class="bonus-condition-list">
            <div
              v-for="condition in conditionRows"
              :key="condition.key"
              class="bonus-condition-row"
              :class="{ 'bonus-condition-row--passed': condition.passed }"
            >
              <span class="bonus-condition-row__icon">
                <span
                  class="bonus-condition-row__icon-mask"
                  :style="getBonusTransferIconStyle(condition.iconName)"
                ></span>
              </span>

              <span class="bonus-condition-row__content">
                <span class="bonus-condition-row__title">
                  <template v-if="condition.labelKey">{{ $t(condition.labelKey) }}</template>
                  <template v-else>{{ condition.label }}</template>
                </span>
                <span class="bonus-condition-row__progress-text">
                  <strong>{{ condition.currentLabel }}</strong>
                  / {{ condition.requiredLabel }}
                </span>
                <span class="condition-progress-track">
                  <span class="condition-progress-track__fill" :style="{ width: `${condition.progress}%` }"></span>
                </span>
                <span class="bonus-condition-row__status">
                  <template v-if="condition.passed">{{ $t("cash.achieved") }}</template>
                  <template v-else-if="condition.statusType === 'vip_custom'">
                    <i18n-t keypath="bonus_vip_custom_status" tag="span">
                      <template #vip>
                        <span class="bonus-condition-row__remaining-label">{{ condition.remainingLabel }}</span>
                      </template>
                    </i18n-t>
                  </template>
                  <template v-else-if="condition.statusType === 'first_deposit_custom'">
                    <i18n-t keypath="bonus_first_deposit_custom_status" tag="span">
                      <template #first_deposit>
                        <span class="bonus-condition-row__remaining-label">{{ $t(condition.labelKey) }}</span>
                      </template>
                    </i18n-t>
                  </template>
                  <template v-else-if="condition.statusType === 'kyc_custom'">
                    <i18n-t keypath="bonus_kyc_custom_status" tag="span">
                      <template #kyc>
                        <span class="bonus-condition-row__remaining-label">{{ $t(condition.labelKey) }}</span>
                      </template>
                    </i18n-t>
                  </template>
                  <template v-else-if="condition.statusType === 'complete_more'">
                    <i18n-t keypath="cash.completeMoreToAchieve" tag="span">
                      <template #amount>
                        <span class="bonus-condition-row__remaining-label">{{ condition.remainingLabel }}</span>
                      </template>
                    </i18n-t>
                  </template>
                </span>
              </span>

              <q-btn
                v-if="!condition.passed && condition.routeName"
                class="bonus-condition-row__action"
                flat
                no-caps
                :ripple="false"
                @click.stop.prevent="goToConditionRoute(condition.routeName)"
              >
                {{ $t("common.btn.go") }}
              </q-btn>
              <span v-else-if="condition.passed" class="bonus-condition-row__check">
                <q-icon name="check" />
              </span>
            </div>
          </div>

          <div class="bonus-transfer-description">
            <div class="bonus-transfer-description__title">
              <q-icon name="info" />
              <span>{{ $t("cash.taskDescription") }}</span>
            </div>
            <ul class="bonus-transfer-description__list">
              <li>• {{ $t("cash.transferAmountLimit") }}</li>
              <li>• {{ $t("cash.transferSuccessDescription") }}</li>
              <li>• {{ $t("cash.bonusBalanceReset") }}</li>
            </ul>
          </div>

          <div class="bonus-transfer-notice">
            <q-icon name="info" />
            <i18n-t keypath="cash.maxTransferAvailableMessage" tag="span" class="bonus-transfer-notice__message">
              <template #amount>
                <span class="bonus-transfer-notice__amount">{{ maxTransferAmountLabel }}</span>
              </template>
              <template #currency>&nbsp;{{ statusCurrencyCode }}</template>
            </i18n-t>
          </div>
        </template>

        <div v-else class="bonus-transfer-empty">{{ $t("tableHeader.no_data") }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_r025/hooks/useSiteImg"
import { Notify } from "quasar"
import type * as Response from "src/api/response.type"
import * as settingApi from "src/api/setting"
import * as userInfoApi from "src/api/userInfo"
import * as vipApi from "src/api/vip"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useApi } from "src/common/hooks/useApi"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { parseBonusWalletTransferRule } from "src/common/utils/bonusWalletTransferRule"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, ref, toRef } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

type ConditionRouteName = "home" | "MemberDeposit" | "MemberVip" | "memberProfile" | "ReferralRebate"
type ConditionStatusType = "complete_more" | "first_deposit_custom" | "kyc_custom" | "vip_custom"
type VisibleBonusTransferConditionCode =
  | "active_downline"
  | "first_deposit"
  | "history_deposit"
  | "kyc"
  | "turnover_or_balance"
  | "vip"

type ConditionConfig = {
  aliases: string[]
  code: VisibleBonusTransferConditionCode
  iconName: string
  labelKey: string
  routeName: ConditionRouteName
}

type BonusConditionRow = {
  key: string
  currentLabel: string | number
  iconName: string
  iconUsesTemplateColor: boolean
  label: string
  labelKey: string
  passed: boolean
  progress: number
  remainingLabel: string | number
  requiredLabel: string | number
  routeName: ConditionRouteName | null
  statusType: ConditionStatusType
}

const conditionConfigs: ConditionConfig[] = [
  {
    aliases: ["turnover_or_balance"],
    code: "turnover_or_balance",
    iconName: "bonusTransferWaterDrop",
    labelKey: "cash.remainingTurnover",
    routeName: "home",
  },
  {
    aliases: ["first_deposit"],
    code: "first_deposit",
    iconName: "bonusTransferChart",
    labelKey: "cash.first_deposit",
    routeName: "MemberDeposit",
  },
  {
    aliases: ["history_deposit"],
    code: "history_deposit",
    iconName: "bonusTransferWallet",
    labelKey: "cash.totalDeposits",
    routeName: "MemberDeposit",
  },
  {
    aliases: ["vip"],
    code: "vip",
    iconName: "vip",
    labelKey: "menu.vip",
    routeName: "MemberVip",
  },
  {
    aliases: ["kyc"],
    code: "kyc",
    iconName: "bonusTransferGuard",
    labelKey: "menu.getVerify",
    routeName: "memberProfile",
  },
  {
    aliases: ["active_downline"],
    code: "active_downline",
    iconName: "bonusTransferAvatar",
    labelKey: "cash.referralCount",
    routeName: "ReferralRebate",
  },
]

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "padXl")
const eventbus = injectStrict(EventBusKey)
const router = useRouter()
const { pngIcon, svgIcon } = useSiteImg()
const { moneyFormat } = useCommon()
const { nowLang } = useLanguage()
const { activeWalletCurrencyId, getUserWalletList, userWalletList } = useUserInfo()
const { t } = useI18n()

const getBonusTransferIconStyle = (iconName: string): Record<string, string> => {
  return {
    "--bonus-transfer-icon-url": `url("${svgIcon(iconName)}")`,
  }
}

const dialog = ref(false)
const isLoading = ref(false)
const isTransferring = ref(false)
const bonusTransferStatus = ref<Response.BonusTransferStatus | null>(null)
const bonusWalletTransferRule = ref<Response.BonusWalletTransferRule | null>(null)
const vipLevelList = ref<Response.MemberLevelist>([])
const isVipLevelListReady = ref(false)

const statusCurrencyCode = computed((): string => {
  if (!bonusTransferStatus.value) return ""

  const matchedWallet = userWalletList.value.find<Response.UserWallet>(
    (wallet: Response.UserWallet) => wallet.currency_id === bonusTransferStatus.value?.currency_id
  )
  return matchedWallet?.currency_code || ""
})

const rewardWalletBalanceLabel = computed((): string | number => {
  return moneyFormat(bonusTransferStatus.value?.reward_wallet_balance || 0)
})

const maxTransferAmountLabel = computed((): string | number => {
  return moneyFormat(bonusTransferStatus.value?.max_transfer_amount || 0)
})

const normalizeAmount = (amount: Response.BonusTransferAmount | null | undefined): number => {
  const numericAmount = Number(amount)

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return 0

  return numericAmount
}

const transferAmount = computed((): number => {
  if (!bonusTransferStatus.value) return 0

  return Math.min(
    normalizeAmount(bonusTransferStatus.value.reward_wallet_balance),
    normalizeAmount(bonusTransferStatus.value.max_transfer_amount)
  )
})

const canTransferAll = computed((): boolean => {
  if (!bonusTransferStatus.value || isTransferring.value) return false

  return bonusTransferStatus.value.enabled && bonusTransferStatus.value.eligible && transferAmount.value > 0
})

const normalizeConditionCode = (code: string): string => {
  return code
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase()
}

const getConditionConfig = (code: string): ConditionConfig | null => {
  const normalizedCode = normalizeConditionCode(code)
  return conditionConfigs.find((config) => config.aliases.includes(normalizedCode)) || null
}

type ConditionMetric = {
  currentLabel: string | number
  currentValue: number
  progress: number
  remainingLabel: string | number
  requiredLabel: string | number
  requiredValue: number
  statusType: ConditionStatusType
}

const getConfiguredConditionCodes = (
  rule: Response.BonusWalletTransferRule | null
): VisibleBonusTransferConditionCode[] => {
  if (!rule || !rule.enabled) return []

  const conditionCodes: VisibleBonusTransferConditionCode[] = ["turnover_or_balance"]

  if (rule.first_deposit_required) {
    conditionCodes.push("first_deposit")
  }

  if (Array.isArray(rule.history_deposit_thresholds) && rule.history_deposit_thresholds.length > 0) {
    conditionCodes.push("history_deposit")
  }

  if (rule.min_vip_level > 0) {
    conditionCodes.push("vip")
  }

  if (rule.kyc_required) {
    conditionCodes.push("kyc")
  }

  if (rule.active_downline?.enabled) {
    conditionCodes.push("active_downline")
  }

  return conditionCodes
}

const configuredConditionCodes = computed((): VisibleBonusTransferConditionCode[] => {
  return getConfiguredConditionCodes(bonusWalletTransferRule.value)
})

const getStatusCondition = (code: VisibleBonusTransferConditionCode): Response.BonusTransferCondition | null => {
  return (
    (bonusTransferStatus.value?.conditions || []).find((condition) => {
      return condition.enabled && normalizeConditionCode(condition.code) === code
    }) || null
  )
}

const bonusTransferConditions = computed((): Response.BonusTransferCondition[] => {
  return configuredConditionCodes.value
    .map((code) => getStatusCondition(code))
    .filter((condition): condition is Response.BonusTransferCondition => condition !== null)
})

const totalConditionCount = computed((): number => bonusTransferConditions.value.length)
const passedConditionCount = computed((): number => {
  return bonusTransferConditions.value.filter((condition) => condition.passed).length
})

const overallProgress = computed((): number => {
  if (totalConditionCount.value <= 0) return 0
  return Math.min((passedConditionCount.value / totalConditionCount.value) * 100, 100)
})

const getConditionProgress = (currentValue: number, requiredValue: number, passed: boolean): number => {
  if (passed) return 100
  if (requiredValue <= 0) return 0
  return Math.min((currentValue / requiredValue) * 100, 100)
}

const getRemainingValue = (currentValue: number, requiredValue: number): number => {
  return Math.max(requiredValue - currentValue, 0)
}

const toNumber = (value: Response.BonusTransferConditionValue | undefined): number => {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : 0
}

const getNumberField = (record: Response.BonusTransferConditionRecord | null | undefined, key: string): number => {
  return toNumber(record?.[key])
}

const getStringField = (record: Response.BonusTransferConditionRecord | null | undefined, key: string): string => {
  const value = record?.[key]

  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return ""
}

const isTurnoverComparisonMode = (condition: Response.BonusTransferCondition): boolean => {
  return getStringField(condition.current, "comparison_mode") === "turnover"
}

const isTurnoverEligibilityMode = (rule: Response.BonusWalletTransferRule | null): boolean => {
  return Boolean(rule?.enabled && rule.eligibility_mode === "turnover")
}

const getTurnoverOrBalanceLabelKey = (
  condition: Response.BonusTransferCondition,
  rule: Response.BonusWalletTransferRule | null
): string => {
  if (isTurnoverComparisonMode(condition) && isTurnoverEligibilityMode(rule)) return "cash.remainingTurnover"

  return "cash.balanceThreshold"
}

const getConditionLabelKey = (
  condition: Response.BonusTransferCondition,
  conditionConfig: ConditionConfig | null,
  rule: Response.BonusWalletTransferRule | null
): string => {
  if (normalizeConditionCode(condition.code) === "turnover_or_balance") {
    return getTurnoverOrBalanceLabelKey(condition, rule)
  }

  return conditionConfig?.labelKey || ""
}

const isConditionRecord = (
  value: Response.BonusTransferConditionValue | undefined
): value is Response.BonusTransferConditionRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const createAmountMetric = (
  currentValue: number,
  requiredValue: number,
  remainingValue: number,
  passed: boolean
): ConditionMetric => {
  return {
    currentLabel: moneyFormat(currentValue),
    currentValue,
    progress: getConditionProgress(currentValue, requiredValue, passed),
    remainingLabel: moneyFormat(remainingValue),
    requiredLabel: moneyFormat(requiredValue),
    requiredValue,
    statusType: "complete_more",
  }
}

const createCountMetric = (
  currentValue: number,
  requiredValue: number,
  remainingLabel: string | number,
  passed: boolean,
  statusType: ConditionStatusType
): ConditionMetric => {
  return {
    currentLabel: currentValue,
    currentValue,
    progress: getConditionProgress(currentValue, requiredValue, passed),
    remainingLabel,
    requiredLabel: requiredValue,
    requiredValue,
    statusType,
  }
}

const getVipLevelItem = (levelId: number): Response.MemberLevelItem => {
  const matchedLevel = vipLevelList.value.find((level) => level.id === levelId)

  if (!matchedLevel) {
    const availableLevelIds = vipLevelList.value.map((level) => level.id).join(", ")
    throw new Error(
      `Missing VIP level mapping for bonus transfer: levelId=${levelId}, availableLevelIds=${availableLevelIds}`
    )
  }

  return matchedLevel
}

const getVipLevelTitle = (level: Response.MemberLevelItem): string => {
  const titles = level.titles as Record<string, string | undefined>
  const title = titles[nowLang.value]

  if (!title) {
    throw new Error(`Missing VIP level title for bonus transfer: levelId=${level.id}, language=${nowLang.value}`)
  }

  return title
}

const getTurnoverOrBalanceMetric = (condition: Response.BonusTransferCondition): ConditionMetric => {
  const comparisonMode = getStringField(condition.current, "comparison_mode")
  const isBalanceMode = comparisonMode === "balance"
  const currentValue = isBalanceMode
    ? getNumberField(condition.current, "balance")
    : getNumberField(condition.current, "turnover")
  const requiredValue = isBalanceMode
    ? getNumberField(condition.current, "remaining_threshold") ||
      getNumberField(condition.required, "balance_gte_remaining_threshold")
    : getNumberField(condition.current, "audit_turnover")
  const remainingValue = isBalanceMode
    ? getRemainingValue(currentValue, requiredValue)
    : getNumberField(condition.current, "remaining_threshold") || getRemainingValue(currentValue, requiredValue)

  return createAmountMetric(currentValue, requiredValue, remainingValue, condition.passed)
}

const getFirstDepositMetric = (condition: Response.BonusTransferCondition): ConditionMetric => {
  const hasFirstDeposit =
    condition.passed ||
    Boolean(getStringField(condition.current, "first_deposit_at")) ||
    getNumberField(condition.current, "first_deposit_id") > 0
  const currentValue = hasFirstDeposit ? 1 : 0
  const requiredValue = 1

  return createCountMetric(currentValue, requiredValue, 0, condition.passed, "first_deposit_custom")
}

const getHistoryDepositMetric = (condition: Response.BonusTransferCondition): ConditionMetric => {
  const currentValue = getNumberField(condition.current, "total_deposit")
  const requiredValue = getNumberField(condition.required, "minimum_total_deposit")

  return createAmountMetric(
    currentValue,
    requiredValue,
    getRemainingValue(currentValue, requiredValue),
    condition.passed
  )
}

const getVipMetric = (condition: Response.BonusTransferCondition): ConditionMetric => {
  const currentLevel = getVipLevelItem(getNumberField(condition.current, "member_level"))
  const requiredLevel = getVipLevelItem(getNumberField(condition.required, "min_vip_level"))
  const currentValue = currentLevel.level
  const requiredValue = requiredLevel.level
  const requiredLabel = getVipLevelTitle(requiredLevel)

  return {
    currentLabel: getVipLevelTitle(currentLevel),
    currentValue,
    progress: getConditionProgress(currentValue, requiredValue, condition.passed),
    remainingLabel: requiredLabel,
    requiredLabel,
    requiredValue,
    statusType: "vip_custom",
  }
}

const getKycMetric = (condition: Response.BonusTransferCondition): ConditionMetric => {
  const currentLabel = getStringField(condition.current, "approval_status") || "-"
  const requiredLabel = getStringField(condition.required, "approval_status") || "verified"
  const currentValue = condition.passed ? 1 : 0
  const requiredValue = 1

  return {
    currentLabel,
    currentValue,
    progress: getConditionProgress(currentValue, requiredValue, condition.passed),
    remainingLabel: 0,
    requiredLabel,
    requiredValue,
    statusType: "kyc_custom",
  }
}

const getActiveDownlineMetric = (condition: Response.BonusTransferCondition): ConditionMetric => {
  const countsValue = condition.current?.counts
  const countRecords = Array.isArray(countsValue) ? countsValue.filter(isConditionRecord) : []
  const matchedCount =
    countRecords.find((countRecord) => {
      return getNumberField(countRecord, "currency_id") === bonusTransferStatus.value?.currency_id
    }) || countRecords[0]
  const currentValue = getNumberField(matchedCount, "active_count")
  const requiredValue = getNumberField(condition.required, "min_count")

  return createCountMetric(
    currentValue,
    requiredValue,
    getRemainingValue(currentValue, requiredValue),
    condition.passed,
    "complete_more"
  )
}

const getConditionMetric = (condition: Response.BonusTransferCondition): ConditionMetric => {
  const normalizedCode = normalizeConditionCode(condition.code)

  if (normalizedCode === "turnover_or_balance") return getTurnoverOrBalanceMetric(condition)
  if (normalizedCode === "first_deposit") return getFirstDepositMetric(condition)
  if (normalizedCode === "history_deposit") return getHistoryDepositMetric(condition)
  if (normalizedCode === "vip") return getVipMetric(condition)
  if (normalizedCode === "kyc") return getKycMetric(condition)
  if (normalizedCode === "active_downline") return getActiveDownlineMetric(condition)

  return createCountMetric(condition.passed ? 1 : 0, 1, condition.passed ? 0 : 1, condition.passed, "complete_more")
}

const conditionRows = computed<BonusConditionRow[]>(() => {
  if (!bonusTransferStatus.value) return []

  const conditions = bonusTransferConditions.value
  const hasVipCondition = conditions.some((condition) => normalizeConditionCode(condition.code) === "vip")

  if (hasVipCondition && !isVipLevelListReady.value) return []

  return conditions.map((condition, index) => {
    const conditionConfig = getConditionConfig(condition.code)
    const conditionMetric = getConditionMetric(condition)

    return {
      key: `${condition.code}-${index}`,
      currentLabel: conditionMetric.currentLabel,
      iconName: conditionConfig?.iconName || "bonusTransferChart",
      iconUsesTemplateColor: conditionConfig?.iconName === "vip",
      label: condition.code,
      labelKey: getConditionLabelKey(condition, conditionConfig, bonusWalletTransferRule.value),
      passed: condition.passed,
      progress: conditionMetric.progress,
      remainingLabel: conditionMetric.remainingLabel,
      requiredLabel: conditionMetric.requiredLabel,
      routeName: conditionConfig?.routeName || null,
      statusType: conditionMetric.statusType,
    }
  })
})

const setVipLevelList = async (): Promise<Response.MemberLevelist> => {
  const { status, data, code, msg } = await useApi(vipApi.getVipList)

  if (!status) {
    throw new Error(`Failed to fetch VIP levels for bonus transfer: code=${code}, msg=${msg || ""}`)
  }

  vipLevelList.value = data
  isVipLevelListReady.value = true
  return data
}

const setBonusTransferStatus = async (currencyId: number): Promise<Response.BonusTransferStatus | null> => {
  const { status, data } = await useApi(userInfoApi.getBonusTransferStatus, { currency_id: currencyId })
  const transferStatus = status ? data : null
  bonusTransferStatus.value = transferStatus
  return transferStatus
}

const setBonusWalletTransferRule = async (): Promise<Response.BonusWalletTransferRule | null> => {
  const { status, data } = await useApi(settingApi.getSetting)
  const transferRule = status ? parseBonusWalletTransferRule(data.bonus_wallet_transfer_rule) : null
  bonusWalletTransferRule.value = transferRule
  return transferRule
}

const setBonusTransferData = async (currencyId: number): Promise<Response.BonusTransferStatus | null> => {
  isVipLevelListReady.value = false

  const [transferStatus, transferRule] = await Promise.all([
    setBonusTransferStatus(currencyId),
    setBonusWalletTransferRule(),
  ])

  if (getConfiguredConditionCodes(transferRule).includes("vip")) {
    await setVipLevelList()
    return transferStatus
  }

  vipLevelList.value = []
  isVipLevelListReady.value = false
  return transferStatus
}

const fetchBonusTransferStatus = async (currencyId: number): Promise<Response.BonusTransferStatus | null> => {
  if (currencyId <= 0) {
    isLoading.value = false
    bonusTransferStatus.value = null
    bonusWalletTransferRule.value = null
    vipLevelList.value = []
    isVipLevelListReady.value = false
    return null
  }

  isLoading.value = true

  try {
    return await setBonusTransferData(currencyId)
  } finally {
    isLoading.value = false
  }
}

const closeDialog = (): void => {
  dialog.value = false
  bonusTransferStatus.value = null
  bonusWalletTransferRule.value = null
  vipLevelList.value = []
  isVipLevelListReady.value = false
}

const showTransferSuccessNotify = (): void => {
  Notify.create({
    type: "positive",
    position: "top",
    message: t("cash.bonusTransferSuccessHistory"),
    timeout: 1000,
  })
}

const showIncompleteTaskNotify = (): void => {
  Notify.create({
    type: "negative",
    position: "top",
    message: t("cash.bonusTransferFailedIncompleteTask"),
    icon: "warning",
    timeout: 1000,
  })
}

const showBlockedLabelNotify = (): void => {
  Notify.create({
    type: "negative",
    position: "top",
    message: t("cash.bonusTransferFailedBlockedLabel"),
    icon: "warning",
    timeout: 1000,
  })
}

const showTransferFailedNotify = (code: number): void => {
  Notify.create({
    type: "negative",
    position: "top",
    message: t("cash.bonusTransferFailedContactSupport", { code }),
    icon: "warning",
    timeout: 1000,
  })
}

const hasIncompleteTransferTasks = (status: Response.BonusTransferStatus | null): boolean => {
  if (!status) return false

  return !status.eligible
}

const hasBlockedLabelTransferBlock = (status: Response.BonusTransferStatus | null): boolean => {
  if (!status) return false

  return (status.conditions || []).some((condition) => {
    return normalizeConditionCode(condition.code) === "blocked_label" && condition.enabled && !condition.passed
  })
}

const handleTransferAll = async (): Promise<void> => {
  if (!bonusTransferStatus.value || !canTransferAll.value) return

  isTransferring.value = true
  const currencyId = bonusTransferStatus.value.currency_id

  try {
    const response = await userInfoApi.postBonusTransferFullResponse({
      currency_id: currencyId,
      amount: transferAmount.value,
    })

    if (response.status) {
      await getUserWalletList()
      await setBonusTransferStatus(currencyId)
      showTransferSuccessNotify()
      return
    }

    const latestStatus = await setBonusTransferStatus(currencyId)

    if (hasBlockedLabelTransferBlock(latestStatus)) {
      showBlockedLabelNotify()
      return
    }

    if (hasIncompleteTransferTasks(latestStatus)) {
      showIncompleteTaskNotify()
      return
    }

    showTransferFailedNotify(response.code)
  } finally {
    isTransferring.value = false
  }
}

const goToConditionRoute = async (routeName: ConditionRouteName): Promise<void> => {
  closeDialog()
  await router.push({ name: routeName })
}

onMounted(() => {
  eventbus.on("openBonusTransferDetail", (show: boolean, currencyId?: number) => {
    if (show) {
      const targetCurrencyId = currencyId || activeWalletCurrencyId.value
      dialog.value = true
      void fetchBonusTransferStatus(targetCurrencyId)
      return
    }

    closeDialog()
  })
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r025/assets/css/_variable.sass";

.bonus-transfer-dialog {
  display: flex;
  flex-direction: column;
  width: min(539px, calc(100vw - 16px));
  max-width: min(539px, calc(100vw - 16px)) !important;
  // max-height: min(758px, calc(100vh - 16px));
  overflow: hidden;
  border-radius: 8px;
  background: $secondary-card;
  box-shadow: 0 8px 24px #00000024;
  color: #6b7280;
  font-family: "Noto Sans TC", sans-serif;
}

.bonus-transfer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  padding: 20px 20px 0px;
}

.bonus-transfer-title {
  margin: 0;
  color: $neutral-01;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.25;
}

.bonus-transfer-close {
  width: 13px;
  height: 13px;
  color: $neutral-01;

  :deep(.q-icon) {
    font-size: 20px;
  }
}

.bonus-transfer-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 14px 20px 18px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.bonus-transfer-loading,
.bonus-transfer-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  color: #7a7a7a;
  font-size: 14px;
  font-weight: 700;
}

.bonus-transfer-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  overflow: hidden;
  border-radius: 8px;
  background: $secondary-card-light;
}

.summary-card {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 56px;
  gap: 8px;
  padding: 11px 16px;
}

.summary-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 36px;
  position: relative;
  width: 36px;
  height: 36px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 1px solid $primany-02;
  background: #03032366;
}

.summary-card__icon-mask {
  position: relative;
  z-index: 1;
  width: 30px;
  height: 30px;
  background: linear-gradient(180deg, $primany-02 0%, $secondary-btn-hover 100%);
  mask-image: var(--bonus-transfer-icon-url);
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
  -webkit-mask-image: var(--bonus-transfer-icon-url);
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
}

.summary-card__content {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 4px;
}

.summary-card__label {
  overflow: hidden;
  color: $neutral-02;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-card__amount {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
  color: $neutral-01;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.summary-card__currency {
  flex: 0 0 auto;
  min-width: 39px;
  padding: 4px 7px;
  border-radius: 12px;
  background: $neutral-04;
  color: $neutral-01;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
}

.bonus-progress-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  position: relative;
  gap: 10px;
  margin-top: 15px;
  padding: 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: linear-gradient(90deg, $secondary-card-secondary 0%, rgba($neutral-10, 0.6) 100%);

  &::before {
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: inherit;
    background: linear-gradient(
      134.58deg,
      rgba(210, 210, 210, 0.06) -25.17%,
      rgba($primany-02, 0.6) -0.77%,
      rgba(210, 210, 210, 0.06) 67.58%,
      rgba($primany-02, 0.6) 102.59%
    );
    content: "";
    mask: linear-gradient(#ffffff 0 0) content-box, linear-gradient(#ffffff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    -webkit-mask: linear-gradient(#ffffff 0 0) content-box, linear-gradient(#ffffff 0 0);
    -webkit-mask-composite: xor;
  }
}

.bonus-progress-panel__gift {
  width: 89px;
  height: 78px;
  object-fit: contain;
}

.bonus-progress-panel__main {
  display: grid;
  grid-template-columns: 89px minmax(0, 1fr);
  align-items: center;
  min-width: 0;
  min-height: 63px;
  gap: 15px;
}

.bonus-progress-panel__content {
  display: grid;
  grid-template-columns: minmax(0, 120px) minmax(0, 1fr);
  align-items: center;
  min-width: 0;
  column-gap: 10px;
  row-gap: 11px;
}

.bonus-progress-panel__title {
  grid-column: 1 / -1;
  color: $neutral-01;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.bonus-progress-panel__status {
  display: grid;
  grid-template-columns: minmax(0, 120px) minmax(0, 1fr);
  align-items: center;
  grid-column: 1 / -1;
  min-width: 0;
  column-gap: 14px;
  row-gap: 2px;
}

.bonus-progress-panel__label {
  color: $neutral-02;
  font-size: 12px;
  line-height: 1.1;
}

.bonus-progress-panel__count {
  grid-row: 2;
  color: $neutral-01;
  font-size: 21px;
  font-weight: 600;
  line-height: 1.1;

  strong {
    color: $primany-02;
    font-size: 22px;
    font-weight: 900;
  }
}

.bonus-progress-track {
  position: relative;
  grid-column: 2;
  grid-row: 1 / span 2;
  height: 12px;
  overflow: hidden;
  border-radius: 10px;
  background: var(--bg-14, #ffffff1a);
}

.bonus-progress-track__fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(180deg, $primany-02 0%, $secondary-btn-hover 100%);
}

.bonus-transfer-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 35px;
  border-radius: 8px;
  background: rgba($neutral-10, 0.45);
  color: $neutral-01;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.2;

  &:disabled {
    opacity: 1 !important;
    cursor: not-allowed;
  }
}

.bonus-condition-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
}

.bonus-condition-row {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 63px;
  gap: 14px;
  padding: 8px 13px 8px 14px;
  border-radius: 8px;
  background: $secondary-card-secondary;
  border: 1px solid $functional-line;
}

.bonus-condition-row__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 32px;
  position: relative;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid $primany-02;
  background: #03032366;

  img {
    position: relative;
    z-index: 1;
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
}

.bonus-condition-row__icon-mask {
  position: relative;
  z-index: 1;
  width: 20px;
  height: 20px;
  background: linear-gradient(180deg, $primany-02 0%, $secondary-btn-hover 100%);
  mask-image: var(--bonus-transfer-icon-url);
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
  -webkit-mask-image: var(--bonus-transfer-icon-url);
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
}

.bonus-condition-row__content {
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: minmax(0, 1fr) auto;
  min-width: 0;
  column-gap: 8px;
  cursor: pointer !important;
  row-gap: 4px;
}

.bonus-condition-row__title {
  overflow: hidden;
  color: $neutral-01;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bonus-condition-row__progress-text {
  color: $neutral-02;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  text-align: right;
  white-space: nowrap;

  strong {
    color: $primany-02;
    font-weight: 600;
  }
}

.condition-progress-track {
  grid-column: 1 / -1;
  height: 7px;
  overflow: hidden;
  border-radius: 7px;
  background: $neutral-04;
}

.condition-progress-track__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(180deg, $primany-02 0%, $secondary-btn-hover 100%);
}

.bonus-condition-row__status {
  grid-column: 1 / -1;
  overflow: hidden;
  color: $neutral-02;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
}

.bonus-condition-row__remaining-label {
  color: $semantic-error;
}

.bonus-condition-row__status--danger {
  color: $semantic-error;
}

.bonus-condition-row__action {
  flex: 0 0 56px;
  width: 56px;
  min-height: 38px;
  padding: 12px;
  border-radius: 12px;
  background: $primany-01;
  color: $neutral-01;
  font-size: 14px;
  font-weight: 400;
}

.bonus-condition-row__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3ecc31;
  color: $secondary-card-secondary;

  :deep(.q-icon) {
    font-size: 15px;
  }
}

.bonus-condition-row--passed {
  .bonus-condition-row__progress-text strong,
  .bonus-condition-row__status {
    color: #3ecc31;
  }
}

.bonus-transfer-description {
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 8px;
  background: $neutral-04;
  border: 1px solid $functional-line;
}

.bonus-transfer-description__title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: $neutral-01;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;

  :deep(.q-icon) {
    font-size: 16px;
  }
}

.bonus-transfer-description__list {
  margin: 9px 0 0;
  padding-left: 25px;
  font-size: 14px;
  color: $neutral-01;
  line-height: 1.45;
}

.bonus-transfer-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  gap: 7px;
  padding: 14px 4px 0;
  color: $neutral-01;
  font-size: 14px;
  font-weight: 400;
  text-align: center;

  :deep(.q-icon) {
    flex: 0 0 auto;
    color: $primany-02;
    font-size: 15px;
  }

  span {
    min-width: 0;
  }
}

.bonus-transfer-notice__amount {
  color: $primany-02;
}

@media (max-width: 430px) {
  .bonus-transfer-dialog {
    width: min(414px, calc(100vw - 8px));
    max-width: min(414px, calc(100vw - 8px)) !important;
  }

  .bonus-transfer-header {
    padding: 16px 16px 8px;
  }

  .bonus-transfer-title {
    font-size: 20px;
  }

  .bonus-transfer-body {
    padding: 12px 16px 16px;
  }

  .summary-card {
    gap: 6px;
    padding: 10px 9px;
  }

  .summary-card__amount {
    gap: 6px;
    font-size: 15px;
  }

  .bonus-progress-panel {
    gap: 10px;
    padding: 12px 10px 10px;
  }

  .bonus-progress-panel__main {
    grid-template-columns: 70px minmax(0, 1fr);
    gap: 10px;
  }

  .bonus-progress-panel__gift {
    width: 70px;
    height: 68px;
  }

  .bonus-progress-panel__content,
  .bonus-progress-panel__status {
    grid-template-columns: minmax(0, 62px) minmax(0, 1fr);
    column-gap: 8px;
  }

  .bonus-condition-row {
    gap: 10px;
    padding: 8px 10px;
  }

  .bonus-condition-row__content {
    grid-template-columns: minmax(0, 1fr);
  }

  .bonus-condition-row__progress-text {
    text-align: left;
  }

  .bonus-condition-row__action {
    flex-basis: 56px;
    width: 56px;
  }
}
</style>
