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
              <q-td key="currency_id" :props="props">
                <q-icon
                  name="error"
                  color="red"
                  size="20px"
                  class="q-ml-xs"
                  v-if="warningNotifyStore.warningStatus.includes(Number(props.row.id))"
                />
                {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums] || "common.unknow") }}
              </q-td>
              <q-td key="schedule_type" :props="props">
                <template v-if="props.row.schedule_type === 1">
                  {{ $t("edit_form.realtime") }}
                </template>
                <template v-else>
                  {{ $t("edit_form.daily") }}
                </template>
              </q-td>
              <q-td key="lower_limit" :props="props">
                {{ moneyFormat(props.row.lower_limit, 2) }}
              </q-td>
              <q-td key="upper_limit" :props="props">
                {{ moneyFormat(props.row.upper_limit, 2) }}
              </q-td>

              <!-- 啟/停用 -->
              <q-td key="is_enabled" :props="props">
                <q-toggle
                  v-model="props.row.is_enabled"
                  color="main-color"
                  class="toggle"
                  size="lg"
                  :false-value="false"
                  :true-value="true"
                  :disable="!permission.edit"
                  keep-color
                  @update:model-value="updateEnable(props.row)"
                />
              </q-td>
              <!--
              <q-td key="status" :props="props">
                {{ $t(GIFT_RECEIVE_STATUS.I18nKeys[props.row.status as GIFT_RECEIVE_STATUS.Enums] || "common.unknow") }}
              </q-td>-->
              <q-td key="created_at" :props="props">
                {{ genTimeFormat(props.row.created_at) }}
              </q-td>

              <!-- 功能 -->
              <q-td key="actions" :props="props">
                <q-btn flat fab-mini color="blue" @click="onEdit(props.row)">
                  <q-icon class="q-mr-xs" size="xs" name="edit" />
                </q-btn>
                <q-btn flat fab-mini color="blue" @click="onAction(props.row)">
                  <q-icon class="q-mr-xs" size="xs" name="visibility" />
                </q-btn>
                <q-btn flat fab-mini color="red" @click="onDelete(props.row)">
                  <q-icon class="q-mr-xs" size="xs" name="delete" />
                </q-btn>
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
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="deleteDialog" :configs="dialogConfigs.delete" :loading="deleteLoading">
    <template #mainContent>
      <div>{{ $t("message.confirm_delete?") }}</div>
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
  import { getWarningList, updateWarningEnabled, deleteWarning, getWariningAlert } from "@/api/warningSetting"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { CURRENCY_TYPE, REWARD_TYPE } from "@/utils/constants"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useSiteStore } from "@/stores/siteStore"
  import { usePermission } from "@/hook/usePermission"
  import { useCommon } from "@/hook/useCommon"
  import { useWarningNotifyStore } from "@/stores/warningNotifyStore"

  const { permission } = usePermission()
  const siteStore = useSiteStore()
  const { walletSwitch } = useWalletBouns()
  const router = useRouter()
  const { t } = useI18n()
  const $q = useQuasar()
  const invitationBonusStore = useInvitationBonusStore()
  const { genTimeFormat, moneyFormat } = useCommon()
  const warningNotifyStore = useWarningNotifyStore()

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
        name: "currency_id",
        label: t("table_header.currency"),
        field: "currency_id",
        sortable: false,
        align: "center"
      },
      {
        name: "schedule_type",
        label: t("table_header.alert_interval"),
        field: "schedule_type",
        sortable: false,
        align: "center"
      },
      {
        name: "lower_limit",
        label: t("table_header.alert_lower_limit"),
        field: "lower_limit",
        sortable: false,
        align: "center"
      },
      {
        name: "upper_limit",
        label: t("table_header.alert_upper_limit"),
        field: "upper_limit",
        sortable: false,
        align: "center"
      },
      {
        name: "is_enabled",
        label: t("table_header.enable_or_disable"),
        field: "is_enabled",
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
      usePagination: true
    }
    return baseConfig
  })

  let { search, tableData, totalSize } = useSearch(getWarningList)
  let catchQueryForm: Request.getWarningList
  async function onSubmit(queryForm: Request.getWarningList) {
    catchQueryForm = queryForm
    await search(queryForm)
    getNotification()
  }

  function onEdit(row: { id: number }) {
    router.push({
      name: "AlertSettingsEdit",
      params: {
        id: row.id
      }
    })
  }

  function onAction(row: { id: number; currency_id: number }) {
    const currency = row.currency_id
    router.push({
      name: "AlertSettingsDetail",
      params: {
        id: row.id
      },
      query: {
        currency
      }
    })
  }

  async function onAdd() {
    router.push({
      name: "AlertSettingsAdd"
    })
  }

  function onDelete(row: Request.getWarningList) {
    dialogDataId.value = row.id
    openDeleteDialog(row)
  }
  async function handleDelete() {
    openDeleteLoading()

    const { search, status } = useSearch(deleteWarning)
    await search(dialogDataId.value)
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }

    closeDeleteLoading()
    closDeleteDialog()
  }

  const updateEnable = async (row: Request.getWarningList) => {
    const { search, status } = useSearch(updateWarningEnabled)
    await search(row)
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }
  }

  const { updateWarningStatue } = useWarningNotifyStore()

  const getNotification = async () => {
    const { search, status, tableData } = useSearch(getWariningAlert)
    await search()
    if (status.value) {
      const result = tableData.value.alert_list
        .filter((item: { is_alert: boolean }) => item.is_alert)
        .map((item: { setting_id: number }) => item.setting_id)
      updateWarningStatue(result)
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep(.custom-hide) {
    display: none;
  }
</style>
