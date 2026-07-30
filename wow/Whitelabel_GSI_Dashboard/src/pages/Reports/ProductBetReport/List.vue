<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template v-slot:mainContent>
        <div class="row q-mb-md justify-end">
          <q-btn
            v-if="!isAdminMode && permission.export"
            class="btns q-ml-xs btn-export"
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
            <template #body="props">
              <!-- 主資料列 -->
              <q-tr>
                <q-td key="product_code" :props="props" class="expand-cell">
                  <q-icon
                    v-if="walletSwitch"
                    :name="expandedRows[getRowKey(props.row)] ? 'arrow_drop_down' : 'arrow_right'"
                    color="blue"
                    size="sm"
                    class="cursor-pointer expand-icon"
                    @click="toggleExpand(props.row)"
                  />
                  <span class="cursor-pointer" @click="onAction(props.row)">{{ props.row.product_title }}</span>
                </q-td>
                <q-td key="game_type" :props="props">
                  {{ $t(getGameTypeI18nKey(props.row.game_type as GameTypeEnums)) }}
                </q-td>
                <q-td key="currency" :props="props">
                  {{ props.row.currency || $t("common.unknow") }}
                </q-td>
                <q-td key="player_count" :props="props">
                  {{ moneyFormat(props.row.player_count, 2) }}
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
                <q-td key="profit" :props="props">
                  {{ moneyFormat(props.row.profit, 2) }}
                </q-td>
                <q-td key="profit_rate" :props="props"> {{ moneyFormat(props.row.profit_rate, 2) }}% </q-td>
                <q-td key="bonus" :props="props">
                  {{ moneyFormat(props.row.bonus, 2) }}
                </q-td>
              </q-tr>

              <!-- 展開：錢包類型子表頭 -->
              <q-tr v-if="walletSwitch && expandedRows[getRowKey(props.row)]" class="sub-header-row">
                <q-td class="sub-header-empty" />
                <q-td class="sub-header-empty" />
                <q-td class="text-center text-bold">{{ $t("table_header.wallet_type") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.bet_player_count") }}</q-td>
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
                  <q-td />
                  <q-td class="text-center">
                    {{ $t(BONUS_WALLET_TYPE.I18nKeys[subRow.wallet_type as BONUS_WALLET_TYPE.Enums]) }}
                  </q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.player_count, 2) }}</q-td>
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
  import { computed, onMounted, reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { getProductBetReportList, getProductBetReportExport, getProductBetReportWalletDetail } from "@/api/report"
  import type { GetProductBetReportList } from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "src/hook/useEnv"
  import { useQueryStore } from "@/stores/queryStore"
  import { usePermission } from "@/hook/usePermission"
  import { BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useExport } from "@/hook/useExport"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { useUserInfo } from "@/hook/useUserInfo"
  import { useGameType } from "@/composables/useGameType"
  import { Enums as GameTypeEnums } from "@/utils/constants/gameType"

  const { permission } = usePermission()

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const queryStore = useQueryStore()
  const { walletSwitch } = useWalletBouns()
  const { isAdminMode, isGeneralAgentMode, isAgentMode } = useEnv()
  const { isAnibetAgent } = useUserInfo()
  const { getGameTypeI18nKey } = useGameType()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true
    }
    // 區分環境
    if (isGeneralAgentMode) {
      baseConfig.useAgentAccount = true
    }
    if (isAdminMode) {
      baseConfig.useAdminAgentAccount = true
    }
    baseConfig.useCurrency = true
    baseConfig.useGameType = true
    baseConfig.useGameCode = true
    baseConfig.useDatePicker = true
    baseConfig.useTimePicker = false
    baseConfig.useMultiBetReportDateType = false
    return baseConfig
  })

  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getProductBetReportList)

  const { moneyFormat } = useCommon()
  let catchQueryForm: GetProductBetReportList
  async function onSubmit(queryForm: GetProductBetReportList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  // 展開：錢包類型明細
  const expandedRows = reactive<Record<string, boolean>>({})
  const expandedData = reactive<Record<string, (Response.productBetReportItem & { wallet_type: number })[]>>({})
  const expandedLoading = reactive<Record<string, boolean>>({})

  function getRowKey(row: Response.productBetReportItem & { product_code: string }) {
    return `${row.product_code}_${row.currency}`
  }

  async function toggleExpand(
    row: Response.productBetReportItem & { product_code: string; currency_id: number; game_type: number }
  ) {
    const key = getRowKey(row)
    if (expandedRows[key]) {
      expandedRows[key] = false
      return
    }
    expandedRows[key] = true

    expandedLoading[key] = true
    const { search: searchDetail, tableData: detailData, status } = useSearch(getProductBetReportWalletDetail)
    await searchDetail({
      ...catchQueryForm,
      code: row.product_code,
      currency: row.currency_id,
      game_type: row.game_type
    })
    if (status.value) {
      expandedData[key] = detailData.value || []
    }
    expandedLoading[key] = false
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const { currency } = route.query
    return [
      {
        name: "product_code",
        label: t("table_header.product"),
        field: "product_code",
        sortable: false,
        align: "center",
        useSubTotalColumn: false
      },
      {
        name: "game_type",
        label: t("table_header.product_type"),
        field: "game_type",
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
        name: "player_count",
        label: t("table_header.bet_player_count"),
        field: "player_count",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "player_count",
        totalColumn: "player_count"
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
  })

  function onAction(row: GetProductBetReportList) {
    // 投注報表、產品投注報表暫不提供點進第二層明細
    return
    const { start, end, game_type, code } = route.query
    router.push({
      name: "ProductBetReportDetail",
      params: {
        productId: row.product_code,
        currencyId: row.currency_id
      },
      query: {
        start,
        end,
        product_title: row.product_title,
        currency_title: row.currency,
        export: permission.value.export === true ? "true" : "false",
        game_type,
        code
      }
    })
  }
  // 匯出
  const { getExportPath } = useExport()
  const onExport = async (params: GetProductBetReportList) => {
    const { search, status, tableData } = useSearch(getProductBetReportExport)
    await search(params)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }
  onMounted(async () => {
    await queryStore.getGameTypeList()
  })

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
