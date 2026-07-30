<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData.value?.list || []"
            :columns="tableColumn"
            table-header-class="bg-success"
            row-key="id"
          >
            <template #body="props">
              <q-tr>
                <q-td key="id" :props="props">
                  {{ props.row.id }}
                </q-td>
                <q-td key="announcement_type" :props="props">
                  {{
                    $t(
                      ANNOUNCEMENT_TYPE.I18nKeys[props.row.announcement_type as ANNOUNCEMENT_TYPE.Enums] ||
                        "common.unknow"
                    )
                  }}
                </q-td>
                <q-td key="title" :props="props">
                  {{ props.row.title }}
                </q-td>
                <q-td key="desc" :props="props">
                  <q-btn flat fab-mini color="blue" @click="onRemove(props.row)">
                    {{ props.row.desc }}
                  </q-btn>
                </q-td>
                <q-td key="time" :props="props">
                  {{ genTimeFormat(props.row.announcement_start_time) }} ~
                  {{ genTimeFormat(props.row.announcement_end_time) }}
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
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #label>
      <div>{{ $t("account_management.latest_annoucement") }}</div>
    </template>
    <template #mainContent>
      <div class="announcement-dialog q-px-sm" v-for="(item, index) in dialogData.remove" :key="index">
        <div class="dialog-item">
          <span class="dialog-item-title">{{ t("table_header.type") }}</span>
          <div class="dialog-item-content">
            {{ $t(ANNOUNCEMENT_TYPE.I18nKeys[item.announcement_type as ANNOUNCEMENT_TYPE.Enums] || "common.unknow") }}
          </div>
        </div>
        <div class="dialog-item">
          <span class="dialog-item-title">{{ t("table_header.announcement_time") }}</span>
          <div class="dialog-item-content">{{ item.announcement_start_time }} ~ {{ item.announcement_end_time }}</div>
        </div>
        <div class="dialog-item">
          <span class="dialog-item-title">{{ t("table_header.type") }}</span>
          <div class="dialog-item-content">
            {{ item.title }}
          </div>
        </div>
        <div class="dialog-item">
          <span class="dialog-item-title">{{ t("table_header.content") }}</span>
          <div class="dialog-item-content">
            {{ item.desc }}
          </div>
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { CustomQTableProps, useQuasar } from "quasar"
  import { reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"

  import { getAnnouncementList, getAnnouncementDetail } from "@/api/announcement"
  import type { GetAnnouncementList } from "@/api/request.type"
  import type { GetAnnouncementListDialog } from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { ANNOUNCEMENT_OBJECT, ANNOUNCEMENT_TYPE } from "@/utils/constants"
  import { useRouter } from "vue-router"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  const { t } = useI18n()
  const router = useRouter()
  const $q = useQuasar()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useAnnouncementType: true,
    useKeyword: true,
    useDatePicker: true
  })

  let { search, tableData, totalSize, tableTotal } = useSearch(getAnnouncementList)

  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetAnnouncementList) {
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    { name: "id", label: t("table_header.id"), field: "id", sortable: false, align: "left" },
    {
      name: "announcement_type",
      label: t("table_header.type"),
      field: "announcement_type",
      sortable: false,
      align: "left"
    },
    { name: "title", label: t("table_header.title"), field: "title", sortable: false, align: "center" },
    { name: "desc", label: t("table_header.content"), field: "desc", sortable: false, align: "center" },
    {
      name: "time",
      label: t("table_header.announcement_time"),
      field: "Time",
      sortable: false,
      align: "center"
    }
  ])
  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleRemove
    }
  })
  async function onRemove(row: GetAnnouncementList) {
    const { data } = await getAnnouncementDetail(row)
    dialogData.remove = data
    openRemoveDialog(row)
  }
  const dialogData = reactive<{
    remove: GetAnnouncementListDialog
  }>({
    remove: []
  })
  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading,
    closeDialog: closeRemove
  } = useDialog()

  async function handleRemove() {
    openRemoveLoading()

    closeRemoveLoading()
    closeRemove()
  }
</script>

<style lang="scss" scoped>
  .announcement-dialog {
    .dialog-item {
      padding: 0.5rem;
      display: flex;
      justify-content: space-between;
      &-title {
        margin-right: 2rem;
        width: 50%;
      }
      &-content {
        text-align: right;
      }
    }
  }

  .table-container {
    padding: 1rem;
    border-radius: 10px 10px 0 0;
    background-color: #fff;
  }
</style>
