<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template v-slot:mainContent>
        <!-- <div class="row q-mb-md justify-start">
          <q-btn outline color="main-color" @click="onExport">
            {{ $t("btn.export") }}
            <q-icon class="q-ml-xs" size="xs" name="archive" />
          </q-btn>
        </div> -->

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
              <q-td key="withdrawal_number" :props="props">
                {{ props.row.id }}
              </q-td>
              <q-td key="member_account" :props="props">
                {{ props.row.member_account }}
              </q-td>
              <q-td key="submit_date" :props="props">
                {{ genTimeFormat(props.row.submit_date) }}
              </q-td>
              <q-td key="currency" :props="props">
                {{ props.row.currency }}
              </q-td>
              <q-td key="payment_gateway_name" :props="props">
                {{ props.row.payment_gateway_name }}
              </q-td>
              <q-td key="payment_type" :props="props">
                {{ t(FUND_METHOD_TYPE.I18nKeys[props.row.payment_type as FUND_METHOD_TYPE.Enums] || "common.unknow") }}
              </q-td>
              <q-td key="amount" :props="props">
                {{ props.row.amount }}
              </q-td>
              <q-td key="deduction_fee" :props="props">
                {{ props.row.deduction_fee }}
              </q-td>
              <q-td key="promotion_amount" :props="props">
                {{ props.row.promotion_amount }}
              </q-td>
              <q-td key="actual_amount" :props="props">
                {{ props.row.actual_amount }}
              </q-td>
              <q-td key="status" :props="props">
                {{ t(SAVE_STATUS_TYPE.I18nKeys[props.row.status as SAVE_STATUS_TYPE.Enums] || "common.unknow") }}
              </q-td>
              <q-td key="verified_date" :props="props">
                {{ props.row.verified_date ? genTimeFormat(props.row.verified_date) : "-" }}
              </q-td>
            </q-tr>
          </template>
          <!-- 查無資料 -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
          </template>
          <template #bottom-row="props">
            <table-total-comp
              v-if="tableData.length"
              :columns="props.cols"
              :table-data="tableData"
              :total-data="tableTotal"
              :sub-total-data="tableSubTotal"
            />
          </template>
        </q-table>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { QTableProps } from "quasar"
  import { reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { getWithdrawalReportList } from "@/api/report"
  import type { GetWithdrawalReportList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { SAVE_STATUS_TYPE, FUND_METHOD_TYPE } from "@/utils/constants"

  const { t } = useI18n()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useCurrency: true,
    useWithdrawalMethod: true,
    useSaveStatus: true,
    useWithdrawalNumber: true,
    useMemberAccount: true,
    useDatePicker: true,
    useTimePicker: true,
    useMultiDateType: true
  })

  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getWithdrawalReportList)

  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetWithdrawalReportList) {
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "withdrawal_number",
      label: t("table_header.withdrawal_number"),
      field: "withdrawal_number",
      sortable: false,
      align: "center"
    },
    {
      name: "member_account",
      label: t("table_header.member_account"),
      field: "member_account",
      sortable: false,
      align: "center"
    },
    {
      name: "submit_date",
      label: t("table_header.application_time"),
      field: "submit_date",
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
      name: "amount",
      label: t("table_header.withdrawal_currency"),
      field: "amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "amount",
      totalColumn: "amount"
    },
    {
      name: "deduction_fee",
      label: t("table_header.deduct_amount"),
      field: "deduction_fee",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "deduction_fee",
      totalColumn: "deduction_fee"
    },
    {
      name: "promotion_amount",
      label: t("table_header.discount"),
      field: "promotion_amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "promotion_amount",
      totalColumn: "promotion_amount"
    },
    {
      name: "actual_amount",
      label: t("table_header.actual_withdrawal"),
      field: "actual_amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "actual_amount",
      totalColumn: "actual_amount"
    },
    {
      name: "status",
      label: t("table_header.save_withdrawal_status"),
      field: "status",
      sortable: false,
      align: "center"
    },
    {
      name: "verified_date",
      label: t("table_header.approval_time"),
      field: "verified_date",
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

  :deep(.table-total) {
    &.q-tr {
      background-color: #FFF9E8 !important;
    }
  }
</style>
