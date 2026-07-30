<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-end">
          <q-btn v-if="permission.export" class="btns q-ml-xs btn-export" @click="() => onExport()">
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
                <q-td key="agent_id" :props="props">
                  {{ props.row.agent_id }}
                </q-td>
                <q-td key="agent_code" :props="props">
                  {{ props.row.agent_code }}
                </q-td>
                <q-td key="currency" :props="props">
                  {{ $t(props.row.currency || "common.unknow") }}
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
  import { getAgentBetReportList } from "@/api/report"
  import { GetAgentBetReportList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { CustomQTableProps } from "quasar"
  import { computed, reactive } from "vue"
  import { useI18n } from "vue-i18n"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { usePermission } from "@/hook/usePermission"
  const { permission } = usePermission()

  const { t } = useI18n()
  const { moneyFormat } = useCommon()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useAgentAccount: true,
    useCurrency: true,
    useGameType: true,
    useGameCode: true,
    useDatePicker: true,
    // 目前報表只有結算時間 暫時隱藏選項
    // useDateType: true,
    // 目前沒有功能暫時隱藏
    // useExport: permission.value.export
    useExport: false
  })
  let catchQueryForm: GetAgentBetReportList
  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getAgentBetReportList)

  async function onSubmit(queryForm: GetAgentBetReportList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "agent_id",
      label: t("table_header.agent_account"),
      field: "agent_id",
      sortable: false,
      align: "center"
    },
    {
      name: "agent_code",
      label: t("table_header.agent_name"),
      field: "agent_code",
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
      name: "player_count",
      label: t("table_header.bet_quantity"),
      field: "bet_people_count",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "player_count",
      totalColumn: "player_count"
    },
    {
      name: "bet_count",
      label: t("table_header.order_amount"),
      field: "quantity_count",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "bet_count",
      totalColumn: "bet_count"
    },
    {
      name: "win_count",
      label: t("table_header.jackpot_amount"),
      field: "jackpot_count",
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
      field: "winlose_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "profit_rate",
      label: t("table_header.winrate_count"),
      field: "winrate_count",
      sortable: false,
      align: "center"
    },
    {
      name: "bonus",
      label: t("table_header.event_amount"),
      field: "event_amount",
      sortable: false,
      align: "center"
    }
  ])

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
</style>
