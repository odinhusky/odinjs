<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start" v-if="permission.edit">
          <q-btn class="btns btn-blue" color="main-color" @click="onAdd">
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
          row-key="id"
          table-header-class="bg-success"
        >
          <template #body="props">
            <q-tr>
              <!-- 群組名稱. -->
              <q-td key="ip_address" :props="props">
                {{ props.row.ip_address }}
              </q-td>
              <!-- 日期 -->
              <q-td key="creation_date" :props="props">
                {{ genTimeFormat(props.row.created_at) }}
              </q-td>

              <!-- 功能 -->
              <q-td key="actions" :props="props" v-if="permission.edit">
                <q-btn flat fab-mini color="main-color" @click="onAction(props.row)">
                  <q-icon class="q-mr-xs" size="xs" name="edit" />
                </q-btn>
                <q-btn flat fab-mini color="red" @click="onRemove(props.row)">
                  <q-icon class="q-mr-xs" size="xs" name="delete" />
                </q-btn>
              </q-td>

              <!-- 備註 -->
              <q-td key="remark" :props="props">
                {{ props.row.remark }}
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
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_ip_address") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"
  import { useRouter } from "vue-router"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getIpWhiteList, deleteIpWhiteList } from "@/api/systemSettings"
  import type { GetIpWhiteList } from "@/api/request.type"
  import type { IpWhiteListItem } from "@/api/response.type"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const { t } = useI18n()
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useIp: true
  })

  const { search, tableData, totalSize } = useSearch(getIpWhiteList)
  const { genTimeFormat, moneyFormat } = useCommon()
  const $q = useQuasar()
  async function onSubmit(queryForm: GetIpWhiteList) {
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "ip_address",
        label: t("table_header.ip_name"),
        field: "ip_address",
        sortable: false,
        align: "center"
      },
      {
        name: "creation_date",
        label: t("table_header.creation_date"),
        field: "creation_date",
        sortable: false,
        align: "center"
      },
      {
        name: "actions",
        label: t("table_header.function"),
        field: "actions",
        sortable: false,
        align: "center"
      },
      {
        name: "remark",
        label: t("table_header.remark"),
        field: "remark",
        sortable: false,
        align: "center"
      }
    ]

    // 如果無編輯權限 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  function onAdd() {
    router.push({
      name: "IpWhiteListAdd"
    })
  }

  function onAction(row: IpWhiteListItem) {
    router.push({
      name: "IpWhiteEdit",
      params: {
        id: row.id
      }
    })
  }
  let catchQueryForm: IpWhiteListItem

  function onRemove(row: IpWhiteListItem) {
    dialogData.remove = row
    openRemoveDialog(row)
  }
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleRemove
    }
  })

  const dialogData = reactive({
    remove: {} as IpWhiteListItem
  })

  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    closeDialog: closeRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading
  } = useDialog()

  async function handleRemove() {
    openRemoveLoading()
    const { code, msg } = await deleteIpWhiteList(dialogData.remove)
    if (code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeRemoveLoading()
      closeRemoveDialog()
    } else {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
    }
  }
</script>
