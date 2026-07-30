<template>
  <div class="summary">
    <div class="summary-content">
      <div class="summary-title">
        {{ calculateTypeKey ? $t(calculateTypeKey) : "" }}
      </div>
      <div class="summary-value">{{ moneyFormat(summaryAmount) }}</div>
    </div>
    <div class="summary-content">
      <div class="summary-title">
        {{ $t("member.referralRebate.latestTotalRevenueAmount") }}
      </div>
      <div class="summary-value">{{ moneyFormat(data?.revenue_amount) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { CALCULATE_TYPE } from "src/common/utils/constants"

const { moneyFormat } = useCommon()

const props = defineProps<{
  data?: {
    calculate_type?: number
    profit?: string
    valid_bet_amount?: string
    revenue_amount?: string
  }
}>()

const calculateTypeKey = computed(() => {
  const calculateType = props.data?.calculate_type
  if (calculateType !== undefined && calculateType in CALCULATE_TYPE.I18nKeys) {
    return CALCULATE_TYPE.I18nKeys[calculateType as CALCULATE_TYPE.Enums]
  }
  return ""
})

const summaryAmount = computed(() => {
  if (props.data?.calculate_type === 1) {
    return props.data?.valid_bet_amount || "0"
  }
  return props.data?.profit || "0"
})
</script>
