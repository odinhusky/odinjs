<template>
  <div class="q-pa-md">
    <query
      ref="queryComponent"
      v-model:total="totalSize"
      :configs="queryConfigs"
      @query-update="onSubmit"
      @query-field-change="onQueryFieldChange"
    >
      <template #mainContent>
        <div class="row q-mb-md justify-start" v-if="permission.edit">
          <q-btn color="green" class="btnCancel q-mr-md" @click="onDistributeAll()">
            {{ $t("btn.distribute_all") }}
          </q-btn>
          <span style="align-items: end; font-size: 12px" class="q-flex text-grey font-weight-bold"
            ><q-icon class="q-mr-xs" color="grey" size="xs" name="info" />
            {{ $t("common.sure_to_distribute_all_tip") }}</span
          >
          <q-btn outline color="main-color" class="q-mr-md q-ml-auto" @click="onExport">
            {{ $t("btn.export") }}
            <q-icon class="q-ml-xs" size="xs" name="archive" />
          </q-btn>
        </div>

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
              <q-td key="settle_cycle" :props="props">
                {{ genTimeFormat(props.row.start_date, "yyyy-MM-dd") }} -
                {{ genTimeFormat(props.row.end_date, "yyyy-MM-dd") }}
              </q-td>
              <q-td key="event_type" :props="props">
                {{ $t(EVENT_TYPE.I18nKeys[props.row.promotion_type as EVENT_TYPE.Enums]) }}
              </q-td>
              <q-td key="event_name" :props="props">
                {{ props.row.promotion_title }}
              </q-td>
              <q-td key="member_account" :props="props">
                {{ props.row.member_account }}
              </q-td>
              <q-td key="currency" :props="props">
                {{ props.row.currency }}
              </q-td>
              <q-td v-if="walletSwitch" key="wallet_type" :props="props">
                {{
                  props.row.wallet_type
                    ? $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                    : "-"
                }}
              </q-td>
              <q-td key="prize_type" :props="props">
                {{ props.row.prize_type ? $t(PRIZE_TYPE.I18nKeys[props.row.prize_type as PRIZE_TYPE.Enums]) : "-" }}
              </q-td>
              <q-td key="reward_amount" :props="props">
                {{
                  props.row.prize_type === PRIZE_TYPE.Enums.FREE_GAME
                    ? `${props.row.free_round_items[0]?.product_name} / ${props.row.free_round_items[0]?.game_name} / ${props.row.free_round_items[0].rounds} `
                    : props.row.amount
                }}
              </q-td>
              <q-td key="distribution_type" :props="props">
                <span v-if="props.row.is_auto">{{ $t(REWARD_TYPE.I18nKeys[REWARD_TYPE.Enums.Auto]) }}</span>
                <span v-else>{{ $t(REWARD_TYPE.I18nKeys[REWARD_TYPE.Enums.Manual]) }}</span>
              </q-td>
              <q-td key="tag" :props="props">
                {{ getBlockLabelCount(props.row) }}
              </q-td>
              <q-td key="reason" :props="props">
                {{ $t(AUTO_PAYOUT_REASON.I18nKeys[props.row.reason as AUTO_PAYOUT_REASON.Enums]) }}
              </q-td>
              <q-td key="status" :props="props">
                {{ $t(DISTRIBUTION_STATUS.I18nKeys[props.row.status as DISTRIBUTION_STATUS.Enums]) }}
              </q-td>
              <!-- 操作 -->
              <q-td key="operate" :props="props" v-if="permission.edit">
                <!-- Disabled when distrubution status not equal to not distributed  -->
                <q-btn
                  :disable="props.row.status !== DISTRIBUTION_STATUS.Enums.NotDistributed"
                  color="green"
                  flat
                  class="q-mr-xs"
                  @click="onDistribute(props.row)"
                  >{{ $t("btn.distribute") }}</q-btn
                >
                <q-btn
                  color="red"
                  :disable="props.row.status !== DISTRIBUTION_STATUS.Enums.NotDistributed"
                  flat
                  @click="onReject(props.row)"
                  >{{ $t("btn.reject") }}</q-btn
                >
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
  <!-- 派發彈窗 -->
  <dialog-comp v-model="distributeDialog" :configs="dialogConfigs.distribute" :loading="distributeLoading">
    <template #mainContent v-if="dialogReason === ''">
      <div>{{ $t("common.sure_to_distribute_event") }}</div>
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
      <div>{{ $t("common.suto_to_reject_event") }}</div>
    </template>
  </dialog-comp>

  <!-- 全部派發 -->
  <dialog-comp v-model="distributeAllDialog" :configs="dialogConfigs.distributeAll" :loading="distributeAllLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_distribute_all_event") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, computed, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar, Notify } from "quasar"
  import type { QTableProps } from "quasar"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import { usePromotionStore } from "@/stores/promotionStore"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import {
    getPromotionReviewList,
    rejectPromotionReviewItem,
    passPromotionReviewItem,
    passPromotionReviewItemAll
  } from "@/api/promotion"
  import type { GetPromotionList } from "@/api/request.type"
  import type { GetPromotionReviewItem, generalPromotionListItem, PromotionReviewBlockLabel } from "@/api/response.type"
  import {
    EVENT_TYPE,
    REWARD_TYPE,
    DISTRIBUTION_STATUS,
    AUTO_PAYOUT_REASON,
    BONUS_WALLET_TYPE,
    PRIZE_TYPE
  } from "@/utils/constants"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { usePermission } from "@/hook/usePermission"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { getPromotionExport } from "@/api/report"
  import { useExport } from "@/hook/useExport"
  import type * as Resquest from "@/api/request.type"

  const { permission } = usePermission()
  const { walletSwitch } = useWalletBouns()
  const { t } = useI18n()
  const $q = useQuasar()
  const store = usePromotionStore()

  // 跟踪当前的 PrizeType 值
  const currentPrizeType = ref<number | undefined>(undefined)

  // 引用 query 组件
  const queryComponent = ref()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useEventName: true,
      useEventType: true,
      useCurrency: true,
      customDateTimeLabelI18nKey: "query_params.query_scope",
      usePrizeType: true,
      currentPrizeType: currentPrizeType.value
    }

    // 只有当 PrizeType 的值为 1（现金类型）时，才启用 useWalletType
    if (walletSwitch.value && currentPrizeType.value === 1) {
      baseConfig.useWalletType = true
    }

    baseConfig.useDistributionStatus = true
    baseConfig.useMemberAccount = true
    baseConfig.useDatePicker = true

    return baseConfig
  })

  let { search, tableData, totalSize } = useSearch(getPromotionReviewList)
  const { genTimeFormat } = useCommon()

  let catchQueryForm: GetPromotionList
  async function onSubmit(queryForm: GetPromotionList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  // 监听查询字段变化事件
  function onQueryFieldChange(eventData: { queryForm: Record<string, any>; rawQueryForm: any }) {
    // 检查 PrizeType 是否发生变化
    const newPrizeType = eventData.queryForm.prizeType
    const oldPrizeType = currentPrizeType.value

    // 更新当前的 PrizeType 值
    currentPrizeType.value = newPrizeType

    // 当 PrizeType 的值发生变化时，初始化 WalletType 的值
    if (newPrizeType !== oldPrizeType) {
      queryComponent.value.queryForm.wallet_type = null
    }
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const baseColumns: QTableProps["columns"] = [
      {
        name: "settle_cycle",
        label: t("table_header.settle_cycle"),
        field: "settle_cycle",
        sortable: false,
        align: "center"
      },
      {
        name: "event_type",
        label: t("query_params.event_type"),
        field: "event_type",
        sortable: false,
        align: "center"
      },
      {
        name: "event_name",
        label: t("query_params.event_name"),
        field: "event_name",
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
        name: "currency",
        label: t("table_header.currency"),
        field: "currency",
        sortable: false,
        align: "center"
      },
      ...(walletSwitch.value
        ? [
            {
              name: "wallet_type",
              label: t("table_header.wallet_type"),
              field: "wallet_type",
              sortable: false,
              align: "center" as const
            }
          ]
        : []),
      {
        name: "prize_type",
        label: t("table_header.prize_distribution_type"),
        field: "prize_type",
        sortable: false,
        align: "center"
      },
      {
        name: "reward_amount",
        label: t("common.reward"),
        field: "reward_amount",
        sortable: false,
        align: "center"
      },
      {
        name: "distribution_type",
        label: t("query_params.distribution_type"),
        field: "distribution_type",
        sortable: false,
        align: "center"
      },
      {
        name: "tag",
        label: t("table_header.tag"),
        field: "tag",
        sortable: false,
        align: "center"
      },
      {
        name: "reason",
        label: t("table_header.no_distribute_reason"),
        field: "reason",
        sortable: false,
        align: "center"
      },
      {
        name: "status",
        label: t("table_header.status"),
        field: "status",
        sortable: false,
        align: "center"
      },
      {
        name: "operate",
        label: t("table_header.operate"),
        field: "operate",
        sortable: false,
        align: "center"
      }
    ]

    return baseColumns
  })

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
  const dialogDataId = ref(0)
  const dialogReason = ref("")

  const {
    dialog: distributeDialog,
    openDialog: openDistributeDialog,
    closeDialog: closeDistributeDialog,
    loading: distributeLoading,
    openLoading: openDistributeLoading,
    closeLoading: closeDistributeLoading
  } = useDialog()

  function getBlockLabelCount(item: Pick<GetPromotionReviewItem, "block_label">): number {
    return item.block_label.length
  }

  function onDistribute(item: generalPromotionListItem) {
    dialogDataId.value = item.id
    dialogReason.value = ""
    const filteredData = tableData.value.filter((items: DataItem) => items.id === dialogDataId.value)

    if (filteredData[0].block_label.length > 0) {
      const tip = filteredData[0].block_label.map((label: PromotionReviewBlockLabel) => label.name)
      // console.log(tip)
      dialogReason.value = tip.join(", ")
    }

    openDistributeDialog(item)
  }
  async function handleDistribute() {
    try {
      openDistributeLoading()

      const { search } = useSearch(passPromotionReviewItem)
      await search(dialogDataId.value)

      onSubmit(catchQueryForm)
      $q.notify({
        type: "positive",
        message: t("message.distribute_success"),
        position: "top",
        timeout: 1000
      })

      closeDistributeDialog()
    } catch (error) {
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

  function onReject(item: generalPromotionListItem) {
    dialogDataId.value = item.id
    openRejectDialog(item)
  }
  async function handleReject() {
    openRejectLoading()

    const { search } = useSearch(rejectPromotionReviewItem)
    await search(dialogDataId.value)

    onSubmit(catchQueryForm)
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
    block_label: PromotionReviewBlockLabel[]
  }

  const {
    dialog: distributeAllDialog,
    openDialog: openDistributeAllDialog,
    closeDialog: closeDistributeAllDialog,
    loading: distributeAllLoading,
    openLoading: openDistributeAllLoading,
    closeLoading: closeDistributeAllLoading
  } = useDialog()

  function onDistributeAll() {
    openDistributeAllDialog()
  }

  // 匯出
  const { getExportPath } = useExport()
  const onExport = async () => {
    const params: GetPromotionList = catchQueryForm

    // 匯出所有搜尋結果
    params.size = totalSize.value

    const { search, status, tableData } = useSearch(getPromotionExport)
    await search(params)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }

  async function handleDistributeAll() {
    const filteredData = tableData.value.filter((item: DataItem) => getBlockLabelCount(item) === 0 && item.status === 0)
    const ids = filteredData.map((item: DataItem) => item.id)

    const sendData = {
      ids: ids
    }
    openDistributeAllLoading()
    /*待API完成
        const { code, msg } = await passPromotionReviewItemAll(sendData)
        if (code !== 0) {
          $q.notify({
            type: "negative",
            message: msg,
            position: "top",
            timeout: 1000
          })
          return
        }
        onSubmit(catchQueryForm)*/
    $q.notify({
      type: "positive",
      message: t("message.distribute_success"),
      position: "top",
      timeout: 1000
    })
    closeDistributeAllLoading()
    closeDistributeAllDialog()
  }
</script>

<style lang="scss" scoped>
  .distribute-tip {
    color: red;
  }
</style>
