<template>
  <div class="q-pa-md">
    <div class="row q-mb-md justify-start">
      <q-btn class="btns btn-blue" color="main-color" :to="{ name: 'CmsH5FooterMenuAdd' }" v-if="permission.edit">
        <q-icon class="q-mr-xs" size="xs" name="add" />
        {{ $t("btn.add") }}
      </q-btn>
    </div>
    <div class="table-container">
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
          <!-- 排序 -->
          <q-td key="sort" :props="props" width="100px">
            <q-number
              v-model="props.row.sort"
              :options="optionsSort"
              dense
              outlined
              class="sort-input"
              @blur="handleSortInput(props.row)"
              placeholder=""
              :disable="isLoading || !permission.edit"
            />
          </q-td>
          <!-- 標題 -->
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <!-- 登入前/後 -->
          <q-td key="displayLogin" :props="props">
            {{ $t(CMS_DISPLAY_LOGIN.I18nKeys[props.row.display_login as CMS_DISPLAY_LOGIN.Enums]) }}
          </q-td>
          <!-- icon 確認api 資料 -->
          <q-td key="icon" :props="props">
            <img
              v-if="props.row.icon_path"
              :src="formatImg({ path: props.row.icon_path, updatedTime: props.row.updated_time })"
              alt=""
              class="icon-img"
            />
            <img v-else :src="cmsIconDefault()" alt="" class="icon-img" />
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
              :disable="isLoading || !permission.edit"
            />
          </q-td>
          <!-- 功能 -->
          <q-td key="actions" :props="props">
            <q-btn flat fab-mini color="blue" :to="{ name: 'CmsH5FooterMenuEdit', params: { id: props.row.id } }">
              {{ $t("btn.edit") }}
            </q-btn>
            <q-btn flat fab-mini color="red" @click="onRemove(props.row)">
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
  </div>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_information") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from "vue"
  import { useCms } from "src/composables/useCms"
  import { useImage } from "src/hook/useImage"
  import { CMS_TYPE, CMS_DISPLAY_LOGIN } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  import { usePermission } from "@/hook/usePermission"

  const {
    isLoading,
    optionsSort,
    tableColumn,
    cmsList,
    handleGetCmsList,
    handleCmsItemSort,
    handleCmsItemStatus,
    formatImg,
    handleDelCmsList
  } = useCms()
  const { cmsIconDefault } = useImage()
  const { permission } = usePermission()

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
      type: CMS_TYPE.Enums.H5_BOTTOM_MENU,
      id: dialogData.remove.id
    })
    closeRemoveLoading()
    closeRemove()
  }

  function handleSortInput(row: Response.CmsItem) {
    const params: Request.UpdateCmsItemSort = {
      id: row.id,
      sort: Number(row.sort),
      title: row.title,
      type: CMS_TYPE.Enums.H5_BOTTOM_MENU
    }
    handleCmsItemSort(params)
  }

  function updateStatus(row: Response.CmsItem) {
    const params: Request.UpdateCmsItemStatus = {
      id: row.id,
      enabled: row.enabled,
      type: CMS_TYPE.Enums.H5_BOTTOM_MENU
    }
    handleCmsItemStatus(params)
  }

  onMounted(() => {
    handleGetCmsList(CMS_TYPE.Enums.H5_BOTTOM_MENU)
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
</style>
