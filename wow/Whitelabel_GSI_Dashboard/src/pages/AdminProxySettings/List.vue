<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn outline color="main-color" @click="onAdd" v-if="permission.edit">
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
              <!-- NO. -->
              <q-td key="agent_code" :props="props">
                {{ props.row.agent_code }}
              </q-td>

              <q-td key="private_key" :props="props">
                {{ props.row.private_key }}
              </q-td>
              <!--名稱-->
              <q-td key="title" :props="props">
                {{ props.row.title }}
              </q-td>
              <!--建立時間-->
              <q-td key="created_at" :props="props">
                {{ genTimeFormat(props.row.created_at, "yyyy-MM-dd HH:mm") }}
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

  <!-- 刪除彈窗 -->
  <!-- <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("table_header.delete_account_content") }}</div>
    </template>
  </dialog-comp>-->
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"
  import { useRouter, useRoute } from "vue-router"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "src/hook/useDialog"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getAuroraAgentList } from "@/api/agencyManagement"
  import type { GetAuroraAgentList } from "@/api/response.type"
  import { useEnv } from "src/hook/useEnv"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { usePermission } from "@/hook/usePermission"

  const { t } = useI18n()
  const $q = useQuasar()

  let { envData } = useEnv()
  const router = useRouter()
  const route = useRoute()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useAuroraAdminAgentAccount: true
  })

  let { search, tableData, totalSize } = useSearch(getAuroraAgentList)
  const { genTimeFormat } = useCommon()

  let catchQueryForm: GetAuroraAgentList

  async function onSubmit(queryForm: GetAuroraAgentList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const { permission } = usePermission()

  onMounted(() => {})

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "agent_code",
        label: t("table_header.agent_ID"),
        field: "agent_code",
        sortable: false,
        align: "center"
      },
      {
        name: "private_key",
        label: "Key",
        field: "private_key",
        sortable: false,
        align: "center"
      },
      {
        name: "title",
        label: t("table_header.agent_name"),
        field: "title",
        sortable: false,
        align: "center"
      },
      {
        name: "created_at",
        label: t("table_header.created_date"),
        field: "created_at",
        sortable: false,
        align: "center"
      }
    ]

    return columns
  })

  /*function onEdit(row: GetAdminAccount) {
    router.push({
      name: "AdminProxySettingsEdit",
      params: {
        id: row.id
      }
    })
  }*/

  function onAdd() {
    router.push({
      name: "AdminProxySettingsAdd"
    })
  }

  /* const dialogConfigs = reactive<{
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

    const res = await deleteAdminAccount(dialogData.remove)
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
  }*/
</script>
