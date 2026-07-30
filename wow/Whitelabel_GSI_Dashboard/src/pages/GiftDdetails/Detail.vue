<template>
  <SubPage :action-label-i18n-key="'common.detail'" :custom-back-func="onBackTo" />
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start m-12-t" v-if="permission.edit">
          <q-btn outline color="main-color" @click="onBatch" :loading="batchLoading">
            {{ $t("btn.cancel_all2") }}
          </q-btn>
          <!--<q-btn outline color="main-color" class="q-ml-md" @click="onExport">
            {{ $t("btn.export") }}
            <q-icon class="q-ml-xs" size="xs" name="archive" />
          </q-btn>-->
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
                <!-- 会员账号 -->
                <q-td key="member_account" :props="props">
                  {{ props.row.member_account }}
                </q-td>
                <q-td key="currency_ids" :props="props">
                  <template v-if="props.row.currency_ids.length">
                    <div v-for="(id, index) in props.row.currency_ids" :key="id">
                      {{ getCurrencyLabel(id as CURRENCY_TYPE.Enums) }}
                    </div>
                  </template>
                  <template v-else>-</template>
                </q-td>
                <!-- 派發金額 -->
                <q-td key="amounts" :props="props">
                  <template v-if="props.row.amounts.length">
                    <div v-for="(amt, index) in props.row.amounts" :key="index">
                      {{ moneyFormat(amt) }}
                    </div>
                  </template>
                  <template v-else>-</template>
                </q-td>
                <q-td key="received" :props="props">
                  {{
                    props.row.received?.currency_id !== undefined
                      ? getCurrencyLabel(props.row.received.currency_id as CURRENCY_TYPE.Enums)
                      : "-"
                  }}
                </q-td>
                <q-td key="received" :props="props">
                  {{ moneyFormat(props.row.received.amount) }}
                </q-td>
                <!-- 錢包類型 -->
                <q-td v-if="walletSwitch" key="wallet_type" :props="props">
                  {{
                    props.row.wallet_type
                      ? $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                      : "-"
                  }}
                </q-td>
                <q-td key="status" :props="props">
                  {{
                    $t(GIFT_RECEIVE_STATUS.I18nKeys[props.row.status as GIFT_RECEIVE_STATUS.Enums] || "common.unknow")
                  }}
                </q-td>
                <q-td key="dispatched_at" :props="props">
                  {{ props.row.dispatched_at === "" ? "-" : genTimeFormat(props.row.dispatched_at) }}
                </q-td>
                <q-td key="received_at" :props="props">
                  {{ props.row.received_at === "" ? "-" : genTimeFormat(props.row.received_at) }}
                </q-td>
                <q-td key="expired_at" :props="props">
                  {{ props.row.expired_at === "" ? "-" : genTimeFormat(props.row.expired_at) }}
                </q-td>
                <!-- 功能 -->
                <q-td key="actions" :props="props" v-if="permission.edit">
                  <q-btn
                    flat
                    fab-mini
                    :loading="Loading"
                    :color="props.row.status === GIFT_RECEIVE_STATUS.Enums.unaccalimed ? 'success' : 'grey'"
                    :disable="!(props.row.status === GIFT_RECEIVE_STATUS.Enums.unaccalimed)"
                    @click="onMandatoryDistribution(props.row)"
                  >
                    <q-icon class="q-mr-xs" size="xs" name="cancel" />
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
      </template>
    </query>
  </div>
  <!-- 確認彈窗 -->
  <dialog-comp v-model="batchDialog" :configs="dialogConfigs.batch" :loading="batchLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_cancel") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import type { CustomQTableProps } from "quasar"
  import { useQuasar } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { GIFT_RECEIVE_STATUS, CURRENCY_TYPE, BONUS_WALLET_TYPE, ERROR_CODE } from "@/utils/constants"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import {
    getGiftDetailList,
    updateGiftDetailStatus,
    updateGiftDetailStatusBatch,
    giftDetailExport
  } from "@/api/giftDetail"
  import { getExportExcel } from "@/api/common"
  import type * as Request from "@/api/request.type"
  import SubPage from "layouts/SubPage/Index.vue"
  import { usePermission } from "@/hook/usePermission"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  import { useEnv } from "src/hook/useEnv"
  import { useExport } from "@/hook/useExport"

  const { permission } = usePermission()
  const { walletSwitch } = useWalletBouns()
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const Loading = ref(false)
  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })

  let { search, tableData, totalSize } = useSearch(getGiftDetailList)
  const { genTimeFormat, moneyFormat } = useCommon()

  function getCurrencyLabel(currencyId: CURRENCY_TYPE.Enums) {
    const key = CURRENCY_TYPE.I18nKeys[currencyId]
    if (!key) return "-"
    // Some entries are plain display text (e.g. "AI ADS"), not i18n keys.
    return key.includes(".") ? t(key) : key
  }

  let catchQueryForm: Request.GetGiftDetailList
  let event_id = Number(route.params.id as string)
  const { memberAccount, start, end, dateType, receiveStatus, currency, wallet_type } = route.query

  async function onSubmit(queryForm: Request.GetGiftDetailList) {
    const sendData = {
      memberAccount: memberAccount,
      currency: currency,
      //name: giftName,
      receiveStatus: receiveStatus,
      start: start,
      end: end,
      dateType: dateType,
      event_id: event_id,
      wallet_type: wallet_type
    }
    catchQueryForm = sendData
    await search(catchQueryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "member_account",
        label: t("query_params.member_account"),
        field: "member_account",
        sortable: false,
        align: "center"
      },
      {
        name: "currency_ids",
        label: t("table_header.currency_distribution"),
        field: "currency_ids",
        sortable: false,
        align: "center"
      },
      {
        name: "amounts",
        label: t("table_header.distribution_amount"),
        field: "amounts",
        sortable: false,
        align: "center"
      },
      {
        name: "received",
        label: t("common.get_currency"),
        field: "received",
        sortable: false,
        align: "center"
      },
      {
        name: "received",
        label: t("table_header.claim_amount"),
        field: "received",
        sortable: false,
        align: "center"
      },
      ...(walletSwitch.value
        ? [
            {
              name: "wallet_type",
              label: t("table_header.wallet_type"),
              field: "wallet_type",
              sortable: false,
              align: "center" as const
            }
          ]
        : []),
      {
        name: "status",
        label: t("table_header.status"),
        field: "status",
        sortable: false,
        align: "center"
      },
      {
        name: "dispatched_at",
        label: t("common.distribution_time"),
        field: "dispatched_at",
        sortable: false,
        align: "center"
      },
      {
        name: "received_at",
        label: t("common.collection_time"),
        field: "received_at",
        sortable: false,
        align: "center"
      },
      {
        name: "expired_at",
        label: t("common.overdue_time"),
        field: "expired_at",
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

    // 如果無編輯權限 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  //多筆
  async function handlebatch() {
    try {
      const { search, status } = useSearch(updateGiftDetailStatusBatch)
      await search(event_id)

      if (status.value) {
        $q.notify({
          type: "positive",
          message: t("message.cancellation_successful"),
          position: "top",
          timeout: 300
        })

        onSubmit(catchQueryForm)
      }
      closebatchLoading()
      closebatch()
    } catch {
      $q.notify({
        type: "negative",
        message: t("message.cancellation_failed"),
        position: "top",
        timeout: 300
      })
      closebatchLoading()
    }
  }
  //單筆
  async function onMandatoryDistribution(row: { id: number }) {
    Loading.value = true
    try {
      const { search, status } = useSearch(updateGiftDetailStatus)
      await search(row.id)
      if (status.value) {
        $q.notify({
          type: "positive",
          message: t("message.cancellation_successful"),
          position: "top",
          timeout: 300
        })
        onSubmit(catchQueryForm)
      }
      Loading.value = false
    } catch {
      $q.notify({
        type: "negative",
        message: t("message.cancellation_failed"),
        position: "top",
        timeout: 300
      })
      Loading.value = false
    }
  }
  function onBackTo() {
    router.push({
      name: "GiftDdetailsList"
    })
  }
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    batch: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handlebatch
    }
  })

  const dialogData = reactive<{
    batch: {
      id?: number
    }
  }>({
    batch: { id: 0 }
  })
  const {
    dialog: batchDialog,
    openDialog: openbatchDialog,
    loading: batchLoading,
    openLoading: openbatchLoading,
    closeLoading: closebatchLoading,
    closeDialog: closebatch
  } = useDialog()

  function onBatch() {
    openbatchDialog()
  }
  /*
  const onExport = async () => {
    const sendData = {
      memberAccount: memberAccount,
      currency: currency,
      //name: giftName,
      receiveStatus: receiveStatus,
      start: start,
      end: end,
      dateType: dateType
    }

    const response: any = await giftDetailExport(event_id, sendData)
    if (!response?.status) {
      $q.notify({
        type: "negative",
        message: `${response.msg}${response.code ? " (" + response.code + ")" : ""}`,
        position: "top",
        icon: "warning",
        timeout: 1000
      })
    }
  }*/
  const { getExportPath } = useExport()
  const onExport = async () => {
    const sendData = {
      memberAccount: memberAccount,
      currency: currency,
      //name: giftName,
      receiveStatus: receiveStatus,
      start: start,
      end: end,
      dateType: dateType,
      event_id: event_id
    }
    const { search, status, tableData } = useSearch(giftDetailExport)
    await search(sendData)

    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }
</script>

<style scoped>
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

  ::v-deep(.custom-hide) {
    display: none;
  }
  .m-12-t {
    margin-top: -1rem;
  }
</style>
