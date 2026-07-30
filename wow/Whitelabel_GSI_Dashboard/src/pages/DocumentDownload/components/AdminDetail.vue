<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn outline color="main-color" @click="onAdd">
            {{ $t("btn.add") }}
            <q-icon class="q-ml-xs" size="xs" name="add_circle_outline" />
          </q-btn>
        </div>
        <div class="table-container">
          <q-markup-table square>
            <thead class="bg-success">
              <tr>
                <th v-for="item in tableColumn">{{ item.label }}</th>
              </tr>
            </thead>
            <!-- disabled => 讓整行不能拉取 -->
            <VueDraggableNext
              class="drag-container"
              :list="tableData"
              tag="tbody"
              :disabled="disabledDrag"
              @end="onDragEnd"
            >
              <tr v-for="item in tableData">
                <td key="id">
                  {{ item.id }}
                  <q-icon
                    name="menu"
                    class="drag-icon"
                    @mouseenter="disabledDrag = false"
                    @mouseleave="disabledDrag = true"
                    @touchstart="disabledDrag = false"
                    @touchend="disabledDrag = true"
                  />
                </td>
                <td key="file_type">
                  {{
                    $t(DOCUMENTDOWNLOAD_TYPE.I18nKeys[item.file_type as DOCUMENTDOWNLOAD_TYPE.Enums] || "common.unknow")
                  }}
                </td>
                <td key="file_name">
                  {{ item.file_name }}
                </td>

                <td key="title" @click="onDetail(item)">
                  {{ item.title }}
                </td>
                <td key="time">
                  {{ genTimeFormat(item.file_start_time) }} ~
                  {{ genTimeFormat(item.file_end_time) }}
                </td>
                <td key="enabled">
                  <q-toggle v-model="item.enabled" color="green" />
                </td>
                <td key="action">
                  <q-btn flat fab-mini icon="settings" color="secondary" @click="onEdit(item)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
                  </q-btn>
                  <q-btn flat fab-mini icon="download" color="secondary" @click="onDownload(item)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.download") }}</q-tooltip>
                  </q-btn>
                  <q-btn flat fab-mini icon="delete" color="grey" @click="onRemove(item)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.detail") }}</q-tooltip>
                  </q-btn>
                </td>
              </tr>
            </VueDraggableNext>
          </q-markup-table>
        </div>
      </template>
    </query>
  </div>
  <!-- 彈窗 -->
  <dialog-comp v-model="viewDialog" :configs="dialogConfigs.view" :loading="viewLoading">
    <template #label>
      <div class="q-pa-md">{{ $t("dialog.file_download") }}</div>
    </template>
    <template #mainContent>
      <!-- 內容 -->
      <div class="row">
        <q-btn flat class="col-12 q-pa-xs flex" v-for="(item, index) in dialogData.view.file_list" :key="index">
          <div class="flex flex-row dw-left">
            <div class="q-pa-md">
              <span>{{ item.file_name }}</span>
            </div>
          </div>
          <q-btn flat icon="download" color="black" @click="onDownloadFile(item)" />
        </q-btn>
      </div>
    </template>
  </dialog-comp>
  <!-- 下載彈窗 -->
  <dialog-comp v-model="detailDialog" :configs="dialogConfigs.detail" :loading="detailLoading">
    <template #label>
      <div class="q-pa-md">{{ $t("account_management.file_download") }}</div>
    </template>
    <template #mainContent>
      <div>{{ $t("table_header.sure_download_document") }}</div>
    </template>
  </dialog-comp>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #label>
      <div class="q-pa-md">{{ $t("account_management.file_download") }}</div>
    </template>
    <template #mainContent>
      <div>{{ $t("table_header.sure_delete_document") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { VueDraggableNext } from "vue-draggable-next"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"

  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { DOCUMENTDOWNLOAD_TYPE } from "@/utils/constants"
  import {
    getdocumentDownloadList,
    getDocumentDownloadSequence,
    deleteDocumentDownloadDetail,
    getDocumentDownloadDialogFileList,
    getDocumentDownloadDialogFileFolderList
  } from "@/api/documentDownload"
  import type { GetdocumentDownloadList } from "@/api/request.type"
  import type { documentDownloadItem, downloadListItem } from "@/api/response.type"
  import { useRoute, useRouter } from "vue-router"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  const $q = useQuasar()
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const disabledDrag = ref(true)
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useDocumentType: true,
    useDocumentDownloadObjectType: true,
    useKeyword: true,
    useEnableStatus: true,
    useDatePicker: true,
    customDateTimeLabelI18nKey: "query_params.date_time_range"
  })

  let { search, tableData, totalSize } = useSearch(getdocumentDownloadList)
  const { genTimeFormat } = useCommon()
  let catchQueryForm: GetdocumentDownloadList
  async function onSubmit(queryForm: GetdocumentDownloadList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  let tableColumn: CustomQTableProps["columns"] = [
    {
      name: "id",
      label: t("table_header.id"),
      field: "id",
      sortable: false,
      align: "center"
    },
    {
      name: "file_type",
      label: t("table_header.type"),
      field: "file_type",
      sortable: false,
      align: "center"
    },
    {
      name: "file_name",
      label: t("table_header.display_target"),
      field: "file_name",
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
      name: "time",
      label: t("table_header.announcement_time"),
      field: "time",
      sortable: false,
      align: "center"
    },
    {
      name: "enabled",
      label: t("table_header.enable_or_disable"),
      field: "enabled",
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
  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    view: {
      type: DialogType.VIEW,
      useActions: false
    },
    detail: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleDetail
    },
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleRemove
    }
  })
  async function onDownload(row: documentDownloadItem) {
    dialogData.detail = row
    openDetailDialog(row)
  }
  const dialogData = reactive<{
    view: documentDownloadItem
    detail: documentDownloadItem
    remove: { id?: number }
  }>({
    view: {
      id: 0,
      file_type: 0,
      title: "",
      file_start_time: "",
      file_end_time: "",
      file_list: []
    },
    detail: {} as documentDownloadItem,
    remove: {}
  })
  const {
    dialog: detailDialog,
    openDialog: openDetailDialog,
    loading: detailLoading,
    openLoading: openDetailLoading,
    closeLoading: closeDetailLoading,
    closeDialog: closeDetailDialog
  } = useDialog()

  async function handleDetail() {
    openDetailLoading()
    const res = await getDocumentDownloadDialogFileFolderList(dialogData.detail)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.download_successful"),
        position: "top",
        timeout: 300
      })
      closeDetailLoading()
      closeDetailDialog()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }

  const { dialog: viewDialog, openDialog: openViewDialog, loading: viewLoading } = useDialog()

  async function onDragEnd() {
    const formatSequence = tableData.value.map((item: documentDownloadItem) => {
      return {
        id: item.id,
        sequence: item.sequence
      }
    })
    await getDocumentDownloadSequence(formatSequence)
    onSubmit(catchQueryForm)
  }

  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading,
    closeDialog: closeRemove
  } = useDialog()

  function onRemove(row: documentDownloadItem) {
    dialogData.remove = row
    openRemoveDialog(row.id)
  }
  async function handleRemove() {
    openRemoveLoading()
    const res = await deleteDocumentDownloadDetail(dialogData.remove)

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

  const onDetail = async (row: documentDownloadItem) => {
    dialogData.view = row
    const res = await getDocumentDownloadDialogFileList(dialogData.view)
    if (res.code === 0) {
      dialogData.view.file_list = res.data.list || []
      openViewDialog()
    }
  }
  function onEdit(row: documentDownloadItem) {
    const { start, end } = route.query
    router.push({
      name: "DocumentDownloadEdit",
      params: {
        id: row.id
      },
      query: {
        start,
        end
      }
    })
  }
  function onAdd() {
    const { start, end } = route.query
    router.push({
      name: "DocumentDownloadAdd",
      query: {
        start,
        end
      }
    })
  }
  function onDownloadFile(item: downloadListItem) {
    try {
      // 下载网址 = 后台网址 + file_path
      const worksheetPath = `${window.location.origin}/${item.file_path}`

      const link = document.createElement("a")
      link.href = worksheetPath
      link.download = item.file_name

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error(error)
    }
  }
</script>
<style scoped>
  .dw-left {
    width: 270px;
    .icon {
      width: 10px;
    }
  }

  .table-container {
    padding: 1rem;
    border-radius: 10px 10px 0 0;
    background-color: #fff;
  }
</style>
