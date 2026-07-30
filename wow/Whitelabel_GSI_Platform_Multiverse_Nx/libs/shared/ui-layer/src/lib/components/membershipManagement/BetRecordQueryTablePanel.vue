<script setup lang="ts">
import type { BetRecordSummaryRow } from "../../composables/useMembershipManagement/types"

interface Props {
  rows: Record<string, any>[]
  pageSummary: BetRecordSummaryRow | null
  totalSummary: BetRecordSummaryRow | null
  page: number
  size: number
  totalRecords: number
  isLoading: boolean
  openingWagerCode?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "page-change", page: number): void
  (e: "open-detail", row: Record<string, any>): void
}>()

const columns = [
  { field: "wager_code", header: "注單編號", width: "180px" },
  { field: "gaming_site_display", header: "遊戲場地", width: "120px" },
  { field: "member_account", header: "會員帳號", width: "140px" },
  { field: "created_at_display", header: "投注時間", width: "160px" },
  { field: "settled_at_display", header: "結算時間", width: "160px" },
  { field: "status_display", header: "狀態", width: "100px" },
  { field: "channel_code_display", header: "投注來源", width: "120px" },
  { field: "product_display", header: "產品", width: "100px" },
  { field: "game_display", header: "遊戲", width: "120px" },
  { field: "bet_amount_display", header: "投注金額", width: "120px" },
  { field: "valid_bet_amount_display", header: "有效投注", width: "120px" },
  { field: "payout_display", header: "派彩", width: "120px" },
  { field: "profit_display", header: "盈虧", width: "120px" },
  { field: "bonus_display", header: "活動獎金", width: "120px" }
]

const NON_AMOUNT_FIELDS = new Set([
  "wager_code",
  "gaming_site_display",
  "member_account",
  "created_at_display",
  "settled_at_display",
  "status_display",
  "channel_code_display",
  "product_display",
  "game_display"
])

const buildSummaryRow = (s: BetRecordSummaryRow | null) => {
  if (!s) return null
  const row: Record<string, any> = { _isSummary: true, wager_code: s.label }
  for (const c of columns) {
    if (c.field === "wager_code") continue
    if (NON_AMOUNT_FIELDS.has(c.field)) {
      row[c.field] = "-"
    } else if (c.field === "bet_amount_display") row[c.field] = s.bet_amount_display
    else if (c.field === "valid_bet_amount_display") row[c.field] = s.valid_bet_amount_display
    else if (c.field === "payout_display") row[c.field] = s.payout_display
    else if (c.field === "profit_display") row[c.field] = s.profit_display
    else if (c.field === "bonus_display") row[c.field] = s.bonus_display
  }
  return row
}

const tableRows = computed(() => {
  const result: Record<string, any>[] = [...props.rows]
  const pageRow = buildSummaryRow(props.pageSummary)
  const totalRow = buildSummaryRow(props.totalSummary)
  if (props.rows.length > 0) {
    if (pageRow) result.push(pageRow)
    if (totalRow) result.push(totalRow)
  }
  return result
})

const handlePayoutClick = (row: Record<string, any>) => {
  if (row._isSummary) return
  emit("open-detail", row)
}
</script>

<template>
  <BaseTable
    :rows="tableRows"
    :columns="columns"
    :loading="props.isLoading"
    :pagination="true"
    :server-pagination="true"
    :page="props.page"
    :rows-per-page="props.size"
    :total-records="props.totalRecords"
    @page-change="emit('page-change', $event.page)"
    @update:page="emit('page-change', $event)"
  >
    <template #cell-payout_display="{ data }">
      <span
        v-if="!data._isSummary"
        class="cursor-pointer text-[var(--button-button-bg-primary-left-enabled)] hover:underline"
        :class="{ 'opacity-60 pointer-events-none': props.openingWagerCode === data.wager_code }"
        @click="handlePayoutClick(data)"
      >
        {{ data.payout_display }}
      </span>
      <span v-else class="font-bold text-[var(--text-text-primary)]">
        {{ data.payout_display }}
      </span>
    </template>

    <template #cell-wager_code="{ data }">
      <span :class="data._isSummary ? 'font-bold text-[var(--text-text-primary)]' : ''">
        {{ data.wager_code }}
      </span>
    </template>

    <template #empty>
      <NoData />
    </template>
  </BaseTable>
</template>
