<script setup lang="ts">
import MembershipManagementActionMenu from "./MembershipManagementActionMenu.vue"

interface Props {
  rows: Record<string, any>[]
  isCredit: boolean
  isLoading: boolean
  expandedRowId?: number
  totalRecords: number
  page: number
  size: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "toggle-row": [id: number]
  add: [row: Record<string, any>]
  minus: [row: Record<string, any>]
  edit: [row: Record<string, any>]
  "view-lower-level": [row: Record<string, any>]
  "page-change": [number]
}>()

const formatTimestamp = (ts: number | string | null | undefined) => {
  const n = Number(ts)
  if (!ts || !Number.isFinite(n) || n <= 0) return "-"
  const d = new Date(n * 1000)
  if (Number.isNaN(d.getTime())) return "-"
  const pad = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const cardClass = cx(
  "w-full rounded-lg p-4 flex flex-col gap-3",
  "bg-[var(--list-list-bg-enabled)]"
)
const labelClass = cx("text-[10px] text-[var(--list-list-subtitle-enabled)]")
const valueClass = cx("text-sm font-bold text-[var(--text-text-primary)]")
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <!-- Loading -->
    <div v-if="props.isLoading" class="flex justify-center py-8">
      <BaseIcon name="mdi:loading" size="32px" class="animate-spin text-[var(--text-text-secondary)]" />
    </div>

    <!-- Empty -->
    <template v-else-if="!props.rows.length">
      <NoData />
    </template>

    <!-- Rows -->
    <template v-else>
      <div
        v-for="row in props.rows"
        :key="row.member_id"
        :class="cardClass"
      >
        <!-- 收合行：帳號 + 主要金額 + 展開箭頭（信用版才有） -->
        <div
          :class="cx(FLEX_ITEMS_CENTER, 'gap-3')"
          @click="isCredit ? emit('toggle-row', row.member_id) : undefined"
        >
          <div class="flex-1 min-w-0">
            <div :class="valueClass">{{ row.member_account }}</div>
            <div :class="labelClass">帳號</div>
          </div>

          <div class="text-right shrink-0">
            <div :class="valueClass">{{ row.balance }}</div>
            <div :class="labelClass">點數</div>
          </div>

          <BaseIcon
            v-if="isCredit"
            :name="props.expandedRowId === row.member_id ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            size="20px"
            class="shrink-0 text-[var(--text-text-secondary)]"
          />
        </div>

        <!-- 展開區：信用版才顯示 -->
        <template v-if="isCredit && props.expandedRowId === row.member_id">
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div :class="labelClass">層數</div>
              <div :class="valueClass">{{ row.hierarchy_level }}</div>
            </div>
            <div>
              <div :class="labelClass">餘額</div>
              <div :class="valueClass">{{ row.remain_quota_amount }}</div>
            </div>
            <div>
              <div :class="labelClass">註冊時間</div>
              <div :class="valueClass">{{ formatTimestamp(row.register_date) }}</div>
            </div>
            <div>
              <div :class="labelClass">最後登入時間</div>
              <div :class="valueClass">{{ formatTimestamp(row.last_login_date) }}</div>
            </div>
          </div>

          <MembershipManagementActionMenu
            :row="row"
            :is-credit="props.isCredit"
            layout="buttons"
            @add="emit('add', $event)"
            @minus="emit('minus', $event)"
            @edit="emit('edit', $event)"
            @view-lower-level="emit('view-lower-level', $event)"
          />
        </template>
      </div>

      <!-- Pagination -->
      <div class="flex justify-end pt-2">
        <BasePagination
          :model-value="props.page"
          :rows="props.size"
          :total-records="props.totalRecords"
          @update:model-value="emit('page-change', $event)"
        />
      </div>
    </template>
  </div>
</template>
