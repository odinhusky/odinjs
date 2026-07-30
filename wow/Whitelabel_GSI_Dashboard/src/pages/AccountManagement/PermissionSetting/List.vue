<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn @click="onAdd" v-if="permission.edit" class="btns btn-blue">
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
                <q-td key="id" :props="props">
                  {{ props.row.id }}
                </q-td>
                <!--名稱-->
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>

                <!--備註-->
                <q-td class="remark" key="remark" :props="props">
                  {{ props.row.remark }}
                </q-td>
                <!--權限內容-->
                <q-td key="perm_count" :props="props">
                  <q-btn class="q-mr-xs color_blue count-btn" outline @click="openPermissionDialog(props.row)">{{
                    props.row.perm_count
                  }}</q-btn>
                </q-td>
                <!-- 啟/停用 -->
                <q-td key="status" :props="props">
                  <q-toggle
                    v-model="props.row.status"
                    class="toggle"
                    color="blue"
                    size="lg"
                    :false-value="0"
                    :true-value="1"
                    keep-color
                    :disable="!permission.edit"
                    @update:model-value="updateStatus(props.row)"
                  />
                </q-td>
                <!-- 功能 -->
                <q-td key="actions" :props="props" v-if="permission.edit">
                  <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onEdit(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
                  </q-btn>
                  <q-btn flat fab-mini icon="content_copy" class="copy" @click="onCopy(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.copy") }}</q-tooltip>
                  </q-btn>
                  <q-btn flat fab-mini icon="delete" class="del" @click="onRemove(props.row)">
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
  <PermissionDialog v-model="openPermission" />
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div class="text-red q-mb-lg">{{ $t("table_header.delete_permission_content") }}</div>
    </template>
  </dialog-comp>
  <!-- 彈窗 -->
  <dialog-comp v-model="viewDialog" :configs="dialogConfigs.view" :loading="viewLoading" max-width="62rem">
    <template #label>
      <div class="q-card__section q-card__section--vert">
        <div class="dialog_title">{{ $t("table_header.permission_content") }}</div>
      </div>
    </template>
    <template #mainContent>
      <q-card class="custom-modal">
        <div class="q-px-sm">
          <q-scroll-area style="height: 400px">
            <div
              class="one-col-grid input-col-grid"
              v-for="(item, index) in dialogData.view.permissionList"
              :key="item.id"
            >
              <div class="flex-column-top">
                <div class="custom-box">
                  <div class="custom-box-label h4-bold bold q-mb-sm">
                    {{ $t(PERMISSION.I18nKeys[item.id as PERMISSION.Enums] || "common.unknow") }}
                  </div>
                </div>
              </div>

              <div class="flex-column">
                <div class="custom-box2" v-for="(menu, menuIndex) in item.sub_permission" :key="menu.id">
                  <span class="h6-bold">{{
                    $t(PERMISSION.I18nKeys[menu.id as PERMISSION.Enums] || "common.unknow")
                  }}</span>
                  <div class="custom-edit grey">
                    <template v-if="menu.actions.edit !== undefined">
                      <span class="btn_green" v-if="menu.actions.edit">{{ $t("common.editable") }}</span
                      ><span class="btn_red" v-else>{{ $t("common.not_editable") }}</span>
                    </template>
                    <template v-if="menu.actions.view !== undefined">
                      <span class="btn_green" v-if="menu.actions.view">{{ $t("common.available_to_view") }}</span
                      ><span class="btn_red" v-else>{{ $t("common.not_viewable") }}</span>
                    </template>
                    <template v-if="menu.actions.export !== undefined">
                      <span class="btn_green" v-if="menu.actions.export">{{ $t("common.can_be_remitted") }}</span
                      ><span class="btn_red" v-else>{{ $t("common.not_remittable") }}</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </q-scroll-area>
        </div>
      </q-card>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "src/hook/useDialog"
  import { useRouter } from "vue-router"

  import query, { IQueryConfig } from "@/components/query/common.vue"
  import {
    getAdminAccountPermission,
    updateAdminAccountPermissionStatue,
    deleteAdminAccountPermission,
    getAdminAccountPermissionDetail
  } from "@/api/adminAccount"
  import type { GetAdminAccountPermissionDetail, GetAdminAccountPermission } from "@/api/request.type"
  import type { adminAccountPermissionItem } from "@/api/response.type"
  import { useEnv } from "src/hook/useEnv"
  import PermissionDialog from "components/dialogs/PermissionDialog.vue"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { PERMISSION } from "@/utils/constants"
  import { useRoute } from "vue-router"
  import { usePermission } from "@/hook/usePermission"

  const { t } = useI18n()
  const $q = useQuasar()

  let { envData } = useEnv()
  const appMode = envData().VITE_APP_MODE
  const openPermission = ref(false)
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useName: true
  })

  let { search, tableData, totalSize } = useSearch(getAdminAccountPermission)

  let catchQueryForm: GetAdminAccountPermission
  async function onSubmit(queryForm: GetAdminAccountPermission) {
    catchQueryForm = queryForm
    await search(queryForm)
  }
  const { permission } = usePermission()

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "id",
        label: "No.",
        field: "id",
        sortable: false,
        align: "center"
      },
      {
        name: "name",
        label: t("table_header.role"),
        field: "name",
        sortable: false,
        align: "center"
      },
      {
        name: "remark",
        label: t("table_header.remark"),
        field: "remark",
        sortable: false,
        align: "center"
      },
      {
        name: "perm_count",
        label: t("table_header.permission_content"),
        field: "perm_count",
        sortable: false,
        align: "center"
      },
      {
        name: "status",
        label: t("table_header.active_disabled"),
        field: "status",
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

  //判斷不同appMode哪些欄位顯示跟隱藏
  /*if (appMode != "admin") {
    queryConfigs.useStatus = false
    queryConfigs.useDatePicker = false
    tableColumn = tableColumn.filter((item) => item.name !== "enable_or_disable" && item.name !== "display_target")
  }*/

  function onCopy(row: adminAccountPermissionItem) {
    router.push({
      name: "PermissionSettingListEdit",
      params: {
        id: row.id,
        type: "copy"
      }
    })
  }
  function onEdit(row: adminAccountPermissionItem) {
    router.push({
      name: "PermissionSettingListEdit",
      params: {
        id: row.id,
        type: "edit"
      }
    })
  }

  function onAdd() {
    router.push({
      name: "PermissionSettingListAdd"
    })
  }

  const updateStatus = async (row: adminAccountPermissionItem) => {
    let sendData = {
      id: row.id,
      mode: ""
    }
    if (row.status === 0) {
      sendData.mode = "disable"
    } else {
      sendData.mode = "enable"
    }
    const res = await updateAdminAccountPermissionStatue(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    view: {
      type: DialogType.VIEW,
      useActions: false
    },
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      showLabelCloseBtn: true,
      submitFunction: handleRemove
    }
  })

  const dialogData = reactive<{
    remove: {
      id?: number
    }
    view: {
      permissionList: any[]
    }
  }>({
    remove: { id: 0 },
    view: { permissionList: [] }
  })
  interface PermissionAction {
    edit: boolean
    view: boolean
    export?: boolean
  }

  interface SubPermission {
    id: number
    name: string
    layer: number
    actions: PermissionAction
  }

  interface ParentPermission {
    id: number
    name: string
    layer: number
    sub_permission?: SubPermission[]
    editAll: boolean
    viewAll: boolean
    exportAll: boolean
  }

  const { dialog: viewDialog, openDialog: openViewDialog, loading: viewLoading } = useDialog()

  const openPermissionDialog = async (row: GetAdminAccountPermissionDetail) => {
    //openPermission.value = true
    //openViewDialog()
    const sendData = {
      id: row.id
    }
    const res = await getAdminAccountPermissionDetail(sendData)
    if (res.code === 0) {
      const filteredParentPermission = (res.data.parent_permission as ParentPermission[])?.filter((parent) => {
        if (!PERMISSION.I18nKeys[parent.id as PERMISSION.Enums]) {
          return false
        }
        parent.sub_permission = (parent.sub_permission as SubPermission[])?.filter((sub) => {
          if (PERMISSION.I18nKeys[sub.id as PERMISSION.Enums]) {
            return true
          }
          return false
        })

        return parent.sub_permission.length > 0
      })
      const sortedPermissions = filteredParentPermission
        .map((group) => ({
          ...group,
          sub_permission: group.sub_permission ? [...group.sub_permission].sort((a, b) => a.id - b.id) : []
        }))
        .sort((a, b) => a.id - b.id)
      dialogData.view.permissionList = sortedPermissions
      openViewDialog()
    }
  }

  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading,
    closeDialog: closeRemove
  } = useDialog()

  function onRemove(row: GetAdminAccountPermissionDetail) {
    dialogData.remove.id = row.id
    openRemoveDialog(row.id)
  }

  async function handleRemove() {
    openRemoveLoading()

    const res = await deleteAdminAccountPermission(dialogData.remove)
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
</script>

<style style="scss" scoped>
  .custom-modal {
    box-shadow: none !important;
    width: 100%;
  }

  .custom-modal .title {
    color: #553b85;
  }

  .custom-modal label {
    color: #505050;
  }

  .one-col-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 24px;
    margin-top: 24px;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
  }

  .custom-box-label {
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
    color: #086eff;
  }

  .custom-box {
    border: none;
    border-radius: 0px;
    text-align: left;
    border-bottom: 1px solid #e5e5e5;
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .custom-box2 {
    border: none;
    border-radius: 0px;
    text-align: left;
    cursor: pointer;
    border-bottom: 1px solid #e5e5e5;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 9px;
  }

  .custom-box:last-child,
  .custom-box2:last-child {
    border-bottom: none;
  }
  .custom-edit {
    display: inline-block;
    float: right;
    span {
      margin-right: 12px;
    }
  }
  .btn_green {
    color: #00bf95;
  }
  .btn_red {
    color: #ff4343;
  }
  :deep(.q-scrollarea__content) {
    display: grid;
    align-items: start;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .remark {
    min-width: 300px;
  }

  .count-btn {
    width: 55px;
  }
</style>
