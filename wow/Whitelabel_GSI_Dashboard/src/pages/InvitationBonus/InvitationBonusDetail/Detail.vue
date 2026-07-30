<template>
  <SubPage :action-label-i18n-key="'common.detail'" :custom-back-func="onBackTo" />

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
              <!-- 会员账号 -->
              <q-td key="member_account" :props="props">
                {{ props.row.member_account }}
              </q-td>
              <!-- 會員數 -->
              <q-td key="active_member_count" :props="props">
                {{ props.row.active_member_count }}
              </q-td>
              <!-- 阻擋 -->
              <q-td key="blocked_count" :props="props">
                {{ props.row.blocked_count }}
              </q-td>
              <!-- 狀態 -->
              <q-td key="status" :props="props">
                <template v-if="props.row.status === PROCESS_STATUS.Enums.PROCESS_STATUS_RELEASED">
                  {{ $t("common.published") }}
                </template>
                <template v-else-if="props.row.status === PROCESS_STATUS.Enums.PROCESS_STATUS_CANCELED">
                  {{ $t("process_status.cancelled") }}
                </template>
                <template v-else-if="props.row.status === PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED">
                  {{ $t("common.unpublished") }}
                </template>
              </q-td>
              <!-- 功能 -->
              <q-td key="actions" :props="props" v-if="permission.edit">
                <q-btn
                  flat
                  :color="props.row.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED ? 'grey' : 'green'"
                  :disable="props.row.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED"
                  class="q-mr-md"
                  @click="onDistributionCheck(props.row)"
                >
                  {{ $t("btn.distribute") }}
                </q-btn>

                <q-btn
                  flat
                  :color="props.row.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED ? 'grey' : 'red'"
                  :disable="props.row.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED"
                  class="q-mr-md"
                  @click="onCancel(props.row)"
                >
                  {{ $t("btn.cancel") }}
                </q-btn>

                <q-btn flat color="main-color" class="q-mr-md" @click="onAction(props.row)">
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
  <!-- 確認派發彈窗 -->

  <dialog-comp v-model="DistributionDialog" :configs="dialogConfigs.distribute" :loading="distributionLoading">
    <template #mainContent>
      <span>{{ $t("common.this_offer_blocked_tip1_2") }}</span>
    </template>
  </dialog-comp>

  <!-- 全部取消彈窗 -->
  <!--  <dialog-comp
    v-model="cancellBatchDialog"
    :configs="dialogConfigs.cancel"
    :loading="cancellBatchLoading"
    max-width="20rem"
  >
    <template #mainContent>
      <div>{{ $t("common.sure_to_cancel") }}</div>
    </template>
  </dialog-comp>-->
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
    getInvitationBounsDetailList,
    postInvitationBounsDist,
    InvitationBounsDetailCancel
  } from "@/api/invitationBouns"

  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { PROCESS_STATUS } from "@/utils/constants"
  import SubPage from "layouts/SubPage/Index.vue"
  import { usePermission } from "@/hook/usePermission"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  import { useQueryStore } from "src/stores/queryStore"

  const { permission } = usePermission()
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const queryStore = useQueryStore()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })

  let { search, tableData, totalSize } = useSearch(getInvitationBounsDetailList)
  const { genTimeFormat, moneyFormat } = useCommon()

  let catchQueryForm: Request.GetInvitationBonusDetail
  const campaign_id = route.params.campaign_id as string
  const event_id = route.params.event_id as string
  async function onSubmit(queryForm: Request.GetInvitationBonusDetail) {
    queryForm.campaign_id = Number(campaign_id)
    queryForm.event_id = Number(event_id)
    catchQueryForm = queryForm
    await search(queryForm)
  }
  onMounted(async () => {})

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
        name: "active_member_count",
        label: t("table_header.cumulative_valid_new_members"),
        field: "active_member_count",
        sortable: false,
        align: "center"
      },
      {
        name: "blocked_count",
        label: t("table_header.block_tags_num"),
        field: "blocked_count",
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

  //一般派發
  async function onDistributionSingle() {
    const payload = {
      event_id: event_id,
      entry_id: dialogData.distribute.id
    }
    try {
      const response = await postInvitationBounsDist(payload)

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
  async function onCancel(row?: Response.GetInvitationBonusDetail) {
    const payload = {
      event_id: event_id,
      entry_id: row?.id
    }
    try {
      const response = await InvitationBounsDetailCancel(payload)

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
      name: "InvitationBonusDetailList",
      query: {
        start,
        end
      }
    })
  }

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    distribute: {
      dialogLabelI18nKey: "btn.distribute",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleDistribution
    }
  })

  const dialogData = reactive<{
    distribute: {
      id?: number
    }
  }>({
    distribute: { id: 0 }
  })
  const {
    dialog: DistributionDialog,
    openDialog: openDistributionDialog,
    loading: distributionLoading,
    openLoading: openDistributionLoading,
    closeLoading: closeDistributionLoading,
    closeDialog: closeDistribution
  } = useDialog()

  function onDistributionCheck(row?: Response.GetInvitationBonusDetail) {
    dialogData.distribute.id = row?.id
    if (row?.blocked_count > 0) {
      openDistributionDialog()
    } else {
      onDistributionSingle()
    }
  }
  function handleDistribution() {
    closeDistribution()
    onDistributionSingle()
  }

  function onAction(row: any) {
    const { start, end } = route.query
    router.push({
      name: "InvitationBonusDetailNestedDetail",
      params: {
        campaign_id: row.campaign_id,
        parent_id: row.member_id,
        active_member_count: row.active_member_count
      },
      query: {
        event_id,
        start,
        end
      }
    })
  }
</script>

<style lang="scss" scoped>
  ::v-deep(.custom-hide) {
    display: none;
  }
</style>
