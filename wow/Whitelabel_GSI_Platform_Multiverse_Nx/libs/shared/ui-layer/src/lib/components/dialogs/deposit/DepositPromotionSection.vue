<script setup lang="ts">
import { useI18n } from "#imports"
import type {
  DepositPromotion,
  DepositPromotionDetailObject,
  DepositPromotionDetailValue
} from "@shared-lib/api/apiFunctions/bank_getDepositPromotionList"

interface Props {
  promotionList: DepositPromotion[]
  selectedPromotionId: number
  isPromoExpanded: boolean
  amount: string
}

const props = defineProps<Props>()
const { t, locale } = useI18n()

const emit = defineEmits<{
  (e: "toggle-expanded"): void
  (e: "select", id: number): void
}>()

const DETAIL_TEXT_FIELDS: Array<keyof DepositPromotionDetailObject> = [
  "title",
  "name",
  "content",
  "description",
  "text"
]

const normalizeLocale = (value: string): string => value.toLowerCase().replace("_", "-")

const getDetailValueText = (value: DepositPromotionDetailValue): string => {
  if (typeof value === "string") return value.trim()
  if (!value || typeof value !== "object") return ""

  const text = DETAIL_TEXT_FIELDS.map((field) => value[field]).find((fieldValue) => {
    return typeof fieldValue === "string" && fieldValue.trim().length > 0
  })

  return typeof text === "string" ? text.trim() : ""
}

const getAmountNumber = (value: string): number => {
  const amount = Number(String(value || "0").replace(/,/g, ""))
  return Number.isFinite(amount) ? amount : 0
}

const formatAmount = (value: number): string => {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 })
}

const getPromoCondition = (promo: DepositPromotion): number => {
  const condition = Number(promo.reward?.condition || 0)
  return Number.isFinite(condition) ? condition : 0
}

const isPromoEligible = (promo: DepositPromotion): boolean => {
  return getAmountNumber(props.amount) >= getPromoCondition(promo)
}

const getPromoRewardLabel = (promo: DepositPromotion): string => {
  const earned = Number(promo.reward?.reward_amount || 0)
  return Number.isFinite(earned) && earned > 0 ? formatAmount(earned) : ""
}

const getPromoTitle = (promo: DepositPromotion): string => {
  return String(promo.title || "").trim()
}

const getPromoGapLabel = (promo: DepositPromotion): string => {
  return formatAmount(Math.max(0, getPromoCondition(promo) - getAmountNumber(props.amount)))
}

const getLocalizedDetailText = (promo: DepositPromotion): string => {
  const entries = Object.entries(promo.details || {}).reduce<Array<[string, string]>>((result, [key, value]) => {
    const text = getDetailValueText(value)
    return text ? [...result, [key, text]] : result
  }, [])

  if (entries.length === 0) return ""

  const normalizedLocale = normalizeLocale(String(locale.value || ""))
  const exact = entries.find(([key]) => normalizeLocale(key) === normalizedLocale)?.[1]
  if (exact) return exact

  const prefix = normalizedLocale.split("-")[0]
  const partial = entries.find(([key]) => normalizeLocale(key).startsWith(prefix))?.[1]
  if (partial) return partial

  return entries[0][1]
}

const selectedPromotion = computed((): DepositPromotion | null => {
  return props.promotionList.find((promo) => promo.id === props.selectedPromotionId) || null
})

const selectedPromotionRewardLabel = computed((): string => {
  return selectedPromotion.value ? getPromoRewardLabel(selectedPromotion.value) : ""
})

const selectedPromotionText = computed((): string => {
  if (!selectedPromotion.value) return ""

  return selectedPromotionRewardLabel.value ? "" : getPromoTitle(selectedPromotion.value)
})
</script>

<template>
  <div v-if="props.promotionList.length > 0" :class="cx(FLEX_COL, 'gap-2 deposit-promotion-section')">
    <div class="deposit-promotion-section__title">{{ t("member.deposit.depositReward") }}</div>

    <BasePlainBtn
      type="button"
      :class="cx(FLEX_ITEMS_CENTER, 'deposit-promotion-summary')"
      @click="
        handleGlobalClick({
          target: 'depositPromoToggle',
          callback: () => emit('toggle-expanded')
        })
      "
    >
      <span v-if="selectedPromotionRewardLabel" class="deposit-promotion-summary__selected">
        <span class="deposit-promotion-summary__selected-label">{{ t("member.deposit.rewardTitle") }}&nbsp;</span>
        <span>{{ selectedPromotionRewardLabel }}</span>
      </span>
      <span v-else-if="selectedPromotionText" class="deposit-promotion-summary__selected">
        {{ selectedPromotionText }}
      </span>
      <span v-else class="deposit-promotion-summary__placeholder">{{ t("table_header.please_select") }}</span>
      <BaseIcon
        name="mdi:chevron-down"
        size="18px"
        class="deposit-promotion-summary__chevron"
        :class="props.isPromoExpanded ? 'rotate-180' : ''"
      />
    </BasePlainBtn>

    <div v-if="props.isPromoExpanded" class="deposit-promotion-list">
      <BasePlainBtn
        v-for="promo in props.promotionList"
        :key="promo.id"
        type="button"
        :class="
          cx(
            'deposit-promotion-card',
            props.selectedPromotionId === promo.id && 'deposit-promotion-card--active',
            !isPromoEligible(promo) && 'deposit-promotion-card--ineligible'
          )
        "
        @click="
          handleGlobalClick({
            target: `depositPromoSelect_${promo.id}`,
            payload: promo.id,
            callback: (id) => emit('select', Number(id))
          })
        "
      >
        <div
          :class="
            cx(
              'deposit-promotion-card__checkbox',
              props.selectedPromotionId === promo.id && 'deposit-promotion-card__checkbox--active'
            )
          "
        >
          <BaseIcon v-if="props.selectedPromotionId === promo.id" name="mdi:check" size="12px" class="text-white" />
        </div>

        <div class="deposit-promotion-card__content">
          <div v-if="getPromoTitle(promo)" class="deposit-promotion-card__title">{{ getPromoTitle(promo) }}</div>
          <ul
            :class="
              cx(
                'deposit-promotion-card__conditions',
                !getPromoTitle(promo) && 'deposit-promotion-card__conditions--without-title'
              )
            "
          >
            <li class="deposit-promotion-card__condition">· 存款滿 {{ formatAmount(getPromoCondition(promo)) }}</li>
            <li v-if="getLocalizedDetailText(promo)" class="deposit-promotion-card__condition">
              · {{ getLocalizedDetailText(promo) }}
            </li>
          </ul>
        </div>

        <div class="deposit-promotion-card__reward-box">
          <template v-if="isPromoEligible(promo)">
            <div v-if="getPromoRewardLabel(promo)" class="deposit-promotion-card__reward">
              {{ getPromoRewardLabel(promo) }}
            </div>
            <div v-if="getPromoRewardLabel(promo)" class="deposit-promotion-card__reward-label">
              {{ t("member.deposit.rewardTitle") }}
            </div>
          </template>
          <template v-else>
            <div class="deposit-promotion-card__ineligible">未符合資格</div>
            <div class="deposit-promotion-card__condition">存款金額還差 {{ getPromoGapLabel(promo) }}</div>
          </template>
        </div>
      </BasePlainBtn>
    </div>
  </div>
</template>
