<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
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
                <!-- NO. -->
                <q-td key="id" :props="props">
                  {{ props.row.id }}
                </q-td>

                <!-- 類型 -->
                <q-td key="file_type" :props="props">
                  {{
                    $t(
                      DOCUMENTDOWNLOAD_TYPE.I18nKeys[props.row.file_type as DOCUMENTDOWNLOAD_TYPE.Enums] ||
                        "common.unknow"
                    )
                  }}
                </q-td>
                <!-- 標題 -->
                <q-td key="title" :props="props" @click="onDetail(props.row)">
                  <q-btn flat fab-mini color="blue">
                    {{ props.row.title }}
                  </q-btn>
                </q-td>

                <!-- 公告時間 -->
                <q-td key="time" :props="props">
                  {{ genTimeFormat(props.row.file_start_time) }} ~ {{ genTimeFormat(props.row.file_end_time) }}
                </q-td>

                <!-- 功能 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini icon="download" color="secondary" @click="onDownload(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.download") }}</q-tooltip>
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
</template>

<script lang="ts" setup>
  import { reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar } from "quasar"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"

  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { DOCUMENTDOWNLOAD_TYPE } from "@/utils/constants"
  import {
    getdocumentDownloadList,
    getDocumentDownloadDialogFileList,
    getDocumentDownloadDialogFileFolderList
  } from "@/api/documentDownload"
  import type { GetdocumentDownloadList } from "@/api/request.type"
  import type { documentDownloadItem, downloadListItem } from "@/api/response.type"

  import { useEnv } from "src/hook/useEnv"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  const $q = useQuasar()
  const { t } = useI18n()
  let { envData } = useEnv()
  const appMode = envData().VITE_APP_MODE
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useDocumentType: true,
    useKeyword: true
  })

  let { search, tableData, totalSize } = useSearch(getdocumentDownloadList)
  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetdocumentDownloadList) {
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
    }
  })
  async function onDownload(row: documentDownloadItem) {
    dialogData.detail = row
    openDetailDialog(row)
  }
  const dialogData = reactive<{
    view: documentDownloadItem
    detail: documentDownloadItem
  }>({
    view: {
      id: 0,
      file_type: 0,
      title: "",
      file_start_time: "",
      file_end_time: "",
      file_list: []
    },
    detail: {} as documentDownloadItem
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

  const onDetail = async (row: documentDownloadItem) => {
    dialogData.view = row
    const res = await getDocumentDownloadDialogFileList(dialogData.view)
    if (res.code === 0) {
      dialogData.view.file_list = res.data.list || []
      openViewDialog()
    }
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
