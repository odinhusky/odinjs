<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-end">
          <q-btn class="btns q-ml-xs btn-export" @click="() => onExport(catchQueryForm)">
            <q-icon size="xs" name="archive" />
            {{ $t("btn.export") }}
          </q-btn>
        </div>
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            table-header-class="bg-success"
            row-key="id"
          >
            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
            </template>

            <!-- 本頁總計/搜尋結果總計 -->
            <template #bottom-row="props">
              <table-total-comp
                v-if="tableData.length"
                :columns="props.cols"
                :table-data="tableData"
                :total-data="tableTotal"
                :sub-total-data="tableSubTotal"
              />
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { CustomQTableProps, Notify } from "quasar"
  import { computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { getAuroraOverviewReportList, getAuroraOverviewReportExport } from "@/api/report"
  import type { GetAuroraOverviewReportList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "src/hook/useEnv"
  import { useExport } from "@/hook/useExport"

  const { t } = useI18n()

  const { isAdminMode, isGeneralAgentMode, isAgentMode } = useEnv()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useAuroraAdminAgentAccount: true
    }
    baseConfig.useDatePicker = true
    return baseConfig
  })

  let { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getAuroraOverviewReportList)
  let catchQueryForm: GetAuroraOverviewReportList
  async function onSubmit(queryForm: GetAuroraOverviewReportList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    return [
      {
        name: "agent_code",
        label: t("table_header.agent"),
        field: "agent_code",
        sortable: false,
        align: "center",
        useSubTotalColumn: false
      },
      {
        name: "new_users",
        label: t("table_header.new_users"),
        field: "new_users",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "new_users",
        totalColumn: "new_users"
      },
      {
        name: "first_depositors_count",
        label: t("table_header.first_depositors_count"),
        field: "first_depositors_count",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "first_depositors_count",
        totalColumn: "first_depositors_count"
      },
      {
        name: "first_deposit_amount",
        label: t("table_header.first_deposit_amount"),
        field: "first_deposit_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "first_deposit_amount",
        totalColumn: "first_deposit_amount"
      },
      {
        name: "retained_deposit_users",
        label: t("table_header.retained_deposit_users"),
        field: "retained_deposit_users",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "retained_deposit_users",
        totalColumn: "retained_deposit_users"
      },
      {
        name: "depositors_count",
        label: t("table_header.depositors_count"),
        field: "depositors_count",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "depositors_count",
        totalColumn: "depositors_count"
      },
      {
        name: "deposit_amount",
        label: t("table_header.deposit_amount"),
        field: "deposit_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "deposit_amount",
        totalColumn: "deposit_amount"
      },
      {
        name: "withdrawers_count",
        label: t("table_header.withdrawers_count"),
        field: "withdrawers_count",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "withdrawers_count",
        totalColumn: "withdrawers_count"
      },
      {
        name: "withdrawal_count",
        label: t("table_header.withdrawal_count"),
        field: "withdrawal_count",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "withdrawal_count",
        totalColumn: "withdrawal_count"
      },
      {
        name: "withdrawal_amount",
        label: t("table_header.withdrawal_amount"),
        field: "withdrawal_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "withdrawal_amount",
        totalColumn: "withdrawal_amount"
      },
      {
        name: "bettors_amount",
        label: t("table_header.bettors_amount"),
        field: "bettors_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "bettors_amount",
        totalColumn: "bettors_amount"
      },
      {
        name: "bet_count",
        label: t("table_header.bet_count"),
        field: "bet_count",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "bet_count",
        totalColumn: "bet_count"
      },
      {
        name: "bet_amount",
        label: t("table_header.bet_amount"),
        field: "bet_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "bet_amount",
        totalColumn: "bet_amount"
      },
      {
        name: "payout_amount",
        label: t("table_header.payout_amount"),
        field: "payout_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "payout_amount",
        totalColumn: "payout_amount"
      },
      {
        name: "ggr",
        label: t("table_header.ggr"),
        field: "ggr",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "ggr",
        totalColumn: "ggr"
      },
      {
        name: "promo_spend",
        label: t("table_header.promo_spend"),
        field: "promo_spend",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "promo_spend",
        totalColumn: "promo_spend"
      }
    ]
  })

  // 匯出

  const { getExportPath } = useExport()
  const onExport = async (params: GetAuroraOverviewReportList) => {
    const { search, status, tableData } = useSearch(getAuroraOverviewReportExport)
    await search(params)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }
</script>

<style lang="scss" scoped>
  :deep(.table-total) {
    &.q-tr {
      background-color: #fff9e8 !important;
    }
  }
</style>
