<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-end">
          <q-btn class="btns q-ml-xs btn-export" @click="() => onExport(catchQueryForm)">
            <q-icon size="xs" name="archive" />
            {{ $t("btn.export") }}
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
              <q-tr>
                <q-td key="product_name" :props="props">
                  {{ props.row.product_name }}
                </q-td>
                <q-td key="game_type" :props="props">
                  {{ $t(GAME_TYPE.I18nKeys[props.row.game_type as GAME_TYPE.Enums] || "common.unknow") }}
                </q-td>
                <q-td key="currency_id" :props="props">
                  {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums] || "common.unknow") }}
                </q-td>
                <q-td key="bet_amount" :props="props">
                  {{ moneyFormat(props.row.bet_amount, 2) }}
                </q-td>
                <q-td key="valid_bet_amount" :props="props">
                  {{ moneyFormat(props.row.valid_bet_amount, 2) }}
                </q-td>
                <q-td key="payout_amount" :props="props">
                  {{ moneyFormat(props.row.payout_amount, 2) }}
                </q-td>
                <q-td key="profit" :props="props">
                  {{ moneyFormat(props.row.profit, 2) }}
                </q-td>
                <q-td key="commission_amount" :props="props">
                  {{ moneyFormat(props.row.commission_amount, 2) }}
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
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { getAgentCommissionReportList, AgentCommissionReportExport } from "@/api/report"
  import { getGeneralAgentList } from "@/api/common"
  import { GetAgentBetReportList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { CustomQTableProps } from "quasar"
  import { computed, reactive, ref, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { CURRENCY_TYPE, GAME_TYPE } from "@/utils/constants"
  import { useExport } from "@/hook/useExport"
  import { useRouter } from "vue-router"

  const { t } = useI18n()
  const { moneyFormat } = useCommon()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useAgentAccount: true,
    useCurrency: true,
    useGameType: true,
    useAgentGameCode: true,
    useDatePicker: true
  })
  const agent_id = ref(0)
  let catchQueryForm: GetAgentBetReportList
  onMounted(async () => {
    getFirstAgent()
  })

  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getAgentCommissionReportList)

  const router = useRouter()
  async function onSubmit(queryForm: GetAgentBetReportList) {
    catchQueryForm = queryForm
    if (agent_id.value === 0) {
      await getFirstAgent()
      queryForm.agentAccount = agent_id.value
      router.replace({
        query: {
          ...router.currentRoute.value.query,
          agentAccount: String(queryForm.agentAccount)
        }
      })
    }

    if (queryForm) await search(queryForm)
  }

  async function getFirstAgent() {
    const { data } = await getGeneralAgentList()
    agent_id.value = data.list[0].id
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "product_name",
      label: t("query_params.product"),
      field: "product_name",
      sortable: false,
      align: "center"
    },
    {
      name: "game_type",
      label: t("query_params.product_type"),
      field: "game_type",
      sortable: false,
      align: "center"
    },
    {
      name: "currency_id",
      label: t("table_header.currency"),
      field: "currency_id",
      sortable: false,
      align: "center"
    },
    {
      name: "bet_amount",
      label: t("table_header.bet_amount"),
      field: "bet_amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "bet_amount",
      totalColumn: "bet_amount"
    },
    {
      name: "valid_bet_amount",
      label: t("table_header.validate_bet"),
      field: "valid_bet_amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "valid_bet_amount",
      totalColumn: "valid_bet_amount"
    },

    {
      name: "payout_amount",
      label: t("table_header.payout"),
      field: "payout_amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "payout_amount",
      totalColumn: "payout_amount"
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
      name: "commission_amount",
      label: t("common.commission_flow_type"),
      field: "commission_amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "commission_amount",
      totalColumn: "commission_amount"
    }
  ])

  // 匯出
  const { getExportPath } = useExport()
  const onExport = async (params: GetAgentBetReportList) => {
    const { search, status, tableData } = useSearch(AgentCommissionReportExport)
    await search(params)
    if (status.value) {
      getExportPath(tableData.value.export_id)
    }
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
</style>
