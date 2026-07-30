<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn class="btns btn-blue" color="main-color" @click="onAdd" v-if="permission.edit">
            <q-icon class="q-mr-xs" size="xs" name="add" />
            {{ $t("btn.add") }}
          </q-btn>
        </div>
        <div class="table-container">
          <q-markup-table square class="!overflow-x-auto">
            <thead class="bg-success">
              <tr>
                <th v-for="item in tableColumn">{{ item.label }}</th>
              </tr>
            </thead>
            <VueDraggableNext
              class="drag-container"
              :list="tableData"
              tag="tbody"
              :disabled="disabledDrag"
              @end="onDragEnd"
            >
              <tr v-for="item in tableData">
                <td>
                  {{ item.campaign_no }}
                </td>
                <td>
                  {{ item.period_start_at.slice(0, 10) }} -
                  {{ item.period_end_at.slice(0, 10) }}
                </td>
                <td>{{ $t(REWARD_TYPE.I18nKeys[item.payout_method as REWARD_TYPE.Enums] || "common.unknow") }}</td>
                <td>
                  {{ $t(PROGRESS_STATUS.I18nKeys[item.status as PROGRESS_STATUS.Enums] || "common.unknow") }}
                </td>
                <td>{{ item.updated_by_username }}</td>
                <td v-if="permission.edit">
                  <q-btn flat fab-mini color="blue" class="q-mr-xs" @click="onAction(item)">
                    <q-icon class="q-mr-xs" size="xs" name="edit" />
                  </q-btn>
                </td>
              </tr>
            </VueDraggableNext>
            <!-- 查無資料 -->
            <template v-if="!tableData.length">
              <tr>
                <td colspan="8" class="text-center">{{ $t("common.no_data") }}</td>
              </tr>
              <!-- <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div> -->
            </template>
          </q-markup-table>
        </div>
      </template>
    </query>
  </div>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="deleteDialog" :configs="dialogConfigs.delete" :loading="deleteLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_event") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import { VueDraggableNext } from "vue-draggable-next"
  import { useInvitationBonusStore } from "@/stores/invitationBonusStore"
  import { useLanguageStore } from "@/stores/languageStore"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import { getInvitationBounsList, deletePromotionItem } from "@/api/invitationBouns"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { PROGRESS_STATUS, REWARD_TYPE } from "@/utils/constants"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useSiteStore } from "@/stores/siteStore"
  import { usePermission } from "@/hook/usePermission"
  import { useCommon } from "@/hook/useCommon"

  const { permission } = usePermission()
  const siteStore = useSiteStore()
  const { walletSwitch } = useWalletBouns()
  const router = useRouter()
  const { t } = useI18n()
  const $q = useQuasar()
  const invitationBonusStore = useInvitationBonusStore()
  const { genTimeFormat } = useCommon()

  const languageStore = useLanguageStore()
  const {
    dialog: deleteDialog,
    openDialog: openDeleteDialog,
    closeDialog: closDeleteDialog,
    loading: deleteLoading,
    openLoading: openDeleteLoading,
    closeLoading: closeDeleteLoading
  } = useDialog()

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    delete: {
      dialogLabelI18nKey: "common.delete",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleDelete
    }
  })
  const dialogDataId = ref(0)
  const disabledDrag = ref(true)

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "campaign_no",
        label: t("table_header.issue_no"),
        field: "campaign_no",
        sortable: false,
        align: "center"
      },
      {
        name: "period_start_at",
        label: t("query_params.event_time"),
        field: "period_start_at",
        sortable: false,
        align: "center"
      },
      {
        name: "payout_method",
        label: t("query_params.distribution_type"),
        field: "payout_method",
        sortable: false,
        align: "center"
      },
      {
        name: "settlement_enabled",
        label: t("table_header.status"),
        field: "settlement_enabled",
        sortable: false,
        align: "center"
      },
      {
        name: "updated_by_username",
        label: t("table_header.last_updated"),
        field: "updated_by_username",
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

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useDatePicker: true,
      useProgressStatus: true,
      customDateTimeLabelI18nKey: "query_params.event_time",
      dateTimeIsUnnecessary: true
    }
    return baseConfig
  })

  let { search, tableData, totalSize } = useSearch(getInvitationBounsList)
  let catchQueryForm: Request.GetInvitationBonusList
  async function onSubmit(queryForm: Request.GetInvitationBonusList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  function onAction(row: { id: number }) {
    router.push({
      name: "InvitationBonusSettingEdit",
      params: {
        id: row.id
      }
    })
  }
  function convertRewardType(isAutoPayout: number): REWARD_TYPE.Enums {
    if (isAutoPayout === 1) {
      return REWARD_TYPE.Enums.Auto
    } else {
      return REWARD_TYPE.Enums.Manual
    }
  }

  async function onAdd() {
    await invitationBonusStore.initItem()
    invitationBonusStore.invitationBonusItem.i18n = siteStore.langList.map((lang) => {
      return {
        language: lang.label,
        title: "",
        description_page: "",
        images: ""
      }
    })

    router.push({
      name: "InvitationBonusSettingAdd"
    })
  }
  async function onDragEnd() {
    // TODO: call api
    // onSubmit(catchQueryForm)
  }

  function onDelete(item: Response.generalPromotionListItem) {
    dialogDataId.value = item.id
    openDeleteDialog(item)
  }
  async function handleDelete() {
    openDeleteLoading()
    try {
      const { code, msg } = await deletePromotionItem(dialogDataId.value)
      if (code === 0) {
        onSubmit(catchQueryForm)
        $q.notify({
          type: "positive",
          message: t("message.delete_success"),
          position: "top",
          timeout: 300
        })
      } else {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 300
        })
      }
    } catch (error) {
      closeDeleteLoading()
    }
    closeDeleteLoading()
    closDeleteDialog()
  }
</script>

<style lang="scss" scoped>
  @import "@/css/dragTable.scss";
</style>
