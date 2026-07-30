<template>
  <SubPage :action-label-i18n-key="reportTime" :custom-back-func="onBackTo" class="q-mt-xl" />
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
              <q-td key="currency" :props="props">
                {{ props.row.currency }}
              </q-td>
              <q-td key="total_deposit_amount" :props="props">
                {{ moneyFormat(props.row.total_deposit_amount, 2) }}
              </q-td>
              <q-td key="total_withdrawal_amount" :props="props">
                {{ moneyFormat(props.row.total_withdrawal_amount, 2) }}
              </q-td>
              <q-td key="total_bet_amount" :props="props">
                {{ moneyFormat(props.row.total_bet_amount, 2) }}
              </q-td>
              <q-td key="total_effective_bet_amount" :props="props">
                {{ moneyFormat(props.row.total_effective_bet_amount, 2) }}
              </q-td>
              <q-td key="total_profit_and_loss_amount" :props="props">
                {{ moneyFormat(props.row.total_profit_and_loss_amount, 2) }}
              </q-td>
              <q-td key="total_activity_amount" :props="props">
                {{ moneyFormat(props.row.total_activity_amount, 2) }}
              </q-td>
              <q-td key="profit" :props="props">
                {{ moneyFormat(props.row.profit, 2) }}
              </q-td>
            </q-tr>
          </template>

          <!-- 查無資料 -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
          </template>
        </q-table>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { CustomQTableProps } from "quasar"
  import { computed, reactive, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter, useRoute } from "vue-router"
  import { getUserReportAgentList } from "@/api/report"
  import type { GetUserReportList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import SubPage from "layouts/SubPage/Index.vue"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })

  const { search, tableData, totalSize, tableTotal, isSuccess } = useSearch(getUserReportAgentList)

  const { moneyFormat } = useCommon()

  const reportTime = computed(() => route.params.date as string)

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "currency",
      label: t("table_header.currency"),
      field: "currency",
      sortable: false,
      align: "center"
    },
    {
      name: "total_deposit_amount",
      label: t("table_header.total_deposit_amount"),
      field: "total_deposit_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "total_withdrawal_amount",
      label: t("table_header.total_withdrawal_amount"),
      field: "total_withdrawal_amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      totalColumn: "deposit"
    },
    {
      name: "total_bet_amount",
      label: t("table_header.total_bet_amount"),
      field: "total_bet_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "total_effective_bet_amount",
      label: t("table_header.total_effective_bet_amount"),
      field: "total_effective_bet_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "total_profit_and_loss_amount",
      label: t("table_header.total_profit_and_loss_amount"),
      field: "total_profit_and_loss_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "total_activity_amount",
      label: t("table_header.total_activity_amount"),
      field: "total_activity_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "profit",
      label: t("table_header.total_amount"),
      field: "profit",
      sortable: false,
      align: "center"
    }
  ])

  async function onSubmit(queryForm: GetUserReportList) {
    const params = route.params
    const payload = { ...queryForm, ...params }
    await search(payload)
  }

  function onBackTo() {
    const { start, end } = route.query
    router.push({
      name: "UserReportList",
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
