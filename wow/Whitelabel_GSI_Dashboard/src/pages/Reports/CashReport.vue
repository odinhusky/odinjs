<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn outline color="main-color" @click="onExport">
            {{ $t("btn.export") }}
            <q-icon class="q-ml-xs" size="xs" name="archive" />
          </q-btn>
        </div>

        <q-table
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="tableData"
          :columns="tableColumn"
          table-header-class="bg-success"
          row-key="id"
        >
          <template #body="props">
            <q-tr>
              <q-td key="date" :props="props" class="text-blue cursor-pointer">
                {{ genTimeFormat(props.row.date, "yyyy-MM-dd", false) }}
              </q-td>
              <q-td key="currency" :props="props">
                {{ props.row.currency }}
              </q-td>
              <q-td key="deposit_amount" :props="props">
                {{ props.row.deposit_amount }}
              </q-td>
              <q-td key="withdrawal_amount" :props="props">
                {{ props.row.withdrawal_amount }}
              </q-td>
              <q-td key="total_amount" :props="props">
                {{ props.row.total_amount }}
              </q-td>
            </q-tr>
          </template>

          <!-- 查無資料 -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
          </template>

          <!-- 本頁總計/搜尋結果總計 -->
          <template #bottom-row="props">
            <table-total-comp :columns="props.cols" :table-data="tableData" :total-data="tableTotal" />
          </template>
        </q-table>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { CustomQTableProps } from "quasar"
  import { computed, reactive } from "vue"
  import { useI18n } from "vue-i18n"

  import { getCashReportList } from "@/api/report"
  import type { GetCashReportList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { CURRENCY_TYPE } from "@/utils/constants"
  const { t } = useI18n()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useAgentAccount: true,
    useCurrency: true,
    useDatePicker: true
  })

  const { search, tableData, totalSize, tableTotal } = useSearch(getCashReportList)

  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetCashReportList) {
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "date",
      label: t("table_header.date"),
      field: "date",
      sortable: false,
      align: "center"
    },
    {
      name: "currency",
      label: t("table_header.currency"),
      field: "currency",
      sortable: false,
      align: "center"
    },
    {
      name: "deposit_amount",
      label: t("table_header.deposit_amount"),
      field: "deposit_amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      totalColumn: "total_deposit"
    },
    {
      name: "withdrawal_amount",
      label: t("table_header.withdrawal_amount"),
      field: "withdrawal_amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      totalColumn: "total_withdrawal_amount"
    },
    {
      name: "total_amount",
      label: t("table_header.total_amount"),
      field: "total_amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      totalColumn: "total_entry_exit"
    }
  ])

  function onExport() {
    console.log("onExport")
  }
</script>

<style lang="scss" scoped>
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }
  ::v-deep(.q-table__sort-icon) {
    opacity: 1;
  }
  :deep(.table-total) {
    &.q-tr {
      background-color: #fff9e8 !important;
    }
  }
</style>
