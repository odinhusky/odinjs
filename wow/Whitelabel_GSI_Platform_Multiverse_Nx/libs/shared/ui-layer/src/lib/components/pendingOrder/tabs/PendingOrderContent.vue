<script setup lang="ts">
import type { PendingOrderRowView } from "../../../composables/usePendingOrder"

const pendingOrder = usePendingOrderContext()

const {
  rows,
  isLoading,
  page,
  rowsPerPage,
  totalRecords,
  dateRange,
  selectedStatus,
  statusOptions,
  handleSearch,
  handlePageChange,
  handleStatusChange,
  handleCancelOrder,
  reload
} = pendingOrder

const uploadDialogVisible = ref(false)
const selectedUploadRow = ref<PendingOrderRowView | null>(null)
const detailDialogVisible = ref(false)
const selectedDetailRow = ref<PendingOrderRowView | null>(null)

const handleOpenUpload = (row: PendingOrderRowView) => {
  if (!row || !row.canUpload) return

  selectedUploadRow.value = {
    ...row
  }
  uploadDialogVisible.value = true
}

const handleCloseUpload = () => {
  uploadDialogVisible.value = false
  selectedUploadRow.value = null
}

const handleUploadSubmitted = async () => {
  await reload({ syncQuery: false })
}

const handleOpenDetail = (row: PendingOrderRowView) => {
  if (!row?.isBankTransfer) return

  selectedDetailRow.value = {
    ...row
  }
  detailDialogVisible.value = true
}

const handleCloseDetail = () => {
  detailDialogVisible.value = false
  selectedDetailRow.value = null
}
</script>

<template>
  <div class="w-full h-full min-h-0 flex flex-col gap-3">
    <PendingTablePanel
      :rows="rows"
      :loading="isLoading"
      :page="page"
      :rows-per-page="rowsPerPage"
      :total-records="totalRecords"
      :selected-date-range="dateRange"
      :selected-status="selectedStatus"
      :status-options="statusOptions"
      @update:selected-date-range="dateRange = $event || []"
      @update:selected-status="handleStatusChange"
      @search="handleSearch"
      @page-change="handlePageChange"
      @upload="handleOpenUpload"
      @open-detail="handleOpenDetail"
      @cancel="handleCancelOrder"
    />
  </div>

  <PendingUploadDialog
    :visible="uploadDialogVisible"
    :row="selectedUploadRow"
    @close="handleCloseUpload"
    @submitted="handleUploadSubmitted"
  />

  <PendingOrderDetailDialog :visible="detailDialogVisible" :row="selectedDetailRow" @close="handleCloseDetail" />
</template>
