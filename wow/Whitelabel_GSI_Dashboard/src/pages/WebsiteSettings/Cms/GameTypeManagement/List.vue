<template>
  <div class="q-pa-md">
    <div class="row q-mb-md justify-start">
      <q-btn outline color="main-color" :to="{ name: 'CmsGameTypeAdd' }" v-if="permission.edit">
        {{ $t("btn.add") }}
        <q-icon class="q-mr-xs" size="xs" name="add_circle_outline" />
      </q-btn>
      <q-select
        color="main-color"
        v-model="selectedLanguage"
        :options="langOption"
        outlined
        dense
        emit-value
        map-options
        class="q-ml-md"
        style="max-width: 200px"
        :option-label="(item) => LANGUAGE_TYPE.Labels[item.label as LANGUAGE_TYPE.Enums]"
        @update:model-value="updateLanguage"
      />
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
          <q-td key="product_entrance_type" :props="props">
            {{ $t(ENTRANCE_TYPE.I18nKeys[props.row.product_entrance_type as ENTRANCE_TYPE.Enums] || "") }}
          </q-td>
          <!-- 功能 -->
          <q-td key="actions" :props="props">
            <q-btn flat fab-mini color="blue" :to="{ name: 'CmsGameTypeEdit', params: { id: props.row.id } }">
              {{ $t("btn.edit") }}
            </q-btn>
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
  import { computed, onMounted, reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"
  import { useCms } from "src/composables/useCms"
  import { useImage } from "src/hook/useImage"
  import { CMS_TYPE, ENTRANCE_TYPE, LANGUAGE_TYPE } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  import { usePermission } from "@/hook/usePermission"
  import { storeToRefs } from "pinia"
  import { useSiteStore } from "@/stores/siteStore"

  const { t } = useI18n()
  const {
    isLoading,
    optionsSort,
    cmsList,
    handleGetCmsList,
    handleCmsItemSort,
    handleCmsItemStatus,
    formatImg,
    handleDelCmsList
  } = useCms()
  const { cmsIconDefault } = useImage()
  const { permission } = usePermission()
  const selectedLanguage = ref("")
  const siteStore = useSiteStore()

  const { langList } = storeToRefs(siteStore)
  const langOption = computed(() =>
    langList.value.map((item) => ({
      label: item.label,
      value: item.label
    }))
  )
  const updateLanguage = (newLanguage: string) => {
    selectedLanguage.value = newLanguage
    handleGetCmsList(CMS_TYPE.Enums.CATEGORYMANAGEMENT, selectedLanguage.value)
  }
  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "title",
        label: t("cms.category_name"),
        field: "title",
        sortable: false,
        align: "center"
      },
      {
        name: "product_entrance_type",
        label: t("cms.entry_settings"),
        field: "product_entrance_type",
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
      type: CMS_TYPE.Enums.CATEGORYMANAGEMENT,
      id: dialogData.remove.id
    })
    closeRemoveLoading()
    closeRemove()
  }

  onMounted(async () => {
    selectedLanguage.value = langOption.value[0].value
    handleGetCmsList(CMS_TYPE.Enums.CATEGORYMANAGEMENT, selectedLanguage.value)
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
</style>
