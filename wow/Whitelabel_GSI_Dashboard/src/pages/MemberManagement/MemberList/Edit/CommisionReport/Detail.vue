<template>
  <SubPage :action-label-i18n-key="'menu.commission_detail'" class="q-mt-xl" :custom-back-func="onBackTo" />
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
              <q-td key="wager_id" :props="props">
                {{ props.row.wager_id }}
              </q-td>
              <q-td key="at" :props="props">
                {{ genTimeFormat(props.row.at) }}
              </q-td>
              <q-td key="settled_at" :props="props">
                {{ genTimeFormat(props.row.settled_at) }}
              </q-td>
              <q-td key="status" :props="props">
                {{ $t(SETTLEMENT_TYPE.I18nKeys[props.row.status] || "common.unknow") }}
              </q-td>
              <q-td key="currency" :props="props">
                {{ props.row.currency }}
              </q-td>
              <q-td key="product_code" :props="props">
                {{ queryStore.productCodeMap[props.row.product_code] }}
              </q-td>
              <q-td key="game_code" :props="props">
                {{ queryStore.gameTypeList[props.row.game_code] }}
              </q-td>
              <q-td key="bet" :props="props">
                {{ moneyFormat(props.row.bet) }}
              </q-td>
              <q-td key="valid_bet" :props="props">
                {{ moneyFormat(props.row.valid_bet) }}
              </q-td>
              <q-td key="profit" :props="props"> {{ moneyFormat(props.row.profit) }} </q-td>
              <q-td key="profit_rate" :props="props"> {{ props.row.profit_rate }}% </q-td>
              <!-- 明細 -->
              <!-- <q-td key="detail" :props="props">
                <q-btn flat fab-mini icon="report" color="secondary" @click="onAction(props.row)">
                  <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.details") }}</q-tooltip>
                </q-btn>
              </q-td> -->
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
  import { getMemberCommisionReportDetail } from "@/api/member"
  import type { GetMemberCommisionReportDetail } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { CURRENCY_TYPE, SETTLEMENT_TYPE } from "@/utils/constants"
  import { useQueryStore } from "@/stores/queryStore"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const queryStore = useQueryStore()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })
  const { genTimeFormat, moneyFormat } = useCommon()

  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getMemberCommisionReportDetail)

  async function onSubmit(queryForm: GetMemberCommisionReportDetail) {
    queryForm.id = Number(route.params.id as string)
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "wager_id",
      label: t("table_header.bet_number"),
      field: "wager_id",
      sortable: false,
      align: "center"
    },
    {
      name: "at",
      label: t("table_header.bet_date"),
      field: "at",
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
      name: "status",
      label: t("table_header.status"),
      field: "status",
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
      name: "product_code",
      label: t("table_header.product"),
      field: "product_code",
      sortable: false,
      align: "center"
    },
    {
      name: "game_code",
      label: t("table_header.game"),
      field: "game_code",
      sortable: false,
      align: "center"
    },
    {
      name: "bet",
      label: t("table_header.bet_amount"),
      field: "bet",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "valid_bet",
      totalColumn: "valid_bet"
    },
    {
      name: "valid_bet",
      label: t("table_header.validate_bet"),
      field: "valid_bet",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "bet",
      totalColumn: "bet"
    },
    {
      name: "profit",
      label: t("table_header.winlose"),
      field: "profit",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "profit",
      totalColumn: "profit"
    },
    {
      name: "profit_rate",
      label: t("table_header.winrate_count"),
      field: "profit_rate",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "rate",
      totalColumn: "rate",
      appendStringI18nKey: "%"
    }
    // {
    //   name: "detail",
    //   label: t("table_header.detail"),
    //   field: "detail",
    //   sortable: false,
    //   align: "center"
    // }
  ])
  function onBackTo() {
    const { start, end } = route.query
    router.push({
      name: "CommisionReportList",
      query: {
        start,
        end
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
