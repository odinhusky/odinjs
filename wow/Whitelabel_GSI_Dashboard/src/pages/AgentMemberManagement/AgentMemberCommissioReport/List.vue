<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            row-key="id"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr>
                <q-td key="commission_name" :props="props">
                  <span
                    v-if="props.row.next_level_member_count > 0"
                    class="text-blue cursor-pointer"
                    @click="onAction(props.row)"
                    >{{ props.row.commission_name }}</span
                  >
                  <span v-else>{{ props.row.commission_name }}</span>
                </q-td>
                <q-td key="next_level_member_count" :props="props">
                  {{ props.row.next_level_member_count }}
                </q-td>
                <q-td key="limit" :props="props">
                  {{ props.row.limit }}
                </q-td>
                <q-td key="currency_id" :props="props">
                  {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums]) || "" }}
                </q-td>
                <q-td key="calculation_type" :props="props">
                  {{ getCalculationTypeLabel(props.row.calculation_type) }}
                </q-td>
                <q-td key="next_level_total_bet" :props="props">
                  {{ props.row.next_level_total_bet }}
                </q-td>
                <q-td key="next_level_total_valid_bet" :props="props">
                  {{ props.row.next_level_total_valid_bet }}
                </q-td>
                <q-td key="next_level_total_profit" :props="props">
                  {{ props.row.next_level_total_profit }}
                </q-td>
                <q-td key="total_member_count" :props="props">
                  {{ props.row.total_member_count }}
                </q-td>
                <q-td key="total_bet" :props="props">
                  {{ props.row.total_bet }}
                </q-td>
                <q-td key="total_valid_bet" :props="props">
                  {{ props.row.total_valid_bet }}
                </q-td>
                <q-td key="total_profit" :props="props">
                  {{ props.row.total_profit }}
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
  import { reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import type { CustomQTableProps } from "quasar"
  import { useQuasar } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { useSearch } from "@/hook/useSearch"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { GetAgentMemberCommissionReport } from "@/api/agentMemberManagements"
  import type * as Request from "@/api/request.type"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { CURRENCY_TYPE } from "@/utils/constants"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    filterShowOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useMemberAccount: true,
    useCommissionName: true,
    useCurrency: true,
    useAgentCommissionCalculationType: true,
    useDatePicker: true
  })
  const { start, end } = route.query
  let catchQueryForm: Request.GetAgentMemberCommissionReport

  let { search, tableData, totalSize, tableTotal } = useSearch(GetAgentMemberCommissionReport)

  async function onSubmit(queryForm: Request.GetAgentMemberCommissionReport) {
    catchQueryForm = queryForm
    if (queryForm.memberAccount) {
      router.push({
        name: "AgentMemberCommissioReportDetail",
        params: {
          commission_id: queryForm.memberAccount
        },
        query: {
          commission_name: "",
          start: catchQueryForm.start,
          end: catchQueryForm.end,
          currency: catchQueryForm.currency
        }
      })
    } else {
      await search(queryForm)
    }
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "commission_name",
      label: t("table_header.commission_event_name"),
      field: "commission_name",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_member_count",
      label: t("table_header.number_of_members"),
      field: "next_level_member_count",
      sortable: false,
      align: "center"
    },
    {
      name: "limit",
      label: t("table_header.rebate_ratio"),
      field: "limit",
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
      name: "calculation_type",
      label: t("table_header.calculate_type"),
      field: "calculation_type",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_total_bet",
      label: t("table_header.bet_amount"),
      field: "next_level_total_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_total_valid_bet",
      label: t("table_header.valid_bet"),
      field: "next_level_total_valid_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_total_profit",
      label: t("table_header.winlose_amount"),
      field: "next_level_total_profit",
      sortable: false,
      align: "center"
    },
    {
      name: "total_member_count",
      label: t("table_header.number_of_members_all"),
      field: "total_member_count",
      sortable: false,
      align: "center"
    },
    {
      name: "total_bet",
      label: t("table_header.bet_amount_all"),
      field: "total_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "total_valid_bet",
      label: t("table_header.valid_bets_all"),
      field: "total_valid_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "total_profit",
      label: t("table_header.profit_and_loss_all"),
      field: "total_profit",
      sortable: false,
      align: "center"
    }
  ])
  function onAction(row: { commission_id: number; commission_name: string }) {
    router.push({
      name: "AgentMemberCommissioReportDetail",
      params: {
        commission_id: row.commission_id
      },
      query: {
        commission_name: row.commission_name,
        start: catchQueryForm.start,
        end: catchQueryForm.end,
        currency: catchQueryForm.currency_id ?? catchQueryForm.currency
      }
    })
  }

  function getCalculationTypeLabel(calculationType?: number | string | null) {
    const normalizedType = Number(calculationType)
    const mode = normalizedType === 2 ? 2 : 1
    return mode === 2 ? t("table_header.net_gaming_revenue") : t("table_header.winlose")
  }
</script>
