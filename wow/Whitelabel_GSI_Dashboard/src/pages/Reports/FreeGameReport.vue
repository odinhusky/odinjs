<template>
  <div class="q-pa-md" v-if="isShow">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
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
              <q-tr>
                <q-td key="code" :props="props"> {{ props.row.code }}</q-td>
                <q-td key="member_account" :props="props">
                  {{ props.row.member_account }}
                </q-td>
                <q-td key="created_at" :props="props">
                  {{ genTimeFormat(props.row.created_at) }}
                </q-td>
                <q-td key="settled_at" :props="props">
                  {{ genTimeFormat(props.row.settled_at) }}
                </q-td>
                <q-td key="status_title" :props="props">
                  {{ props.row.status_title }}
                </q-td>
                <q-td key="currency" :props="props">
                  {{ t(currencyFormat(props.row.currency_id)) }}
                </q-td>
                <q-td key="product_title" :props="props">
                  {{ props.row.product_title }}
                </q-td>
                <q-td key="game_title" :props="props">
                  {{ props.row.game_title }}
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
                <q-td v-if="walletSwitch" key="wallet_type" :props="props">
                  {{
                    props.row.wallet_type
                      ? t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                      : "-"
                  }}
                </q-td>
                <q-td key="profit" :props="props">
                  {{ moneyFormat(props.row.profit, 2) }}
                </q-td>
              </q-tr>
            </template>
            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm">{{ t("common.no_data") }}</div>
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
  import type { CustomQTableProps } from "quasar"
  import { computed, onMounted, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { getFreeGameList } from "@/api/report"
  import type { GetBetRecordList } from "@/api/request.type"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useRoute } from "vue-router"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useWalletBouns } from "@/hook/useWalletBouns"

  const { t } = useI18n()
  const store = useQueryStore()
  const isShow = ref(false)
  const { walletSwitch } = useWalletBouns()
  const route = useRoute()
  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useMemberAccount: true,
      useBetNumber: true,
      useCurrency: true,
      useGameCode: true,
      useDatePicker: true,
      useMultiBetReportDateType: true
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }
    return baseConfig
  })

  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getFreeGameList)

  const { genTimeFormat, moneyFormat } = useCommon()

  const memberAccountQuery = route.query.memberAccount
  const memberAccountFromQuery = Array.isArray(memberAccountQuery) ? memberAccountQuery[0] : memberAccountQuery
  const hasMemberAccount = typeof memberAccountFromQuery === "string" && memberAccountFromQuery.length > 0
  async function onSubmit(queryForm: GetBetRecordList) {
    if (hasMemberAccount) {
      queryForm.memberAccount = memberAccountFromQuery
    }
    await search(queryForm)
  }
  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const baseColumns: CustomQTableProps["columns"] = [
      {
        name: "code",
        label: t("table_header.number"),
        field: "code",
        sortable: false,
        align: "center"
      },
      {
        name: "member_account",
        label: t("table_header.member_account"),
        field: "member_account",
        sortable: false,
        align: "center"
      },
      {
        name: "created_at",
        label: t("table_header.bet_date"),
        field: "created_at",
        sortable: false,
        align: "center"
      },
      {
        name: "settled_at",
        label: t("table_header.settlement_date"),
        field: "settled_at",
        sortable: false,
        align: "center"
      },

      {
        name: "status_title",
        label: t("table_header.status"),
        field: "status_title",
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
        name: "product_title",
        label: t("table_header.product"),
        field: "product_title",
        sortable: false,
        align: "center"
      },
      {
        name: "game_title",
        label: t("table_header.game"),
        field: "game_title",
        sortable: false,
        align: "center"
      },
      {
        name: "bet_amount",
        label: t("table_header.bet_amount"),
        field: "bet_amount",
        sortable: false,
        align: "center"
      },
      {
        name: "valid_bet_amount",
        label: t("table_header.valid_bet"),
        field: "valid_bet_amount",
        sortable: false,
        align: "center"
      },
      {
        name: "payout",
        label: t("table_header.payout"),
        field: "payout",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        totalColumn: "payout",
        subTotalColumn: "payout"
      },
      ...(walletSwitch.value
        ? [
            {
              name: "wallet_type",
              label: t("table_header.wallet_type"),
              field: "wallet_type",
              sortable: false,
              align: "center" as const
            }
          ]
        : []),
      {
        name: "profit",
        label: t("table_header.winlose"),
        field: "profit",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        totalColumn: "profit",
        subTotalColumn: "profit"
      }
    ]

    return baseColumns
  })

  function onExport() {
    console.log("onExport")
  }
  interface columnFormat {
    value: number
    label: string
  }
  const currencyFormat = (id: number) => {
    const currencyFormat: columnFormat | undefined = store.currencyList.find((currency) => currency.value === id)
    return currencyFormat ? currencyFormat.label : ""
  }

  onMounted(async () => {
    await store.getProductDropdownList()
    await store.getGameDropdownList()

    isShow.value = true
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

  :deep(.table-total) {
    &.q-tr {
      background-color: #fff9e8 !important;
    }
  }
</style>
