<template>
  <div class="q-pa-md">
    <SubPage :action-label-i18n-key="date" :custom-back-func="onBackTo" class="q-mb-md">
      <template #breadcrumbs>
        <q-breadcrumbs-el :label="memberAccount" />
      </template>
    </SubPage>
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
          hide-no-data
        >
          <template #body="props">
            <q-tr v-if="tableData.length">
              <q-td
                key="trans_code"
                :props="props"
                class="cursor-pointer"
                :class="{ 'text-blue': transCodeTypes.includes(props.row.action_type) }"
                @click="onAction(props.row)"
              >
                {{ props.row.trans_code }}
              </q-td>
              <q-td key="created_at" :props="props">
                {{ genTimeFormat(props.row.created_at) }}
              </q-td>
              <q-td key="currency" :props="props">
                {{ $t(currencyName(props.row.currency_id)) }}
              </q-td>
              <q-td key="action_type" :props="props">
                {{ t(ACCOUNT_FLOW_TYPE.I18nKeys[props.row.action_type as ACCOUNT_FLOW_TYPE.Enums] || "common.unknow") }}
              </q-td>
              <q-td key="payment_gateway_name" :props="props">
                {{ props.row.payment_gateway_name || "-" }}
              </q-td>
              <q-td key="payment_type" :props="props">
                {{
                  props.row.payment_type
                    ? $t(FUND_METHOD_TYPE.I18nKeys[props.row.payment_type as FUND_METHOD_TYPE.Enums])
                    : "-"
                }}
              </q-td>
              <q-td key="deposit_amount" :props="props">
                {{ moneyFormat(props.row.deposit_amount, 2) }}
              </q-td>
              <q-td key="withdraw_amount" :props="props">
                {{ moneyFormat(props.row.withdraw_amount, 2) }}
              </q-td>
              <q-td key="updated_at" :props="props">
                {{ genTimeFormat(props.row.updated_at) }}
              </q-td>
              <q-td key="operator" :props="props">
                {{ props.row.operator || "-" }}
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
  import { computed, reactive, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter, useRoute } from "vue-router"
  import { getAgentCashReportAgentMemberDetail } from "@/api/report"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import type { GetCashReportDetail } from "@/api/request.type"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { FUND_METHOD_TYPE, ACCOUNT_FLOW_TYPE, QUOTA_TYPE } from "@/utils/constants"

  const transCodeTypes = [
    ACCOUNT_FLOW_TYPE.Enums.DEPOSIT,
    ACCOUNT_FLOW_TYPE.Enums.WITHDRAWAL,
    ACCOUNT_FLOW_TYPE.Enums.ADJUSMENT_DEPOSIT,
    ACCOUNT_FLOW_TYPE.Enums.ADJUSMENT_WITHDRAWAL
  ]

  const store = useQueryStore()
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

  const { moneyFormat, genTimeFormat } = useCommon()

  const { search, tableData, totalSize, tableTotal, tableSubTotal, isSuccess } = useSearch(
    getAgentCashReportAgentMemberDetail
  )

  const memberAccount = computed(() => route.params.memberAccount as string)
  const date = computed(() => route.params.date as string)

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "trans_code",
      label: t("table_header.deposit_and_withdrawal_number"),
      field: "trans_code",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "created_at",
      label: t("table_header.application_time"),
      field: "created_at",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "currency",
      label: t("table_header.currency"),
      field: "currency",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "action_type",
      label: t("query_params.trading_action"),
      field: "action_type",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "payment_gateway_name",
      label: t("query_params.payer"),
      field: "payment_gateway_name",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "payment_type",
      label: t("query_params.fund_method"),
      field: "payment_type",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "deposit_amount",
      label: t("table_header.total_deposit"),
      field: "deposit_amount",
      sortable: false,
      align: "right",
      useSubTotalColumn: true,
      subTotalColumn: "total_deposit",
      totalColumn: "total_deposit"
    },
    {
      name: "withdraw_amount",
      label: t("table_header.withdrawal_amount"),
      field: "withdraw_amount",
      sortable: false,
      align: "right",
      useSubTotalColumn: true,
      subTotalColumn: "total_withdraw",
      totalColumn: "total_withdraw"
    },
    {
      name: "updated_at",
      label: t("table_header.approval_time"),
      field: "updated_at",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "operator",
      label: t("table_header.auditors"),
      field: "operator",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    }
  ])

  function onExport() {
    console.log("onExport")
  }

  async function onSubmit(queryForm: GetCashReportDetail) {
    const params = route.params
    const payload = { ...queryForm, ...params }
    await search(payload)
  }

  function onBackTo() {
    const { export: isExport } = route.query
    router.push({
      name: "CashReportDetail",
      params: {
        memberId: route.params.memberId
      },
      query: {
        export: isExport
      }
    })
  }
  interface CurrencyFormat {
    value: number
    label: string
  }
  const currencyName = (id: number) => {
    const currencyFormat: CurrencyFormat | undefined = store.currencyList.find((currency) => currency.value === id)
    return currencyFormat ? currencyFormat.label : ""
  }

  const onAction = (row: GetCashReportDetail) => {
    // 目前只有帳變類型1-4需要跳轉
    if (!transCodeTypes.includes(row.action_type)) return
    if (row.action_type === ACCOUNT_FLOW_TYPE.Enums.DEPOSIT) {
      router.push({
        name: "DepositAndwithdrawalManagementDepositList",
        query: {
          depositNumber: row.trans_code
        }
      })
      return
    }
    if (row.action_type === ACCOUNT_FLOW_TYPE.Enums.WITHDRAWAL) {
      router.push({
        name: "DepositAndwithdrawalManagementList",
        query: {
          withdrawalNumber: row.trans_code
        }
      })
      return
    }
    if (row.action_type === ACCOUNT_FLOW_TYPE.Enums.ADJUSMENT_DEPOSIT) {
      router.push({
        name: "MemberQuota",
        query: {
          orderNumber: row.trans_code,
          quotaType: QUOTA_TYPE.Enums.ManualDeposit
        }
      })
      return
    }
    if (row.action_type === ACCOUNT_FLOW_TYPE.Enums.ADJUSMENT_WITHDRAWAL) {
      router.push({
        name: "MemberQuota",
        query: {
          orderNumber: row.trans_code,
          quotaType: QUOTA_TYPE.Enums.ManualWithdraw
        }
      })
      return
    }
  }

  onMounted(async () => {
    await store.getCurrencyList()
  })
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
