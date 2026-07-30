<template>
  <OnlyTitle backLabelI18nKey="btn.settings" :custom-back-func="onCancel" />
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
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
              <!--  日期 -->
              <q-td key="created_at" :props="props">
                {{ genTimeFormat(props.row.created_at, "yyyy-MM-dd HH:mm:ss") }}
              </q-td>
              <!--  會員帳號 -->
              <q-td key="member_account" :props="props">
                {{ props.row.member_account }}
              </q-td>
              <!--  類別 -->
              <q-td key="reason_type" :props="props">
                <template v-if="props.row.reason_type === 1">
                  {{ $t("common.below_limit") }}
                </template>
                <template v-else>
                  {{ $t("common.above_limit") }}
                </template>
              </q-td>
              <!--  內容 -->
              <q-td key="payload" :props="props">
                <!--  內容 -->
                <q-td key="payload" :props="props">
                  <template v-if="props.row.reason_type === 1">
                    <p
                      v-html="
                      t('common.waring_below_tip', {
                        limit: moneyFormat(props.row.payload.limit_value),
                        currency:  $t(CURRENCY_TYPE.I18nKeys[currency as CURRENCY_TYPE.Enums])
                      })
                    "
                    ></p>
                  </template>
                  <template v-else>
                    <p
                      v-html="
                      t('common.waring_above_tip', {
                        limit: moneyFormat(props.row.payload.limit_value),
                        currency:  $t(CURRENCY_TYPE.I18nKeys[currency as CURRENCY_TYPE.Enums])
                      })
                    "
                    ></p>
                  </template>
                </q-td>
              </q-td>
              <!--  狀態 -->
              <q-td key="status" :props="props">
                {{ $t(WARNING_STATUS.I18nKeys[props.row.status as WARNING_STATUS.Enums]) }}
              </q-td>

              <!-- 功能 -->
              <q-td key="actions" :props="props">
                <template v-if="props.row.status === 1">
                  <q-btn color="green" class="q-mr-xs" @click="onEdit(props.row, 2)">
                    {{ $t("warning_status.success") }}</q-btn
                  >
                  <q-btn color="red" class="q-mr-xs" @click="onEdit(props.row, 3)">
                    {{ $t("warning_status.cancelled") }}</q-btn
                  >
                  <q-btn color="primary" class="q-mr-xs" @click="onAction(props.row)">{{
                    $t("btn.check_the_details")
                  }}</q-btn>
                </template>
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
    <dialog-comp v-model="editDialog" :configs="dialogConfigs.edit" :loading="editLoading" max-width="34.25rem">
      <template #mainContent>
        <div class="custom-image-form">
          <!-- TAB -->
          <div class="custom-image-content">
            <div class="custom-image-row"></div>
          </div>
        </div>
      </template>
    </dialog-comp>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, watch, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useSearch } from "@/hook/useSearch"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getWarningDetail, updateWarningLog, getWariningAlert } from "@/api/warningSetting"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { usePermission } from "@/hook/usePermission"
  import { WARNING_STATUS, CURRENCY_TYPE } from "src/utils/constants"
  import OnlyTitle from "src/layouts/SubPage/OnlyTitle.vue"
  import { useDialog } from "src/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { storeToRefs } from "pinia"
  import { useWarningNotifyStore } from "@/stores/warningNotifyStore"

  import { useCommon } from "@/hook/useCommon"

  const { permission } = usePermission()
  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { genTimeFormat, moneyFormat } = useCommon()
  const { currency } = route.query

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      useMemberAccount: true,
      useWarningType: true,
      useWarningStatus: true,
      useDatePickerSingle: true,
      useTimePicker: true,
      dateTimeIsUnnecessary: true,
      usePagination: true
    }
    return baseConfig
  })

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    let result: CustomQTableProps["columns"] = [
      {
        name: "created_at",
        label: t("table_header.alarm_time"),
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
        name: "reason_type",
        label: t("table_header.alarm_type"),
        field: "reason_type",
        sortable: false,
        align: "center"
      },
      {
        name: "payload",
        label: t("table_header.alarm_content"),
        field: "payload",
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
        label: t("table_header.actions"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]
    return result
  })

  const tableList = ref<Response.GetProductList>([])

  const { search, tableData, totalSize } = useSearch(getWarningDetail)

  let catchQueryForm: Request.getWarningDetail
  let id = Number(route.params.id as string)
  async function onSubmit(queryForm: Request.getWarningDetail) {
    catchQueryForm = queryForm
    catchQueryForm.setting_id = id
    await search(catchQueryForm)
  }

  const dialogConfigs = reactive<{
    edit: IDialogConfig
  }>({
    edit: {
      dialogLabelI18nKey: "btn.entrance_image",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleEdit,
      showLabelCloseBtn: true
    }
  })
  const dialogData = reactive<{
    integration_id: number
  }>({
    integration_id: 0
  })

  const {
    dialog: editDialog,
    openDialog: openEditDialog,
    loading: editLoading,
    openLoading: openEditLoading,
    closeLoading: closeEditLoading,
    closeDialog: closeEdit
  } = useDialog()

  async function onEdit(row: { id: number; setting_id: number }, schedule_status: number) {
    //1:未處理 2:已處理 3: 不處理
    const { search, status } = useSearch(updateWarningLog)
    const payload = {
      id: row.id,
      //setting_id: row.setting_id,
      status: schedule_status
    }
    await search(payload)
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      getNotification()
    }
    //dialogData.product_code = row.product_code
    // openEditDialog()
  }
  const { updateWarningStatue } = useWarningNotifyStore()

  const getNotification = async () => {
    const { search, status, tableData } = useSearch(getWariningAlert)
    await search()
    if (status.value) {
      const result = tableData.value.alert_list
        .filter((item: { is_alert: boolean }) => item.is_alert)
        .map((item: { setting_id: number }) => item.setting_id)
      updateWarningStatue(result)
    }
  }
  async function handleEdit() {
    /*
    const payload: Request.ProductCustomFormV2 = {
      integration_id: dialogData.integration_id,
      product_code: dialogData.product_code,
      game_type: catchQueryForm.game_type,
      game_code: dialogData.code,
      customize: customize
    }

    const { search, status } = useSearch(updateProductCustomize)
    await search(payload)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }
    closeEdit()
    closeEditLoading()*/
  }

  onMounted(async () => {
    // selectedLanguage.value = langOption.value[0].value
  })

  function onCancel() {
    router.push({ name: "AlertSettingsList" })
  }

  function onAction(row: { member_account: string }) {
    router.push({
      name: "MemberList",
      query: {
        memberAccount: row.member_account,
        offset: 0,
        size: 20
      }
    })
  }
</script>

<style lang="scss">
  .q-table .red {
    color: red;
  }
</style>
