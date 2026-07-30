<script setup lang="ts">
import { useMemberInboxContext } from "../../composables/useMemberInbox/useMemberInboxContext"

const { rows, page, rowsPerPage, totalRecords, isLoading, handlePageChange, handleOpenDetail } = useMemberInboxContext()

const inboxColumns = [
  { field: "title", header: "標題", width: "320px" },
  { field: "typeLabel", header: "類型", width: "180px", bodyClass: "!text-center" },
  { field: "sendAt", header: "時間", width: "220px", bodyClass: "!text-center" },
  { field: "action", header: "操作", width: "160px" }
]
</script>

<template>
  <BaseTable
    :rows="rows"
    :columns="inboxColumns"
    :loading="isLoading"
    :pagination="true"
    :server-pagination="true"
    :page="page"
    :rows-per-page="rowsPerPage"
    :total-records="totalRecords"
    :is-show-mobile-card="false"
    @update:page="handlePageChange"
  >
    <template #cell-title="{ data }">
      <div class="w-full flex items-center justify-center gap-2">
        <span class="truncate max-w-[240px]">{{ data.title }}</span>
      </div>
    </template>

    <template #cell-action="{ data }">
      <div class="w-full flex justify-center">
        <BaseBtn theme="primary" category="outline" size="md" @click="handleOpenDetail(data.id)"> 查看詳情 </BaseBtn>
      </div>
    </template>

    <template #empty>
      <NoData type="empty" />
    </template>
  </BaseTable>
</template>
