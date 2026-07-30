<template>
  <SubPage :action-label-i18n-key="message" :custom-back-func="onBackTo" class="q-mt-xl" />
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
              <q-td key="master_id" :props="props">
                {{ props.row.master_id }}
              </q-td>
              <q-td key="master_code" :props="props">
                {{ props.row.master_code }}
              </q-td>
              <q-td key="player_count" :props="props">
                {{ props.row.player_count }}
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
              <q-td key="profit" :props="props">
                {{ moneyFormat(props.row.profit, 2) }}
              </q-td>
              <q-td key="profit_rate" :props="props"> {{ moneyFormat(props.row.profit_rate, 2) }}% </q-td>
              <q-td key="bonus" :props="props">
                {{ moneyFormat(props.row.bonus, 2) }}
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
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { CustomQTableProps } from "quasar"
  import { computed, reactive } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter, useRoute } from "vue-router"
  import { getMasterAgentBetReportList } from "@/api/report"
  import type { GetProductBetReportList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { GAME_TYPE } from "@/utils/constants"

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

  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getMasterAgentBetReportList)

  const { moneyFormat } = useCommon()

  const message = computed(() => {
    const { currency_title, product_title } = route.query
    return `${product_title}(${currency_title})`
  })

  async function onSubmit(queryForm: GetProductBetReportList) {
    queryForm.id = Number(route.params.productId as string)
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "master_id",
      label: t("table_header.master_agent_ID"),
      field: "master_id",
      sortable: false,
      align: "center"
    },
    {
      name: "master_code",
      label: t("table_header.agent_name"),
      field: "master_code",
      sortable: false,
      align: "center"
    },
    {
      name: "player_count",
      label: t("table_header.bet_quantity"),
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
      name: "profit",
      label: t("table_header.winlose_amount"),
      field: "profit",
      sortable: false,
      align: "center"
    },
    {
      name: "profit_rate",
      label: t("table_header.winrate_count"),
      field: "profit_rate",
      sortable: false,
      align: "center",
      useSubTotalColumn: true
    },
    {
      name: "bonus",
      label: t("table_header.event_amount"),
      field: "bonus",
      sortable: false,
      align: "center"
    }
  ])
  function onExport() {
    console.log("onExport")
  }
  function onBackTo() {
    const { start, end, currency_title, export: isExport, game_type, code } = route.query
    router.push({
      name: "ProductBetReportList",
      query: {
        start,
        end,
        currency_title: currency_title,
        export: isExport,
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
