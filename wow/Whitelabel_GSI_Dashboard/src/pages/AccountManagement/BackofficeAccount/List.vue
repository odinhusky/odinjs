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
                <!-- NO. -->
                <q-td key="id" :props="props">
                  <span v-if="props.row.is_sub !== false" class="q-mr-xs" style="cursor: pointer">{{
                    props.row.id
                  }}</span>
                  <span v-else>{{ props.row.id }}</span>
                </q-td>
                <!--帳號-->
                <!-- <q-td key="account" :props="props" @click="onEdit(props.row)">
                {{ props.row.account }}
              </q-td> -->
                <q-td key="account" :props="props">
                  {{ props.row.account }}
                </q-td>
                <!--名稱-->
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <!--建立時間-->
                <q-td key="created_at" :props="props">
                  <span v-if="props.row.is_sub !== false">{{
                    genTimeFormat(new Date(props.row.created_at), "yyyy-MM-dd HH:mm:ss")
                  }}</span>
                  <span v-else>--</span>
                </q-td>

                <!--權限等級-->
                <q-td key="role_id" :props="props">
                  {{ getPermissionName(props.row.role_id) }}
                </q-td>
                <!--權限內容-->
                <q-td key="role_id" :props="props">
                  <q-btn class="q-mr-xs color_blue" outline @click="openPermissionDialog(props.row.role_id)">{{
                    getPermissionContent(props.row.role_id)
                  }}</q-btn>
                </q-td>
                <!-- 啟/停用 -->
                <q-td key="enabled" :props="props">
                  <q-toggle
                    v-if="props.row.is_sub !== false"
                    v-model="props.row.enabled"
                    class="toggle"
                    color="blue"
                    size="lg"
                    :false-value="false"
                    :true-value="true"
                    keep-color
                    :disable="!permission.edit"
                    @update:model-value="updateStatus(props.row)"
                  />
                  <span v-else>--</span>
                </q-td>
                <!--狀態-->
                <q-td key="is_ban" :props="props">
                  <div v-if="props.row.is_sub !== false">
                    <span v-if="props.row.is_ban === false" class="status_label status_unfrozen">{{
                      $t("common.un_frozen")
                    }}</span>
                    <span v-else class="status_label status_frozen">{{ $t("common.frozen") }}</span>
                  </div>
                  <span v-else>--</span>
                </q-td>
                <!-- 功能 -->
                <q-td key="actions" :props="props">
                  <q-btn
                    flat
                    fab-mini
                    icon="edit"
                    class="edit_pen"
                    @click="onEdit(props.row)"
                    :disable="!permission.edit"
                    v-if="props.row.is_sub !== false"
                  >
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    fab-mini
                    icon="delete"
                    class="del q-mr-xs"
                    @click="onRemove(props.row)"
                    v-if="props.row.is_sub !== false"
                  >
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.remove") }}</q-tooltip>
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
  <!--權限內容彈窗-->
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
  <!-- 解綁彈窗 -->
  <!--<dialog-comp v-model="unbindDialog" :configs="dialogConfigs.unbind" :loading="unbindLoading">
    <template #mainContent>
      <div>
        {{ $t("table_header.unbind_account_content", { account: dialogData.unbind.member_account }) }}
      </div>
    </template>
  </dialog-comp>-->
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div class="text-red q-mb-lg">{{ $t("table_header.delete_account_content") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"
  import { useRouter, useRoute } from "vue-router"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "src/hook/useDialog"

  import query, { IQueryConfig } from "@/components/query/common.vue"
  import {
    getAdminAccount,
    deleteAdminAccount,
    getAdminAccountPermission,
    getAdminAccountPermissionDetail,
    updateAccountAdminDetail
  } from "@/api/adminAccount"
  import type { adminAccountPermissionItem } from "@/api/response.type"
  import type { GetAdminAccount, GetAdminAccountPermissionDetail } from "@/api/request.type"
  import { useEnv } from "src/hook/useEnv"
  import PermissionDialog from "components/dialogs/PermissionDialog.vue"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { PERMISSION } from "@/utils/constants"
  import { usePermission } from "@/hook/usePermission"

  const { t } = useI18n()
  const $q = useQuasar()

  let { envData } = useEnv()
  const appMode = envData().VITE_APP_MODE
  const openPermission = ref(false)
  const router = useRouter()
  const route = useRoute()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useAccount: true,
    useName: true,

    usePermissionLevel: true,
    useEnableStatus: true,
    useFrozenStatus: true,
    usePhone: true,
    useEmail: true,
    customDateTimeLabelI18nKey: "query_params.date_time_range"
  })

  let { search, tableData, totalSize } = useSearch(getAdminAccount)
  const { genTimeFormat } = useCommon()

  let catchQueryForm: GetAdminAccount
  const permissionList: adminAccountPermissionItem[] = reactive([])

  async function onSubmit(queryForm: GetAdminAccount) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const { permission } = usePermission()

  onMounted(() => {
    //取得權限設定列表
    getPermissionList()
  })

  const getPermissionList = async () => {
    const sendData = { name: "", offset: 0, size: 100 }
    const { data } = await getAdminAccountPermission(sendData)

    if (!data || !Object.keys(data).length) {
      return
    }
    /* var test = [
      {
        id: 1,
        name: "finance13",
        perm_count: 1,
        status: 1,
        remark: "report only"
      }
    ]*/
    Object.assign(permissionList, data.list)
  }

  const getPermissionName = (roleId: number) => {
    const role = permissionList.find((item) => item.id === roleId)
    return role ? role.name : ""
  }
  const getPermissionContent = (roleId: number) => {
    const role = permissionList.find((item) => item.id === roleId)
    return role ? role.perm_count : 0
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "id",
        label: t("table_header.id"),
        field: "id",
        sortable: false,
        align: "center"
      },
      {
        name: "account",
        label: t("table_header.account"),
        field: "account",
        sortable: false,
        align: "center"
      },
      {
        name: "name",
        label: t("table_header.name"),
        field: "name",
        sortable: false,
        align: "center"
      },
      {
        name: "created_at",
        label: t("table_header.created_date"),
        field: "created_at",
        sortable: false,
        align: "center"
      },
      {
        name: "role_id",
        label: t("table_header.permission_level"),
        field: "role_id",
        sortable: false,
        align: "center"
      },
      {
        name: "role_id",
        label: t("table_header.permission_content"),
        field: "role_id",
        sortable: false,
        align: "center"
      },
      {
        name: "enabled",
        label: t("table_header.active_disabled"),
        field: "enabled",
        sortable: false,
        align: "center"
      },
      {
        name: "is_ban",
        label: t("table_header.status"),
        field: "is_ban",
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
    //如果無編輯權限 就把action移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  //判斷不同appMode哪些欄位顯示跟隱藏
  /*if (appMode != "admin") {
    queryConfigs.useStatus = false
    queryConfigs.useDatePicker = false
    tableColumn = tableColumn.filter((item) => item.name !== "enabled" && item.name !== "display_target")
  }*/

  function onEdit(row: GetAdminAccount) {
    router.push({
      name: "BackofficeAccountListEdit",
      params: {
        id: row.id
      }
    })
  }

  function onAdd() {
    router.push({
      name: "BackofficeAccountListAdd"
    })
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

  const openPermissionDialog = async (id: number) => {
    const sendData = {
      id: id
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

  function onRemove(row: GetAdminAccount) {
    dialogData.remove.id = row.id
    openRemoveDialog(row.id)
  }

  async function handleRemove() {
    openRemoveLoading()
    const { search, status } = useSearch(deleteAdminAccount)
    await search(dialogData.remove)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeRemoveLoading()
      closeRemove()
    }
  }

  const updateStatus = async (row: GetAdminAccount) => {
    let sendData = {
      id: row.id,
      enabled: row.enabled
    }
    const { search, status } = useSearch(updateAccountAdminDetail)
    await search(sendData)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      setTimeout(() => {
        history.go(0)
      }, 2000)
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
</style>
