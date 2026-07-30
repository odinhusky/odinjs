<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start" v-if="permission.edit">
          <q-btn color="main-color" @click="onAdd">
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
          >
            <template #body="props">
              <q-tr>
                <!-- id -->
                <q-td key="id" :props="props">
                  {{ props.row.id }}
                </q-td>

                <!-- 標題 -->
                <q-td key="title" :props="props">
                  {{ props.row.title }}
                </q-td>
                <!-- 備註 -->
                <q-td key="context" :props="props">
                  {{ props.row.context }}
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
  <!-- 編輯彈窗 -->
  <dialog-comp v-model="EditDialog" :configs="dialogConfigs.edit" :loading="editLoading">
    <template #label>
      <div class="dialog-title">{{ $t("btn.add") }}/{{ $t("btn.edit") }}</div>
    </template>
    <template #mainContent>
      <!-- 標題 -->
      <div class="row q-col-gutter-md items-baseline q-mb-md">
        <div class="col-12">
          <span class="q-mr-md">{{ $t("table_header.title") }}</span>
          <q-input v-model="dialogData.edit.title" class="" outlined />
        </div>
      </div>

      <!-- 備註 -->
      <div class="row q-col-gutter-md items-baseline q-mb-md">
        <div class="col-12">
          <span class="q-mr-md">{{ $t("table_header.remark") }}</span>
          <q-input v-model="dialogData.edit.context" type="textarea" class="" outlined />
        </div>
      </div>
    </template>
  </dialog-comp>

  <!-- 新增彈窗 -->
  <dialog-comp v-model="addDialog" :configs="dialogConfigs.add" :loading="addLoading" class="note-settings-dialog">
    <template #label>
      <div class="dialog-title">{{ $t("btn.add") }}/{{ $t("btn.edit") }}</div>
    </template>
    <template #mainContent>
      <!-- 標題 -->
      <div class="row q-col-gutter-md items-baseline q-mb-md">
        <div class="col-12">
          <span class="q-mr-md">{{ $t("table_header.title") }}</span>
          <q-input dense v-model="dialogData.add.title" class="" outlined />
        </div>
      </div>

      <!-- 備註 -->
      <div class="row q-col-gutter-md items-baseline q-mb-md">
        <div class="col-12">
          <span class="q-mr-md">{{ $t("table_header.remark") }}</span>
          <q-input v-model="dialogData.add.context" type="textarea" class="" outlined />
        </div>
      </div>
    </template>
  </dialog-comp>

  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("table_header.delete_permission_content") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"

  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  import { getNoteSettingList, deleteNoteSetting, updateNoteSetting, addNoteSetting } from "@/api/systemSettings"
  import type { GetNoteSettingList } from "@/api/request.type"
  import type { NoteSettingItem } from "@/api/response.type"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const { t } = useI18n()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useKeyword: true,
    everyColumnsClass: "col-12 col-sm-6 col-md-6 col-lg-2"
  })

  let { search, tableData, totalSize } = useSearch(getNoteSettingList)

  let catchQueryForm: GetNoteSettingList
  async function onSubmit(queryForm: GetNoteSettingList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "id",
        label: t("table_header.number"),
        field: "id",
        sortable: false,
        align: "center"
      },
      {
        name: "title",
        label: t("table_header.title"),
        field: "title",
        sortable: false,
        align: "center"
      },
      {
        name: "context",
        label: t("table_header.remark"),
        field: "context",
        sortable: false,
        align: "center"
      },
      {
        name: "actions",
        label: t("table_header.function"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]

    // 如果無編輯權限 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    edit: {
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleEdit
    },
    add: {
      type: DialogType.ADD,
      useActions: true,
      submitFunction: handleAdd
    },
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleRemove
    }
  })
  function onRemove(row: NoteSettingItem) {
    dialogData.remove = row
    openRemoveDialog(row)
  }
  const dialogData = reactive<{
    edit: {
      id: number
      title: string
      context: string
    }
    remove: {}
    add: { id: number; title: string; context: string }
  }>({
    edit: {
      id: 0,
      title: "",
      context: ""
    },
    remove: {},
    add: { id: 0, title: "", context: "" }
  })

  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading,
    closeDialog: closeRemove
  } = useDialog()

  async function handleRemove() {
    openRemoveLoading()
    const res = await deleteNoteSetting(dialogData.remove)

    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeRemoveLoading()
      closeRemove()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }

  const $q = useQuasar()

  const {
    dialog: EditDialog,
    openDialog: openEditDialog,
    closeDialog: closeEditDialog,
    loading: editLoading,
    openLoading: openEditLoading,
    closeLoading: closeEditLoading
  } = useDialog()

  const onAction = (row: NoteSettingItem) => {
    dialogData.edit.id = row.id
    dialogData.edit.title = row.title
    dialogData.edit.context = row.context

    openEditDialog()
  }

  async function handleEdit() {
    openEditLoading()
    const res = await updateNoteSetting(dialogData.edit)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeEditDialog()
      closeEditLoading()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }

  const {
    dialog: addDialog,
    openDialog: openAddDialog,
    loading: addLoading,
    openLoading: openAddLoading,
    closeLoading: closeAddLoading,
    closeDialog: closeAddDialog
  } = useDialog()

  function onAdd() {
    openAddDialog()
  }
  async function handleAdd() {
    openAddLoading()
    const res = await addNoteSetting(dialogData.add)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeAddDialog()
      closeAddLoading()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
    // 清空數據
    dialogData.add.title = ""
    dialogData.add.context = ""
  }
</script>

<style lang="scss" scoped>
  :deep(.fileSelector) {
    .q-field__control {
      height: 2.5rem;
    }
  }

  .dialog-title {
    padding: 16px;
    font-family: "Noto Sans TC", sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0px;
    text-transform: capitalize;
  }

  .note-settings-dialog {
    :deep(.q-card) {
      padding: 16px;
      background-color: #fff;
    }
  }
</style>
