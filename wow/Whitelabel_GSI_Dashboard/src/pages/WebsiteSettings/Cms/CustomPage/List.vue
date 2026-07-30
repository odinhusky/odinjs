<template>
  <div class="q-pa-md">
    <div class="row q-mb-md justify-start">
      <q-btn outline color="main-color" :to="{ name: 'CmsCustomPageAdd' }" v-if="permission.edit">
        {{ $t("btn.add") }}
        <q-icon class="q-ml-xs" size="xs" name="add_circle_outline" />
      </q-btn>
    </div>
    <q-table
      square
      hide-pagination
      :rows-per-page-options="[0]"
      :rows="cmsList"
      :columns="tableColumn"
      row-key="id"
      table-header-class="bg-success"
    >
      <template #body="props">
        <q-tr>
          <!-- 標題 -->
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td key="url" :props="props">
            <a
              v-if="isStagingId"
              :href="`https://${userInfo.agentId.toLocaleLowerCase()}.gsiwl.com/cmsCustomPage/${props.row.id}`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 underline"
            >
              {{ `https://${userInfo.agentId.toLocaleLowerCase()}.gsiwl.com/cmsCustomPage/${props.row.id}` }}
            </a>
            <a
              v-else-if="isdevelopId"
              :href="`https://${userInfo.agentId.toLocaleLowerCase()}-dev.gsiwl.com/cmsCustomPage/${props.row.id}`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 underline"
            >
              {{ `https://${userInfo.agentId.toLocaleLowerCase()}-dev.gsiwl.com/cmsCustomPage/${props.row.id}` }}
            </a>
            <span v-else> {{ `cmsCustomPage/${props.row.id}` }}</span>
          </q-td>
          <!-- 啟停用 -->
          <q-td key="enabled" :props="props">
            <q-toggle
              v-model="props.row.enabled"
              color="green"
              :false-value="false"
              :true-value="true"
              keep-color
              @click="updateStatus(props.row)"
              :disable="isLoading || !permission.edit || !props.row.is_editable"
            />
          </q-td>
          <!-- 功能 -->
          <q-td key="actions" :props="props">
            <q-btn flat fab-mini color="blue" :to="{ name: 'CmsCustomPageEdit', params: { id: props.row.id } }">
              {{ $t("btn.edit") }}
            </q-btn>
            <!-- 預覽 -->
            <q-btn flat fab-mini color="red" @click="onRemove(props.row)" v-if="props.row.is_editable">
              {{ $t("btn.remove") }}
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
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_information") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"
  import { useCms } from "src/composables/useCms"
  import { CMS_TYPE } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  import { usePermission } from "@/hook/usePermission"
  import { useUserInfo } from "@/hook/useUserInfo"

  const { t } = useI18n()
  const { isLoading, cmsList, handleGetCmsList, handleCmsItemStatus, handleDelCmsList } = useCms()
  const { permission } = usePermission()
  const { userInfo, isStagingId, isdevelopId } = useUserInfo()

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "title",
        label: t("table_header.title"),
        field: "title",
        sortable: false,
        align: "center"
      },
      {
        name: "url",
        label: t("cms.page_url"),
        field: "url",
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

    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })
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

  const dialogData = reactive<{
    remove: {
      id: number
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

  function onRemove(row: { id: number }) {
    dialogData.remove.id = row.id
    openRemoveDialog(row.id)
  }

  async function handleRemove() {
    openRemoveLoading()

    await handleDelCmsList({
      type: CMS_TYPE.Enums.CUSTOM_PAGE,
      id: dialogData.remove.id
    })
    closeRemoveLoading()
    closeRemove()
  }

  function updateStatus(row: Response.CmsItem) {
    if (row.is_editable) {
      const params: Request.UpdateCmsItemStatus = {
        id: row.id,
        enabled: row.enabled,
        type: CMS_TYPE.Enums.CUSTOM_PAGE
      }
      handleCmsItemStatus(params)
    }
  }

  onMounted(() => {
    handleGetCmsList(CMS_TYPE.Enums.CUSTOM_PAGE)
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
</style>
