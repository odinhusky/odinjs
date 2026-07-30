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
          :rows="formatTableData.list"
          :columns="tableColumn"
          table-header-class="bg-success"
          row-key="id"
          hide-no-data
        >
          <template #body="props">
            <q-tr v-if="formatTableData.list.length">
              <q-td key="id" :props="props">
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
              <q-td key="prize_amount" :props="props">
                {{ moneyFormat(props.row.prize_amount, 2) }}
              </q-td>
              <q-td key="profit" :props="props">
                {{ moneyFormat(props.row.profit, 2) }}
              </q-td>
              <q-td key="bonus" :props="props"> {{ moneyFormat(props.row.bonus, 2) }}</q-td>
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
  import { getMemberBetReportDetail } from "@/api/report"
  import * as Request from "@/api/request.type"
  import * as Response from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import SubPage from "layouts/SubPage/Index.vue"
  import { SETTLEMENT_TYPE, BONUS_WALLET_TYPE } from "@/utils/constants"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const { walletSwitch } = useWalletBouns()
  const { genTimeFormat, moneyFormat } = useCommon()
  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }
    baseConfig.usePagination = true

    return baseConfig
  })
  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getMemberBetReportDetail)

  const formatTableData = reactive({
    list: []
  })

  const currencyId = computed(() => parseInt(route.params.currencyId as string))
  const productCode = computed(() => parseInt(route.params.productCode as string))
  const memberId = computed(() => parseInt(route.params.memberId as string))

  async function onSubmit(queryForm: Request.GetMemberBetReportDetail) {
    queryForm.currency = currencyId.value
    queryForm.product_code = productCode.value
    queryForm.member_id = memberId.value

    await search(queryForm)

    formatTableData.list =
      tableData.value && tableData.value.length
        ? tableData.value.map((item: Response.memberBetReportDetailItem) => ({
            ...item,
            winlose: parseInt(item.prize_amount) - parseInt(item.bet_amount),
            winloseRate:
              ((parseInt(item.prize_amount) - parseInt(item.bet_amount)) / parseInt(item.valid_bet_amount)) * 100
          }))
        : []
  }
  const message = computed(() => {
    const { currencyId, productCode, memberId } = route.query
    return `${currencyId} / ${productCode} / ${memberId}`
  })
  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const baseColumns: CustomQTableProps["columns"] = [
      {
        name: "id",
        label: t("table_header.bet_number"),
        field: "id",
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
        name: "product_title",
        label: t("table_header.product"),
        field: "product_title",
        sortable: false,
        align: "center",
        useSubTotalColumn: false
      },
      {
        name: "game_title",
        label: t("table_header.game"),
        field: "game_title",
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

  function onExport() {
    console.log("onExport")
  }

  function onBackTo() {
    const { start, end, memberId, game_type, code } = route.query
    router.push({
      name: "BetReportMemberDetail",
      params: {
        currencyId: currencyId.value,
        productCode: productCode.value
      },
      query: {
        start,
        end,
        currencyId: route.query.currencyId,
        memberId,
        productCode: route.query.productCode,
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
