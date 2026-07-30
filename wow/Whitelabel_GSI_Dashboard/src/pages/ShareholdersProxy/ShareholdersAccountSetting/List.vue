<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start q-gutter-xs">
          <q-space />
          <q-btn @click="onExport" class="q-ml-md btns btn-export">
            <q-icon class="q-mr-xs" size="xs" name="archive" />
            {{ $t("btn.export") }}
          </q-btn>
        </div>
        <div class="table-container">
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
                <q-td key="member_account" :props="props">
                  {{ props.row.member_account }}
                </q-td>
                <q-td key="rate" :props="props"> {{ props.row.rate }} / {{ rate_base }} </q-td>
                <q-td key="tier" :props="props">
                  {{ props.row.tier }}
                </q-td>
                <!-- 註冊時間 -->
                <q-td key="registration_time" :props="props">
                  {{ genTimeFormat(props.row.registration_time, "yyyy-MM-dd HH:mm:ss") }}
                </q-td>
                <!-- 明細 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini color="primary" class="q-mr-xs" @click="onAction(props.row)">
                    <q-icon class="q-mr-xs" size="xs" name="edit" />
                  </q-btn>
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
  <!-- 編輯彈窗 -->
  <dialog-comp v-model="EditDialog" :configs="dialogConfigs.edit" :loading="editLoading">
    <template #mainContent>
      <q-form class="q-gutter-md">
        <!-- 會員帳號 -->
        <div class="items-baseline q-mb-md">
          <div class="col-12 col-sm-3 dialog_title2">
            {{ $t("query_params.shareholder_account") }}
          </div>
          <div class="col-12 col-sm-12">
            {{ dialogData.edit.account }}
          </div>
        </div>
        <div class="items-baseline q-mb-md">
          <div class="col-12 col-sm-3 dialog_title2">
            {{ $t("table_header.capped_commission") }}
          </div>
          <div class="col-6 col-sm-6 rate">
            <q-input
              v-model="dialogData.edit.rate"
              outlined
              type="text"
              @keypress="onlyAllowNumbers"
              @blur="handleInput()"
              class="custom-rate-input"
            />
            <span>/ {{ rate_base }}</span>
          </div>
        </div>
      </q-form>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar, Notify } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import {
    getShareholdersAccountSetting,
    updateShareholdersAccountSetting,
    getShareholdersSetting,
    shareholdersAccountExport
  } from "@/api/shareholdersSetting"
  import type { getShareholdersAccountSettings } from "@/api/request.type"
  import { useExport } from "@/hook/useExport"

  const { t, locale } = useI18n()
  const $q = useQuasar()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useShareholderAccount: true,
    customDateTimeLabelI18nKey: "table_header.registration_time",
    useDatePicker: true,
    // useTimePicker: true,
    useShareholderLevel: true,
    inputPlaceholder: "common.numbers_only"
  })
  let { search, tableData, totalSize } = useSearch(getShareholdersAccountSetting)
  const { genTimeFormat, moneyFormat } = useCommon()

  let catchQueryForm: getShareholdersAccountSettings

  async function onSubmit(queryForm: getShareholdersAccountSettings) {
    catchQueryForm = queryForm

    await search(queryForm)
  }
  const rate_base = ref(0)
  onMounted(() => {
    Promise.all([getShareholdersSetting()])
      .then(([Response]) => {
        rate_base.value = Response.data.rate_base
      })
      .catch((e: any) => {
        console.log(e)
      })
  })
  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "member_account",
      label: t("query_params.shareholder_account"),
      field: "member_account",
      sortable: false,
      align: "center"
    },
    {
      name: "rate",
      label: t("table_header.capped_commission"),
      field: "rate",
      sortable: false,
      align: "center"
    },
    {
      name: "tier",
      label: t("table_header.shareholder_level"),
      field: "tier",
      sortable: false,
      align: "center"
    },
    {
      name: "registration_time",
      label: t("table_header.registration_time"),
      field: "registration_time",
      sortable: false,
      align: "center"
    },

    {
      name: "actions",
      label: t("table_header.actions"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])

  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    edit: {
      dialogLabelI18nKey: t("edit_form.edit_shareholder"),
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleEdit,
      showLabelCloseBtn: true
    }
  })
  const dialogData = reactive<{
    edit: {
      member_id: number
      account: string
      rate: number
    }
  }>({
    edit: {
      member_id: 0,
      account: "",
      rate: 0
    }
  })

  const {
    dialog: EditDialog,
    openDialog: openEditDialog,
    closeDialog: closeEditDialog,
    loading: editLoading,
    openLoading: openEditLoading,
    closeLoading: closeEditLoading
  } = useDialog()

  const onAction = (row: { member_id: number; member_account: string; rate: number }) => {
    dialogData.edit.member_id = row.member_id
    dialogData.edit.account = row.member_account
    dialogData.edit.rate = row.rate

    openEditDialog()
  }

  async function handleEdit() {
    openEditLoading()
    const res = await updateShareholdersAccountSetting(dialogData.edit)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeEditDialog()
      closeEditLoading()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }
  function onlyAllowNumbers(e: KeyboardEvent) {
    const char = String.fromCharCode(e.keyCode)
    if (!/[0-9]/.test(char)) {
      e.preventDefault()
    }
  }
  const handleInput = () => {
    if (Number(dialogData.edit.rate) > rate_base.value) {
      dialogData.edit.rate = rate_base.value
    }
  }

  // 匯出
  const { getExportPath } = useExport()
  const onExport = async () => {
    const params: getShareholdersAccountSettings = catchQueryForm
    const { search, status, tableData } = useSearch(shareholdersAccountExport)
    await search(params)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }
</script>

<style lang="scss" scoped>
  // 調整disable樣式
  .drag-container {
    opacity: 1 !important;

    .drag-icon {
      font-size: 30px;
      cursor: pointer !important;
    }
  }

  ::v-deep([disabled]) * {
    cursor: default !important;
  }
  .rate {
    display: flex;
    align-items: center;
    span {
      font-size: 16px;
      margin-left: 5px;
    }
  }
  .custom-rate-input {
    width: 40%;
    ::v-deep(.q-field__control) {
      height: 2.5rem;
    }
  }
</style>
