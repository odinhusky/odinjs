<script setup lang="ts">
import MembershipManagementActionMenu from "./MembershipManagementActionMenu.vue"

interface Props {
  rows: Record<string, any>[]
  isCredit: boolean
  isLoading: boolean
  totalRecords: number
  page: number
  size: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "page-change": [number]
  add: [row: Record<string, any>]
  minus: [row: Record<string, any>]
  edit: [row: Record<string, any>]
  "view-lower-level": [row: Record<string, any>]
}>()

const baseColumns = [
  { field: "member_account", header: "帳號" },
  { field: "hierarchy_level", header: "層數" },
  { field: "register_date_display", header: "註冊時間" },
  { field: "last_login_date_display", header: "最後登入時間" },
  { field: "balance", header: "點數" }
]

const creditOnlyColumn = { field: "remain_quota_amount", header: "餘額" }
const actionColumn = { field: "_action", header: "操作" }

const tableColumns = computed(() => [
  ...baseColumns,
  ...(props.isCredit ? [creditOnlyColumn] : []),
  actionColumn
])

const formatTimestamp = (ts: number | string | null | undefined) => {
  const n = Number(ts)
  if (!ts || !Number.isFinite(n) || n <= 0) return "-"
  const d = new Date(n * 1000)
  if (Number.isNaN(d.getTime())) return "-"
  const pad = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const normalizedRows = computed(() =>
  props.rows.map((r) => ({
    ...r,
    register_date_display: formatTimestamp(r.register_date),
    last_login_date_display: formatTimestamp(r.last_login_date)
  }))
)
</script>

<template>
  <BaseTable
    :rows="normalizedRows"
    :columns="tableColumns"
    :loading="props.isLoading"
    :pagination="true"
    :server-pagination="true"
    :page="props.page"
    :rows-per-page="props.size"
    :total-records="props.totalRecords"
    @page-change="emit('page-change', $event.page)"
  >
    <template #cell-_action="{ data }">
      <MembershipManagementActionMenu
        :row="data"
        :is-credit="props.isCredit"
        layout="dropdown"
        @add="emit('add', $event)"
        @minus="emit('minus', $event)"
        @edit="emit('edit', $event)"
        @view-lower-level="emit('view-lower-level', $event)"
      />
    </template>

    <template #empty>
      <NoData />
    </template>
  </BaseTable>
</template>
