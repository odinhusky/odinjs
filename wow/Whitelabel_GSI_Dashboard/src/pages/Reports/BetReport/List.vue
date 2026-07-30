<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template v-slot:mainContent>
        <div v-if="false" class="row q-mb-md justify-start">
          <q-btn outline color="main-color" @click="onExport">
            {{ $t("btn.export") }}
            <q-icon class="q-ml-xs" size="xs" name="archive" />
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
            <template #body="props">
              <!-- 主資料列 -->
              <q-tr>
                <q-td key="expand" :props="props" class="text-center">
                  <q-icon
                    v-if="walletSwitch"
                    :name="expandedRows[getRowKey(props.row)] ? 'arrow_drop_down' : 'arrow_right'"
                    color="blue"
                    size="sm"
                    class="cursor-pointer"
                    @click="toggleExpand(props.row)"
                  />
                </q-td>
                <q-td key="currency" :props="props">
                  <span class="cursor-pointer" @click="onAction(props.row)">{{
                    props.row.currency || $t("common.unknow")
                  }}</span>
                </q-td>
                <q-td key="bet_count" :props="props">
                  {{ moneyFormat(props.row.bet_count, 2) }}
                </q-td>
                <q-td key="win_count" :props="props">
                  {{ moneyFormat(props.row.win_count, 2) }}
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
                <q-td key="profit" :props="props"> {{ moneyFormat(props.row.profit, 2) }} </q-td>
                <q-td key="profit_rate" :props="props"> {{ moneyFormat(props.row.profit_rate, 2) }}% </q-td>
                <q-td key="bonus" :props="props">
                  {{ moneyFormat(props.row.bonus, 2) }}
                </q-td>
              </q-tr>

              <!-- 展開：錢包類型子表頭 -->
              <q-tr v-if="walletSwitch && expandedRows[getRowKey(props.row)]" class="sub-header-row">
                <q-td class="sub-header-empty" />
                <q-td class="text-center text-bold">{{ $t("table_header.wallet_type") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.order_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.jackpot_amount") }}</q-td>
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
                  <q-td class="text-center">{{ moneyFormat(subRow.bet_amount, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.valid_bet_amount, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.payout, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.profit, 2) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.profit_rate, 2) }}%</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bonus, 2) }}</q-td>
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
                :columns="props.cols"
                :table-data="tableData"
                :sub-total-data="tableSubTotal"
                :total-data="tableTotal"
              />
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { CustomQTableProps } from "quasar"
  import { computed, reactive } from "vue"
  import { useI18n } from "vue-i18n"

  import { getBetReportList, getBetReportWalletDetail } from "@/api/report"
  import type { GetBetReportList } from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useRoute, useRouter } from "vue-router"
  import { useUserInfo } from "@/hook/useUserInfo"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const { walletSwitch } = useWalletBouns()
  const { isAnibetAgent } = useUserInfo()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useCurrency: true,
      useGameType: true,
      useGameCode: true,
      useDatePicker: true,
      useTimePicker: false,
      useMultiBetReportDateType: false
    }

    return baseConfig
  })

  const { search, tableData, totalSize, tableSubTotal, tableTotal } = useSearch(getBetReportList)

  const { moneyFormat } = useCommon()

  // 展開：錢包類型明細
  const expandedRows = reactive<Record<string, boolean>>({})
  const expandedData = reactive<Record<string, (Response.betReportItem & { wallet_type: number })[]>>({})
  const expandedLoading = reactive<Record<string, boolean>>({})

  function getRowKey(row: Response.betReportItem) {
    return `${row.currency}`
  }

  async function toggleExpand(row: Response.betReportItem & { currency_id: number }) {
    const key = getRowKey(row)
    if (expandedRows[key]) {
      expandedRows[key] = false
      return
    }
    expandedRows[key] = true

    expandedLoading[key] = true
    const { search: searchDetail, tableData: detailData, status } = useSearch(getBetReportWalletDetail)
    await searchDetail({
      ...catchQueryForm,
      currency: row.currency_id
    })
    if (status.value) {
      expandedData[key] = detailData.value || []
    }
    expandedLoading[key] = false
  }

  let catchQueryForm: GetBetReportList
  async function onSubmit(queryForm: GetBetReportList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const { currency } = route.query
    const baseColumns: CustomQTableProps["columns"] = [
      {
        name: "expand",
        label: "",
        field: "",
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
      // {
      //   name: "player_count",
      //   label: t("table_header.bet_quantity"),
      //   field: "player_count",
      //   sortable: false,
      //   align: "right",
      //   useSubTotalColumn: true,
      //   subTotalColumn: "player_count",
      //   totalColumn: "player_count"
      // },
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
        sortable: false,
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
        appendStringI18nKey: currency ? "%" : ""
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
      }
    ]

    return baseColumns
  })

  function onAction(row: GetBetReportList) {
    // 投注報表、產品投注報表暫不提供點進第二層明細
    return
    const { start, end, game_type, code } = route.query
    router.push({
      name: "BetReportProductDetail",
      params: {
        currencyId: row.currency_id
      },
      query: {
        start,
        end,
        game_type,
        code,
        currencyId: row.currency
      }
    })
  }

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

  :deep(.sub-header-row) {
    td {
      background-color: #dceeff !important;
    }

    td.sub-header-empty {
      background-color: transparent !important;
    }
  }

  :deep(.q-table) {
    th:first-child,
    td:first-child {
      width: 40px;
      max-width: 40px;
      padding: 4px;
    }
  }

  .text-right {
    text-align: right !important;
  }
</style>
