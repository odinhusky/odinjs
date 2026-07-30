<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template v-slot:mainContent>
        <div class="row q-mb-md justify-end">
          <q-btn
            v-if="!isAdminMode && permission.export"
            class="btns q-ml-xs btn-export ml-auto"
            :loading="Loading"
            @click="() => onExport(catchQueryForm)"
          >
            <q-icon size="xs" name="archive" />
            {{ $t("btn.export") }}
          </q-btn>
        </div>
        <div :style="{ height: tableHeight }" class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            table-header-class="bg-success"
            row-key="id"
            class="sticky-header-table"
          >
            <template v-slot:header="props">
              <table-header-sort
                :columns="props.cols"
                :orderType="orderType"
                :sortType="sortType"
                :show-sort-icon="!!catchQueryForm?.currency"
                @sort-update="handleSortClick"
              />
            </template>

            <template #body="props">
              <!-- 主資料列 -->
              <q-tr>
                <q-td key="member_account" :props="props" class="expand-cell">
                  <q-icon
                    v-if="walletSwitch"
                    :name="expandedRows[getRowKey(props.row)] ? 'arrow_drop_down' : 'arrow_right'"
                    color="blue"
                    size="sm"
                    class="cursor-pointer expand-icon"
                    @click="toggleExpand(props.row)"
                  />
                  <span class="text-blue cursor-pointer" @click="onAction(props.row)">{{
                    props.row.member_account
                  }}</span>
                </q-td>
                <q-td key="currency" :props="props">
                  {{ props.row.currency || $t("common.unknow") }}
                </q-td>
                <q-td key="bet_count" :props="props">
                  {{ moneyFormat(props.row.bet_count, 2) }}
                </q-td>
                <q-td key="win_count" :props="props">
                  {{ moneyFormat(props.row.win_count, 2) }}
                </q-td>
                <q-td key="deposit" :props="props">
                  {{ moneyFormat(props.row.deposit, 2) }}
                </q-td>
                <q-td key="withdraw" :props="props">
                  {{ moneyFormat(props.row.withdraw, 2) }}
                </q-td>
                <q-td key="bet_amount" :props="props">
                  {{ moneyFormat(props.row.bet_amount, 2) }}
                </q-td>
                <q-td key="valid_bet_amount" :props="props">
                  {{ moneyFormat(props.row.valid_bet_amount, 2) }}
                </q-td>
                <q-td key="payout" :props="props">
                  {{ moneyFormat(props.row.payout, 2) }}
                </q-td>
                <q-td key="profit" :props="props">
                  {{ moneyFormat(props.row.profit, 2) }}
                </q-td>
                <q-td key="profit_rate" :props="props"> {{ moneyFormat(props.row.profit_rate, 2) }}% </q-td>
                <q-td key="bonus" :props="props">
                  {{ moneyFormat(props.row.bonus, 2) }}
                </q-td>
                <q-td
                  key="prom_amount"
                  :props="props"
                  class="text-blue cursor-pointer"
                  @click="onPromAmountClick(props.row)"
                >
                  {{ moneyFormat(props.row.prom_amount, 2) }}
                </q-td>
                <q-td key="ngr" :props="props">
                  {{ moneyFormat(props.row.ngr_profit, 2) }}
                </q-td>
              </q-tr>

              <!-- 展開：錢包類型子表頭 -->
              <q-tr v-if="walletSwitch && expandedRows[getRowKey(props.row)]" class="sub-header-row">
                <q-td class="sub-header-empty" />
                <q-td class="text-center text-bold">{{ $t("table_header.wallet_type") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.order_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.jackpot_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.total_deposit") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.total_withdraw") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.bet_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.valid_bet") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.payout") }}</q-td>
                <q-td class="text-center text-bold">{{
                  isAnibetAgent ? $t("table_header.ggr_amount") : $t("table_header.winlose")
                }}</q-td>
                <q-td class="text-center text-bold">{{
                  isAnibetAgent ? $t("table_header.ggr_ratio") : $t("table_header.winrate_count")
                }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.event_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.promo_spend") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.winlose") }}(NGR)</q-td>
              </q-tr>

              <!-- 展開：錢包類型子資料列 -->
              <template v-if="walletSwitch && expandedRows[getRowKey(props.row)]">
                <q-tr v-if="expandedLoading[getRowKey(props.row)]" class="bg-grey-1">
                  <q-td :colspan="tableColumn?.length" class="text-center">
                    <q-spinner size="sm" />
                  </q-td>
                </q-tr>
                <q-tr v-else-if="!expandedData[getRowKey(props.row)]?.length" class="bg-grey-1">
                  <q-td :colspan="tableColumn?.length" class="text-center">
                    {{ $t("common.no_data") }}
                  </q-td>
                </q-tr>
                <q-tr
                  v-for="(subRow, subIdx) in expandedData[getRowKey(props.row)]"
                  v-else
                  :key="subIdx"
                  class="bg-grey-1"
                >
                  <q-td />
                  <q-td class="text-center">
                    {{ $t(BONUS_WALLET_TYPE.I18nKeys[subRow.wallet_type as BONUS_WALLET_TYPE.Enums]) }}
                  </q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bet_count, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.win_count, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.deposit, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.withdraw, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bet_amount, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.valid_bet_amount, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.payout, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.profit, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.profit_rate, 2) }}%</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bonus, 2) }}</q-td>
                  <q-td
                    class="text-center text-blue cursor-pointer"
                    @click="onPromAmountClick(props.row, subRow.wallet_type)"
                    >{{ moneyFormat(subRow.prom_amount, 2) }}</q-td
                  >
                  <q-td class="text-center">{{ moneyFormat(subRow.ngr_profit, 2) }}</q-td>
                </q-tr>
              </template>
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
  import { computed, reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { getMemberBetReportList, getMemberBetReportExport, getMemberBetReportWalletDetail } from "@/api/report"
  import type * as Resquest from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { usePermission } from "@/hook/usePermission"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useExport } from "@/hook/useExport"
  import { useTableSort } from "@/hook/useTableSort"
  import { useEnv } from "src/hook/useEnv"
  import TableHeaderSort from "@/components/tables/TableHeaderSort.vue"
  import { useUserInfo } from "@/hook/useUserInfo"
  import { convertPromoTypesToAccountFlowTypes } from "@/utils/constants/promoToAccountFlowMapping"

  const { permission } = usePermission()
  const { walletSwitch } = useWalletBouns()
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const { orderType, sortType, handleSort, resetSort } = useTableSort()
  const { isAnibetAgent } = useUserInfo()

  const { isAdminMode, isGeneralAgentMode } = useEnv()
  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useMemberAccount: true,
      useCurrency: true,
      useDatePicker: true,
      useTimePicker: true,
      useMemberTag: true,
      useExcludeMemberTag: true,
      useRecommender: true,
      useExport: false
    }

    return baseConfig
  })

  const { search, tableData, totalSize, tableTotal, tableSubTotal, spinShow } = useSearch(getMemberBetReportList)

  const { moneyFormat } = useCommon()

  // 展開：錢包類型明細
  const expandedRows = reactive<Record<string, boolean>>({})
  const expandedData = reactive<Record<string, (Response.MemberBetReportItem & { wallet_type: number })[]>>({})
  const expandedLoading = reactive<Record<string, boolean>>({})

  function getRowKey(row: Response.MemberBetReportItem) {
    return `${row.member_account}_${row.currency}`
  }

  async function toggleExpand(row: Response.MemberBetReportItem) {
    const key = getRowKey(row)
    if (expandedRows[key]) {
      expandedRows[key] = false
      return
    }
    expandedRows[key] = true

    expandedLoading[key] = true
    const { search: searchDetail, tableData: detailData, status } = useSearch(getMemberBetReportWalletDetail)
    await searchDetail({
      ...catchQueryForm,
      member_id: row.member_id,
      currency: row.currency_id
    })
    if (status.value) {
      expandedData[key] = detailData.value || []
    }
    expandedLoading[key] = false
  }

  let catchQueryForm: Resquest.GetMemberBetReportList
  async function onSubmit(queryForm: Resquest.GetMemberBetReportList) {
    catchQueryForm = queryForm

    if (!catchQueryForm.currency && orderType.value) {
      resetSort()
    }

    catchQueryForm.order_type = orderType.value
    catchQueryForm.sort_type = sortType.value
    await search(catchQueryForm)
  }

  function handleSortClick(field: string) {
    if (spinShow.value) return

    handleSort(field)
    onSubmit(catchQueryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const { currency } = route.query
    return [
      {
        name: "member_account",
        label: t("table_header.member_account"),
        field: "member_account",
        sortable: false,
        align: "center",
        useSubTotalColumn: false
      },
      {
        name: "currency",
        label: t("table_header.currency"),
        field: "currency",
        sortable: false,
        align: "center",
        useSubTotalColumn: false
      },
      {
        name: "bet_count",
        label: t("table_header.order_amount"),
        field: "bet_count",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "bet_count",
        totalColumn: "bet_count"
      },
      {
        name: "win_count",
        label: t("table_header.jackpot_amount"),
        field: "win_count",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "win_count",
        totalColumn: "win_count"
      },
      {
        name: "deposit",
        label: t("table_header.total_deposit"),
        field: "deposit",
        sortable: false,
        align: "center",
        useSubTotalColumn: currency ? true : false,
        subTotalColumn: currency ? "deposit" : "",
        totalColumn: currency ? "deposit" : ""
      },
      {
        name: "withdraw",
        label: t("table_header.total_withdraw"),
        field: "withdraw",
        sortable: false,
        align: "center",
        useSubTotalColumn: currency ? true : false,
        subTotalColumn: currency ? "withdraw" : "",
        totalColumn: currency ? "withdraw" : ""
      },
      {
        name: "bet_amount",
        label: t("table_header.bet_amount"),
        field: "bet_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: currency ? true : false,
        subTotalColumn: currency ? "bet_amount" : "",
        totalColumn: currency ? "bet_amount" : ""
      },
      {
        name: "valid_bet_amount",
        label: t("table_header.valid_bet"),
        field: "valid_bet_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: currency ? true : false,
        subTotalColumn: currency ? "valid_bet_amount" : "",
        totalColumn: currency ? "valid_bet_amount" : ""
      },
      {
        name: "payout",
        label: t("table_header.payout"),
        field: "payout",
        sortable: false,
        align: "center",
        useSubTotalColumn: currency ? true : false,
        subTotalColumn: currency ? "payout" : "",
        totalColumn: currency ? "payout" : ""
      },
      {
        name: "profit",
        label: isAnibetAgent.value ? t("table_header.ggr_amount") : t("table_header.winlose"),
        field: "profit",
        sortable: true,
        align: "center",
        useSubTotalColumn: currency ? true : false,
        subTotalColumn: currency ? "profit" : "",
        totalColumn: currency ? "profit" : ""
      },
      {
        name: "profit_rate",
        label: isAnibetAgent.value ? t("table_header.ggr_ratio") : t("table_header.winrate_count"),
        field: "profit_rate",
        sortable: false,
        align: "center",
        useSubTotalColumn: currency ? true : false,
        subTotalColumn: currency ? "profit_rate" : "",
        totalColumn: currency ? "profit_rate" : "",
        appendStringI18nKey: "%"
      },
      {
        name: "bonus",
        label: t("table_header.event_amount"),
        field: "bonus",
        sortable: false,
        align: "center",
        useSubTotalColumn: currency ? true : false,
        subTotalColumn: currency ? "bonus" : "",
        totalColumn: currency ? "bonus" : ""
      },
      {
        name: "prom_amount",
        label: t("table_header.promo_spend"),
        field: "prom_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: currency ? true : false,
        subTotalColumn: currency ? "prom_amount" : "",
        totalColumn: currency ? "prom_amount" : ""
      },
      {
        name: "ngr",
        label: t("table_header.winlose") + "(NGR)",
        field: "ngr_profit",
        sortable: false,
        align: "center",
        useSubTotalColumn: currency ? true : false,
        subTotalColumn: currency ? "ngr_profit" : "",
        totalColumn: currency ? "ngr_profit" : ""
      }
    ]
  })

  function onAction(row: Response.MemberBetReportItem) {
    const { start, end } = route.query
    const memberAccount = row.member_account
    const currency = row.currency_id
    router.push({
      name: "BetRecord",
      query: {
        start,
        end,
        memberAccount,
        currency
      }
    })
  }

  function onPromAmountClick(row: Response.MemberBetReportItem, walletType?: number) {
    const { start, end } = route.query
    const memberAccount = row.member_account
    const currency = row.currency_id
    // 從 row.prom_type 取得優惠類型對應的帳變類型
    const promType = row.prom_type
    // 使用映射函數將 DailyReportPromoType 轉換為 ACCOUNT_FLOW_TYPE
    const accountFlowTypes = promType ? convertPromoTypesToAccountFlowTypes(promType) : []
    const query: Record<string, any> = {
      start,
      end,
      memberAccount,
      currency,
      accountFlowType: accountFlowTypes
    }
    if (walletType != null) {
      query.wallet_type = walletType
    }
    router.push({
      name: "AccountFlowReport",
      query
    })
  }

  const { getExportPath } = useExport()
  const Loading = ref(false)
  const onExport = async (params: Resquest.GetMemberBetReportList) => {
    Loading.value = true
    const { search, status, tableData } = useSearch(getMemberBetReportExport)
    await search(params)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
    Loading.value = false
  }
  const tableHeight = computed(() => {
    const rowHeight = 48
    const headerHeight = 40
    const maxHeight = 600
    const rowCount = tableData.value.length
    if (rowCount === 0 || rowCount <= 10) {
      return "auto"
    }

    const contentHeight = rowCount * rowHeight + headerHeight
    return `${Math.min(contentHeight, maxHeight)}px`
  })
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

  :deep(.sub-header-row) {
    td {
      background-color: #dceeff !important;
    }

    td.sub-header-empty {
      background-color: transparent !important;
    }
  }

  .expand-cell {
    position: relative;
    text-align: center;
  }

  .expand-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
