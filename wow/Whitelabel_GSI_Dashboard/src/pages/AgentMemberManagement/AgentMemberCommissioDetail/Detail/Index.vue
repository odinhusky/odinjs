<template>
  <div class="q-pa-md">
    <SubPage :action-label-i18n-key="'common.detail'" :custom-back-func="onBackTo" class="q-mb-md" />

    <div class="row q-col-gutter-md q-mb-md items-center">
      <div class="col-12 col-sm-auto">
        <q-select
          v-model="currentCurrency"
          :options="store.currencyList"
          outlined
          dense
          emit-value
          map-options
          class="currency-select"
          style="min-width: 5.5rem"
          :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item?.value)"
          @update:model-value="handleCurrency"
        />
      </div>
      <div class="col-12 col-sm-auto row q-gutter-sm" v-if="permission.edit">
        <q-btn class="btns btn-green" :disable="!detailRows.length" @click="openConfirmDialog('payoutAll')">
          {{ $t("btn.distribute_all") }}
        </q-btn>
        <q-btn class="btns btn-pink" :disable="!detailRows.length" @click="openConfirmDialog('cancelAll')">
          {{ $t("btn.no_distribute_all") }}
        </q-btn>
      </div>
    </div>

    <div class="table-container">
      <q-table
        square
        hide-pagination
        :rows-per-page-options="[0]"
        :rows="detailRows"
        :columns="tableColumn"
        row-key="row_id"
        table-header-class="bg-success"
      >
        <template #body="props">
          <q-tr>
            <q-td key="member_account" :props="props">
              {{ props.row.member_account }}
            </q-td>
            <q-td key="member_count" :props="props">
              {{ getMemberCount(props.row) }}
            </q-td>
            <q-td key="ratio" :props="props">
              {{ formatRatio(props.row.limit) }}
            </q-td>
            <q-td key="amount" :props="props">
              {{ moneyFormat(props.row.amount) }}
            </q-td>
            <q-td key="updated_at" :props="props">
              {{ props.row.updated_at ? genTimeFormat(props.row.updated_at, "yyyy-MM-dd HH:mm:ss") : "-" }}
            </q-td>
            <q-td key="status" :props="props">
              {{ getStatusLabel(props.row.status) }}
            </q-td>
            <q-td key="actions" :props="props" v-if="permission.edit">
              <q-btn
                class="btns q-mr-sm"
                color="green"
                :disable="isActionDisabled(props.row)"
                @click="openConfirmDialog('payoutOne', props.row)"
              >
                {{ $t("btn.distribute") }}
              </q-btn>
              <q-btn
                class="btns"
                color="red"
                :disable="isActionDisabled(props.row)"
                @click="openConfirmDialog('cancelOne', props.row)"
              >
                {{ $t("btn.reject") }}
              </q-btn>
            </q-td>
          </q-tr>
        </template>
        <template #no-data>
          <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
        </template>
      </q-table>
    </div>
  </div>

  <dialog-comp v-model="confirmDialog" :configs="dialogConfigs.confirm" :loading="confirmLoading">
    <template #mainContent>
      <div>{{ confirmMessage }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from "vue"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"

  import {
    GetAgentMemberCommissionStatementDetails,
    PostAgentMemberCommissionStatementCancel,
    PostAgentMemberCommissionStatementDetailCancel,
    PostAgentMemberCommissionStatementDetailPayout,
    PostAgentMemberCommissionStatementPayout
  } from "@/api/agentMemberManagements"
  import type { AgentMemberCommissionStatementDetailItem } from "@/api/response.type"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import { useCurrencyStore } from "@/stores/currencyStore"
  import { useQueryStore } from "@/stores/queryStore"
  import { usePermission } from "@/hook/usePermission"
  import { AgentCommissionDetailStatusEnum, agentCommissionDetailStatusI18nKeys } from "./constants"
  import type { AgentCommissionDetailStatus } from "./type"
  import SubPage from "layouts/SubPage/Index.vue"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"

  type ConfirmAction = "payoutAll" | "cancelAll" | "payoutOne" | "cancelOne"
  const confirmDialogTitleI18nKeyMap: Record<ConfirmAction, string> = {
    payoutOne: "common.confirm_distribution",
    cancelOne: "common.confirm_reject_distribution",
    payoutAll: "common.confirm_distribution_of_all",
    cancelAll: "common.confirm_no_distribution_of_all"
  }

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const $q = useQuasar()
  const { genTimeFormat, moneyFormat } = useCommon()
  const currencyStore = useCurrencyStore()
  const store = useQueryStore()
  const { permission } = usePermission()

  const statementId = computed(() => Number(route.params.statement_id))
  const currentCurrency = ref<number>()
  const currentAction = ref<ConfirmAction>("payoutAll")
  const selectedRow = ref<AgentMemberCommissionStatementDetailItem | null>(null)

  const { search, tableData } = useSearch(GetAgentMemberCommissionStatementDetails)

  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    confirm: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      showLabelCloseBtn: true,
      submitFunction: submitConfirmAction
    }
  })

  const {
    dialog: confirmDialog,
    openDialog: openConfirm,
    closeDialog: closeConfirm,
    loading: confirmLoading,
    openLoading: openConfirmLoading,
    closeLoading: closeConfirmLoading
  } = useDialog()

  const detailRows = computed(() =>
    (tableData.value || []).map((item: AgentMemberCommissionStatementDetailItem) => ({
      ...item,
      row_id: item.detail_id ?? item.id ?? item.member_account
    }))
  )

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "member_account",
        label: t("table_header.member_account"),
        field: "member_account",
        sortable: false,
        align: "center"
      },
      {
        name: "member_count",
        label: t("table_header.number_of_subordinate_members"),
        field: "member_count",
        sortable: false,
        align: "center"
      },
      {
        name: "ratio",
        label: t("table_header.ratio"),
        field: "ratio",
        sortable: false,
        align: "center"
      },
      {
        name: "amount",
        label: t("table_header.amount"),
        field: "amount",
        sortable: false,
        align: "center"
      },
      {
        name: "updated_at",
        label: t("table_header.updated_time"),
        field: "updated_at",
        sortable: false,
        align: "center"
      },
      {
        name: "status",
        label: t("table_header.status"),
        field: "status",
        sortable: false,
        align: "center"
      }
    ]

    if (permission.value.edit) {
      columns.push({
        name: "actions",
        label: t("table_header.actions"),
        field: "actions",
        sortable: false,
        align: "center"
      })
    }

    return columns
  })

  const currentCurrencyLabel = computed(() => {
    const currency = store.currencyList.find((item) => item.value === currentCurrency.value)
    return currency ? t(`${currency.label}`) : ""
  })

  const confirmMessage = computed(() => {
    switch (currentAction.value) {
      case "payoutAll":
        return t("common.confirm_distribute_by_currency_all", {
          currency: currentCurrencyLabel.value
        })
      case "cancelAll":
        return t("common.confirm_no_distribute_by_currency_all", {
          currency: currentCurrencyLabel.value
        })
      case "payoutOne":
        return t("common.confirm_distribution_to_all")
      case "cancelOne":
        return t("common.confirm_no_distribution_to_all")
      default:
        return ""
    }
  })

  onMounted(async () => {
    await store.getCurrencyList()

    if (!store.currencyList.length) {
      return
    }

    const headerCurrency = Number(currencyStore.currentCurrency)
    const hasHeaderCurrency =
      !Number.isNaN(headerCurrency) &&
      headerCurrency !== 0 &&
      store.currencyList.some((item) => item.value === headerCurrency)

    currentCurrency.value = hasHeaderCurrency ? headerCurrency : store.currencyList[0].value
    await loadDetails()
  })

  async function loadDetails() {
    if (!statementId.value || !currentCurrency.value) {
      return
    }

    await search({
      statement_id: statementId.value,
      currency_id: currentCurrency.value
    })
  }

  async function handleCurrency(currencyId: number) {
    currentCurrency.value = currencyId
    await loadDetails()
  }

  function getMemberCount(row: AgentMemberCommissionStatementDetailItem) {
    return row.member_count ?? row.next_level_count ?? "-"
  }

  function formatRatio(ratio?: number | string) {
    if (ratio === undefined || ratio === null || ratio === "") {
      return "-"
    }

    const ratioText = String(ratio)
    return ratioText.includes("%") ? ratioText : `${ratioText}%`
  }

  function toAgentCommissionDetailStatus(status?: number): AgentCommissionDetailStatus | undefined {
    if (
      status === AgentCommissionDetailStatusEnum.Pending ||
      status === AgentCommissionDetailStatusEnum.Distributed ||
      status === AgentCommissionDetailStatusEnum.Cancelled
    ) {
      return status
    }

    return undefined
  }

  function getStatusLabel(status?: number) {
    const detailStatus = toAgentCommissionDetailStatus(status)
    if (detailStatus === undefined) {
      return t("common.unknow")
    }

    return t(agentCommissionDetailStatusI18nKeys[detailStatus])
  }

  function isActionDisabled(row: AgentMemberCommissionStatementDetailItem) {
    const detailStatus = toAgentCommissionDetailStatus(row.status)
    return detailStatus !== AgentCommissionDetailStatusEnum.Pending || Number(row.amount) === 0
  }

  function openConfirmDialog(action: ConfirmAction, row?: AgentMemberCommissionStatementDetailItem) {
    currentAction.value = action
    selectedRow.value = row ?? null
    dialogConfigs.confirm.dialogLabelI18nKey = confirmDialogTitleI18nKeyMap[action]
    openConfirm()
  }

  async function submitConfirmAction() {
    try {
      openConfirmLoading()

      switch (currentAction.value) {
        case "payoutAll":
          await executeAction(() => PostAgentMemberCommissionStatementPayout({ statement_id: statementId.value }), true)
          break
        case "cancelAll":
          await executeAction(
            () => PostAgentMemberCommissionStatementCancel({ statement_id: statementId.value }),
            false
          )
          break
        case "payoutOne":
          if (!selectedRow.value) return
          await executeAction(
            () =>
              PostAgentMemberCommissionStatementDetailPayout({
                statement_id: statementId.value,
                detail_id: selectedRow.value?.detail_id ?? selectedRow.value?.id ?? ""
              }),
            true
          )
          break
        case "cancelOne":
          if (!selectedRow.value) return
          await executeAction(
            () =>
              PostAgentMemberCommissionStatementDetailCancel({
                statement_id: statementId.value,
                detail_id: selectedRow.value?.detail_id ?? selectedRow.value?.id ?? ""
              }),
            false
          )
          break
      }
    } finally {
      closeConfirmLoading()
    }
  }

  async function executeAction(action: () => Promise<{ code: number; msg: string }>, isPayout: boolean) {
    const response = await action()

    if (response.code === 0) {
      $q.notify({
        type: "positive",
        message: t(isPayout ? "message.distributed_success" : "message.cancellation_successful"),
        position: "top",
        timeout: 300
      })
      closeConfirm()
      await loadDetails()
      return
    }

    $q.notify({
      type: "negative",
      message: response.msg,
      position: "top",
      timeout: 1000
    })
  }

  function onBackTo() {
    const { start, end } = route.query

    router.push({
      name: "AgentMemberCommissioDetailList",
      query: {
        start,
        end
      }
    })
  }
</script>
