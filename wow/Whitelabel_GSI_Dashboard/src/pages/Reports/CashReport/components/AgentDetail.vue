<template>
  <SubPage :action-label-i18n-key="reportTime" :custom-back-func="onBackTo" />
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-end">
          <q-btn v-if="Boolean(route.query.export)" class="btns q-ml-xs btn-export" @click="() => onExport()">
            <q-icon size="xs" name="archive" />
            {{ $t("btn.export") }}
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
              <q-td
                key="member_account"
                :props="props"
                class="text-blue cursor-pointer"
                @click="goMemberDetail(props.row)"
              >
                {{ props.row.member_account }}
              </q-td>
              <q-td key="currency" :props="props">
                {{ props.row.currency }}
              </q-td>
              <q-td key="deposit" :props="props">
                {{ moneyFormat(props.row.deposit) }}
              </q-td>
              <q-td key="withdraw" :props="props">
                {{ moneyFormat(props.row.withdraw) }}
              </q-td>
              <q-td key="net" :props="props">
                {{ moneyFormat(props.row.net) }}
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
  import type { CustomQTableProps } from "quasar"
  import { computed, reactive } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter, useRoute } from "vue-router"
  import { getAgentCashReportDetail, getAgentCashReportAgentExport } from "@/api/report"
  import type { GetCashReportDetail } from "@/api/request.type"
  import type { cashReportItemDetail } from "@/api/response.type"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useExport } from "@/hook/useExport"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })

  const { search, tableData, totalSize, tableTotal, tableSubTotal, isSuccess } = useSearch(getAgentCashReportDetail)

  const { moneyFormat } = useCommon()

  const reportTime = computed(() => route.params.date as string)

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "member_account",
      label: t("table_header.member_account"),
      field: "member_account",
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

  let catchQueryForm: GetCashReportDetail
  async function onSubmit(queryForm: GetCashReportDetail) {
    const params = route.params
    const queries = route.query
    const payload = { ...queryForm, ...params, ...queries }
    catchQueryForm = payload
    await search(payload)
  }

  // 匯出
  const { getExportPath } = useExport()
  const onExport = async () => {
    const { search, status, tableData } = useSearch(getAgentCashReportAgentExport)
    await search(catchQueryForm)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }
  const goMemberDetail = async (item: cashReportItemDetail) => {
    const { export: isExport, wallet_type } = route.query

    router.push({
      name: "CashReportMemberDetail",
      params: {
        currencyId: item.currency_id,
        memberId: item.member_id,
        memberAccount: item.member_account
      },
      query: {
        wallet_type,
        export: isExport
      }
    })
  }
  function onBackTo() {
    const { start, end, export: isExport, wallet_type } = route.query
    router.push({
      name: "CashReportList",
      query: {
        start,
        end,
        wallet_type,
        export: isExport
      }
    })
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
