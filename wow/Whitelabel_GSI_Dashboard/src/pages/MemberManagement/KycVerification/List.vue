<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-space />
          <q-btn @click="onExport" class="q-ml-md btns btn-export">
            <q-icon class="q-mr-xs" size="xs" name="archive" />
            {{ $t("btn.export") }}
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
              <q-td key="created_at" :props="props">
                {{ genTimeFormat(props.row.created_at, "yyyy-MM-dd HH:mm:ss", false) }}
              </q-td>

              <q-td key="member_account" :props="props">
                {{ props.row.member_account }}
              </q-td>
              <q-td key="registered_at" :props="props">
                {{ genTimeFormat(props.row.registered_at, "yyyy-MM-dd HH:mm:ss", false) }}
              </q-td>
              <q-td key="number" :props="props">
                {{ props.row.number }}
              </q-td>
              <q-td key="document_type" :props="props">
                {{ $t(KYC_IDTYPE.I18nKeys[props.row.document_type as KYC_IDTYPE.Enums] || "") }}
              </q-td>
              <q-td key="reviewed_at" :props="props">
                {{ genTimeFormat(props.row.reviewed_at, "yyyy-MM-dd HH:mm:ss", false) }}
              </q-td>
              <q-td key="reviewer" :props="props">
                {{ props.row.reviewer }}
              </q-td>
              <q-td key="internal_note" :props="props">
                {{ props.row.internal_note }}
              </q-td>
              <q-td key="updated_at" :props="props">
                {{ genTimeFormat(props.row.updated_at, "yyyy-MM-dd HH:mm:ss", false) }}
              </q-td>

              <q-td key="status" :props="props">
                {{ $t(PROCESS_STATUS.kycI18nKeys[props.row.status as PROCESS_STATUS.Enums]) || "" }}
              </q-td>

              <!-- 功能 -->
              <q-td key="actions" :props="props">
                <q-btn color="primary" @click="onAction(props.row)">
                  <span>
                    {{ $t("btn.detail")
                    }}<span
                      v-if="props.row.reviewer?.toLowerCase() !== username?.toLowerCase() && props.row.reviewer !== ''"
                      >({{ $t("btn.locked") }})</span
                    >
                  </span>
                </q-btn>
                <!--有權限+狀態是審核中-->

                <q-btn
                  color="green"
                  @click="onUnlock(props.row)"
                  v-if="
                    lockPermission &&
                    props.row.status === PROCESS_STATUS.Enums.PROCESS_STATUS_PROCESSING &&
                    props.row.reviewer !== ''
                  "
                  :loading="isLoading"
                  class="q-ml-sm"
                >
                  {{ $t("common.unlock") }}
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
      <div>{{ $t("table_header.delete_membertag_content") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"
  import { useRouter } from "vue-router"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { PROCESS_STATUS, KYC_IDTYPE, PERMISSION } from "@/utils/constants"
  import { getMemberKycList, kycUnLock, getMemberKycExport } from "@/api/member"

  import type { GetMemberKycList } from "@/api/request.type"
  import type { GetMemberKyc } from "@/api/response.type"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { usePermission } from "@/hook/usePermission"
  import { useExport } from "@/hook/useExport"
  import { usePermissionStore } from "src/stores/permissionStore"

  const { t } = useI18n()
  const router = useRouter()
  const $q = useQuasar()
  const { permission } = usePermission()
  const permissionStore = usePermissionStore()
  const lockPermission = ref(false)
  const username = sessionStorage.getItem("account")
  const isLoading = ref(false)
  const { genTimeFormat } = useCommon()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    filterShowOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useMemberAccount: true,
    useOrderNumber: true,
    useKycIdType: true,
    useKycStatus: true,
    useDatePicker: true,
    customDateTimeLabelI18nKey: "table_header.application_time",
    useDatePicker2: true,
    customDateTimeLabelI18nKey2: "table_header.lock_time",
    dateTimeIsUnnecessary: true
  })

  const { search, tableData, totalSize } = useSearch(getMemberKycList)
  let catchQueryForm: GetMemberKycList

  async function onSubmit(queryForm: GetMemberKycList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "created_at",
        label: t("table_header.application_time"),
        field: "created_at",
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
        name: "registered_at",
        label: t("table_header.registration_time"),
        field: "registered_at",
        sortable: false,
        align: "center"
      },
      {
        name: "number",
        label: t("table_header.order_number"),
        field: "number",
        sortable: false,
        align: "center"
      },
      {
        name: "document_type",
        label: t("table_header.id_type"),
        field: "document_type",
        sortable: false,
        align: "center"
      },
      {
        name: "reviewed_at",
        label: t("table_header.lock_time"),
        field: "reviewed_at",
        sortable: false,
        align: "center"
      },
      {
        name: "reviewer",
        label: t("table_header.locked_account"),
        field: "reviewer",
        sortable: false,
        align: "center"
      },
      {
        name: "internal_note",
        label: t("table_header.remark"),
        field: "internal_note",
        sortable: false,
        align: "center"
      },
      {
        name: "updated_at",
        label: t("table_header.updated_time"),
        field: "updated_at",
        sortable: false,
        align: "center"
      },
      {
        name: "status",
        label: t("table_header.status"),
        field: "status",
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

  async function handleRemove() {
    /*openRemoveLoading()

    const res = await deleteMemberTag(dialogData.remove)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeRemove()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
    closeRemoveLoading()*/
  }

  const { getExportPath } = useExport()
  const onExport = async () => {
    const params: GetMemberKycList = catchQueryForm
    const { search, status, tableData } = useSearch(getMemberKycExport)
    await search(params)
    if (status.value) {
      getExportPath(tableData.value.export_id, true)
    }
  }

  async function onUnlock(row: { number: string }) {
    isLoading.value = true
    const { search, status } = useSearch(kycUnLock)
    await search(row.number)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }
    isLoading.value = false
    /*dialogData.remove.id = row.id
    openRemoveDialog(row.id)*/
  }

  function onAction(row: { number: string }) {
    router.push({
      name: "MemberKycEdit",
      params: {
        id: row.number
      }
    })
  }

  onMounted(async () => {
    const target = Object.values(permissionStore.permission)
      .flat()
      .find((item: any) => item.id === PERMISSION.Enums.A_F_MEMBER_KYC)
    if (target) {
      lockPermission.value = target.unlock
    }
  })
</script>
