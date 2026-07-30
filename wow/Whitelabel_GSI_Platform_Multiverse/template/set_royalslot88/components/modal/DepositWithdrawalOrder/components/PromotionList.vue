<template>
  <div
    class="card"
    :class="{
      active: props.activeId === props.item.id
    }"
  >
    <div>
      {{ props.item.title }}
      <ul>
        <li>
          {{
            $t(`member.deposit.depositOver`, {
              amount: props.item.reward.condition
            })
          }}
        </li>
        <li v-if="props.item.reward.type === 0">
          {{
            $t(`member.deposit.depositreward`, {
              rewardPercent: props.item.reward.amount
            })
          }}
        </li>
        <li v-else>
          {{
            $t(`member.deposit.rewardPercent`, {
              rewardPercent: props.item.reward.amount
            })
          }}
        </li>
        <PromotionAuditRate :audit-rate="props.item.audit_rate ?? props.item.reward.audit_rate" />
      </ul>
    </div>
    <div class="amount">
      {{ $t("member.deposit.rewardTitle") }}
      <div class="txt-lg">
        {{ props.item.reward.reward_amount }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PromotionAuditRate from "src/common/components/Deposit/PromotionAuditRate.vue"

const props = defineProps<{
  activeId: number
  item: {
    id: number | string
    title: string
    audit_rate?: number | string | null
    reward: {
      type: number
      amount: number | string
      reward_amount: number | string
      condition: number | string
      audit_rate?: number | string | null
    }
  }
}>()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
</style>
