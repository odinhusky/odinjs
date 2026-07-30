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
        <q-markup-table square>
          <thead class="bg-success">
            <tr>
              <th v-for="item in tableColumn">{{ item.label }}</th>
            </tr>
          </thead>
          <!-- disabled => 讓整行不能拉取 -->
          <VueDraggableNext
            class="drag-container"
            :list="tableData"
            tag="tbody"
            :disabled="disabledDrag"
            @end="onDragEnd"
          >
            <tr v-for="item in tableData">
              <td key="id">
                {{ item.id }}
                <q-icon
                  name="menu"
                  class="drag-icon"
                  @mouseenter="disabledDrag = false"
                  @mouseleave="disabledDrag = true"
                  @touchstart="disabledDrag = false"
                  @touchend="disabledDrag = true"
                />
              </td>
              <td key="announcement_type">
                {{
                  $t(ANNOUNCEMENT_TYPE.I18nKeys[item.announcement_type as ANNOUNCEMENT_TYPE.Enums] || "common.unknow")
                }}
              </td>
              <td key="target">
                {{ $t(ANNOUNCEMENT_OBJECT.I18nKeys[item.target as ANNOUNCEMENT_OBJECT.Enums] || "common.unknow") }}
              </td>

              <td key="title">
                {{ item.title }}
              </td>
              <td key="desc">
                <q-btn flat fab-mini color="blue" @click="openDetail(item)">
                  {{ item.desc }}
                </q-btn>
              </td>
              <td key="time">
                {{ genTimeFormat(item.announcement_start_time) }} ~
                {{ genTimeFormat(item.announcement_end_time) }}
              </td>
              <td key="enabled">
                <q-toggle v-model="item.enabled" color="green" />
              </td>
              <td key="action">
                <q-btn flat fab-mini icon="settings" color="secondary" @click="onEdit(item)">
                  <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
                </q-btn>
                <q-btn flat fab-mini icon="delete" color="grey" @click="onRemove(item)">
                  <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.remove") }}</q-tooltip>
                </q-btn>
              </td>
            </tr>
          </VueDraggableNext>
        </q-markup-table>
      </template>
    </query>
  </div>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_announcement") }}</div>
    </template>
  </dialog-comp>
  <!-- detail彈窗 -->
  <dialog-comp v-model="detailDialog" :configs="dialogConfigs.detail" :loading="detailLoading">
    <template #label>
      <div>{{ $t("account_management.latest_annoucement") }}</div>
    </template>
    <template #mainContent>
      <div class="announcement-dialog q-px-sm" v-for="(item, index) in dialogData.detail" :key="index">
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
  import { reactive, computed, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { VueDraggableNext } from "vue-draggable-next"
  import {
    getAnnouncementList,
    getAnnouncementDetail,
    deleteAnnouncementDetail,
    getAnnouncementSequence
  } from "@/api/announcement"
  import type { GetAnnouncementList } from "@/api/request.type"
  import type { GetAnnouncementListDialog } from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { ANNOUNCEMENT_OBJECT, ANNOUNCEMENT_TYPE } from "@/utils/constants"
  import { useRoute, useRouter } from "vue-router"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const $q = useQuasar()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useAnnouncementType: true,
    useDisplayObjectType: true,
    useKeyword: true,
    useEnableStatus: true,
    useDatePicker: true
  })

  let { search, tableData, totalSize, tableTotal } = useSearch(getAnnouncementList)
  async function onDragEnd() {
    const formatSequence = tableData.value.map((item: GetAnnouncementList) => {
      return {
        id: item.id,
        sequence: item.sequence
      }
    })
    await getAnnouncementSequence(formatSequence)
    onSubmit(catchQueryForm)
  }
  const disabledDrag = ref(true)
  const { genTimeFormat } = useCommon()
  let catchQueryForm: GetAnnouncementList
  async function onSubmit(queryForm: GetAnnouncementList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    { name: "id", label: t("table_header.sequence"), field: "id", sortable: false, align: "left" },
    {
      name: "announcement_type",
      label: t("table_header.type"),
      field: "announcement_type",
      sortable: false,
      align: "left"
    },
    { name: "target", label: t("table_header.announcement_target"), field: "target", sortable: false, align: "left" },
    { name: "title", label: t("table_header.title"), field: "title", sortable: false, align: "center" },
    { name: "desc", label: t("table_header.content"), field: "desc", sortable: false, align: "center" },
    {
      name: "time",
      label: t("table_header.announcement_time"),
      field: "time",
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
      name: "action",
      label: t("table_header.action"),
      field: "action",
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
    },
    detail: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.ADD,
      useActions: true,
      submitFunction: handleOpenDetail
    }
  })
  async function onRemove(row: GetAnnouncementList) {
    dialogData.remove.id = row.id
    openRemoveDialog(row)
  }

  async function openDetail(row: GetAnnouncementList) {
    const { data } = await getAnnouncementDetail(row)
    dialogData.detail = data
    openDetailDialog(row)
  }
  const dialogData = reactive<{
    remove: { id: number }
    detail: GetAnnouncementListDialog
  }>({
    remove: { id: 0 },
    detail: []
  })
  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading,
    closeDialog: closeRemove
  } = useDialog()

  const {
    dialog: detailDialog,
    openDialog: openDetailDialog,
    loading: detailLoading,
    openLoading: openDetailLoading,
    closeLoading: closeDetailLoading,
    closeDialog: closeDetail
  } = useDialog()

  async function handleRemove() {
    openRemoveLoading()

    const res = await deleteAnnouncementDetail(dialogData.remove)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.success"),
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
  function handleOpenDetail() {
    openDetailLoading()
    closeDetailLoading()
    closeDetail()
  }
  function onEdit(row: GetAnnouncementList) {
    const { start, end } = route.query
    router.push({
      name: "AnnouncementEdit",
      params: {
        id: row.id
      },
      query: {
        start,
        end
      }
    })
  }
  function onAdd() {
    const { start, end } = route.query
    router.push({
      name: "AnnouncementAdd",
      query: {
        start,
        end
      }
    })
  }
</script>
