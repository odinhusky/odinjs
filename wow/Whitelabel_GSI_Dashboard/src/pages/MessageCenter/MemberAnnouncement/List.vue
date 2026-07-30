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
          table-header-class="bg-success"
          row-key="id"
        >
          <template #body="props">
            <q-tr>
              <!--  排序  -->
              <q-td key="sort" :props="props" width="100px">
                <q-number
                  v-model="props.row.sorts"
                  :options="{
                    min: 1,
                    minimumFractionDigits: '0',
                    precision: '0',
                    nullValue: '',
                    separator: ''
                  }"
                  dense
                  outlined
                  class="sort-input"
                  @blur="handleSortsInput(props.row)"
                  placeholder=""
                />
              </q-td>
              <!-- 公告類型 -->
              <q-td key="type" :props="props">
                {{
                  $t(
                    ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[props.row.type as ANNOUNCEMENT_MEMBER_TYPE.Enums] ||
                      "common.unknow"
                  )
                }}
              </q-td>
              <!-- 標題 -->
              <q-td key="title" :props="props">
                {{ getDynamicLangTitleValue(props.row.title) }}
              </q-td>
              <!-- 公告時間 -->
              <q-td key="announcement_time" :props="props">
                {{ displayMemberAnnouncementDate(props.row.start_time) }} ~
                {{ displayMemberAnnouncementDate(props.row.end_time) }}
              </q-td>
              <!--入口開關 -->
              <q-td key="enable" :props="props">
                <q-toggle
                  v-model="props.row.enable"
                  :disable="!permission.edit"
                  color="green"
                  :false-value="2"
                  :true-value="1"
                  @update:model-value="handleAnnouncementEnable(props.row)"
                />
              </q-td>
              <q-td key="action" :props="props">
                <q-btn flat fab-mini color="blue" @click="onEdit(props.row)" v-if="permission.edit">
                  {{ $t("btn.edit") }}
                </q-btn>
                <q-btn flat fab-mini color="red" @click="onRemove(props.row)" v-if="permission.edit">
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
      </template>
    </query>
  </div>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_announcement") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { useQuasar } from "quasar"
  import type { QTableProps } from "quasar"

  import { reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import {
    getMemberAnnouncementList,
    deleteAnnouncementDetail,
    deleteMemberAnnouncement,
    putMemberAnnouncementSorts,
    putMemberAnnouncementToggle
  } from "@/api/announcement"
  import type { GetMemberAnnouncementList } from "@/api/request.type"
  import type * as Response from "@/api/response.type"

  import query, { type IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { ANNOUNCEMENT_MEMBER_TYPE } from "@/utils/constants"
  import type { LANGUAGE_TYPE } from "@/utils/constants"
  import { useRoute, useRouter } from "vue-router"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { DialogType } from "@/components/dialogs/types"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { usePermission } from "@/hook/usePermission"
  import { useLanguageStore } from "@/stores/languageStore"
  import { useMemberAnnouncement } from "@/stores/memberAnnouncement"
  import { formatMemberAnnouncementUtcDateTime, isMemberAnnouncementUtcDateTime } from "./utils/memberAnnouncementTime"

  const { permission } = usePermission()
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const $q = useQuasar()
  const languageStore = useLanguageStore()
  const memberAnnouncementStore = useMemberAnnouncement()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useTitle: true,
    useAnnouncementType: true,
    useEnableStatus: true,
    useDatePicker: true,
    customDateTimeLabelI18nKey: "table_header.announcement_time"
  })

  let { search, tableData, totalSize, tableTotal } = useSearch(getMemberAnnouncementList)

  const { genTimeFormat } = useCommon()

  function displayMemberAnnouncementDate(value: string): string | undefined {
    if (isMemberAnnouncementUtcDateTime(value)) {
      return formatMemberAnnouncementUtcDateTime(value, "yyyy-MM-dd")
    }

    return genTimeFormat(value, "yyyy-MM-dd")
  }

  let catchQueryForm: GetMemberAnnouncementList
  async function onSubmit(queryForm: GetMemberAnnouncementList) {
    catchQueryForm = queryForm
    await search(queryForm)
    tableData.value.fotEach
    tableData.value.forEach((element: Response.announcementItem) => {
      element.origin_sorts = element.sorts
    })
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "sort",
        label: "No.",
        field: "sort",
        sortable: false,
        align: "center"
      },
      {
        name: "type",
        label: t("query_params.announcement_type"),
        field: "type",
        sortable: false,
        align: "center"
      },
      {
        name: "title",
        label: t("table_header.title"),
        field: "title",
        sortable: false,
        align: "center"
      },
      {
        name: "announcement_time",
        label: t("table_header.announcement_time"),
        field: "announcement_time",
        sortable: false,
        align: "center"
      },
      {
        name: "enable",
        label: t("query_params.status"),
        field: "enable",
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
    ]

    return permission.value.edit ? columns : columns.filter((column) => column.name !== "action")
  })

  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
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
  async function onRemove(row: GetMemberAnnouncementList) {
    dialogData.remove.id = row.id
    openRemoveDialog(row)
  }

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

    const res = await deleteMemberAnnouncement(dialogData.remove.id)
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
  function onEdit(row: GetMemberAnnouncementList) {
    const { start, end } = route.query
    router.push({
      name: "MemberAnnouncementEdit",
      params: {
        id: row.id
      },
      query: {
        start,
        end
      }
    })
  }
  async function onAdd() {
    await memberAnnouncementStore.initMemberAnnouncementItem()
    const { start, end } = route.query
    router.push({
      name: "MemberAnnouncementAdd",
      query: {
        start,
        end
      }
    })
  }

  const handleSortsInput = async (row: Response.announcementItem) => {
    const sorts = row.sorts * 1

    if (sorts === row.origin_sorts) return
    console.log("aa")
    $q.loading.show()
    try {
      const { search, status } = useSearch(putMemberAnnouncementSorts)
      const payload = {
        announcement_id: row.id,
        sort_number: sorts
      }
      await search(payload)
      if (status.value) {
        onSubmit(catchQueryForm)
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
      }
    } catch (error) {
      $q.loading.hide()
    }

    $q.loading.hide()
  }

  const handleAnnouncementEnable = async (row: Response.announcementItem) => {
    console.log("handleAnnouncementEnable", row)

    let sendData = {
      announcement_id: row.id,
      enable: row.enable
    }

    const { search, status } = useSearch(putMemberAnnouncementToggle)
    await search(sendData)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }
  }
  function getDynamicLangTitleValue(data: Response.announcementItem["title"]) {
    const currentLang = languageStore.currentLanguage.toLowerCase() as LANGUAGE_TYPE.Enums

    const langValue = data[currentLang]

    if (langValue) {
      return langValue
    }

    const titles = Object.values(data)
    if (titles.length) {
      return titles[0]
    }

    return ""
  }

  function truncatedHtmlContent(data: any, maxLength = 30) {
    if (data === null || data === "") {
      return ""
    }
    const currentLang = languageStore.currentLanguage.toLowerCase()

    let langValue

    if (data[currentLang]?.content) {
      langValue = data[currentLang]
    } else {
      langValue = Object.values(data)[0]
    }

    //return langValue.content || ""
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = langValue.content || ""

    let truncatedContent = ""
    let length = 0

    function traverseNodes(node: any) {
      if (length >= maxLength) {
        return
      }

      if (node.nodeType === Node.TEXT_NODE) {
        const remainingLength = maxLength - length
        truncatedContent += node.textContent.substring(0, remainingLength)
        length += node.textContent.length
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase()
        truncatedContent += `<${tagName}`

        for (let attr of node.attributes) {
          truncatedContent += ` ${attr.name}="${attr.value}"`
        }
        truncatedContent += ">"

        for (let child of node.childNodes) {
          traverseNodes(child)
          if (length >= maxLength) {
            break
          }
        }

        truncatedContent += `</${tagName}>`
      }
    }

    for (let child of tempDiv.childNodes) {
      traverseNodes(child)
      if (length >= maxLength) {
        break
      }
    }

    // Add ellipsis if content is truncated
    if (length > maxLength) {
      truncatedContent += "..."
    }

    return truncatedContent
  }
</script>
<style lang="scss" scoped>
  ::v-deep(.q-td) {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    p {
      margin: 0;
    }
  }
  .centered-content {
    display: inline-block;
    vertical-align: middle;
    color: blue;
    cursor: pointer;
  }

  .sort-input {
    :deep(.q-field__input) {
      text-align: center;
    }
  }
</style>
