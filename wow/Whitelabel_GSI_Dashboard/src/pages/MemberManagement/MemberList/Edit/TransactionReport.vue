<template>
  <q-card class="q-pa-md no-shadow editWrapper_v2">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <q-table
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="tableData"
          :columns="tableColumn"
          row-key="trans_code"
          class="table_v2"
        >
          <template #body="props">
            <q-tr>
              <q-td key="trans_code" :props="props">
                {{ props.row.trans_code }}
              </q-td>
              <q-td key="created_at" :props="props">
                {{ genTimeFormat(props.row.created_at) }}
              </q-td>
              <q-td key="currency_id" :props="props">
                {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums] || "common.unknow") }}
              </q-td>
              <q-td key="action_type" :props="props">
                {{ $t(ACTION_TYPE.I18nKeys[props.row.action_type as ACTION_TYPE.Enums] || "common.unknow") }}
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
              <q-td key="wallet_type" :props="props">
                {{
                  props.row.wallet_type
                    ? $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                    : "-"
                }}
              </q-td>
              <q-td key="deposit_amount" :props="props">
                {{ props.row.deposit_amount }}
              </q-td>
              <q-td key="withdraw_amount" :props="props">
                {{ props.row.withdraw_amount }}
              </q-td>
              <q-td key="verified_date" :props="props">
                {{ genTimeFormat(props.row.verified_date) }}
              </q-td>
              <q-td key="operator" :props="props">
                {{ props.row.operator }}
              </q-td>
            </q-tr>
          </template>

          <!-- 查無資料 -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm column no_data">
              <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
              <p class="bold h5-bold q-mt-sm">{{ $t("common.no_data") }}</p>
            </div>
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
  </q-card>
</template>

<script lang="ts" setup>
  import { getCurrencyList, getPaymentTypeList } from "@/api/common"
  import { getMemberTransactionReport } from "@/api/member"
  import type { GetMemberTransactionReport } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useQueryStore } from "@/stores/queryStore"
  import { CustomQTableProps } from "quasar"
  import { computed, onMounted, reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { CURRENCY_TYPE, FUND_METHOD_TYPE, ACTION_TYPE, BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useWalletBouns } from "@/hook/useWalletBouns"

  const { t } = useI18n()
  const store = useQueryStore()
  const route = useRoute()
  const router = useRouter()
  const { walletSwitch } = useWalletBouns()

  const isLoading = ref(false)

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      filterShowOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useCurrency: true,
      useTradingActionType: true,
      usePaymentType: true
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }

    baseConfig.useTransactionNumber = true
    baseConfig.useDatePicker = true
    baseConfig.useDateType = true
    baseConfig.useVisibleBtn = true
    baseConfig.useVisibleTitle = false

    return baseConfig
  })

  const { search, tableData, totalSize, tableTotal, tableSubTotal, isSuccess } = useSearch(getMemberTransactionReport)

  console.log(tableTotal, "tableTotal")

  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetMemberTransactionReport) {
    const id = route.params.id as string
    await search({ ...queryForm, ...{ id: parseInt(id) } })
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const baseColumns: CustomQTableProps["columns"] = [
      {
        name: "trans_code",
        label: t("table_header.deposit_and_withdrawal_number"),
        field: "trans_code",
        sortable: false,
        align: "center"
      },
      {
        name: "created_at",
        label: t("table_header.application_time"),
        field: "created_at",
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
        name: "action_type",
        label: t("table_header.motion"),
        field: "action_type",
        sortable: false,
        align: "center"
      },
      {
        name: "payment_gateway_name",
        label: t("table_header.payment_provider"),
        field: "payment_gateway_name",
        sortable: false,
        align: "center"
      },
      {
        name: "payment_type",
        label: t("table_header.fund_method"),
        field: "payment_type",
        sortable: false,
        align: "center"
      },
      {
        name: "wallet_type",
        label: t("table_header.wallet_type"),
        field: "wallet_type",
        sortable: false,
        align: "center"
      },
      {
        name: "deposit_amount",
        label: t("table_header.total_deposit"),
        field: "deposit_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "total_deposit",
        totalColumn: "total_deposit"
      },
      {
        name: "withdraw_amount",
        label: t("table_header.withdrawal_amount"),
        field: "withdraw_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "total_withdraw",
        totalColumn: "total_withdraw"
      },
      {
        name: "verified_date",
        label: t("table_header.approval_time"),
        field: "verified_date",
        sortable: false,
        align: "center"
      },
      {
        name: "operator",
        label: t("table_header.auditors"),
        field: "operator",
        sortable: false,
        align: "center"
      }
    ]

    return walletSwitch.value ? baseColumns : baseColumns.filter((column) => column.name !== "wallet_type")
  })

  const dropdownData = reactive<{
    currencyList: {
      label: string
      value: number
    }[]
    paymentTypeList: {
      label: string
      value: number
    }[]
  }>({
    currencyList: [],
    paymentTypeList: []
  })

  //取得幣別
  const getCurrency = async () => {
    const { data } = await getCurrencyList()

    if (!data || !Object.keys(data).length) {
      dropdownData.currencyList.length = 0
      return
    }
    for (const [currency, value] of Object.entries(data)) {
      const newItem = {
        label: currency,
        value: value
      }
      dropdownData.currencyList.push(newItem as never)
    }
  }

  //取得交易類型
  const getPaymentType = async () => {
    const { data } = await getPaymentTypeList()

    if (!data || !Object.keys(data).length) {
      dropdownData.paymentTypeList.length = 0
      return
    }
    for (const [value, label] of Object.entries(data)) {
      const newItem = {
        label: label,
        value: Number(value)
      }
      dropdownData.paymentTypeList.push(newItem as never)
    }
  }

  function goBack() {
    router.back()
  }

  function onCancel() {
    router.push({ name: "MemberList" })
  }

  onMounted(() => {
    getCurrency() // 幣種
    getPaymentType() // 交易類型
    store.getActionTypeList()
    console.log(store.actionTypeList)
  })
</script>

<style lang="scss" scoped>
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }
</style>
