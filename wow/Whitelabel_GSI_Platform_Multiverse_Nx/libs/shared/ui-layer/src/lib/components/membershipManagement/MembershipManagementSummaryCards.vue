<script setup lang="ts">
interface Props {
  memberAgentAccount: string
  remainQuotaAmount: string | number
  isCredit: boolean
  viewingAccount?: string
}

defineProps<Props>()

// 摘要卡共用尺寸：Figma 高度 80px 固定，圓角/邊框/padding 對齊 referral 卡
const cardBase = cx("flex flex-col gap-2 flex-1 min-w-0 rounded-lg px-4 py-3 border h-20 justify-center")
// 下級會員卡：purple 主題（對齊 referral 主推卡）
const baseCardClass = cx(
  cardBase,
  "bg-[var(--card-card-bg-purple)]",
  "border-[var(--color-abyss-600,transparent)]"
)
// 代理剩餘額度卡：pink 主題
const quotaCardClass = cx(
  cardBase,
  "bg-[var(--card-card-bg-pink)]",
  "border-[var(--card-card-border-pink)]"
)
const labelClass = cx("text-sm leading-5 truncate text-[var(--card-card-subtitle-secondary-enabled)]")
const valueClass = cx("text-xl leading-7 font-bold text-[var(--text-text-primary)] truncate")
</script>

<template>
  <div :class="cx(FLEX_ITEMS_CENTER, 'gap-3 w-full')">
    <div :class="baseCardClass">
      <div :class="labelClass">下級會員</div>
      <div :class="valueClass">{{ viewingAccount || memberAgentAccount || '-' }}</div>
    </div>

    <div v-if="isCredit" :class="quotaCardClass">
      <div :class="labelClass">代理剩餘額度</div>
      <div :class="valueClass">{{ remainQuotaAmount }}</div>
    </div>
  </div>
</template>
