<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn
            v-if="!isAdminMode && permission.export"
            class="btns q-ml-xs btn-export ml-auto"
            @click="() => onExport(catchQueryForm)"
          >
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
            row-key="date"
          >
            <template #body="props">
              <q-tr>
                <q-td key="date" :props="props" class="text-blue cursor-pointer" @click="goDetail(props.row)">
                  {{ genTimeFormat(props.row.date, "yyyy-MM-dd", false) }}
                </q-td>
                <q-td key="wallet_type" :props="props" v-if="walletSwitch">
                  {{ $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums]) }}
                </q-td>
                <q-td key="currency" :props="props">
                  {{ props.row.currency }}
                </q-td>
                <q-td key="deposit" :props="props">
                  {{ moneyFormat(props.row.deposit, 2) }}
                </q-td>
                <q-td key="withdraw" :props="props">
                  {{ moneyFormat(props.row.withdraw, 2) }}
                </q-td>
                <q-td key="net" :props="props">
                  {{ moneyFormat(props.row.net, 2) }}
                </q-td>
              </q-tr>
            </template>

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
  import { computed, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { getCurrencyList } from "@/api/common"
  import { getCashReportList, getCashReportExport } from "@/api/report"
  import type { GetCashReportList } from "@/api/request.type"
  import type { cashReportItemDetail } from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "src/hook/useEnv"
  import { usePermission } from "@/hook/usePermission"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useExport } from "@/hook/useExport"
  const { permission } = usePermission()
  const { walletSwitch } = useWalletBouns()

  const { isAdminMode, isGeneralAgentMode } = useEnv()
  const store = useQueryStore()

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  let { envData } = useEnv()
  const appMode = envData().VITE_APP_MODE

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }
    // 區分環境
    if (isGeneralAgentMode) {
      baseConfig.useAgentAccount = true
    }
    if (isAdminMode) {
      baseConfig.useAdminAgentAccount = true
    }
    baseConfig.useCurrency = true

    baseConfig.useDatePicker = true
    return baseConfig
  })

  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getCashReportList)

  const { genTimeFormat, moneyFormat } = useCommon()

  const catchQueryForm = ref<GetCashReportList>({} as GetCashReportList)
  async function onSubmit(queryForm: GetCashReportList) {
    catchQueryForm.value = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const baseColumns: CustomQTableProps["columns"] = [
      {
        name: "date",
        label: t("table_header.date"),
        field: "date",
        sortable: false,
        align: "center"
      },
      {
        name: "wallet_type",
        label: t("table_header.wallet_type"),
        field: "wallet_type",
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
        name: "deposit",
        label: t("table_header.total_deposit"),
        field: "deposit",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "deposit",
        totalColumn: "deposit"
      },
      {
        name: "withdraw",
        label: t("table_header.withdrawal_amount"),
        field: "withdraw",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "withdraw",
        totalColumn: "withdraw"
      },
      {
        name: "net",
        label: t("table_header.total_amount"),
        field: "net",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "net",
        totalColumn: "net"
      }
    ]

    return walletSwitch.value ? baseColumns : baseColumns.filter((column) => column.name !== "wallet_type")
  })

  const goDetail = async (item: cashReportItemDetail) => {
    store.getCurrencyList()
    const { start, end, agentAccount } = route.query

    router.push({
      name: "CashReportDetail",
      params: {
        currencyId: item.currency_id,
        date: item.date
      },
      query: {
        start,
        end,
        agentAccount,
        wallet_type: item.wallet_type,
        export: permission.value.export === true ? "true" : "false"
      }
    })
  }
  // 匯出
  const { getExportPath } = useExport()
  const onExport = async (params: GetCashReportList) => {
    const { search, status, tableData } = useSearch(getCashReportExport)
    await search(params)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
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
