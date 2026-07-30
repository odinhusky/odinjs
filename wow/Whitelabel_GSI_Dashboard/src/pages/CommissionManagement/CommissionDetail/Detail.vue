<template>
  <SubPage :action-label-i18n-key="'common.detail'" class="q-pt-xs" :custom-back-func="onBackTo" />
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start m-12-t">
          <q-btn
            class="btns btn-green"
            @click="onBatch"
            v-if="permission.edit && dispatch_type === SEND_TYPE.Enums.Auto.toString()"
          >
            {{ $t("btn.distribute_all") }}
          </q-btn>
          <span class="q-pt-sm q-ml-md" v-if="permission.edit && dispatch_type === SEND_TYPE.Enums.Auto.toString()">{{
            $t("common.sure_to_distribute_all_tip")
          }}</span>
          <q-space />
          <q-btn @click="onExport" class="q-ml-md btns btn-export">
            <q-icon class="q-mr-xs" size="xs" name="archive" />
            {{ $t("btn.export") }}
          </q-btn>
        </div>
        <div class="table-white-bg">
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
                <q-td key="member_name" :props="props">
                  {{ props.row.member_name }}
                </q-td>

                <!-- 币别 -->
                <q-td key="currency" :props="props">
                  {{ props.row.currency }}
                </q-td>

                <!-- 有效投注 -->
                <q-td key="valid_bet" :props="props">
                  {{ moneyFormat(props.row.valid_bet) }}
                </q-td>
                <!-- 盈虧 -->
                <q-td key="profit" :props="props">
                  {{ moneyFormat(props.row.profit) }}
                </q-td>
                <!-- 比例 -->
                <!--<q-td key="rebate_rate" :props="props">
                {{ props.row.rebate_rate }}
              </q-td>-->
                <!-- 佣金金額 -->
                <q-td key="amount" :props="props">
                  {{ moneyFormat(props.row.amount) }}
                </q-td>

                <!-- 阻擋派發標籤 -->
                <q-td key="block_label_count" :props="props">
                  {{ props.row.block_label_count }}
                </q-td>

                <q-td key="dispatch_at" :props="props">
                  {{ props.row.dispatch_at ? genTimeFormat(props.row.dispatch_at, "yyyy-MM-dd HH:mm") : "-" }}
                </q-td>
                <!-- 狀態 -->
                <q-td key="status" :props="props">
                  {{
                    $t(REWARD_STATUS.I18nKeys[props.row.status as REWARD_STATUS.Enums] || $t("reward_status.pending"))
                  }}
                </q-td>
                <!-- 功能 -->
                <q-td key="actions" :props="props" v-if="permission.edit">
                  <q-btn
                    :color="props.row.status !== 0 ? 'grey' : 'success'"
                    :disable="props.row.status !== 0"
                    class="q-mr-md btns"
                    @click="onMandatoryDistribution(props.row)"
                    :loading="isLoading"
                  >
                    {{ $t("btn.force_send") }}
                  </q-btn>
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
          </q-table>
        </div>
      </template>
    </query>
  </div>
  <!-- 確認彈窗 -->
  <dialog-comp v-model="batchDialog" :configs="dialogConfigs.batch" :loading="batchLoading" max-width="600px">
    <template #mainContent>
      <div class="q-mb-lg">{{ $t("common.sure_to_force_all_send_reward") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import type { CustomQTableProps } from "quasar"
  import { useQuasar } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import {
    getCommssionDetailDetail,
    postCommssionDetailDistributeAll,
    postCommssionDetailMandatoryDistribution,
    commssionDetailExport
  } from "@/api/commissionManagement"
  import type {
    postCommssionDistributeAll,
    postCommssionMandatoryDistribution,
    GetCommissionDetailDetail
  } from "@/api/request.type"
  import { REWARD_STATUS, SEND_TYPE } from "@/utils/constants"
  import SubPage from "layouts/SubPage/Index.vue"
  import { usePermission } from "@/hook/usePermission"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  import { useExport } from "@/hook/useExport"

  const { permission } = usePermission()
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { dispatch_type } = route.query
  const isLoading = ref(false)
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })

  const { search, tableData, totalSize } = useSearch(getCommssionDetailDetail)
  const { genTimeFormat, moneyFormat } = useCommon()

  let catchQueryForm: GetCommissionDetailDetail

  async function onSubmit(queryForm: GetCommissionDetailDetail) {
    queryForm.id = Number(route.params.id as string)
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "member_name",
        label: t("query_params.member_account"),
        field: "member_name",
        sortable: false,
        align: "center"
      },
      {
        name: "currency",
        label: t("query_params.currency"),
        field: "currency",
        sortable: false,
        align: "center"
      },
      {
        name: "valid_bet",
        label: t("table_header.validate_bet"),
        field: "valid_bet",
        sortable: false,
        align: "center"
      },
      {
        name: "profit",
        label: t("table_header.winlose"),
        field: "profit",
        sortable: false,
        align: "center"
      },
      /*{
        name: "rebate_rate",
        label: t("table_header.ratio"),
        field: "rebate_rate",
        sortable: false,
        align: "center"
      },*/
      {
        name: "amount",
        label: t("table_header.commission_amount"),
        field: "amount",
        sortable: false,
        align: "center"
      },
      {
        name: "block_label_count",
        label: t("common.block_send_tag"),
        field: "block_label_count",
        sortable: false,
        align: "center"
      },
      {
        name: "dispatch_at",
        label: t("table_header.dispatch_date"),
        field: "dispatch_at",
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

  async function handlebatch() {
    const firstEventId = tableData.value.length > 0 ? tableData.value[0].event_id : null
    const payload: postCommssionDistributeAll = {
      id: firstEventId
    }
    const { search, status } = useSearch(postCommssionDetailDistributeAll)
    openbatchLoading()
    await search(payload)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.distributed_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closebatchLoading()
      closebatch()
    }
  }
  async function onMandatoryDistribution(row: GetCommissionDetailDetail) {
    const payload: postCommssionMandatoryDistribution = {
      event_id: row.event_id,
      entry_id: row.id,
      force: true
    }
    const { search, status } = useSearch(postCommssionDetailMandatoryDistribution)
    isLoading.value = true
    await search(payload)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.distributed_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }
    isLoading.value = false
  }
  function onBackTo() {
    const { start, end } = route.query
    router.push({
      name: "CommissionDetailList",
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
      showLabelCloseBtn: true,
      submitFunction: handlebatch
    }
  })

  const dialogData = reactive<{
    batch: {
      id?: number
    }
  }>({
    batch: { id: 0 }
  })
  const {
    dialog: batchDialog,
    openDialog: openbatchDialog,
    loading: batchLoading,
    openLoading: openbatchLoading,
    closeLoading: closebatchLoading,
    closeDialog: closebatch
  } = useDialog()

  function onBatch() {
    openbatchDialog()
  }

  // 匯出
  const { getExportPath } = useExport()
  const onExport = async () => {
    const { search, status, tableData } = useSearch(commssionDetailExport)
    await search(catchQueryForm.id as number)

    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }
</script>

<style scoped>
  .drag-container {
    opacity: 1 !important;

    .drag-icon {
      font-size: 30px;
      cursor: pointer !important;
    }
  }

  ::v-deep([disabled]) * {
    cursor: default !important;
  }

  ::v-deep(.custom-hide) {
    display: none;
  }
  .m-12-t {
    margin-top: -1rem;
  }
</style>
