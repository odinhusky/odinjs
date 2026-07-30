<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start" v-if="permission.edit">
          <q-btn
            :label="t('btn.batch_edit')"
            class="btns btn-green"
            :disable="!selection.list || !selection.list.length"
            @click="onBatchEdit"
          />
        </div>
        <div class="table-white-bg ckeckbox-style">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            row-key="id"
          >
            <!-- 勾選框 -->
            <template #header-cell-checkbox v-if="permission.edit">
              <q-th class="text-center">
                <q-checkbox v-model="isSelectedAll" />
              </q-th>
            </template>

            <template #body="props">
              <q-tr>
                <!-- 勾選框 -->
                <q-td style="width: 4rem" v-if="permission.edit">
                  <q-checkbox v-model="selection.list" :val="props.row" dense color="main-color" />
                </q-td>

                <!-- 會員帳號 -->
                <q-td key="member_account" :props="props">
                  {{ props.row.account }}
                </q-td>

                <!-- 推薦人 -->
                <q-td key="recommender" :props="props">
                  {{ props.row.ref_account === null || props.row.ref_account === "" ? "-" : props.row.ref_account }}
                </q-td>

                <q-td key="level" :props="props">
                  {{ props.row.level }}
                </q-td>

                <!-- 會員層級 -->
                <q-td key="member_level" :props="props">
                  {{ getDynamicLangValue(props.row.member_level) }}
                </q-td>

                <!-- 生日 -->
                <q-td key="birthday" :props="props">
                  {{ formatDate(props.row.date_of_birth) || "-" }}
                </q-td>

                <!-- 會員標籤 -->
                <q-td key="member_tag" :props="props">
                  {{ props.row.labels }}
                </q-td>

                <!-- 啟/停用 -->
                <q-td key="member_status" :props="props">
                  <!-- <q-btn v-if="props.row.enabled === STATUS.Enums.Enable" flat color="positive" :ripple="false">
                  {{ $t("common.enable") }}
                </q-btn>
                <q-btn
                  v-else-if="props.row.member_status === STATUS.Enums.Disable"
                  flat
                  color="negative"
                  :ripple="false"
                >
                  {{ $t("common.disable") }}
                </q-btn> -->
                  {{
                    props.row.enabled === true
                      ? t(STATUS.I18nKeys[STATUS.Enums.Enable as STATUS.Enums])
                      : t(STATUS.I18nKeys[STATUS.Enums.Disable as STATUS.Enums])
                  }}
                </q-td>

                <!-- 調整層級 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onSingleEdit(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ t("btn.edit_level") }}</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>

            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm column no_data">
                <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
                <p class="bold h5-bold q-mt-sm">{{ t("common.no_data") }}</p>
              </div>
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>

  <!-- 單一編輯彈窗 -->
  <dialog-comp
    v-model="singleEditDialog"
    :configs="dialogConfigs.singleEdit"
    :loading="singleEditLoading"
    max-width="600px"
  >
    <template #label>
      <div class="q-card__section q-card__section--vert">
        <div class="dialog_title">{{ t("btn.edit_level") }} {{ dialogData.singleEdit.account }}</div>
      </div>
    </template>
    <template #mainContent>
      <!-- 當前層級 -->
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">{{ t("table_header.current_level") }}</div>
        <div class="col-12 col-sm-9">
          {{ t(MEMBER_LEVEL.I18nKeys[dialogData.singleEdit.originLevel as MEMBER_LEVEL.Enums] || "common.unknow") }}
        </div>
      </div>
      <!-- 異動原因 -->
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">
          {{ t("table_header.modify_reason") }}<span class="required-dot"></span>
        </div>
        <div class="col-12 col-sm-9">
          <q-input v-model="dialogData.singleEdit.reason" type="textarea" class="" outlined />
        </div>
      </div>
      <!-- 異動層級 -->
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">
          {{ t("common.modify_selected_member") }}<span class="required-dot"></span>
        </div>
        <div class="col-12 col-sm-9">
          <q-select
            v-model="dialogData.singleEdit.level"
            :options="queryStore.memberLevel"
            dense
            outlined
            emit-value
            map-options
            class="default-input"
          />
        </div>
      </div>
    </template>
  </dialog-comp>

  <!-- 批量編輯彈窗 -->
  <dialog-comp
    v-model="batchEditDialog"
    :configs="dialogConfigs.batchEdit"
    :loading="batchEditLoading"
    max-width="600px"
  >
    <template #mainContent>
      <!-- 異動原因 -->
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">
          {{ t("table_header.modify_reason") }}<span class="required-dot"></span>
        </div>
        <div class="col-12 col-sm-9">
          <q-input v-model="dialogData.batchEdit.reason" type="textarea" class="" outlined />
        </div>
      </div>
      <!-- 異動層級 -->
      <div class="items-baseline q-mb-md" v-if="modifyMemberList && modifyMemberList.length">
        <div class="col-12 col-sm-3 dialog_title2">
          {{ t("common.modify_selected_member") }}<span class="required-dot"></span>
        </div>
        <div class="col-12 col-sm-9">
          <q-select
            v-model="dialogData.batchEdit.selectedEditMember"
            :options="queryStore.memberLevel"
            dense
            outlined
            emit-value
            map-options
            class="default-input"
            :disable="dialogData.batchEdit.batchEditType !== BATCH_EDIT_TYPE.Selection"
          />
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import type { QTableProps } from "quasar"
  import { useQuasar } from "quasar"

  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import type { LANGUAGE_TYPE } from "@/utils/constants"
  import { STATUS, MEMBER_LEVEL } from "@/utils/constants"

  import { getMemberLevelModify, updateMemberLevelModify } from "@/api/member"
  import type { GetMemberLevelModify } from "@/api/request.type"
  import type { MemberLevelLangTitle, MemberLevelModifyItem } from "@/api/response.type"
  import { useQueryStore } from "@/stores/queryStore"
  import { usePermission } from "@/hook/usePermission"
  import { useLanguageStore } from "@/stores/languageStore"
  import { useRfc3339 } from "@/composables/useRfc3339"

  enum BATCH_EDIT_TYPE {
    /** 已選會員異動 */
    Selection = 1,

    /** 上傳異動名單 */
    CustomUpload
  }

  const { t } = useI18n()
  const { enumToArray } = useCommon()

  const queryStore = useQueryStore()
  const { permission } = usePermission()
  const { formatDate } = useRfc3339()

  const languageStore = useLanguageStore()

  onMounted(async () => {
    await queryStore.getMemberLevel()
  })

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    filterShowOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useMemberAccount: true,
    useRecommender: true,
    useMemberLevel: true,
    useMemberTag: true,
    useEnableStatus: true,
    everyColumnsClass: "col-12 col-sm-6 col-md-6 col-lg-2"
  })

  let { search, tableData, totalSize } = useSearch(getMemberLevelModify)
  let catchQueryForm: GetMemberLevelModify

  async function onSubmit(queryForm: GetMemberLevelModify) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "checkbox",
        label: "",
        field: "checkbox",
        sortable: false,
        align: "center"
      },
      {
        name: "member_account",
        label: t("table_header.member_account"),
        field: "member_account",
        sortable: false,
        align: "center"
      },
      {
        name: "recommender",
        label: t("table_header.recommender"),
        field: "recommender",
        sortable: false,
        align: "center"
      },
      {
        name: "level",
        label: t("table_header.distribution_level"),
        field: "level",
        sortable: false,
        align: "center"
      },
      {
        name: "member_level",
        label: t("table_header.member_level"),
        field: "member_level",
        sortable: false,
        align: "center"
      },
      {
        name: "birthday",
        label: t("table_header.birthday"),
        field: "birthday",
        sortable: false,
        align: "center"
      },
      {
        name: "member_tag",
        label: t("table_header.member_tag"),
        field: "member_tag",
        sortable: false,
        align: "center"
      },
      {
        name: "member_status",
        label: t("table_header.enable_or_disable"),
        field: "member_status",
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
    // 如果無編輯權限 就把 action+checkbox 移除
    return permission.value.edit
      ? columns
      : columns.filter((column) => column.name !== "actions" && column.name !== "checkbox")
  })

  const selection = reactive<{
    list: MemberLevelModifyItem[]
  }>({
    list: []
  })

  const isSelectedAll = computed({
    get() {
      return tableData.value.every((tableItem: any) =>
        selection.list.some((selectionItem) => selectionItem.id === tableItem.id)
      )
    },
    set(value) {
      if (!value) {
        selection.list = []
        return
      }
      selection.list = tableData.value.map((item: MemberLevelModifyItem) => item)
    }
  })

  const {
    dialog: batchEditDialog,
    openDialog: openBatchEditDialog,
    closeDialog: closeBatchEditDialog,
    loading: batchEditLoading,
    openLoading: openBatchEditLoading,
    closeLoading: closeBatchEditLoading
  } = useDialog()

  const dialogConfigs = reactive<{ batchEdit: IDialogConfig; singleEdit: IDialogConfig }>({
    batchEdit: {
      dialogLabelI18nKey: "btn.batch_edit",
      type: DialogType.EDIT,
      useActions: true,
      showLabelCloseBtn: true,
      submitFunction: handleBatchEdit
    },
    singleEdit: {
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleSingleEdit
    }
  })

  const dialogData = reactive<{
    batchEdit: {
      id: number
      reason: string
      batchEditType: BATCH_EDIT_TYPE
      selectedEditMember: string | number
      files: any[]
      uploadList: { memberAccount: string; status: boolean; direction: string }[]
    }
    singleEdit: {
      id: number
      account: string
      reason: string
      originLevel: number
      level: number
    }
  }>({
    batchEdit: {
      id: 0,
      reason: "",
      batchEditType: BATCH_EDIT_TYPE.Selection,
      selectedEditMember: 0,
      files: [],
      uploadList: []
    },
    singleEdit: {
      id: 0,
      account: "",
      reason: "",
      originLevel: 0,
      level: 0
    }
  })

  const modifyMemberList = computed(() => {
    // 不確定清單裡會有什麼，暫無清單
    return [
      {
        label: t("table_header.please_select"),
        value: 0
      }
    ]
  })

  const $q = useQuasar()
  function onBatchEdit() {
    if (!selection.list || !selection.list.length) {
      return
    }

    dialogData.batchEdit.reason = ""
    dialogData.batchEdit.files = []
    dialogData.batchEdit.selectedEditMember = queryStore.memberLevel[0].value
    dialogData.batchEdit.batchEditType = BATCH_EDIT_TYPE.Selection
    dialogData.batchEdit.uploadList = []

    openBatchEditDialog()
  }

  async function handleBatchEdit() {
    if (!dialogData.batchEdit.reason.trim()) {
      $q.notify({
        type: "negative",
        message: t("error_msg.modify_reason_is_required"),
        position: "top",
        timeout: 300
      })
      return
    }

    const ids = selection.list.map((item) => item.id)

    openBatchEditLoading()

    const sendData = {
      member_ids: ids,
      level_id: dialogData.batchEdit.selectedEditMember,
      reason: dialogData.batchEdit.reason
    }

    const { search, status } = useSearch(updateMemberLevelModify)
    await search(sendData)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      closeBatchEditDialog()
      onSubmit(catchQueryForm)
    }
    closeBatchEditLoading()
  }

  const uploadTableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "memberAccount",
      label: t("table_header.member_account"),
      field: "memberAccount",
      sortable: false,
      align: "center"
    },
    {
      name: "status",
      label: t("table_header.check_status"),
      field: "status",
      sortable: false,
      align: "center"
    },
    {
      name: "direction",
      label: t("table_header.direction"),
      field: "direction",
      sortable: false,
      align: "center"
    }
  ])

  const filesStatus = computed(() => {
    return (
      (dialogData.batchEdit.batchEditType === BATCH_EDIT_TYPE.CustomUpload &&
        dialogData.batchEdit.uploadList.every((item) => item.status)) ||
      dialogData.batchEdit.batchEditType !== BATCH_EDIT_TYPE.CustomUpload
    )
  })

  function filesChange() {
    // 暫時寫死，之後改為從xlsx檔案裡提取資料
    dialogData.batchEdit.uploadList = [
      {
        memberAccount: "Jack001",
        status: true,
        direction: ""
      },
      {
        memberAccount: "Jack002",
        status: false,
        direction: "查無此會員"
      },
      {
        memberAccount: "Jack003",
        status: true,
        direction: ""
      }
    ]
  }

  const {
    dialog: singleEditDialog,
    openDialog: openSingleEditDialog,
    closeDialog: closeSingleEditDialog,
    loading: singleEditLoading,
    openLoading: openSingleEditLoading,
    closeLoading: closeSingleEditLoading
  } = useDialog()

  const levelList = computed(() =>
    enumToArray(MEMBER_LEVEL.Enums).map((item) => ({
      label: MEMBER_LEVEL.I18nKeys[MEMBER_LEVEL.Enums[item as keyof typeof MEMBER_LEVEL.Enums]]
        ? t(MEMBER_LEVEL.I18nKeys[MEMBER_LEVEL.Enums[item as keyof typeof MEMBER_LEVEL.Enums]])
        : t("common.unknow"),
      value: MEMBER_LEVEL.Enums[item as keyof typeof MEMBER_LEVEL.Enums]
    }))
  )

  const onSingleEdit = (row: MemberLevelModifyItem) => {
    dialogData.singleEdit.id = row.id
    dialogData.singleEdit.account = row.member_account
    dialogData.singleEdit.originLevel = row.member_level
    dialogData.singleEdit.level = row.member_level_id
    dialogData.singleEdit.reason = ""
    openSingleEditDialog()
  }

  async function handleSingleEdit() {
    if (!dialogData.singleEdit.reason.trim()) {
      $q.notify({
        type: "negative",
        message: t("error_msg.modify_reason_is_required"),
        position: "top",
        timeout: 300
      })
      return
    }

    openSingleEditLoading()

    const sendData = {
      member_ids: [dialogData.singleEdit.id],
      level_id: dialogData.singleEdit.level,
      reason: dialogData.singleEdit.reason
    }

    const { search, status } = useSearch(updateMemberLevelModify)
    await search(sendData)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      closeSingleEditDialog()
      onSubmit(catchQueryForm)
    }

    closeSingleEditLoading()
  }

  function getDynamicLangValue(data: MemberLevelLangTitle): string {
    if (!data || typeof data !== "object") {
      console.error("Invalid data format:", data) // Log error
      return ""
    }

    const nowLang = languageStore.currentLanguageOption.backendKey as LANGUAGE_TYPE.Enums
    if (nowLang in data) {
      return data[nowLang]
    } else {
      for (const key in data) {
        return data[key as LANGUAGE_TYPE.Enums]
      }
    }
    return "N/A" // Default value if no valid key found
  }
</script>

<style lang="scss" scoped>
  :deep(.fileSelector) {
    .q-field__control {
      height: 2.5rem;
    }
  }
</style>
