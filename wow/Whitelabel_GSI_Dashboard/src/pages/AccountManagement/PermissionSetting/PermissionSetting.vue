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
              <!--名稱-->
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>

              <!--權限內容-->
              <q-td key="permission_content" :props="props">
                <q-btn class="q-mr-xs btn-purple" outline @click="onAction(props.row)">{{
                  props.row.permission_content
                }}</q-btn>
              </q-td>
              <!-- 啟/停用 -->
              <q-td key="enable_or_disable" :props="props">
                <q-toggle
                  v-model="props.row.enable_or_disable"
                  color="green"
                  disable
                  :false-value="0"
                  :true-value="1"
                  keep-color
                />
              </q-td>
              <!--狀態-->
              <q-td key="status" :props="props">
                <q-btn v-if="props.row.status == 0" color="primary" :label="$t('common.un_frozen')" size="12px" />
                <q-btn v-else size="12px" color="grey" glossy :label="$t('common.un_frozen')" />
              </q-td>
              <!-- 功能 -->
              <q-td key="actions" :props="props">
                <q-btn flat fab-mini icon="download" color="secondary" @click="onAction(props.row)">
                  <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.download") }}</q-tooltip>
                </q-btn>
                <q-btn flat fab-mini icon="settings" color="secondary" @click="onAction(props.row)">
                  <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
                </q-btn>
                <q-btn flat fab-mini icon="delete" color="grey" @click="onAction(props.row)">
                  <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.remove") }}</q-tooltip>
                </q-btn>
              </q-td>
              <!--權限等級-->
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
      </template>
    </query>
  </div>
  <PermissionDialog v-model="openPermission" />
</template>

<script lang="ts" setup>
  import { reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "src/hook/useDialog"

  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getAdminAccountPermission } from "@/api/adminAccount"
  import type { GetAdminAccountPermission } from "@/api/request.type"
  import { useEnv } from "src/hook/useEnv"
  import PermissionDialog from "components/dialogs/PermissionDialog.vue"

  const { isOpen, openDialog } = useDialog()
  const { t } = useI18n()

  let { envData } = useEnv()
  const appMode = envData().VITE_APP_MODE
  const openPermission = ref(false)

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useName: true
  })

  let { search, tableData, totalSize } = useSearch(getAdminAccountPermission)
  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetAdminAccountPermission) {
    await search(queryForm)
  }

  let tableColumn: QTableProps["columns"] = [
    {
      name: "name",
      label: t("table_header.name"),
      field: "name",
      sortable: false,
      align: "center"
    },
    {
      name: "permission_content",
      label: t("table_header.permission_content"),
      field: "permission_content",
      sortable: false,
      align: "center"
    },
    {
      name: "enable_or_disable",
      label: t("table_header.active_disabled"),
      field: "enable_or_disable",
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
  //判斷不同appMode哪些欄位顯示跟隱藏
  /*if (appMode != "admin") {
    queryConfigs.useStatus = false
    queryConfigs.useDatePicker = false
    tableColumn = tableColumn.filter((item) => item.name !== "enable_or_disable" && item.name !== "display_target")
  }*/
  function handleOpenDialog() {
    console.log("handleOpenDialog")
    isOpen.value = true
  }

  function onDownload(row: GetAdminAccountPermission) {
    console.log(row)
  }
  function onAction(item: GetAdminAccountPermission) {
    openPermission.value = true
  }
  function onAdd() {
    isOpen.value = true
  }
</script>
