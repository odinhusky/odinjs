<template>
  <SubPage :action-label-i18n-key="'common.detail'" class="q-pt-xs" :custom-back-func="onBackTo" />

  <div class="row q-pl-md justify-start">
    <p style="font-size: 20px">
      {{ $t("common.current_version") }} : {{ version }}
      <span v-if="Number(status) === PROCESS_STATUS.Enums.PROCESS_STATUS_PROCESSING"
        >({{ $t("common.calculating") }})</span
      >
      <span v-else-if="Number(status) === PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED"
        >({{ $t("step_label.finish") }})</span
      >
    </p>
  </div>

  <div class="q-pa-md q-pt-none">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start q-gutter-xs">
          <q-btn color="red" class="q-mr-sm btns" @click="onCancellAll()">{{ $t("btn.cancel_all2") }}</q-btn>

          <q-btn color="green" class="q-mr-sm btns" @click="onBatchAll()">{{ $t("btn.distribute_all") }}</q-btn>

          <q-btn color="brown" @click="onEdit()" class="btns">{{ $t("btn.data_adjustment") }}</q-btn>
          <q-space />

          <q-btn @click="onExport" class="q-ml-md btns btn-export" v-if="permission.export">
            <q-icon class="q-mr-xs" size="xs" name="archive" />
            {{ $t("btn.export") }}
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
              <!-- 会员账号 -->
              <q-td key="member_account" :props="props">
                {{ props.row.member_account }}
              </q-td>

              <!-- 總輸贏 -->
              <q-td key="total_profit" :props="props">
                {{ moneyFormat(props.row.total_profit) }}
              </q-td>

              <!-- 下級分配投注額 -->
              <q-td key="downline_calculated_bet" :props="props">
                {{ moneyFormat(props.row.downline_calculated_bet) }}
              </q-td>

              <!-- 總投注 -->
              <q-td key="total_valid_bet" :props="props">
                {{ moneyFormat(props.row.total_valid_bet) }}
              </q-td>

              <!-- 結算佔成 -->
              <q-td key="settlement_rate" :props="props"> {{ props.row.settlement_rate }} / {{ rate_base }} </q-td>
              <!-- 佣金金額 -->
              <q-td key="commission" :props="props">
                {{ moneyFormat(props.row.commission) }}
              </q-td>

              <!-- 狀態 -->
              <q-td key="status" :props="props">
                <template v-if="props.row.status === 0">
                  {{ $t("reward_status.pending") }}
                </template>
                <template v-else-if="props.row.status === 2">
                  {{ $t("reward_status.done") }}
                </template>
                <template v-else-if="props.row.status === 4">
                  {{ $t("reward_status.cancelled") }}
                </template>
                <template v-if="props.row.status === 5">
                  {{ $t("process_status.settled") }}
                </template>
              </q-td>
              <!-- 功能 -->
              <q-td key="actions" :props="props" v-if="permission.edit">
                <!--<q-btn
                  v-if="props.row.blocked_label_ids.length > 0"
                  :color="props.row.status !== 0 || Number(props.row.amount) === 0 ? 'grey' : 'green'"
                  :disable="props.row.status !==0 || Number(props.row.amount) === 0"
                  class="q-mr-md"
                  @click="onDistribution(props.row)"
                >
                  {{ $t("btn.force_send") }}
                </q-btn>-->

                <template v-if="Number(status) === PROCESS_STATUS.Enums.PROCESS_STATUS_RELEASED">
                  <q-btn
                    :color="props.row.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED ? 'grey' : 'green'"
                    :disable="props.row.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED"
                    class="q-mr-md btns"
                    @click="onDistributionSingle(props.row)"
                  >
                    {{ $t("btn.distribute") }}
                  </q-btn>

                  <q-btn
                    :color="props.row.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED ? 'grey' : 'red'"
                    :disable="props.row.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED"
                    class="q-mr-md btns"
                    @click="onCancel(props.row)"
                  >
                    {{ $t("btn.cancel") }}
                  </q-btn>
                  <!--<q-btn
                    :color="props.row.status === 0 || props.row.status === 1 ? 'green' : 'grey'"
                    :disable="!(props.row.status === 0 || props.row.status === 1)"
                    class="q-mr-md"
                    @click="onDistributionSingle(props.row)"
                  >
                    {{ $t("btn.distribute") }}
                  </q-btn>

                  <q-btn
                    :color="props.row.status === 0 || props.row.status === 1 ? 'red' : 'grey'"
                    :disable="!(props.row.status === 0 || props.row.status === 1)"
                    class="q-mr-md"
                    @click="onCancel(props.row)"
                  >
                    {{ $t("btn.cancel") }}
                  </q-btn>-->
                </template>
                <template v-else>
                  <q-btn :color="'grey'" :disable="true" class="q-mr-md btns">
                    {{ $t("btn.distribute") }}
                  </q-btn>
                  <q-btn :color="'grey'" :disable="true" class="q-mr-md btns">
                    {{ $t("btn.cancel") }}
                  </q-btn>
                </template>

                <q-btn
                  style="background-color: #2196f3; color: white"
                  class="q-mr-md btns"
                  @click="onAction(props.row)"
                >
                  {{ $t("common.detail") }}
                </q-btn>
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
  <!-- 確認全部派發彈窗 -->
  <dialog-comp v-model="batchDialog" :configs="dialogConfigs.batch" :loading="batchLoading" max-width="20rem">
    <template #mainContent>
      <div>{{ $t("common.sure_to_force_all_send_reward") }}</div>
    </template>
  </dialog-comp>

  <!-- 全部取消彈窗 -->
  <dialog-comp
    v-model="cancellBatchDialog"
    :configs="dialogConfigs.cancel"
    :loading="cancellBatchLoading"
    max-width="20rem"
  >
    <template #mainContent>
      <div>{{ $t("common.sure_to_cancel") }}</div>
    </template>
  </dialog-comp>

  <!-- 數據彈窗 -->
  <dialog-comp v-model="detailDialog" :configs="dialogConfigs.detail" max-width="48rem">
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-sm">
          <div>
            <p style="font-size: 20px">
              {{ $t("common.current_version") }} : {{ version }}
              <span v-if="Number(status) === PROCESS_STATUS.Enums.PROCESS_STATUS_PROCESSING"
                >({{ $t("common.calculating") }})</span
              >
              <span v-else-if="Number(status) === PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED"
                >({{ $t("step_label.finish") }})</span
              >
            </p>
          </div>
          <q-card-section style="padding: 0">
            <q-separator />
          </q-card-section>
        </div>
        <div class="col-12">
          <q-markup-table square separator="none">
            <thead class="bg-success">
              <tr>
                <th>{{ $t("table_header.product _category") }}</th>
                <th>{{ $t("table_header.validate_bet") }}</th>
                <th>{{ $t("table_header.payout") }}</th>
                <th>{{ $t("table_header.win_or_lose") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in statisticsDate" :key="item.game_type">
                <td align="right">
                  <span>
                    {{ t(GAME_TYPE.I18nKeys[item.game_type as GAME_TYPE.Enums] || "table_header.other_fees") }}
                  </span>
                </td>
                <td>
                  <q-number
                    v-model.number="item.valid_bet"
                    dense
                    borderless
                    square
                    :options="generalOptions"
                    @focus="clearIfZero(item, 'valid_bet')"
                    @update:model-value="recalculateTotal"
                  />
                </td>
                <td>
                  <q-number
                    v-model.number="item.prize_amount"
                    dense
                    borderless
                    square
                    :options="generalOptions"
                    @focus="clearIfZero(item, 'prize_amount')"
                    @update:model-value="recalculateTotal"
                  />
                </td>
                <td align="right">
                  <span>{{ item.profit }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>{{ $t("common.total") }}</span>
                </td>
                <td>
                  <span>{{ moneyFormat(total_valid_bet) }}</span>
                </td>
                <td>
                  <span>{{ moneyFormat(total_prize_amount) }}</span>
                </td>
                <td>
                  <span>{{ moneyFormat(total_profit) }}</span>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div class="col-12 q-mt-lg" style="justify-content: end; display: flex">
          <q-btn
            :style="{
              backgroundColor: Number(status) !== PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED ? 'grey' : '#2196f3',
              color: 'white'
            }"
            :disable="Number(status) !== PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED"
            @click="updatedStatisticsDate"
          >
            {{ $t("btn.recalculate") }}
          </q-btn>
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar, Notify } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { REWARD_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useExport } from "@/hook/useExport"

  import query, { IQueryConfig } from "@/components/query/common.vue"
  import {
    getShareholdersDetail,
    postShareholdersDetailCancelAll,
    postShareholdersDetailDistAll,
    postShareholdersDetailMandatoryDist,
    shareholdersDetailCancel,
    shareholdersDetailExport,
    shareholderStatistics,
    updateShareholderStatistics,
    getShareholderSingleEvent
  } from "@/api/shareholdersSetting"

  import type { ShareholdersCancell, ShareholdersDistribution, GetShareholdersDetails } from "@/api/request.type"
  import type { GetShareholderStatistics } from "@/api/response.type"
  import { SHAREHOLDERS_REWARD_STATUS, PROCESS_STATUS, SEND_TYPE, GAME_TYPE } from "@/utils/constants"
  import SubPage from "layouts/SubPage/Index.vue"
  import { usePermission } from "@/hook/usePermission"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  import { useQueryStore } from "src/stores/queryStore"
  import { update } from "ramda"

  const { permission } = usePermission()
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const queryStore = useQueryStore()
  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: ""
  }
  type Field = "valid_bet" | "prize_amount" | "profit"
  const clearIfZero = (item: any, field: Field) => {
    if (item[field] <= 0) {
      item[field] = ""
    }
  }
  const isBatch = ref(false)
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })

  let { search, tableData, totalSize } = useSearch(getShareholdersDetail)
  const { genTimeFormat, moneyFormat } = useCommon()

  let catchQueryForm: GetShareholdersDetails
  const event_id = route.params.id as string
  async function onSubmit(queryForm: GetShareholdersDetails) {
    queryForm.id = Number(event_id)
    catchQueryForm = queryForm
    await search(queryForm)
    reLoadEventStatue()
  }
  onMounted(async () => {
    await queryStore.getGameTypeList()
  })

  const status = ref(0)
  const rate_base = ref(0)
  const version = ref("")
  async function reLoadEventStatue() {
    const response = await getShareholderSingleEvent(event_id)
    if (response?.code === 0) {
      status.value = response.data.status
      rate_base.value = response.data.rate_base
      version.value = response.data.version
    } else {
      $q.notify({
        type: "negative",
        message: response.msg,
        position: "top",
        timeout: 300
      })
    }
  }

  /*const dropdownData = reactive<{
       tag: {
         label: string
         value: number
       }[]
     }>({
       tag: []
     })
     //取得活動列表
     const getTaglist = async (currency: number) => {
       const { data } = await getTagList()

       if (!data || !Object.keys(data).length) {
         return
       }
       dropdownData.tag.length = 0
       dropdownData.tag.push({ label: "", value: 0 })
       data.list.forEach((item) => {
         const newItem = {
           label: item.name,
           value: item.id
         }
         dropdownData.tag.push(newItem)
       })
     }*/
  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "member_account",
        label: t("query_params.member_account"),
        field: "member_account",
        sortable: false,
        align: "center"
      },
      {
        name: "total_profit",
        label: t("table_header.total_win_loss"),
        field: "total_profit",
        sortable: false,
        align: "center"
      },
      {
        name: "downline_calculated_bet",
        label: t("table_header.subordinate_bet_all"),
        field: "downline_calculated_bet",
        sortable: false,
        align: "center"
      },
      {
        name: "total_valid_bet",
        label: t("table_header.total_platform_bets"),
        field: "total_valid_bet",
        sortable: false,
        align: "center"
      },
      {
        name: "settlement_rate",
        label: t("table_header.settlement_commission"),
        field: "settlement_rate",
        sortable: false,
        align: "center"
      },
      {
        name: "commission",
        label: t("table_header.commission_amount"),
        field: "commission",
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
        name: "actions",
        label: t("table_header.actions"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]

    // 如果無編輯權限 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  //全部派發
  async function handleBatchAll() {
    openbatchLoading()
    try {
      const response = await postShareholdersDetailDistAll(event_id)

      if (response?.code === 0) {
        $q.notify({
          type: "positive",
          message: t("message.distributed_success"),
          position: "top",
          timeout: 300
        })
        onSubmit(catchQueryForm)
      } else {
        $q.notify({
          type: "negative",
          message: response.msg,
          position: "top",
          timeout: 300
        })
      }
      closebatchLoading()
      closebatch()
    } catch {
      $q.notify({
        type: "negative",
        message: t("message.distributed_failed"),
        position: "top",
        timeout: 300
      })
    }
  }

  //全部取消
  async function handleCancellBatchAll() {
    opencancellBatchLoading()
    try {
      const response = await postShareholdersDetailCancelAll(event_id)

      if (response?.code === 0) {
        $q.notify({
          type: "positive",
          message: t("message.cancellation_successful"),
          position: "top",
          timeout: 300
        })
        onSubmit(catchQueryForm)
      } else {
        $q.notify({
          type: "negative",
          message: response.msg,
          position: "top",
          timeout: 300
        })
      }
      closecancellBatchLoading()
      closecancellBatch()
    } catch {
      $q.notify({
        type: "negative",
        message: t("message.distributed_failed"),
        position: "top",
        timeout: 300
      })
    }
  }

  //一般派發
  async function onDistributionSingle(row?: GetShareholdersDetails) {
    const payload: ShareholdersDistribution = {
      event_id: event_id,
      entry_id: row?.id
    }
    try {
      const response = await postShareholdersDetailMandatoryDist(payload)

      if (response?.code === 0) {
        $q.notify({
          type: "positive",
          message: t("message.distributed_success"),
          position: "top",
          timeout: 300
        })
        onSubmit(catchQueryForm)
      } else if (response?.code === 309010) {
        $q.notify({
          type: "negative",
          message: t("error_msg.member_marked_tag"),
          position: "top",
          timeout: 2000
        })
        onSubmit(catchQueryForm)
      } else {
        $q.notify({
          type: "negative",
          message: response.msg,
          position: "top",
          timeout: 300
        })
      }
    } catch {
      $q.notify({
        type: "negative",
        message: t("message.distributed_failed"),
        position: "top",
        timeout: 300
      })
    }
  }

  //取消
  async function onCancel(row?: GetShareholdersDetails) {
    const payload: ShareholdersDistribution = {
      event_id: event_id,
      entry_id: row?.id
    }
    try {
      const response = await shareholdersDetailCancel(payload)

      if (response?.code === 0) {
        $q.notify({
          type: "positive",
          message: t("message.cancellation_successful"),
          position: "top",
          timeout: 300
        })
        onSubmit(catchQueryForm)
      } else {
        $q.notify({
          type: "negative",
          message: response.msg,
          position: "top",
          timeout: 300
        })
      }
    } catch {
      $q.notify({
        type: "negative",
        message: t("message.cancellation_failed"),
        position: "top",
        timeout: 300
      })
    }
  }

  function onBackTo() {
    const { start, end } = route.query
    router.push({
      name: "ShareholdersDetailList",
      query: {
        start,
        end
      }
    })
  }
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    batch: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleBatchAll
    },
    cancel: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleCancellBatchAll
    },
    detail: {
      dialogLabelI18nKey: "",
      type: DialogType.ADD,
      useActions: false,
      submitFunction: handleOpenDetail
    }
  })

  const dialogData = reactive<{
    batch: {
      id?: number
    }
    cancellbatch: {
      id?: number
    }
    detail: {
      id?: number
    }
  }>({
    batch: { id: 0 },
    cancellbatch: { id: 0 },
    detail: { id: 0 }
  })
  const {
    dialog: batchDialog,
    openDialog: openbatchDialog,
    loading: batchLoading,
    openLoading: openbatchLoading,
    closeLoading: closebatchLoading,
    closeDialog: closebatch
  } = useDialog()

  const {
    dialog: cancellBatchDialog,
    openDialog: opencancellBatchDialog,
    loading: cancellBatchLoading,
    openLoading: opencancellBatchLoading,
    closeLoading: closecancellBatchLoading,
    closeDialog: closecancellBatch
  } = useDialog()

  const {
    dialog: detailDialog,
    openDialog: openDetailDialog,
    loading: detailLoading,
    openLoading: openDetailLoading,
    closeLoading: closeDetailLoading,
    closeDialog: closeDetailDialog
  } = useDialog()

  const disId = ref(-1)
  const disEventId = ref(-1)

  function onCancellAll() {
    opencancellBatchDialog()
  }
  function onBatchAll() {
    openbatchDialog()
  }
  const statisticsDate = ref<GetShareholderStatistics[]>([])
  const total_valid_bet = ref(0)
  const total_prize_amount = ref(0)
  const total_profit = ref(0)

  async function onEdit() {
    const response = await shareholderStatistics(route.params.id as string)
    if (response?.code === 0) {
      statisticsDate.value = response.data.list
    } else {
      $q.notify({
        type: "negative",
        message: response.msg,
        position: "top",
        timeout: 300
      })
    }
    /*statisticsDate.value = statisticsDate.value.map((stat) => {
       const matched = queryStore.gameTypeList.find((item) => item.value === stat.game_type)
       return {
         ...stat,
         type_name: matched ? GAME_TYPE.I18nKeys[stat.game_type as keyof typeof GAME_TYPE.I18nKeys] : undefined
       }
     })*/
    const currencyID = statisticsDate.value[0]?.currency_id || 1

    const existingGameTypeIDs = new Set(statisticsDate.value.map((item) => item.game_type))

    // 檢查 queryStore 中有無缺漏的 GameType，若缺少就補上
    queryStore.gameTypeList.forEach((game: any) => {
      if (!existingGameTypeIDs.has(game.value)) {
        statisticsDate.value.push({
          game_type: game.value,
          currency_id: currencyID,
          valid_bet: 0,
          prize_amount: 0,
          profit: 0
        })
      }
    })

    statisticsDate.value.sort((a: any, b: any) => a.game_type - b.game_type)

    recalculateTotal()

    openDetailDialog()
  }

  function recalculateTotal() {
    total_valid_bet.value = statisticsDate.value.reduce((sum, stat) => sum + Number(stat.valid_bet || 0), 0)
    total_prize_amount.value = statisticsDate.value.reduce((sum, stat) => sum + Number(stat.prize_amount || 0), 0)
    total_profit.value = statisticsDate.value.reduce((sum, stat) => sum + Number(stat.profit || 0), 0)
  }

  async function updatedStatisticsDate() {
    statisticsDate.value = statisticsDate.value.map((item) => ({
      ...item,
      valid_bet: item.valid_bet === "" ? "0" : item.valid_bet,
      prize_amount: item.prize_amount === "" ? "0" : item.prize_amount,
      profit: item.profit === "" ? "0" : item.profit
    }))

    openDetailLoading()
    const response = await updateShareholderStatistics(route.params.id as string, statisticsDate.value)
    if (response?.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    } else {
      $q.notify({
        type: "negative",
        message: response.msg,
        position: "top",
        timeout: 300
      })
    }
    closeDetailLoading()
    closeDetailDialog()
  }

  function handleOpenDetail() {}

  function onAction(row: any) {
    const { start, end, currency, rate_base, status, version } = route.query
    router.push({
      name: "ShareholdersDetailNestedDetail",
      params: {
        event_id: event_id,
        entry_id: row.member_id
      },
      query: {
        start,
        end,
        currency,
        rate_base,
        status,
        version
      }
    })
  }

  // 匯出
  const { getExportPath } = useExport()
  const onExport = async () => {
    const { search, status, tableData } = useSearch(shareholdersDetailExport)
    await search(event_id)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/css/setting.scss";

  .q-markup-table.q-table__container {
    tbody {
      tr {
        td {
          ::v-deep(.q-field) {
            width: 60%;
            border: 0.0625rem solid #999;
            display: inline-table;
          }
          text-align: right;
          span {
            padding-right: 5px !important;
          }
        }
      }
    }
  }
  ::v-deep(
      .q-field--auto-height.q-field--dense .q-field__control,
      .q-field--auto-height.q-field--dense .q-field__native
    ) {
    min-height: 30px !important;
  }
</style>
