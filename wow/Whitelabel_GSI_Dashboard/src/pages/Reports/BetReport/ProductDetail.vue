<template>
  <div class="q-pa-md">
    <SubPage :action-label-i18n-key="message" :custom-back-func="onBackTo" class="q-mb-md" />
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div v-if="false" class="row q-mb-md justify-start">
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
          hide-no-data
        >
          <template #body="props">
            <q-tr v-if="tableData.length">
              <q-td key="product_code" :props="props" class="text-blue cursor-pointer" @click="onAction(props.row)">
                {{ props.row.product_title }}
                ({{ props.row.product_code }})
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
  import { getBetReportProductDetail } from "@/api/report"
  import type { GetBetReportList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import SubPage from "layouts/SubPage/Index.vue"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })

  const { moneyFormat } = useCommon()

  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getBetReportProductDetail)

  const currencyId = computed(() => parseInt(route.params.currencyId as string))

  async function onSubmit(queryForm: GetBetReportList) {
    queryForm.currency = currencyId.value

    await search(queryForm)
  }
  const message = computed(() => route.query.currencyId)

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "product_code",
      label: t("table_header.product"),
      field: "product_code",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "player_count",
      label: t("table_header.bet_quantity"),
      field: "player_count",
      sortable: false,
      align: "right",
      useSubTotalColumn: true,
      subTotalColumn: "player_count",
      totalColumn: "player_count"
    },
    {
      name: "bet_count",
      label: t("table_header.order_number"),
      field: "bet_count",
      sortable: false,
      align: "right",
      useSubTotalColumn: true,
      subTotalColumn: "bet_count",
      totalColumn: "bet_count"
    },
    {
      name: "win_count",
      label: t("table_header.jackpot_amount"),
      field: "win_count",
      sortable: false,
      align: "right",
      useSubTotalColumn: true,
      subTotalColumn: "win_count",
      totalColumn: "win_count"
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
      name: "payout",
      label: t("table_header.payout"),
      field: "payout",
      sortable: false,
      align: "right",
      useSubTotalColumn: true,
      subTotalColumn: "payout",
      totalColumn: "payout"
    },
    {
      name: "profit",
      label: t("table_header.winlose_amount"),
      field: "profit",
      sortable: false,
      align: "right",
      useSubTotalColumn: true,
      subTotalColumn: "profit",
      totalColumn: "profit"
    },
    {
      name: "profit_rate",
      label: t("table_header.winrate_count"),
      field: "profit_rate",
      sortable: false,
      align: "right",
      useSubTotalColumn: true,
      subTotalColumn: "profit_rate",
      totalColumn: "profit_rate",
      appendStringI18nKey: "%"
    },
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
  ])

  function onExport() {
    console.log("onExport")
  }

  function onAction(row: any) {
    const { start, end, game_type, code } = route.query
    router.push({
      name: "BetReportMemberDetail",
      params: {
        currencyId: currencyId.value,
        productCode: row.product_code
      },
      query: {
        start,
        end,
        game_type,
        code,
        currencyId: route.query.currencyId,
        productCode: row.product_title
      }
    })
  }

  function onBackTo() {
    const { start, end, currencyId, game_type, code } = route.query
    router.push({
      name: "BetReportList",
      query: {
        start,
        end,
        currencyId,
        game_type,
        code
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
