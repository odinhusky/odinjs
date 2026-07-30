<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
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
              <q-tr>
                <q-td key="currency" :props="props">
                  {{ props.row.currency || $t("common.unknow") }}
                </q-td>
                <q-td key="bet_people_count" :props="props">
                  {{ props.row.bet_people_count }}
                </q-td>
                <q-td key="order_amount" :props="props">
                  {{ props.row.order_amount }}
                </q-td>
                <q-td key="jackpot_amount" :props="props">
                  {{ props.row.jackpot_amount }}
                </q-td>
                <q-td key="bet_amount" :props="props">
                  {{ props.row.bet_amount }}
                </q-td>
                <q-td key="valid_bet_amount" :props="props">
                  {{ props.row.valid_bet_amount }}
                </q-td>
                <q-td key="winlose_amount" :props="props">
                  {{ props.row.winlose_amount }}
                </q-td>
                <q-td key="winrate_count" :props="props">
                  {{ props.row.winrate_count }}
                </q-td>
                <q-td key="event_amount" :props="props">
                  {{ props.row.event_amount }}
                </q-td>
              </q-tr>
            </template>
            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
            </template>

            <!-- 本頁總計/搜尋結果總計 -->
            <template #bottom-row="props">
              <table-total-comp :columns="props.cols" :table-data="tableData" :total-data="tableTotal" />
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import type { QTableProps } from "quasar"
  import { computed, reactive } from "vue"
  import { useI18n } from "vue-i18n"

  import { getBetReportList } from "@/api/report"
  import type { GetBetReportList } from "@/api/request.type"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  const { t } = useI18n()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: false,
    allowSameSubmit: true,
    usePagination: true,
    useDatePicker: true,
    useTimePicker: true,
    useCurrency: true,
    useAgentAccount: true
  })

  const { search, tableData, totalSize, tableTotal } = useSearch(getBetReportList)

  async function onSubmit(queryForm: GetBetReportList) {
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "currency",
      label: t("table_header.currency"),
      field: "currency",
      sortable: false,
      align: "center"
    },
    {
      name: "bet_people_count",
      label: t("table_header.bet_quantity"),
      field: "bet_people_count",
      sortable: false,
      align: "right"
    },
    {
      name: "order_amount",
      label: t("table_header.order_amount"),
      field: "order_amount",
      sortable: false,
      align: "right"
    },
    {
      name: "jackpot_amount",
      label: t("table_header.jackpot_amount"),
      field: "jackpot_count",
      sortable: false,
      align: "right"
    },
    {
      name: "bet_amount",
      label: t("table_header.bet_amount"),
      field: "bet_amount",
      sortable: false,
      align: "right"
    },
    {
      name: "valid_bet_amount",
      label: t("table_header.valid_bet"),
      field: "valid_bet_amount",
      sortable: false,
      align: "right"
    },
    {
      name: "winlose_amount",
      label: t("table_header.winlose_amount"),
      field: "winlose_amount",
      sortable: false,
      align: "right"
    },
    {
      name: "winrate_count",
      label: t("table_header.winrate_count"),
      field: "winrate_count",
      sortable: false,
      align: "right"
    },
    {
      name: "event_amount",
      label: t("table_header.event_amount"),
      field: "event_amount",
      sortable: false,
      align: "right"
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
  :deep(.table-total) {
    &.q-tr {
      background-color: #fff9e8 !important;
    }
  }
</style>
