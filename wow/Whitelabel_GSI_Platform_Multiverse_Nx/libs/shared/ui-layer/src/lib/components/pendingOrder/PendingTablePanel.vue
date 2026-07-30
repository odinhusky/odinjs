<script setup lang="ts">
import { TOAST_SEVERITY_ENUMS } from "@shared-lib/constants/enums/toast"
import type { PendingOrderRowView } from "../../composables/usePendingOrder"

interface Props {
  rows: PendingOrderRowView[]
  loading?: boolean
  page: number
  rowsPerPage: number
  totalRecords: number
  selectedDateRange?: string[]
  selectedStatus?: number
  statusOptions?: Array<{ label: string; value: number }>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectedDateRange: () => [],
  selectedStatus: -1,
  statusOptions: () => []
})

const emit = defineEmits<{
  (e: "update:selectedDateRange", value: string[] | null): void
  (e: "update:selectedStatus", value: number): void
  (e: "search"): void
  (e: "page-change", value: number): void
  (e: "upload", row: PendingOrderRowView): void
  (e: "cancel", row: PendingOrderRowView): void
  (e: "open-detail", row: PendingOrderRowView): void
}>()

const tableColumns = [
  { field: "transCode", header: "編號", width: "180px" },
  { field: "paymentTypeLabel", header: "金流類型", width: "160px" },
  { field: "paymentGatewayName", header: "支付商", width: "220px" },
  { field: "currencyCode", header: "幣別", width: "100px" },
  { field: "amount", header: "金額", width: "120px", bodyClass: "text-right" },
  { field: "actualAmount", header: "實際金額", width: "120px", bodyClass: "text-right" },
  { field: "submitDate", header: "申請日期", width: "200px" },
  { field: "status", header: "狀態", width: "120px" },
  { field: "actions", header: "操作", width: "220px" }
]

const nuxtApp = useNuxtApp()
const { copy } = useClipboard()
const appToast = (nuxtApp as any).$appToast

const handleUploadClick = (row: PendingOrderRowView) => {
  emit("upload", row)
}

const handleCancelClick = (row: PendingOrderRowView) => {
  emit("cancel", row)
}

const handleOpenDetail = (row: PendingOrderRowView) => {
  if (!row?.isBankTransfer) return
  emit("open-detail", row)
}

const handleCopyTransCode = async (transCode: string) => {
  try {
    await copy(transCode)
    appToast?.("編號已複製", {
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "成功",
      life: 2000
    })
  } catch {
    appToast?.("複製失敗，請稍後再試", {
      severity: TOAST_SEVERITY_ENUMS.ERROR,
      summary: "提示",
      life: 2000
    })
  }
}

const MOBILE_TOGGLE_HOVER_CLASS_MAP: Record<PendingOrderRowView["statusTheme"], string> = {
  base: "group-hover:border-r-[var(--tag-tag-title-warning)]",
  success: "group-hover:border-r-[var(--tag-tag-title-success)]",
  fail: "group-hover:border-r-[var(--tag-tag-title-negative)]",
  info: "group-hover:border-r-[var(--tag-tag-title-info)]",
  warning: "group-hover:border-r-[var(--tag-tag-title-warning)]"
}

const MOBILE_TOGGLE_EXPANDED_CLASS_MAP: Record<PendingOrderRowView["statusTheme"], string> = {
  base: "border-r-[var(--tag-tag-title-warning)]",
  success: "border-r-[var(--tag-tag-title-success)]",
  fail: "border-r-[var(--tag-tag-title-negative)]",
  info: "border-r-[var(--tag-tag-title-info)]",
  warning: "border-r-[var(--tag-tag-title-warning)]"
}

const MOBILE_LIST_WRAP_CLASS_MAP: Record<PendingOrderRowView["statusTheme"], string> = {
  base: "border-r-[var(--tag-tag-title-warning)]",
  success: "border-r-[var(--tag-tag-title-success)]",
  fail: "border-r-[var(--tag-tag-title-negative)]",
  info: "border-r-[var(--tag-tag-title-info)]",
  warning: "border-r-[var(--tag-tag-title-warning)]"
}

const getMobileToggleRowStatusClass = (payload: { row: PendingOrderRowView; expanded: boolean }) => {
  const statusTheme = payload.row.statusTheme || "base"
  const hoverClass = MOBILE_TOGGLE_HOVER_CLASS_MAP[statusTheme]
  if (payload.expanded) {
    return `${hoverClass} ${MOBILE_TOGGLE_EXPANDED_CLASS_MAP[statusTheme]}`
  }
  return hoverClass
}

const getMobileRowListStatusClass = (payload: { row: PendingOrderRowView }) => {
  const statusTheme = payload.row.statusTheme || "base"
  return MOBILE_LIST_WRAP_CLASS_MAP[statusTheme]
}

const asPendingRow = (row: Record<string, any>) => row as PendingOrderRowView

const transCodeLinkClassObj = {
  button: "text-[var(--link)] hover:underline focus:underline"
}
</script>

<template>
  <BaseTable
    :rows="props.rows"
    :columns="tableColumns"
    :loading="props.loading"
    :pagination="true"
    :server-pagination="true"
    :page="props.page"
    :rows-per-page="props.rowsPerPage"
    :total-records="props.totalRecords"
    :class-obj="{
      mobileToggleRow: ({ row, expanded }) =>
        getMobileToggleRowStatusClass({ row: row as PendingOrderRowView, expanded }),
      mobileRowListWrap: ({ row }) => getMobileRowListStatusClass({ row: row as PendingOrderRowView })
    }"
    @update:page="emit('page-change', $event)"
  >
    <template #cell-transCode="{ data }">
      <div class="flex items-center justify-center gap-2">
        <BasePlainBtn
          v-if="asPendingRow(data).isBankTransfer"
          :class-obj="transCodeLinkClassObj"
          @click="handleOpenDetail(asPendingRow(data))"
        >
          {{ asPendingRow(data).transCode }}
        </BasePlainBtn>
        <span v-else>{{ asPendingRow(data).transCode }}</span>
        <!-- <BaseIcon
          name="bxs:copy"
          size="18px"
          class-name="cursor-pointer text-[var(--text-text-primary)]"
          @click="handleCopyTransCode(data.transCode)"
        /> -->
      </div>
    </template>

    <template #filters>
      <PendingTableFilters
        :selected-date-range="props.selectedDateRange"
        :selected-status="props.selectedStatus"
        :status-options="props.statusOptions"
        @update:selected-date-range="emit('update:selectedDateRange', $event)"
        @update:selected-status="emit('update:selectedStatus', $event)"
        @search="emit('search')"
      />
    </template>

    <template #cell-status="{ data }">
      <div class="flex justify-center">
        <BaseBadge size="md" :theme="asPendingRow(data).statusTheme">
          {{ asPendingRow(data).statusLabel }}
        </BaseBadge>
      </div>
    </template>

    <template #cell-actions="{ data }">
      <PendingActionCell :data="asPendingRow(data)" @upload="handleUploadClick" @cancel="handleCancelClick" />
    </template>

    <template #mobileCardToggleRow="{ data }">
      <PendingMobileToggleRow :data="asPendingRow(data)" @open-detail="handleOpenDetail" />
    </template>

    <template #mobileCardRowList="{ data }">
      <PendingMobileRowList
        :data="asPendingRow(data)"
        @copy="handleCopyTransCode"
        @open-detail="handleOpenDetail"
        @upload="handleUploadClick"
        @cancel="handleCancelClick"
      />
    </template>

    <template #empty>
      <NoData type="empty" />
    </template>
  </BaseTable>
</template>
