<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <!-- <div class="row q-mb-md justify-start">
          <q-btn outline color="green" class="q-mr-md" @click="onDistributeAll('confirm')">
            {{ $t("btn.batch_distribute") }}
          </q-btn>
          <q-btn outline color="red" class="q-mr-md" @click="onDistributeAll('reject')">
            {{ $t("btn.batch_reject") }}
          </q-btn>
          <q-btn outline color="main-color" class="q-mr-md" @click="onDistributeAll('all')">
            {{ $t("btn.distribute_all") }}
          </q-btn>
          <span style="align-items: center" class="q-flex"> {{ $t("common.sure_to_distribute_all_tip") }}</span>
        </div> -->
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            row-key="id"
          >
            <!-- 勾選框 -->
            <!-- <template #header-cell-checkbox v-if="permission.edit">
            <q-th>
              <q-checkbox v-model="isSelectedAll" dense dark />
            </q-th>
          </template> -->
            <template #body="props">
              <q-tr>
                <!-- 勾選框 -->
                <!-- <q-td v-if="permission.edit" class="text-center">
                <q-checkbox
                  v-model="selection.list"
                  :val="props.row"
                  dense
                  color="main-color"
                  :disable="props.row.status !== COLLABORATION_DISTRIBUTION_STATUS.Enums.NotDistributed"
                />
              </q-td> -->
                <!-- 結算週期 -->
                <q-td key="started_at" :props="props">
                  {{ genTimeFormat(props.row.started_at, "yyyy-MM-dd") }}~{{
                    genTimeFormat(props.row.ended_at, "yyyy-MM-dd")
                  }}
                </q-td>
                <!-- 會員帳號 -->
                <q-td key="member_account" :props="props">
                  {{ props.row.member_account }}
                </q-td>
                <!-- 等級 -->
                <q-td key="level" :props="props"> LV {{ props.row.level }} </q-td>

                <!-- 活躍會員人數 -->
                <q-td key="active_member_count" :props="props">
                  <span
                    v-if="props.row.active_member_count > 0"
                    class="text-blue cursor-pointer"
                    @click="onAction(props.row)"
                    >{{ props.row.active_member_count }}</span
                  >
                  <span v-else>{{ props.row.active_member_count }}</span>
                </q-td>

                <!-- 幣別 -->
                <q-td key="currency_id" :props="props">
                  {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums] || "common.unknow") }}
                </q-td>
                <!-- 淨利 -->
                <q-td key="net_profit" :props="props">
                  {{ moneyFormat(props.row.net_profit, 2) }}
                </q-td>
                <!-- 獲得返水 -->
                <q-td key="rebate_amount" :props="props">
                  {{ moneyFormat(props.row.rebate_amount, 2) }}
                </q-td>
                <!-- 獲得優惠贈金 -->
                <q-td key="promotion_amount" :props="props">
                  {{ moneyFormat(props.row.promotion_amount, 2) }}
                </q-td>
                <!-- 金流手續費 -->
                <q-td key="payment_fee_amount" :props="props">
                  {{ moneyFormat(props.row.payment_fee_amount, 2) }}
                </q-td>
                <!-- 管理費 -->
                <q-td key="platform_fee_amount" :props="props">
                  {{ moneyFormat(props.row.platform_fee_amount, 2) }}
                </q-td>
                <!-- 返佣 -->
                <q-td key="collab_rebate_amount" :props="props">
                  {{ moneyFormat(props.row.collab_rebate_amount, 2) }}
                </q-td>
                <!-- 派發方式 -->
                <q-td key="auto_payout" :props="props">
                  {{
                    $t(
                      COLLABORATION_REWARD_TYPE.I18nKeys[props.row.auto_payout as COLLABORATION_REWARD_TYPE.Enums] ||
                        "common.unknow"
                    )
                  }}
                </q-td>
                <!-- 標籤 -->
                <q-td key="label_count" :props="props">
                  {{ props.row.label_count }}
                </q-td>
                <!-- 原因 -->
                <q-td key="reason" :props="props">
                  {{ $t(AUTO_PAYOUT_REASON.I18nKeys[props.row.reason as AUTO_PAYOUT_REASON.Enums] || "") }}
                </q-td>
                <!-- 狀態 -->
                <q-td key="status" :props="props">
                  {{
                    $t(
                      COLLABORATION_DISTRIBUTION_STATUS.I18nKeys[
                        props.row.status as COLLABORATION_DISTRIBUTION_STATUS.Enums
                      ] || "common.unknow"
                    )
                  }}
                </q-td>
                <!-- 操作 -->
                <q-td key="actions" :props="props" v-if="permission.edit">
                  <!-- Disabled when distrubution status not equal to not distributed  -->
                  <q-btn
                    :disable="props.row.status !== 0"
                    color="green"
                    class="q-mr-xs"
                    @click="onDistribute(props.row)"
                    >{{ $t("btn.distribute") }}</q-btn
                  >
                  <q-btn color="red" :disable="props.row.status !== 0" @click="onReject(props.row)">{{
                    $t("btn.reject")
                  }}</q-btn>
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
  <!-- 派發彈窗 -->
  <dialog-comp v-model="distributeDialog" :configs="dialogConfigs.distribute" :loading="distributeLoading">
    <template #mainContent v-if="dialogReason === ''">
      <div>{{ $t("common.confirm_distribution") }}</div>
      <div class="distribute-tip">{{ $t("common.distributed_cannot_cancel") }}</div>
    </template>
    <template #mainContent v-else>
      <span>{{ $t("common.this_offer_blocked_tip1") }}</span>
      <span class="distribute-tip">{{ dialogReason }}</span>
      <span>{{ $t("common.this_offer_blocked_tip2") }}</span>
    </template>
  </dialog-comp>
  <!-- 拒絕彈窗 -->
  <dialog-comp v-model="rejectDialog" :configs="dialogConfigs.reject" :loading="rejectLoading">
    <template #mainContent>
      <div>{{ $t("common.confirm_reject_distribution") }}</div>
    </template>
  </dialog-comp>

  <!-- 全部派發 -->
  <dialog-comp v-model="distributeAllDialog" :configs="dialogConfigs.distributeAll" :loading="distributeAllLoading">
    <template #mainContent>
      <div v-if="dialogMode === 'confirm'">{{ $t("common.confirm_batch_distribution") }}</div>
      <div v-if="dialogMode === 'reject'">{{ $t("common.confirm_batch_reject_distribution") }}</div>
      <div v-if="dialogMode === 'all'">{{ $t("common.confirm_distribution_of_all") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { QTableProps, useQuasar, Notify } from "quasar"
  import { computed, reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter } from "vue-router"
  import {
    COLLABORATION_REWARD_TYPE,
    CURRENCY_TYPE,
    COLLABORATION_DISTRIBUTION_STATUS,
    AUTO_PAYOUT_REASON
  } from "@/utils/constants"
  import {
    getCollaborationReviewList,
    rejectCollaborationBatch,
    passCollaborationBatch,
    passCollaborationAll,
    passCollaborationReview,
    rejectCollaborationReview
  } from "@/api/collaboration"
  import type { CollaborationReviewItem } from "@/api/request.type"
  import type { dayReportItem } from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { usePermission } from "@/hook/usePermission"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "@/hook/useDialog"

  const { t } = useI18n()
  const { permission } = usePermission()
  const $q = useQuasar()

  const router = useRouter()
  const onAction = (row: CollaborationReviewItem) => {
    router.push({
      name: "CollaborationReviewDetail",
      params: {
        id: row.id
      }
    })
  }
  const selection = reactive<{
    list: CollaborationReviewItem[]
  }>({
    list: []
  })

  const isSelectedAll = computed({
    get() {
      return tableData.value.every((tableItem: any) =>
        selection.list.some((selectionItem) => selectionItem.id === tableItem.id)
      )
    },
    set(value) {
      if (!value) {
        selection.list = []
        return
      }
      selection.list = tableData.value
        .filter(
          (item: CollaborationReviewItem) => item.status === COLLABORATION_DISTRIBUTION_STATUS.Enums.NotDistributed
        )
        .map((item: CollaborationReviewItem) => item)
      console.log(selection.list)
    }
  })

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    filterShowOnLoaded: true,
    allowSameSubmit: true,
    useCurrency: true,
    useDatePicker: true,
    // useDistributionStatus: true,
    // useRewardType: true,
    usePagination: true
  })

  let { search, tableData, totalSize, tableTotal } = useSearch(getCollaborationReviewList)

  const { genTimeFormat, moneyFormat } = useCommon()
  let catchQueryForm: CollaborationReviewItem

  async function onSubmit(queryForm: CollaborationReviewItem) {
    catchQueryForm = queryForm

    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      // {
      //   name: "checkbox",
      //   label: "",
      //   field: "checkbox",
      //   sortable: false,
      //   align: "center"
      // },
      {
        name: "started_at",
        label: t("table_header.settle_cycle"),
        field: "started_at",
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
        name: "level",
        label: t("table_header.rebate_levels"),
        field: "level",
        sortable: false,
        align: "center"
      },
      {
        name: "active_member_count",
        label: t("edit_form.active_member_count"),
        field: "active_member_count",
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
        name: "net_profit",
        label: t("edit_form.net_profit"),
        field: "net_profit",
        sortable: false,
        align: "center"
      },
      {
        name: "rebate_amount",
        label: t("table_header.rebate_amount"),
        field: "rebate_amount",
        sortable: false,
        align: "center"
      },
      {
        name: "promotion_amount",
        label: t("table_header.promotion_amount"),
        field: "promotion_amount",
        sortable: false,
        align: "center"
      },
      {
        name: "payment_fee_amount",
        label: t("table_header.payment_fee_amount"),
        field: "payment_fee_amount",
        sortable: false,
        align: "center"
      },
      {
        name: "platform_fee_amount",
        label: t("table_header.platform_fee_amount"),
        field: "platform_fee_amount",
        sortable: false,
        align: "center"
      },
      {
        name: "collab_rebate_amount",
        label: t("table_header.collab_rebate_amount"),
        field: "collab_rebate_amount",
        sortable: false,
        align: "center"
      }
      // {
      //   name: "auto_payout",
      //   label: t("query_params.distribution_type"),
      //   field: "auto_payout",
      //   sortable: false,
      //   align: "center"
      // },
      // {
      //   name: "label_count",
      //   label: t("table_header.tag"),
      //   field: "label_count",
      //   sortable: false,
      //   align: "center"
      // },
      // {
      //   name: "reason",
      //   label: t("table_header.no_distribute_reason"),
      //   field: "reason",
      //   sortable: false,
      //   align: "center"
      // },
      // {
      //   name: "status",
      //   label: t("table_header.status"),
      //   field: "status",
      //   sortable: false,
      //   align: "center"
      // },
      // {
      //   name: "actions",
      //   label: t("table_header.function"),
      //   field: "actions",
      //   sortable: false,
      //   align: "center"
      // }
    ]
    // 如果無編輯權限 就把 action+checkbox 移除
    return permission.value.edit
      ? columns
      : columns.filter((column) => column.name !== "actions" && column.name !== "checkbox")
  })
  function onExport() {}

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    distribute: {
      dialogLabelI18nKey: "btn.distribute",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleDistribute
    },
    reject: {
      dialogLabelI18nKey: "btn.reject",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleReject
    },
    distributeAll: {
      dialogLabelI18nKey: "btn.distribute",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleDistributeAll
    }
  })
  const dialogData = reactive({
    id: 0,
    amount: 0,
    currency_id: 0
  })

  const dialogReason = ref("")
  const dialogMode = ref("")
  const {
    dialog: distributeDialog,
    openDialog: openDistributeDialog,
    closeDialog: closeDistributeDialog,
    loading: distributeLoading,
    openLoading: openDistributeLoading,
    closeLoading: closeDistributeLoading
  } = useDialog()

  interface BlockLabel {
    name: string
  }
  function onDistribute(item: CollaborationReviewItem) {
    dialogData.id = item.id
    dialogData.currency_id = item.currency_id
    dialogData.amount = item.rebate_amount
    dialogReason.value = ""
    /*const filteredData = tableData.value.filter((items: DataItem) => items.id === dialogDataId.value)

      if (filteredData[0].block_label.length > 0) {
        let tip = filteredData[0].block_label.map((label: BlockLabel) => label.name)
        console.log(tip)
        dialogReason.value = tip.join(", ")
      }*/

    openDistributeDialog(item)
  }
  async function handleDistribute() {
    try {
      openDistributeLoading()
      const { code, msg } = await passCollaborationReview(dialogData)

      if (code !== 0) {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
        return
      }

      onSubmit(catchQueryForm)
      selection.list = []
      $q.notify({
        type: "positive",
        message: t("message.distribute_success"),
        position: "top",
        timeout: 1000
      })

      closeDistributeDialog()
      closeDistributeLoading()
    } catch (error) {
      // used for error handling and avoid keep loading issue
      console.error("Error during distribution:", error)
      $q.notify({
        type: "negative",
        message: "error",
        position: "top",
        timeout: 3000
      })
    } finally {
      closeDistributeLoading()
    }
  }

  const {
    dialog: rejectDialog,
    openDialog: openRejectDialog,
    closeDialog: closeRejectDialog,
    loading: rejectLoading,
    openLoading: openRejectLoading,
    closeLoading: closeRejectLoading
  } = useDialog()

  function onReject(item: CollaborationReviewItem) {
    dialogData.id = item.id
    openRejectDialog(item)
  }
  async function handleReject() {
    openRejectLoading()
    const { code, msg } = await rejectCollaborationReview(dialogData.id)
    if (code !== 0) {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
      closeRejectLoading()
      return
    }
    onSubmit(catchQueryForm)
    selection.list = []
    $q.notify({
      type: "positive",
      message: t("message.distribute_success"),
      position: "top",
      timeout: 1000
    })
    closeRejectDialog()
    closeRejectLoading()
  }
  interface DataItem {
    id: number
    status: number
    block_label_count: number
    block_label: any[]
  }

  const {
    dialog: distributeAllDialog,
    openDialog: openDistributeAllDialog,
    closeDialog: closeDistributeAllDialog,
    loading: distributeAllLoading,
    openLoading: openDistributeAllLoading,
    closeLoading: closeDistributeAllLoading
  } = useDialog()

  function onDistributeAll(mode: string) {
    dialogMode.value = mode
    openDistributeAllDialog()
  }

  async function handleDistributeAll() {
    /*const filteredData = tableData.value.filter((item: DataItem) => item.block_label_count === 0 && item.status === 0)
      const ids = filteredData.map((item: DataItem) => item.id)
  */
    const ids = selection.list.map((item) => item.id)

    let msgs = t("message.distribute_success")

    openDistributeAllLoading()
    let results
    if (dialogMode.value === "confirm") {
      const result = ids.map((id) => {
        const item = tableData.value.find((data: { id: number }) => data.id === id)
        return {
          id: item.id,
          amount: parseFloat(item.rebate_amount),
          currency_id: item.currency_id
        }
      })
      results = await passCollaborationBatch(result)
    } else if (dialogMode.value === "reject") {
      msgs = t("message.reject_success")
      results = await rejectCollaborationBatch(ids)
    } else {
      results = await passCollaborationAll()
    }
    if (results.code !== 0) {
      $q.notify({
        type: "negative",
        message: results.msg,
        position: "top",
        timeout: 1000
      })
      return
    }
    selection.list = []
    onSubmit(catchQueryForm)
    $q.notify({
      type: "positive",
      message: msgs,
      position: "top",
      timeout: 1000
    })
    closeDistributeAllLoading()
    closeDistributeAllDialog()
  }
</script>
<style lang="scss" scoped>
  :deep(.fileSelector) {
    .q-field__control {
      height: 2.5rem;
    }
  }
  .text-center {
    text-align: center;
  }
</style>
