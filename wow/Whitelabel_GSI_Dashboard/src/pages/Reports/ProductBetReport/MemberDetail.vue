<template>
  <div class="q-pa-md">
    <SubPage :action-label-i18n-key="message" :custom-back-func="onBackTo" class="q-mb-md" />
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-end">
          <q-btn class="btns q-ml-xs btn-export" @click="() => onExport()">
            <q-icon size="xs" name="archive" />
            {{ $t("btn.export") }}
          </q-btn>
        </div>
        <q-table
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="formatTableData.list"
          :columns="tableColumn"
          table-header-class="bg-success"
          row-key="id"
          hide-no-data
        >
          <template #body="props">
            <q-tr v-if="formatTableData.list.length">
              <q-td key="code" :props="props">
                {{ props.row.code }}
              </q-td>
              <q-td key="created_at" :props="props">
                {{ props.row.created_at ? genTimeFormat(props.row.created_at) : "-" }}
              </q-td>
              <q-td key="settled_at" :props="props">
                {{ props.row.settled_at ? genTimeFormat(props.row.settled_at) : "-" }}
              </q-td>
              <q-td key="status" :props="props">
                {{
                  $t(
                    SETTLEMENT_TYPE.I18nKeys[props.row.status as SETTLEMENT_TYPE.Enums]
                      ? SETTLEMENT_TYPE.I18nKeys[props.row.status as SETTLEMENT_TYPE.Enums]
                      : "common.unknow"
                  )
                }}
              </q-td>
              <q-td key="wallet_type" :props="props">
                {{ $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums]) }}
              </q-td>
              <q-td key="product_code" :props="props">
                {{ props.row.product_title }}
              </q-td>
              <q-td key="game_type" :props="props">
                {{ props.row.game_title }}
              </q-td>
              <q-td key="bet_amount" :props="props">
                {{ moneyFormat(props.row.bet_amount, 2) }}
              </q-td>
              <q-td key="valid_bet_amount" :props="props">
                {{ moneyFormat(props.row.valid_bet_amount, 2) }}
              </q-td>
              <q-td key="prize_amount" :props="props">
                {{ moneyFormat(props.row.prize_amount, 2) }}
              </q-td>
              <q-td key="profit" :props="props"> {{ moneyFormat(props.row.profit, 2) }} </q-td>
              <!-- <q-td key="profit_rate" :props="props"> {{ moneyFormat(props.row.profit_rate, 2) }}% </q-td> -->
              <q-td key="bonus" :props="props">
                {{ moneyFormat(props.row.bonus, 2) }}
              </q-td>
              <!-- <q-td key="detail" :props="props">
                <q-btn color="primary" @click="goToGameLink()">
                  <span>{{ $t("common.detail") }}</span>
                </q-btn>
              </q-td> -->
            </q-tr>

            <!-- 查無資料 -->
            <q-tr v-else>
              <q-td colspan="99">
                <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
              </q-td>
            </q-tr>
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
  import { getMemberBetReportDetail } from "@/api/report"
  import type { GetProductBetReportList } from "@/api/request.type"
  import type { memberBetReportDetailItem } from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import SubPage from "layouts/SubPage/Index.vue"
  import { GAME_TYPE, SETTLEMENT_TYPE, BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useQueryStore } from "@/stores/queryStore"
  import { useWalletBouns } from "@/hook/useWalletBouns"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const queryStore = useQueryStore()
  const { walletSwitch } = useWalletBouns()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }

    return baseConfig
  })

  const { moneyFormat, genTimeFormat } = useCommon()

  const { search, tableData, totalSize, tableTotal, tableSubTotal, isSuccess } = useSearch(getMemberBetReportDetail)

  const formatTableData = reactive({
    list: []
  })
  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const baseColumns: CustomQTableProps["columns"] = [
      {
        name: "code",
        label: t("table_header.bet_number"),
        field: "code",
        sortable: false,
        align: "center",
        useSubTotalColumn: false
      },
      {
        name: "created_at",
        label: t("table_header.bet_date"),
        field: "created_at",
        sortable: false,
        align: "center",
        useSubTotalColumn: false
      },
      {
        name: "settled_at",
        label: t("table_header.end_date"),
        field: "settled_at",
        sortable: false,
        align: "center",
        useSubTotalColumn: false
      },
      {
        name: "status",
        label: t("table_header.status"),
        field: "status",
        sortable: false,
        align: "center",
        useSubTotalColumn: false
      },
      {
        name: "wallet_type",
        label: t("table_header.wallet_type"),
        field: "wallet_type",
        sortable: false,
        align: "center"
      },
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
        label: t("table_header.game"),
        field: "game_type",
        sortable: false,
        align: "center",
        useSubTotalColumn: false
      },
      {
        name: "bet_amount",
        label: t("table_header.bet_amount"),
        field: "bet_amount",
        sortable: false,
        align: "right",
        useSubTotalColumn: true,
        subTotalColumn: "bet_amount",
        totalColumn: "bet_amount"
      },
      {
        name: "valid_bet_amount",
        label: t("table_header.valid_bet"),
        field: "valid_bet_amount",
        sortable: false,
        align: "right",
        useSubTotalColumn: true,
        subTotalColumn: "valid_bet_amount",
        totalColumn: "valid_bet_amount"
      },
      {
        name: "prize_amount",
        label: t("table_header.payout"),
        field: "prize_amount",
        sortable: false,
        align: "right",
        useSubTotalColumn: true,
        subTotalColumn: "prize_amount",
        totalColumn: "prize_amount"
      },
      {
        name: "profit",
        label: t("table_header.winlose"),
        field: "profit",
        sortable: false,
        align: "right",
        useSubTotalColumn: true,
        subTotalColumn: "profit",
        totalColumn: "profit"
      },
      // {
      //   name: "profit_rate",
      //   label: t("table_header.winrate_count"),
      //   field: "profit_rate",
      //   sortable: false,
      //   align: "right",
      //   useSubTotalColumn: true,
      //   subTotalColumn: "profit_rate",
      //   totalColumn: "profit_rate",
      //   appendStringI18nKey: "%"
      // },
      {
        name: "bonus",
        label: t("table_header.event_amount"),
        field: "bonus",
        sortable: false,
        align: "right",
        useSubTotalColumn: true,
        subTotalColumn: "bonus",
        totalColumn: "bonus"
      }
    ]

    return walletSwitch.value ? baseColumns : baseColumns.filter((column) => column.name !== "wallet_type")
  })

  const message = computed(() => {
    const { currency_title, member_account, product_title } = route.query
    return `${product_title}(${currency_title}) / ${member_account}`
  })

  function onExport() {
    console.log("onExport")
  }

  const productId = computed(() => parseInt(route.params.productId as string))
  const currencyId = computed(() => parseInt(route.params.currencyId as string))
  const memberId = computed(() => parseInt(route.params.memberId as string))

  async function onSubmit(queryForm: GetProductBetReportList) {
    queryForm.product_code = productId.value
    queryForm.currency = currencyId.value
    queryForm.member_id = memberId.value

    await search(queryForm)

    formatTableData.list =
      tableData.value && tableData.value.length
        ? tableData.value
            .filter((item: memberBetReportDetailItem) => item.product_code === productId.value)
            .map((item: memberBetReportDetailItem) => ({
              ...item,
              winlose: parseInt(item.prize_amount) - parseInt(item.bet_amount),
              winloseRate:
                ((parseInt(item.prize_amount) - parseInt(item.bet_amount)) / parseInt(item.valid_bet_amount)) * 100
            }))
        : []
  }

  function onBackTo() {
    const { start, end, currency_title, product_title, game_type, code } = route.query

    router.push({
      name: "ProductBetReportDetail",
      query: {
        start,
        end,
        currency_title,
        product_title,
        game_type,
        code
      }
    })
  }
  // 目前缺 link
  const goToGameLink = () => {
    console.log("goToGameLink")
    // window.open("", "_blank")
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
