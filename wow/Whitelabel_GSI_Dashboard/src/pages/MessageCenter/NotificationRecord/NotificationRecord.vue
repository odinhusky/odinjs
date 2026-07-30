<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit" @query-export="onExport">
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
              <q-td key="id" :props="props">
                {{ props.row.id }}
              </q-td>
              <q-td key="monitoring_type" :props="props">
                {{
                  $t(MONITORING_TYPE.I18nKeys[props.row.monitoring_type as MONITORING_TYPE.Enums] || "common.unknow")
                }}
              </q-td>
              <q-td key="warning_message" :props="props">
                <q-btn
                  flat
                  color="blue-6"
                  :ripple="false"
                  :label="props.row.warning_message"
                  @click="onAction(props.row)"
                />
              </q-td>
              <q-td key="time" :props="props">
                {{ props.row.time }}
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
  <!-- 彈窗 -->
  <dialog-comp v-model="viewDialog" :configs="dialogConfigs.view" :loading="viewLoading">
    <template #label>
      <div>{{ $t("table_header.warning_message") }}</div>
    </template>
    <template #mainContent>
      <!-- 內容 -->
      <div class="row q-col-gutter-md items-baseline q-mb-md">
        <div class="col-12 col-sm-2">{{ $t("table_header.content") }} :</div>
        <div class="col-12 col-sm-10">
          <p>{{ dialogData.view.warning_message }}</p>
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { QTableProps, Notify } from "quasar"
  import { reactive, onMounted } from "vue"
  import { useI18n } from "vue-i18n"

  import {
    getNotificationRecordList,
    getNotificationRecordDetail,
    getNotificationRecordListFake,
    getNotificationRecordExport
  } from "@/api/monitoringSettings"
  import type { GetNotificationRecordList } from "@/api/request.type"
  import type { notificationRecordItem } from "@/api/response.type"
  import { MONITORING_TYPE } from "@/utils/constants"

  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { usePermission } from "@/hook/usePermission"
  const { permission } = usePermission()

  const { t } = useI18n()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useMonitoringType: true,
    useDatePicker: true,
    useKeyword: true,
    useExport: true
  })

  let { search, tableData, totalSize, tableTotal } = useSearch(getNotificationRecordListFake)

  async function onSubmit(queryForm: GetNotificationRecordList) {
    await search(queryForm)
  }
  onMounted(() => {
    queryConfigs.useExport = permission.value.export
  })

  const tableColumn: QTableProps["columns"] = [
    { name: "id", label: t("table_header.event_id"), field: "id", sortable: false, align: "center" },
    {
      name: "monitoring_type",
      label: t("table_header.monitoring_type"),
      field: "monitoring_type",
      sortable: false,
      align: "center"
    },
    {
      name: "warning_message",
      label: t("table_header.warning_message"),
      field: "warning_message",
      sortable: false,
      align: "center"
    },
    { name: "time", label: t("table_header.notification_time"), field: "time", sortable: false, align: "center" }
  ]
  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    view: {
      type: DialogType.VIEW,
      useActions: false
    }
  })
  const dialogData = reactive<{
    view: {
      id: number
      warning_message: string
    }
  }>({
    view: {
      id: 0,
      warning_message: ""
    }
  })
  const { dialog: viewDialog, openDialog: openViewDialog, loading: viewLoading } = useDialog()

  const onAction = (row: notificationRecordItem) => {
    dialogData.view.id = row.id
    dialogData.view.warning_message = row.warning_message

    //彈窗暫時可先打開 等正式API要刪掉
    openViewDialog()

    getDetail()
  }

  const getDetail = async () => {
    const res = await getNotificationRecordDetail(dialogData.view.id)
    if (res.code === 0) {
      dialogData.view.warning_message = res.data.warning_message
      openViewDialog()
    }
  }

  // 匯出
  const onExport = async (params: GetNotificationRecordList) => {
    const { search } = useSearch(getNotificationRecordExport)
    await search(params)
  }
</script>
