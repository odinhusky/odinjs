<template>
  <SubPage :action-label-i18n-key="reportTime" :custom-back-func="onBackTo" />
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
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
              <q-td key="agent_id" :props="props">
                {{ props.row.agent_id }}
              </q-td>
              <q-td key="agent_code" :props="props">
                {{ props.row.agent_code }}
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
              :sub-total-data="tableSubTotal"
              :total-data="tableTotal"
            />
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
  import { useRouter, useRoute } from "vue-router"
  import { getAdminCashReportDetail, getGeneralAgentCashReportAgentExport } from "@/api/report"
  import type { GetCashReportDetail } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useCommon } from "@/hook/useCommon"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    // 目前沒有功能暫時隱藏
    // useExport: Boolean(route.query.export)
    useExport: false
  })
  const { search, tableData, totalSize, tableTotal, tableSubTotal, isSuccess } = useSearch(getAdminCashReportDetail)
  const { moneyFormat } = useCommon()
  const reportTime = computed(() => route.params.date as string)

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "agent_id",
      label: t("table_header.master_agent_ID"),
      field: "agent_id",
      sortable: false,
      align: "center"
    },
    {
      name: "agent_code",
      label: t("table_header.master_agent_name"),
      field: "agent_code",
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
      label: t("table_header.deposit_amount"),
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
  ])

  async function onSubmit(queryForm: GetCashReportDetail) {
    const params = route.params
    const queries = route.query
    const payload = { ...queryForm, ...params, ...queries }
    await search(payload)
  }

  function onBackTo() {
    const { start, end, export: isExport, wallet_type } = route.query
    router.push({
      name: "CashReportList",
      query: {
        start,
        end,
        wallet_type: wallet_type,
        export: isExport
      }
    })
  }

  // 匯出
  // 尚缺 admin env api
  const onExport = async (params: GetCashReportDetail) => {
    try {
      // const response = getGeneralAgentCashReportAgentExport(params)
      // const url = window.URL.createObjectURL(response as any)
      // const link = document.createElement("a")
      // link.href = url
      // link.download = "export_cash_report.xlsx"
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)
      console.log("Export !!")
    } catch (error) {
      console.error("Export request error:", error)
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
  ::v-deep(.custom-hide) {
    display: none;
  }
</style>
