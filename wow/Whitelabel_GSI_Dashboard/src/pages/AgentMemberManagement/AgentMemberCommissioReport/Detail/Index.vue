<template>
  <div class="q-pa-md" v-if="showTable">
    <SubPage :action-label-i18n-key="message" :custom-back-func="onBackTo" class="q-mb-md" />
    <query :configs="queryConfigs">
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
                <q-td
                  key="parent_account"
                  :props="props"
                  :class="props.row.next_level_member_count > 0 ? 'text-blue cursor-pointer' : ''"
                  @click="props.row.next_level_member_count > 0 ? onAction(props.row) : null"
                >
                  {{ props.row.member_account }}
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
          </q-table>
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import type { CustomQTableProps } from "quasar"
  import { computed, reactive, onMounted, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter, useRoute } from "vue-router"

  import { GetAgentCommissionReportsMembers } from "@/api/agentMemberManagements"

  import type { GetAgentMemberCommissionReport } from "@/api/request.type"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useQueryStore } from "@/stores/queryStore"

  import { CURRENCY_TYPE } from "@/utils/constants"
  import tableTotalComp from "@/components/tableTotal/Index.vue"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    usePagination: false
  })
  const level0Detail = ref(true)

  const message = computed(() => {
    return commission.value
  })

  const store = useQueryStore()
  const commission = ref("")
  const { start, end, currency } = route.query
  const { commission_id } = route.params

  const { search, spinShow, isSuccess, tableData, tableTotal } = useSearch(GetAgentCommissionReportsMembers)
  interface levelDetail {
    member_id: number
    account: string
    next_level_count: number
    currency_limit: { currency_id: number; limit: number }[]
  }

  const showTable = ref(false)
  const currencyTable = ref<{ currency_id: string | number; limit: number }[]>([])

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "parent_account",
      label: t("table_header.member_account"),
      field: "parent_account",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_member_count",
      label: t("table_header.number_of_members_lower_level"),
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
      name: "next_level_total_bet",
      label: t("table_header.bet_amount_lower_level"),
      field: "next_level_total_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_total_valid_bet",
      label: t("table_header.valid_bets_lower_level"),
      field: "next_level_total_valid_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_total_profit",
      label: t("table_header.profit_and_loss_lower_level"),
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
  onMounted(async () => {
    await store.getCurrencyList()

    let payload: Record<string, unknown> = {}
    //非帳號搜尋
    if (!isNaN(Number(route.params.commission_id))) {
      payload = {
        commission_id: commission_id,
        currency_id: currency,
        start_date: start,
        end_date: end
      }
    } else {
      payload = {
        account: commission_id,
        currency_id: currency,
        start_date: start,
        end_date: end
      }
    }
    Promise.all([search(payload)]).then(() => {
      if (tableData.value.length <= 0) {
        showTable.value = true
        return
      }
      if (!isNaN(Number(route.params.commission_id))) {
        commission.value = route.query.commission_name as string
      } else {
        commission.value = tableData.value[0].commission_name
      }
      showTable.value = true
    })
  })

  async function onAction(row: GetAgentMemberCommissionReport) {
    router.push({
      name: "AgentMemberCommissioReportNestedDetail",
      params: {
        commission_id: row.commission_id,
        member_id: row.member_id
        //grand_parent_account: row.parent_account
      },
      query: {
        commission_name: commission.value,
        account: row.parent_account,
        member_id: row.member_id,
        currency,
        start,
        end
      }
    })
  }

  function onBackTo() {
    router.push({
      name: "AgentMemberCommissioReportList",
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
  ::v-deep(.q-table--horizontal-separator thead th) {
    border-bottom-width: 1px !important;
    border-color: white;
  }
</style>
