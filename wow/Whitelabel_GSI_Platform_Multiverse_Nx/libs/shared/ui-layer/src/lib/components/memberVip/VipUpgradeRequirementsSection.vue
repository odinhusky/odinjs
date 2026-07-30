<script setup lang="ts">
import { PROMOTION_CONDITION_ENUMS } from "@shared-lib/constants/enums/promotionCondition"
import type { MemberVipItem } from "../../composables/useMemberVip"
import type { UserStatistics } from "@shared-lib/api/commonTypes/vipTypes"

interface Props {
  currentVip: MemberVipItem | null
  nextVip: MemberVipItem | null
  userStatisticsMap: Record<number, UserStatistics>
  getCurrencyCode: (currencyId: number) => string
}

const props = defineProps<Props>()

const targetVip = computed(() => props.nextVip || props.currentVip)
const isMaxLevel = computed(() => Boolean(props.currentVip) && !props.nextVip)
const promotionCondition = computed(() => Number(targetVip.value?.promotion_condition || 0))

const shouldShowBet = computed(() => {
  if (!targetVip.value) return false
  return [PROMOTION_CONDITION_ENUMS.BET, PROMOTION_CONDITION_ENUMS.BET_AND_DEPOSIT].includes(promotionCondition.value)
})

const shouldShowDeposit = computed(() => {
  if (!targetVip.value) return false
  return [PROMOTION_CONDITION_ENUMS.DEPOSIT, PROMOTION_CONDITION_ENUMS.BET_AND_DEPOSIT].includes(
    promotionCondition.value
  )
})

const hasConditions = computed(() => Boolean(targetVip.value?.conditions?.length))
const shouldFallbackShowBoth = computed(() => hasConditions.value && !shouldShowBet.value && !shouldShowDeposit.value)
</script>

<template>
  <section :class="cx(FLEX_COL, 'items-start gap-4 w-full')">
    <h3 class="text-2xl leading-7 font-bold text-[var(--text-text-primary)] capitalize">晉級條件</h3>

    <div
      :class="
        cx(
          'w-full flex phone:flex-col gap-5 p-5 rounded-lg',
          'bg-[var(--card-card-border-secondary-enabled)]',
          !shouldShowBet || !shouldShowDeposit ? 'items-start' : 'items-start'
        )
      "
    >
      <VipUpgradeRequirementsConditionContent
        v-if="shouldShowBet || shouldFallbackShowBoth"
        title="有效投注"
        metric="bet"
        :conditions="targetVip?.conditions || []"
        :is-max-level="isMaxLevel"
        :user-statistics-map="props.userStatisticsMap"
        :get-currency-code="props.getCurrencyCode"
      />

      <VipUpgradeRequirementsConditionContent
        v-if="shouldShowDeposit || shouldFallbackShowBoth"
        title="存款金額"
        metric="deposit"
        :conditions="targetVip?.conditions || []"
        :is-max-level="isMaxLevel"
        :user-statistics-map="props.userStatisticsMap"
        :get-currency-code="props.getCurrencyCode"
      />
    </div>
  </section>
</template>
