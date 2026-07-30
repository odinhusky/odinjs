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
            row-key="id"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr>
                <!-- NO. -->
                <q-td key="id" :props="props">
                  {{ props.row.id }}
                </q-td>

                <!-- 標籤類型 -->
                <q-td key="type" :props="props">
                  {{ $t(MEMBER_TAG_TYPE.I18nKeys[props.row.type] || "common.unknow") }}
                </q-td>

                <!-- 標籤名稱 -->
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>

                <!-- 備註 -->
                <q-td key="remark" :props="props">
                  {{ props.row.remark }}
                </q-td>

                <!-- 啟/停用 -->
                <q-td key="enabled" :props="props">
                  <q-toggle
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
                </q-td>

                <!-- 功能 -->
                <q-td key="actions" :props="props">
                  <template v-if="props.row.type !== MEMBER_TAG_TYPE.Enums.AI">
                    <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onAction(props.row)">
                      <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
                    </q-btn>
                    <q-btn flat fab-mini icon="delete" class="del q-mr-xs" @click="onRemove(props.row)">
                      <q-tooltip anchor="top middle" self="bottom middle">{{ $t("common.delete") }}</q-tooltip>
                    </q-btn>
                  </template>
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
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div class="text-red q-mb-lg">{{ $t("table_header.delete_membertag_content") }}</div>
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
  import { MEMBER_TAG_TYPE } from "@/utils/constants"
  import { getMemberTagList, updateMemberTagStatue, deleteMemberTag } from "@/api/member"
  import type { GetMemberTagList } from "@/api/request.type"
  import type { MemberTagItem } from "@/api/response.type"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { usePermission } from "@/hook/usePermission"

  const { t } = useI18n()
  const router = useRouter()
  const $q = useQuasar()
  const { permission } = usePermission()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useMemberTagType: true,
    useEnableStatus: true,
    useName: true
  })

  const { search, tableData, totalSize } = useSearch(getMemberTagList)
  let catchQueryForm: GetMemberTagList

  async function onSubmit(queryForm: GetMemberTagList) {
    catchQueryForm = queryForm
    await search(queryForm)
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
        name: "type",
        label: t("table_header.tag_type"),
        field: "type",
        sortable: false,
        align: "center"
      },
      {
        name: "name",
        label: t("table_header.tag_name"),
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

    // 如果無編輯權限 就把 checkbox 和 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
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
  }>({
    remove: { id: 0 }
  })
  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading,
    closeDialog: closeRemove
  } = useDialog()

  function onRemove(row: GetMemberTagList) {
    dialogData.remove.id = row.id
    openRemoveDialog(row.id)
  }

  async function handleRemove() {
    openRemoveLoading()

    const res = await deleteMemberTag(dialogData.remove)
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

  const updateStatus = async (row: GetMemberTagList) => {
    let sendData = {
      id: row.id,
      enabled: true
    }
    if (row.enabled === false) {
      sendData.enabled = false
    } else {
      sendData.enabled = true
    }

    const res = await updateMemberTagStatue(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }
  function onAdd() {
    router.push({
      name: "MemberTagListAdd"
    })
  }

  function onAction(row: MemberTagItem) {
    router.push({
      name: "MemberTagListEdit",
      params: {
        id: row.id
      }
    })
  }
</script>
