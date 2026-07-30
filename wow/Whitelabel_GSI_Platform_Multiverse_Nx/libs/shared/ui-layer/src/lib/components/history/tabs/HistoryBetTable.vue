<script setup lang="ts">
const history = useHistoryContext()
const {
  rows,
  isLoading,
  page,
  rowsPerPage,
  totalRecords,
  walletOptions,
  walletTypeOptions,
  betMethodOptions,
  filterState,
  validBetAmount,
  winLossAmount,
  handleSearch,
  handlePageChange
} = history

const tableColumns = [
  { field: "updatedAt", header: "帳變時間", width: "220px" },
  { field: "currencyCode", header: "幣種", width: "120px" },
  { field: "betMethodLabel", header: "投注方式", width: "140px" },
  { field: "walletTypeLabel", header: "錢包類型", width: "140px" },
  { field: "actionTypeLabel", header: "帳變類型", width: "160px" },
  { field: "actionTarget", header: "帳變對象", width: "260px" },
  { field: "amount", header: "金額", width: "140px", bodyClass: "text-right" },
  { field: "beforeBalance", header: "帳變前金額", width: "160px", bodyClass: "text-right" },
  { field: "afterBalance", header: "帳變後金額", width: "160px", bodyClass: "text-right" }
]
</script>

<template>
  <HistoryTablePanel
    :rows="rows"
    :loading="isLoading"
    :page="page"
    :rows-per-page="rowsPerPage"
    :total-records="totalRecords"
    :wallet-options="walletOptions"
    :wallet-type-options="walletTypeOptions"
    :bet-method-options="betMethodOptions"
    :selected-currency="filterState.currencyCode"
    :selected-wallet-type="filterState.walletType"
    :selected-bet-method="filterState.betMethod"
    :selected-date-range="filterState.dateRange"
    :valid-bet-amount="validBetAmount"
    :win-loss-amount="winLossAmount"
    :table-columns="tableColumns"
    :show-bet-method-filter="true"
    :show-bet-summary="true"
    no-data-type="empty"
    @update:selected-currency="filterState.currencyCode = $event"
    @update:selected-wallet-type="filterState.walletType = $event"
    @update:selected-bet-method="filterState.betMethod = $event"
    @update:selected-date-range="filterState.dateRange = $event || []"
    @search="handleSearch"
    @page-change="handlePageChange"
  />
</template>
