<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md">
          <q-btn class="btns btn-green q-mr-sm" @click="handleOpenDialog(1)">
            {{ $t("btn.add_quota") }}
          </q-btn>
          <q-btn class="btns btn-pink" @click="handleOpenDialog(2)">
            {{ $t("btn.remove_quota") }}
          </q-btn>

          <q-space />
          <q-btn @click="onExport" class="btns btn-export">
            <q-icon class="q-mr-xs" size="xs" name="archive" />
            {{ $t("btn.export") }}
          </q-btn>
        </div>
        <div class="table-white-bg">
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
                <q-td key="code" :props="props">
                  {{ props.row.code }}
                </q-td>
                <!--建立時間-->
                <q-td key="created_at" :props="props">
                  {{ format(new Date(props.row.created_at), "yyyy-MM-dd HH:mm:ss") }}
                </q-td>
                <!--帳號-->
                <q-td key="member_account" :props="props">
                  {{ props.row.member_account }}
                </q-td>
                <!--類型-->
                <q-td key="type" :props="props">
                  {{ $t(AGENT_QUOTA_ADJUST_TYPE.I18nKeys[props.row.type as AGENT_QUOTA_ADJUST_TYPE.Enums]) }}
                </q-td>
                <!--幣別-->
                <q-td key="currency_id" :props="props">
                  {{ CURRENCY_TYPE.Enums[props.row.currency_id as CURRENCY_TYPE.Enums] }}
                </q-td>
                <!--金額-->
                <q-td key="amount" :props="props">
                  {{ moneyFormat(props.row.amount) }}
                </q-td>
                <!--建立者-->
                <q-td key="created_by_account" :props="props">
                  {{ props.row.created_by_account }}
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
  <dialog-comp v-model="editDialog" :configs="dialogConfigs.edit" :loading="editLoading">
    <template #mainContent>
      <q-form class="q-gutter-md">
        <!-- 會員帳號 -->
        <div class="items-baseline q-mb-md">
          <div class="col-12 col-sm-3 dialog_title2">
            {{ $t("query_params.account") }}<span class="required-dot"></span>
          </div>
          <div class="col-12 col-sm-12">
            <q-select
              v-model="editData.member_account"
              :options="accountOption"
              use-input
              emit-value
              map-options
              hide-selected
              fill-input
              input-debounce="600"
              @filter="filterAccount"
              @update:model-value="handleGetMemberAgentQuota"
              outlined
              class="default-input"
            />
          </div>
        </div>
        <!-- 幣別 -->
        <div class="items-baseline q-mb-md">
          <div class="col-12 col-sm-3 dialog_title2">{{ $t("common.currency") }}<span class="required-dot"></span></div>
          <div class="col-12 col-sm-12">
            <q-select
              v-if="store.currencyList.length"
              v-model="editData.currency_id"
              :options="store.currencyList"
              emit-value
              map-options
              outlined
              :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
              @update:model-value="handleGetMemberAgentQuota"
              class="default-input"
            />
            <span class="text-info" v-if="memberAgentQuota !== null">{{
              `${$t("table_header.level_quota")}: ${moneyFormat(memberAgentQuota)}`
            }}</span>
          </div>
        </div>
        <div class="items-baseline q-mb-md">
          <div class="col-12 col-sm-3 dialog_title2">
            {{ $t("table_header.amount") }}<span class="required-dot"></span>
          </div>
          <div class="col-12 col-sm-12">
            <q-input v-model.trim="editData.amount" type="number" outlined class="default-input" />
          </div>
        </div>
      </q-form>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted, watch, nextTick } from "vue"
  import { useI18n } from "vue-i18n"
  import type { QTableProps } from "quasar"
  import { useQuasar, Notify } from "quasar"
  import { useRouter, useRoute } from "vue-router"
  import { injectStrict } from "@/utils/injectTyped"
  import { EventBusKey } from "@/symbols"

  import { useRule } from "src/hook/useRule"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "src/hook/useDialog"
  import { useExport } from "@/hook/useExport"

  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import currency from "@/components/query/selects/currency.vue"
  import {
    getMemberAgentQuotaListExport,
    getMemberAgentQuotaList,
    getMemberAgentQuota,
    editMemberAgentQuota,
    getMemberQuotaMemberSearch
  } from "@/api/member"
  import type { GetMemberAgentQuotaItem } from "@/api/response.type"
  import type { GetMemberAgentQuotaList } from "@/api/request.type"
  import { useEnv } from "src/hook/useEnv"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { format } from "date-fns"
  import { useQueryStore } from "@/stores/queryStore"

  import { CURRENCY_TYPE, AGENT_QUOTA_ADJUST_TYPE } from "@/utils/constants"

  interface MemberAgentQuotaResponse {
    data: {
      currency_id: number
      remain_quota_amount: number
    }
  }

  const { t } = useI18n()
  const $q = useQuasar()
  const eventbus = injectStrict(EventBusKey)

  const Rules = useRule()
  let { envData } = useEnv()
  const appMode = envData().VITE_APP_MODE
  const store = useQueryStore()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useAccount: true,
    useAgentQuotaAdjustType: true,
    useCurrency: true,
    useCode: true,
    useDatePicker: true,
    customDateTimeLabelI18nKey: "query_params.date_time_range"
  })

  let { search, tableData, totalSize } = useSearch(getMemberAgentQuotaList)
  const { genTimeFormat, moneyFormat } = useCommon()

  let catchQueryForm: GetMemberAgentQuotaList

  async function onSubmit(queryForm: GetMemberAgentQuotaList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "code",
        label: t("query_params.order_number"),
        field: "code",
        sortable: false,
        align: "center"
      },
      {
        name: "created_at",
        label: t("table_header.created_date"),
        field: "created_at",
        sortable: false,
        align: "center"
      },
      {
        name: "member_account",
        label: t("table_header.account"),
        field: "member_account",
        sortable: false,
        align: "center"
      },
      {
        name: "type",
        label: t("table_header.type"),
        field: "type",
        sortable: false,
        align: "center"
      },
      {
        name: "currency_id",
        label: t("table_header.currency"),
        field: "currency_id",
        sortable: false,
        align: "center"
      },
      {
        name: "amount",
        label: t("table_header.amount"),
        field: "amount",
        sortable: false,
        align: "center"
      },
      {
        name: "created_by_account",
        label: t("table_header.created_by_account"),
        field: "created_by_account",
        sortable: false,
        align: "center"
      }
    ]
    return columns
  })

  // 匯出
  const { getExportPath } = useExport()
  const onExport = async () => {
    const { search, status, tableData } = useSearch(getMemberAgentQuotaListExport)
    await search(catchQueryForm)

    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }

  const memberAgentQuota = ref<number | null>(null)

  // 會員帳號搜尋相關
  const accountOption = ref([])

  const filterAccount = async (val: string, update: Function, abort: Function) => {
    const needle = val.trim().toLowerCase()

    if (needle.length < 1) {
      abort()
      return
    }

    const sendData = {
      type: 1,
      account: needle + "%",
      offset: 0,
      size: 100
    }

    try {
      const { data } = await getMemberQuotaMemberSearch(sendData)

      if (!data || !Object.keys(data).length || !data.list) {
        update(() => {
          accountOption.value = []
        })
        return
      }

      // 使用 Set 來處理 account 可能重複的情況
      const accountSet = new Set<string>()
      const newOptions: { label: string; value: string }[] = []

      data.list.forEach((item: any) => {
        // 只添加未出現過的 account
        if (item.account && !accountSet.has(item.account)) {
          accountSet.add(item.account)
          newOptions.push({
            label: item.account,
            value: item.account
          })
        }
      })

      update(() => {
        accountOption.value = newOptions as never[]
      })
    } catch (error) {
      console.error("Error fetching members:", error)
      abort()
    }
  }

  const handleGetMemberAgentQuota = async () => {
    if (!editData.value.member_account || !editData.value.currency_id) return
    const response = (await getMemberAgentQuota({
      member_account: editData.value.member_account,
      currency_id: editData.value.currency_id as number
    })) as MemberAgentQuotaResponse
    if (response.data.currency_id === 0) {
      memberAgentQuota.value = null
    } else {
      memberAgentQuota.value = response.data.remain_quota_amount
    }
  }

  const editData = ref<{
    type: number
    currency_id: string | number | undefined
    amount: string | number | undefined
    member_account: string
  }>({
    type: 0,
    currency_id: undefined,
    amount: undefined,
    member_account: ""
  })

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    edit: {
      get dialogLabelI18nKey() {
        return `${AGENT_QUOTA_ADJUST_TYPE.I18nKeys[editData.value.type as AGENT_QUOTA_ADJUST_TYPE.Enums]}`
      },
      type: DialogType.EDIT,
      submitFunction: handleSubmit,
      useActions: true,
      showLabelCloseBtn: true
    }
  })

  const {
    dialog: editDialog,
    openDialog: openEditDialog,
    loading: editLoading,
    openLoading: openEditLoading,
    closeLoading: closeEditLoading,
    closeDialog: closeEdit
  } = useDialog()

  const handleOpenDialog = (type: number) => {
    editData.value = {
      type: 0,
      currency_id: undefined,
      amount: undefined,
      member_account: ""
    }
    editData.value.type = type
    memberAgentQuota.value = null
    // 重置選項列表
    accountOption.value.length = 0
    openEditDialog()
  }

  async function handleSubmit() {
    if (!editData.value.member_account) {
      errorMsg("common.please_enter_account")
      return
    } else if (!editData.value.currency_id) {
      errorMsg("error_msg.please_select_currency")
      return
    } else if (!editData.value.amount || Number(editData.value.amount) <= 0) {
      errorMsg("error_msg.the_amount_greater_than_0")
      return
    }
    openEditLoading()
    const sendData = {
      member_account: editData.value.member_account,
      currency_id: editData.value.currency_id as number,
      type: editData.value.type,
      amount: editData.value.amount as number
    }
    const { search, status } = useSearch(editMemberAgentQuota)
    await search(sendData)

    if (status.value) {
      Notify.create({
        type: "positive",
        position: "top",
        message: t("message.success"),
        icon: "check",
        timeout: 1000
      })
      closeEdit()
      await onSubmit({ ...catchQueryForm })
      editData.value = {
        type: 0,
        currency_id: undefined,
        amount: undefined,
        member_account: ""
      }
      memberAgentQuota.value = null
      // 重置選項列表
      accountOption.value.length = 0
    }
    closeEditLoading()
  }

  const handleReset = () => {
    editData.value = {
      type: 0,
      currency_id: undefined,
      amount: undefined,
      member_account: ""
    }
    memberAgentQuota.value = null
    // 重置選項列表
    accountOption.value.length = 0
    closeEdit()
  }
  const errorMsg = (msg: string) => {
    $q.notify({
      type: "negative",
      message: t(msg),
      position: "top",
      timeout: 2000
    })
  }

  onMounted(() => {
    // 增加代理額度
    eventbus.on("handleIncreaseAgentQuota", (data) => {
      editData.value = {
        type: 0,
        currency_id: data.currencyId || undefined,
        amount: undefined,
        member_account: data.account || ""
      }
      editData.value.type = 1
      memberAgentQuota.value = null
      // 重置選項列表
      accountOption.value.length = 0
      openEditDialog()
    })
  })
</script>

<style style="scss" scoped>
  .custom-modal {
    box-shadow: none !important;
    width: 100%;
  }

  .custom-modal .title {
    color: #553b85;
  }

  .custom-modal label {
    color: #505050;
  }

  .one-col-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 24px;
    margin-top: 24px;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    border: 1px solid #c2c2ca;
    border-radius: 6px;
  }

  .custom-label {
    color: black;
  }

  .custom-box-label {
    font-family: Noto Sans TC;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
  }

  .custom-box {
    border: none;
    border-radius: 0px;
    margin-bottom: 4px;
    padding: 2px 8px;
    text-align: left;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 15px;
    border-bottom: 1px solid #c2c2ca;
  }
  .custom-box:last-child {
    border-bottom: none;
  }
  .custom-edit {
    display: inline-block;
    float: right;
    span {
      margin-right: 12px;
    }
  }
  .btn_green {
    color: #26bf94;
  }
  .btn_red {
    color: #ff4343;
  }
  :deep(.q-scrollarea__content) {
    display: grid;
    align-items: start;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  :deep(.required) {
    .q-field__label {
      &::after {
        content: " *";
      }
    }
  }
</style>
