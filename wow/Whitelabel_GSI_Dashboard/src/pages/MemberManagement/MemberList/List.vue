<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-select
            v-model="currentCurrency"
            :options="queryStore.currencyList"
            outlined
            dense
            emit-value
            map-options
            class="q-mr-sm currency-select"
            style="min-width: 4.6875rem"
            :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
            @update:model-value="handleCurrency"
            :loading="spinShow"
          />
          <q-btn @click="onAdd" v-if="permission.edit" class="btns btn-blue q-mr-sm">
            <q-icon class="q-mr-xs" size="xs" name="add" />
            {{ $t("btn.add") }}
          </q-btn>
          <q-btn
            :label="$t('btn.batch_enable')"
            class="q-mr-sm btns btn-green"
            v-if="permission.edit"
            @click="onBatch(1)"
          />
          <q-btn
            :label="$t('btn.batch_disable')"
            class="q-mr-sm btns btn-pink"
            v-if="permission.edit"
            @click="onBatch(2)"
          />
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
            row-key="id"
            class="table_v2"
          >
            <template v-slot:header="props">
              <table-header-sort
                :columns="props.cols"
                :orderType="orderType"
                :sortType="sortType"
                @sort-update="handleSortClick"
              />
            </template>
            <template #body="props">
              <q-tr>
                <!-- 會員帳號 -->
                <q-td key="account" :props="props">
                  {{ props.row.account }}
                </q-td>

                <!-- 活躍狀態 -->
                <q-td key="active_status" :props="props" v-if="agent_code === 'anip' || agent_code === 'fp1a'">
                  {{ t(ACTIVE_STATUS_TYPE.I18nKeys[props.row.active_status as ACTIVE_STATUS_TYPE.Enums]) }}
                </q-td>
                <!-- 身份 -->
                <q-td key="identity" :props="props">
                  {{
                    props.row.identity === IDENTITY.Enums.MEMBER
                      ? $t("common.member")
                      : props.row.identity === IDENTITY.Enums.AGENT
                        ? $t("common.agent")
                        : "-"
                  }}
                </q-td>

                <!-- 推薦人 -->
                <q-td key="ref_account" :props="props">
                  {{ props.row.ref_account || "-" }}
                </q-td>

                <!-- 會員層級 -->
                <q-td key="member_level" :props="props"> {{ getLevel(props.row.member_level) }} </q-td>

                <!-- 餘額 -->
                <q-td key="balance" :props="props"> {{ getBalance(props.row.wallets) }} </q-td>

                <!-- 額度 -->
                <q-td key="remaining_agent_quota" :props="props">
                  <span
                    v-if="props.row.identity === IDENTITY.Enums.AGENT"
                    style="display: block; color: #2196f3; cursor: pointer"
                    @click="onQuota(props.row)"
                  >
                    {{ getRemainingAgentQuota(props.row.wallets) }}
                  </span>
                  <span v-else>
                    {{ getRemainingAgentQuota(props.row.wallets) }}
                  </span>
                </q-td>

                <!-- 會員標籤 -->
                <q-td key="labels" :props="props">
                  {{ props.row.labels }}
                </q-td>

                <!-- 註冊方式 -->
                <q-td key="register_method" :props="props">
                  <div
                    v-if="
                      [REGISTER_METHOD.Enums.Telegram, REGISTER_METHOD.Enums.Google].includes(props.row.register_method)
                    "
                    class="row items-center justify-center no-wrap register-method-badge"
                  >
                    <template v-if="props.row.register_method === REGISTER_METHOD.Enums.Telegram">
                      <img src="~assets/svg/telegram.svg" width="18" height="18" class="q-mr-xs" />
                      <span>Telegram</span>
                    </template>
                    <template v-else-if="props.row.register_method === REGISTER_METHOD.Enums.Google">
                      <img src="~assets/svg/google.svg" width="18" height="18" class="q-mr-xs" />
                      <span>Google</span>
                    </template>
                    <template v-else>
                      <span></span>
                    </template>
                  </div>
                  <span v-else>-</span>
                </q-td>

                <!-- 遊戲場地 -->
                <q-td key="gaming_site" :props="props" v-if="agent_code === 'anip' || agent_code === 'fp1a'">
                  {{ getGameSite(props.row.gaming_site) }}
                </q-td>
                <!-- 排除會員標籤 -->
                <q-td key="self_exclusion_status" :props="props" v-if="agent_code === 'anip' || agent_code === 'fp1a'">
                  {{
                    props.row.self_exclusion_status === "Active" ? $t("common.self_active") : $t("common.self_excluded")
                  }}
                </q-td>
                <!-- 最後登入 -->
                <q-td key="last_login" :props="props">
                  {{ props.row.last_login ? genTimeFormat(props.row.last_login) : "-" }}
                </q-td>

                <!-- 註冊時間 -->
                <q-td key="created_at" :props="props">
                  {{ props.row.created_at ? genTimeFormat(props.row.created_at) : "-" }}
                </q-td>
                <!-- 啟/停用 -->
                <q-td key="enabled" :props="props">
                  <q-toggle
                    v-model="props.row.enabled"
                    class="toggle"
                    color="blue"
                    size="lg"
                    :false-value="false"
                    :true-value="true"
                    keep-color
                    :disable="!permission.edit"
                    @update:model-value="updateStatus(props.row)"
                  />
                </q-td>

                <!-- 帳號凍結 -->
                <q-td key="block" :props="props">
                  <q-toggle
                    v-model="props.row.block"
                    class="toggle"
                    color="blue"
                    size="lg"
                    :false-value="false"
                    :true-value="true"
                    keep-color
                    :disable="true"
                  />
                </q-td>

                <!-- 編輯 -->
                <q-td key="actions" :props="props">
                  <q-btn
                    flat
                    fab-mini
                    icon="edit"
                    class="edit_pen"
                    @click="onAction(props.row)"
                    :disable="!permission.edit"
                  >
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
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

  <!-- 批次彈窗 -->
  <dialog-comp v-model="batchDialog" :configs="dialogConfigs.remove" :loading="batchLoading">
    <template #mainContent>
      <div v-if="dialogData.batch.type === 1">{{ $t("table_header.batch_member_enable_state") }}</div>
      <div v-else>{{ $t("table_header.batch_member_disabled_state") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, computed, onMounted, watch, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import type { QTableProps } from "quasar"
  import { useQuasar, Notify } from "quasar"
  import { useRouter, useRoute } from "vue-router"
  import { injectStrict } from "@/utils/injectTyped"
  import { EventBusKey } from "@/symbols"

  import { ERROR_CODE, ACTIVE_STATUS_TYPE, IDENTITY, REGISTER_METHOD } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { getMemberList, batchMemberState, updateMemberState, getMemberListExport } from "@/api/member"
  import { getExportExcel } from "@/api/common"

  import type { GetMemberList } from "@/api/request.type"
  import type { MemberItem } from "@/api/response.type"
  import { useQueryStore } from "@/stores/queryStore"
  import { useLanguageStore } from "@/stores/languageStore"
  import { usePermission } from "@/hook/usePermission"
  import { useEnv } from "src/hook/useEnv"
  import { useCurrencyStore } from "src/stores/currencyStore"

  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { useSiteStore } from "@/stores/siteStore"
  import { useTableSort } from "@/hook/useTableSort"
  import TableHeaderSort from "@/components/tables/TableHeaderSort.vue"
  import { useExport } from "@/hook/useExport"

  const $q = useQuasar()
  const eventbus = injectStrict(EventBusKey)
  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()
  const currencyStore = useCurrencyStore()
  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleBatch
    }
  })
  const dialogData = reactive<{
    batch: {
      type?: number
    }
  }>({
    batch: { type: 0 }
  })
  const {
    dialog: batchDialog,
    openDialog: openBatchDialog,
    closeDialog: closeBatchDialog,
    loading: batchLoading,
    openLoading: openBatchLoading,
    closeLoading: closeBatchLoading
  } = useDialog()

  function onBatch(type: number) {
    dialogData.batch.type = type
    openBatchDialog()
  }
  async function handleBatch() {
    openBatchLoading()
    const sendData = {
      enabled: dialogData.batch.type === 1
    }
    const res = await batchMemberState(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
    onSubmit(catchQueryForm)
    closeBatchDialog()
    closeBatchLoading()
  }

  const updateStatus = async (row: { id: number; enabled: boolean }) => {
    let sendData = {
      ids: [row.id],
      enabled: row.enabled
    }

    const res = await updateMemberState(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    } else {
      onSubmit(catchQueryForm)
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }

  interface Wallet {
    currency_id: number
    balance: number
    remaining_agent_quota: number
  }
  const { t } = useI18n()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      filterShowOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useMemberAccount: true,
      useBettingStatus: true,
      useFrozenStatus: true,
      useRecommender: true,
      useExcludeRecommender: true,
      useMemberTag: true,
      useExcludeMemberTag: true,
      useMemberLevel: true,
      useExcludeMemberLevel: true,
      customDateTimeLabelI18nKey: "table_header.registration_time",
      dateTimeIsUnnecessary: true,
      useRegisterMethod: true
    }

    if (agent_code === "anip" || agent_code === "fp1a") {
      baseConfig.useSelfExclusionStatus = true
      baseConfig.useActiveStatus = true
      baseConfig.useGamingSite = true
    }

    if (siteStore.is_bulk_data === 1) {
      baseConfig.submitOnLoaded = false
      baseConfig.dateTimeIsUnnecessary = false
      baseConfig.initialDateRange = 7
    }

    baseConfig.useDatePicker = true
    baseConfig.usePhone = true
    baseConfig.useUid = true
    baseConfig.useIdentity = true
    baseConfig.useEmail = true
    baseConfig.usePayoutIdentity = true

    return baseConfig
  })

  const currentCurrency = ref(0)

  const languageStore = useLanguageStore()
  const { search, tableData, totalSize, spinShow } = useSearch(getMemberList)
  const { genTimeFormat, moneyFormat } = useCommon()
  const siteStore = useSiteStore()
  const { orderType, sortType, handleSort } = useTableSort()
  const agent_code = siteStore.agent_code.toLocaleLowerCase()

  let catchQueryForm: GetMemberList
  async function onSubmit(queryForm: GetMemberList) {
    catchQueryForm = queryForm
    if (!currentCurrency.value) {
      const currency = parseInt(currencyStore.currentCurrency)
      currentCurrency.value = currency !== 0 ? currency : queryStore.currencyList[0].value
    }
    catchQueryForm.currency_id = currentCurrency.value

    catchQueryForm.order_type = orderType.value
    catchQueryForm.sort_type = sortType.value
    await search(catchQueryForm)
  }

  function handleCurrency(currency_id: number) {
    currentCurrency.value = currency_id
    catchQueryForm.currency_id = currency_id
    onSubmit(catchQueryForm)
  }

  function handleSortClick(field: string) {
    if (spinShow.value) return

    handleSort(field)
    onSubmit(catchQueryForm)
  }

  /*
    const catchQueryForms = (params: GetMemberList) => {
      catchQueryForm = params
    }
  */

  const allColumnsMap: Record<string, any> = {
    account: {
      name: "account",
      label: t("table_header.member_account"),
      field: "account",
      sortable: false,
      align: "center"
    },
    active_status: {
      name: "active_status",
      label: t("table_header.active_status"),
      field: "active_status",
      sortable: false,
      align: "center"
    },
    ref_account: {
      name: "ref_account",
      label: t("table_header.recommender"),
      field: "ref_account",
      sortable: false,
      align: "center"
    },
    identity: {
      name: "identity",
      label: t("table_header.identity"),
      field: "identity",
      sortable: false,
      align: "center"
    },
    member_level: {
      name: "member_level",
      label: t("table_header.member_level"),
      field: "member_level",
      sortable: false,
      align: "center"
    },
    balance: {
      name: "balance",
      label: t("common.balance"),
      field: "balance",
      sortable: siteStore.isCredit,
      align: "center"
    },
    remaining_agent_quota: {
      name: "remaining_agent_quota",
      label: t("table_header.quota"),
      field: "remaining_agent_quota",
      sortable: false,
      align: "center"
    },
    labels: { name: "labels", label: t("table_header.member_tag"), field: "labels", sortable: false, align: "center" },
    gaming_site: {
      name: "gaming_site",
      label: t("table_header.game_site"),
      field: "gaming_site",
      sortable: false,
      align: "center"
    },
    self_exclusion_status: {
      name: "self_exclusion_status",
      label: t("query_params.self_exclusion_status"),
      field: "self_exclusion_status",
      sortable: false,
      align: "center"
    },
    register_method: {
      name: "register_method",
      label: t("table_header.third_party_register"),
      field: "register_method",
      sortable: false,
      align: "center"
    },
    last_login: {
      name: "last_login",
      label: t("table_header.last_login_time"),
      field: "last_login",
      sortable: false,
      align: "center"
    },
    created_at: {
      name: "created_at",
      label: t("table_header.registration_time"),
      field: "created_at",
      sortable: false,
      align: "center"
    },
    enabled: {
      name: "enabled",
      label: t("table_header.is_betting"),
      field: "enabled",
      sortable: false,
      align: "center"
    },
    block: { name: "block", label: t("table_header.account_frozen"), field: "block", sortable: false, align: "center" },
    actions: { name: "actions", label: t("table_header.function"), field: "actions", sortable: false, align: "center" }
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const showSpecialColumns = agent_code === "anip" || agent_code === "fp1a"
    const columnOrder = [
      "account",
      ...(showSpecialColumns ? ["active_status"] : []),
      "identity",
      "ref_account",
      "member_level",
      "balance",
      "remaining_agent_quota",
      "labels",
      ...(showSpecialColumns ? ["gaming_site", "self_exclusion_status"] : []),
      "register_method",
      "last_login",
      "created_at",
      "enabled",
      "block",
      ...(permission.value.edit ? ["actions"] : [])
    ]

    return columnOrder.map((name) => allColumnsMap[name]).filter((col) => col !== undefined)
  })

  const router = useRouter()
  const route = useRoute()
  const onAction = (row: MemberItem) => {
    router.push({
      name: "MemberListEdit",
      params: {
        id: row.id
      }
    })
  }

  const onQuota = async (row: MemberItem) => {
    router
      .push({
        name: "AgentQuota"
      })
      .then(() => {
        setTimeout(() => {
          eventbus.emit("handleIncreaseAgentQuota", {
            account: row.account,
            currencyId: currentCurrency.value
          })
        }, 500)
      })
  }

  function onAdd() {
    router.push({
      name: "AddMemberSetting"
    })
  }
  const queryStore = useQueryStore()
  const { permission } = usePermission()

  onMounted(async () => {
    await queryStore.getMemberLevel()
    await queryStore.getCurrencyList()
    await queryStore.getGameSiteDropdown()
  })
  function getLevel(memberLevel: number) {
    for (const item of queryStore.memberLevel) {
      if (item.value === memberLevel) {
        return item.label
      }
    }
    return ""
  }
  function getBalance(wallets: Wallet[]) {
    const format = wallets?.find((item) => item.currency_id === currentCurrency.value)
    return moneyFormat(format?.balance) || ""
  }

  function getRemainingAgentQuota(wallets: Wallet[]) {
    const format = wallets?.find((item) => item.currency_id === currentCurrency.value)
    return moneyFormat(format?.remaining_agent_quota) || ""
  }

  function getGameSite(gameSiteId: number) {
    for (const item of queryStore.gameSiteDropdown) {
      if (item.value === gameSiteId) {
        return t(`member_customize_column.${item.label}`)
      }
    }
    return "-"
  }
  const { getExportPath } = useExport()
  const onExport = async () => {
    const params: GetMemberList = catchQueryForm
    const { search, status, tableData } = useSearch(getMemberListExport)
    await search(params)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }

  watch(
    () => languageStore.currentLanguageOption.backendKey,
    (val) => {
      queryStore.getMemberLevel()
    },
    { immediate: false }
  )
  watch(
    () => currencyStore.currentCurrency,
    (newValue) => {
      if (!newValue) {
        return
      }
      currentCurrency.value = newValue
      onSubmit(catchQueryForm)
    }
  )
</script>

<style scoped>
  /* ::v-deep(.q-field__control) {
    border-radius: 7px;
  } */
  .register-method-badge {
    background-color: #f0f2f5;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    display: inline-flex;
  }
</style>
