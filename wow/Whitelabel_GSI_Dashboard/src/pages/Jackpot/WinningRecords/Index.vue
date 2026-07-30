<template>
  <div class="p-4">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div>
          <q-table
            class="hide-scrollbar"
            bordered
            :rows="tableData"
            :columns="columns"
            row-key="id"
            :loading="loading"
            hide-pagination
            :rows-per-page-options="[0]"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="flex items-center justify-center gap-x-2 flex-nowrap">
                <q-btn
                  color="primary"
                  :label="t('jackpotWinningRecords.view_details')"
                  size="sm"
                  @click="onViewDetails(props.row)"
                />
                <q-btn
                  :color="props.row.status === JackpotAuditStatus.Pending ? 'positive' : 'grey'"
                  :disable="props.row.status !== JackpotAuditStatus.Pending"
                  :label="t('jackpotWinningRecords.award_approval')"
                  size="sm"
                  @click="onApproval(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue"
  import { useQuasar, type QTableColumn } from "quasar"
  import { useI18n } from "vue-i18n"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import {
    useJackpotWinningRecords,
    type JackpotWinningRecord,
    claimStatusOptions,
    auditStatusOptions,
    JackpotClaimStatus,
    JackpotAuditStatus
  } from "./useJackpotWinningRecords"
  import JackpotAuditDialog from "./components/JackpotAuditDialog.vue"
  import JackpotDetailsDialog from "./components/JackpotDetailsDialog.vue"

  const $q = useQuasar()
  const { t } = useI18n()
  const { genTimeFormat, moneyFormat } = useCommon()

  const { loading, totalSize, tableData, queryForm, fetchWinningRecords, handleApproval, handleReject } =
    useJackpotWinningRecords(10)

  const queryConfigs: IQueryConfig = {
    submitOnLoaded: false,
    allowSameSubmit: true,
    usePagination: true,
    dateTimeIsUnnecessary: true, // Enable Date Picker
    useDatePicker: true,
    useCurrency: true,
    customFields: [
      {
        type: "input",
        key: "claim_transaction_code",
        label: "jackpotWinningRecords.claim_transaction_code",
        placeholder: "jackpotWinningRecords.claim_transaction_code"
      },
      {
        type: "input",
        key: "member_account",
        label: "jackpotWinningRecords.player_account",
        placeholder: "jackpotWinningRecords.player_account"
      },
      {
        type: "select",
        key: "claim_status",
        label: "jackpotWinningRecords.claim_status",
        options: claimStatusOptions
      },
      {
        type: "select",
        key: "audit_status",
        label: "jackpotWinningRecords.audit_status",
        options: auditStatusOptions
      },
      {
        type: "input",
        key: "wager_code",
        label: "jackpotWinningRecords.wager_code",
        placeholder: "jackpotWinningRecords.wager_code"
      }
    ]
  }

  const columns = computed<QTableColumn[]>(() => [
    {
      name: "claim_transaction_code",
      label: t("jackpotWinningRecords.claim_transaction_code"),
      field: "claim_transaction_code",
      align: "center",
      format: (val: string) => val || ""
    },
    {
      name: "member_account",
      label: t("jackpotWinningRecords.player_account"),
      field: "member_account",
      align: "center"
    },
    {
      name: "currency",
      label: t("common.currency"),
      field: "currency",
      align: "center"
    },
    {
      name: "winning_amount",
      label: t("jackpotWinningRecords.winning_amount"),
      field: "winning_amount",
      align: "center",
      format: (val: number) => String(moneyFormat(val, 4))
    },
    {
      name: "created_at",
      label: t("jackpotWinningRecords.created_at"),
      field: "created_at",
      align: "center",
      format: (val: string) => genTimeFormat(parseInt(val), "yyyy-MM-dd HH:mm:ss") || ""
    },
    {
      name: "claim_status",
      label: t("jackpotWinningRecords.claim_status"),
      field: "claim_status",
      align: "center",
      format: (val: number) => getClaimStatusLabel(val),
      classes: (row: JackpotWinningRecord) => getClaimStatusColor(row.claim_status)
    },
    {
      name: "audit_status",
      label: t("jackpotWinningRecords.audit_status"),
      field: "status",
      align: "center",
      format: (val: number) => getAuditStatusLabel(val),
      classes: (row: JackpotWinningRecord) => getAuditStatusColor(row.status)
    },
    {
      name: "claimed_at",
      label: t("jackpotWinningRecords.claimed_at"),
      field: "claimed_at",
      align: "center",
      format: (val: string) => (val && val !== "0" ? genTimeFormat(parseInt(val), "yyyy-MM-dd HH:mm:ss") || "" : "")
    },
    {
      name: "trigger_wager_code",
      label: t("jackpotWinningRecords.wager_code"),
      field: "trigger_wager_code",
      align: "center"
    },
    {
      name: "audit_remark",
      label: t("dialog.remark"),
      field: "audit_remark",
      align: "center",
      format: (val: string) => val || ""
    },
    {
      name: "audit_operator_id",
      label: t("table_header.operator"),
      field: "audit_operator_id",
      align: "center",
      format: (val: number) => (val > 0 ? `OP-${val}` : "")
    },
    {
      name: "updated_at",
      label: t("jackpotManagement.last_updated_time"),
      field: "updated_at",
      align: "center",
      format: (val: string) => genTimeFormat(parseInt(val), "yyyy-MM-dd HH:mm:ss") || ""
    },
    {
      name: "actions",
      label: t("common.actions"),
      field: "actions",
      align: "center"
    }
  ])

  const getClaimStatusLabel = (status: number) => {
    const option = claimStatusOptions.find((opt) => opt.value === status)
    return option ? t(option.label) : "Unknown"
  }

  const getClaimStatusColor = (status: number) => {
    const colors: Record<number, string> = {
      [JackpotClaimStatus.Pending]: "text-orange",
      [JackpotClaimStatus.Claimed]: "text-green",
      [JackpotClaimStatus.Failed]: "text-red"
    }
    return colors[status] || "text-grey"
  }

  const getAuditStatusLabel = (status: number) => {
    const option = auditStatusOptions.find((opt) => opt.value === status)
    return option ? t(option.label) : "Unknown"
  }

  const getAuditStatusColor = (status: number) => {
    const colors: Record<number, string> = {
      [JackpotAuditStatus.Pending]: "text-orange",
      [JackpotAuditStatus.Approved]: "text-green",
      [JackpotAuditStatus.Rejected]: "text-red"
    }
    return colors[status] || "text-grey"
  }

  const onSubmit = (params: any) => {
    if (params.size) {
      queryForm.limit = params.size
      queryForm.page = Math.floor(params.offset / params.size) + 1
    }

    queryForm.currency = params.currency || null
    queryForm.claim_status = params.claim_status !== undefined ? params.claim_status : null
    queryForm.audit_status = params.audit_status !== undefined ? params.audit_status : null
    queryForm.claim_transaction_code = params.claim_transaction_code || null
    queryForm.member_account = params.member_account || null
    queryForm.wager_code = params.wager_code || null
    queryForm.start = params.start || undefined
    queryForm.end = params.end || undefined

    fetchWinningRecords()
  }

  const onViewDetails = (row: JackpotWinningRecord) => {
    $q.dialog({
      component: JackpotDetailsDialog,
      componentProps: {
        record: {
          ...row,
          current_pool_amount: row.winning_amount + row.currency_payout_threshold + 1234.56 // Realistic mock
        }
      }
    })
  }

  const onApproval = (row: JackpotWinningRecord) => {
    $q.dialog({
      component: JackpotAuditDialog,
      componentProps: {
        record: {
          ...row,
          // 模擬當時池金額：通常大於中獎金額加上門檻
          current_pool_amount: row.winning_amount + row.currency_payout_threshold + Math.floor(Math.random() * 5000)
        }
      }
    }).onOk(async (data: { status: number; remark: string }) => {
      if (data.status === JackpotAuditStatus.Approved) {
        await handleApproval(row)
      } else {
        await handleReject(row, data.remark)
      }
    })
  }

  onMounted(() => {
    fetchWinningRecords()
  })
</script>

<style lang="scss" scoped>
  .hide-scrollbar {
    :deep(.q-table__middle) {
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }
    }

    /* Table Styling Overrides */
    :deep(.q-table) {
      /* Header: Light blue background and black text */
      thead tr th {
        background-color: #e6f7ff !important;
        color: #000 !important;
        font-weight: bold;
      }

      /* Remove alternating row colors and set to white */
      tbody tr {
        background-color: #fff !important;
      }

      /* Hover state for rows */
      tbody tr:hover {
        background-color: #f5f7fa !important;
      }

      /* Sticky Actions Column */
      thead tr:last-child th:last-child {
        background-color: #e6f7ff !important;
        color: #000 !important;
        position: sticky;
        right: 0;
        z-index: 3;
      }

      tbody tr td:last-child {
        background-color: #fff !important;
        position: sticky;
        right: 0;
        z-index: 2;
      }

      /* Match hover state for the sticky cell */
      tbody tr:hover td:last-child {
        background-color: #f5f7fa !important;
      }
    }

    /* Dark mode support if applicable */
    :deep(.q-table--dark) {
      thead tr:last-child th:last-child,
      tbody tr td:last-child {
        background-color: #1d1d1d;
      }
    }
  }
</style>
