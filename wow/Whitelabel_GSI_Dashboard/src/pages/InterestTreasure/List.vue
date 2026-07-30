<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start" v-if="permission.edit">
          <q-btn @click="onAdd" v-if="permission.edit" class="btns btn-blue">
            <q-icon class="q-mr-xs" size="xs" name="add" />
            {{ $t("btn.add") }}
          </q-btn>
        </div>
        <div class="table-white-bg">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            class="table_v2"
            row-key="id"
          >
            <template #body="props">
              <q-tr>
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="valid_time" :props="props">
                  {{ formatDateTime(props.row.start_time) }} ~
                  {{ formatDateTime(props.row.end_time) }}
                </q-td>
                <q-td key="currency_id" :props="props">
                  {{ getCurrencyCode(props.row.currency_id) }}
                </q-td>

                <q-td key="is_auto_dispatch" :props="props">
                  {{ props.row.is_auto_dispatch === 1 ? $t("reward_type.manual") : $t("reward_type.auto") }}
                </q-td>

                <!-- 編輯 -->
                <q-td key="actions" :props="props" v-if="permission.edit">
                  <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onAction(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
                  </q-btn>
                  <q-btn flat fab-mini icon="delete" class="del" @click="onDelete(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("common.delete") }}</q-tooltip>
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

  <!-- 刪除彈窗 -->
  <dialog-comp v-model="deleteDialog" :configs="dialogConfigs.delete" :loading="deleteLoading" max-width="600px">
    <template #mainContent>
      <div class="q-mb-lg">{{ $t("interest_treasure.delete_msg") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import type { CustomQTableProps } from "quasar"
  import { useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import { useRfc3339 } from "@/composables/useRfc3339"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import type * as Request from "@/api/request.type"
  import { getInterestActivityList, deleteInterestActivity } from "@/api/interest"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { usePermission } from "@/hook/usePermission"
  import { useQueryStore } from "@/stores/queryStore"
  import { CURRENCY_TYPE } from "@/utils/constants"

  const { permission } = usePermission()
  const { t } = useI18n()
  const $q = useQuasar()
  const store = useQueryStore()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useEventName: true,
    useDatePicker: true,
    customDateTimeLabelI18nKey: "query_params.event_time",
    dateTimeIsUnnecessary: true,
    customFields: [
      {
        key: "is_auto_dispatch",
        type: "select",
        label: "query_params.distribution_type",
        clearable: true,
        options: [
          { label: "reward_type.manual", value: 1 },
          { label: "reward_type.auto", value: 2 }
        ]
      }
    ]
  })

  let { search, tableData, totalSize } = useSearch(getInterestActivityList)
  const { formatDateTime } = useRfc3339()
  let catchQueryForm: Request.GetInterestActivityList

  async function onSubmit(queryForm: any) {
    const params = { ...queryForm }

    // 將查詢元件的日期格式轉換為 API 需要的 start_time / end_time
    if (params.startDateTime) {
      params.start_time = params.startDateTime
    }
    if (params.endDateTime) {
      params.end_time = params.endDateTime
    }

    // 未選擇派發方式時不送出
    if (params.is_auto_dispatch == null) {
      delete params.is_auto_dispatch
    }

    catchQueryForm = params
    await search(params)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "name",
        label: t("query_params.event_name"),
        field: "name",
        sortable: false,
        align: "center"
      },
      {
        name: "valid_time",
        label: t("query_params.event_time"),
        field: "valid_time",
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
        name: "is_auto_dispatch",
        label: t("query_params.distribution_type"),
        field: "is_auto_dispatch",
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

  const router = useRouter()
  const onAction = (row: any) => {
    router.push({
      name: "InterestTreasureEdit",
      params: {
        id: row.id
      }
    })
  }

  function onAdd() {
    router.push({
      name: "InterestTreasureAdd"
    })
  }

  const {
    dialog: deleteDialog,
    openDialog: openDeleteDialog,
    closeDialog: closeDeleteDialog,
    loading: deleteLoading,
    openLoading: openDeleteLoading,
    closeLoading: closeDeleteLoading
  } = useDialog()

  const dialogConfigs = reactive<{ delete: IDialogConfig }>({
    delete: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      showLabelCloseBtn: true,
      submitFunction: handleDelete
    }
  })

  const dialogData = reactive({
    delete: {
      id: 0
    }
  })

  const onDelete = (row: any) => {
    dialogData.delete.id = row.id
    openDeleteDialog(row)
  }

  async function handleDelete() {
    // openDeleteLoading()

    try {
      const { code, msg } = await deleteInterestActivity(dialogData.delete.id as number)

      if (code === 0) {
        // $q.notify({
        //   type: "positive",
        //   message: t("message.delete_success"),
        //   position: "top",
        //   timeout: 300
        // })
        // 刷新列表
        await onSubmit(catchQueryForm)
      } else {
        $q.notify({
          type: "negative",
          message: msg || t("message.delete_failed"),
          position: "top",
          timeout: 300
        })
      }
    } catch (error) {
      console.error("删除失败:", error)
      $q.notify({
        type: "negative",
        message: t("message.delete_failed"),
        position: "top",
        timeout: 300
      })
    }

    closeDeleteLoading()
    closeDeleteDialog()
  }

  const getCurrencyCode = (currencyId: number): string => {
    // 从 CURRENCY_TYPE.Enums 中查找对应的货币代码
    const currencyEntry = Object.entries(CURRENCY_TYPE.Enums).find(([_, value]) => value === currencyId)
    if (currencyEntry) {
      return currencyEntry[0] // 返回货币代码，如 USD, CNY 等
    }
    return String(currencyId) // 如果找不到，返回 ID 本身
  }
</script>

<style lang="scss" scoped>
  // 調整disable樣式
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
</style>
