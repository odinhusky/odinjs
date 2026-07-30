<script setup lang="ts">
import type { AgentReportSummaryCardData } from "../../composables/useMembershipManagement/types"

interface Props {
  data: AgentReportSummaryCardData
}

defineProps<Props>()

// 對齊 MembershipManagementSummaryCards 共用尺寸/變數
const cardBase = cx("flex flex-col gap-2 flex-1 min-w-0 rounded-lg px-4 py-3 border h-20 justify-center")
const accountCardClass = cx(
  cardBase,
  "bg-[var(--card-card-bg-purple)]",
  "border-[var(--color-abyss-600,transparent)]"
)
const teamCardClass = cx(
  cardBase,
  "bg-[var(--card-card-bg-pink)]",
  "border-[var(--card-card-border-pink)]"
)
const labelClass = cx("text-sm leading-5 truncate text-[var(--card-card-subtitle-secondary-enabled)]")
const valueClass = cx("text-xl leading-7 font-bold text-[var(--text-text-primary)] truncate")
</script>

<template>
  <div :class="cx(FLEX_ITEMS_CENTER, 'gap-3 w-full phone:gap-4 phone:items-stretch')">
    <div :class="accountCardClass">
      <div :class="labelClass">會員帳戶</div>
      <div :class="valueClass">{{ data.account }}</div>
    </div>

    <div :class="teamCardClass">
      <div :class="labelClass">團隊人數</div>
      <div :class="valueClass">{{ data.teamCount }}</div>
    </div>
  </div>
</template>
