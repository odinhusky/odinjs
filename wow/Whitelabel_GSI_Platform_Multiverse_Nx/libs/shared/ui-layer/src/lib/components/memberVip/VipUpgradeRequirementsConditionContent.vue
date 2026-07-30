<script setup lang="ts">
import type { MemberVipItem } from "../../composables/useMemberVip"
import type { UserStatistics } from "@shared-lib/api/commonTypes/vipTypes"

interface Props {
  title: string
  metric: "deposit" | "bet"
  conditions: MemberVipItem["conditions"]
  isMaxLevel: boolean
  userStatisticsMap: Record<number, UserStatistics>
  getCurrencyCode: (currencyId: number) => string
}

const props = defineProps<Props>()

const units = computed(() => {
  return props.conditions.map((condition) => {
    const stats = props.userStatisticsMap[condition.currency_id]

    return {
      currencyCode: props.getCurrencyCode(condition.currency_id),
      numerator: props.metric === "deposit" ? stats?.total_deposit || "0" : stats?.total_valid_bet_amount || "0",
      denominator: props.metric === "deposit" ? condition.deposit_amount : condition.valid_bet_amount
    }
  })
})
</script>

<template>
  <div :class="cx(FLEX_COL, 'gap-2 flex-1')">
    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-2')">
      <p class="text-base leading-6 font-bold text-[var(--text-text-primary)]">{{ props.title }}</p>
    </div>

    <div :class="cx(FLEX_COL, 'gap-2 flex-1')">
      <VipUpgradeRequirementsCurrencyProgressUnit
        v-for="unit in units"
        :key="`${props.metric}-${unit.currencyCode}`"
        :currency-code="unit.currencyCode"
        :numerator="unit.numerator"
        :denominator="unit.denominator"
        :is-max-level="props.isMaxLevel"
      />
    </div>
  </div>
</template>
