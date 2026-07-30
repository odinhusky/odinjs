<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-between">
          <div>
            <q-btn v-if="permission.edit" class="btns btn-blue" @click="openAuditAdjustmentDialog">
              <q-icon class="q-mr-xs" size="xs" name="edit" />
              {{ $t("member_audit_adjustment") }}
            </q-btn>
          </div>
          <q-btn
            v-if="permission.export"
            class="btns btn-export"
            :disable="exportLoading || !catchQueryForm"
            :loading="exportLoading"
            @click="onExport"
          >
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
            row-key="trans_code"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr>
                <q-td key="member_account" :props="props">
                  {{ props.row.member_account }}
                </q-td>
                <q-td key="wallet_type" :props="props">
                  {{ getWalletTypeLabel(props.row.wallet_type) }}
                </q-td>
                <q-td key="currency_id" :props="props">
                  {{ getCurrencyLabel(props.row.currency_id) }}
                </q-td>
                <q-td key="before_audit_balance" :props="props">
                  {{ moneyFormat(props.row.before_audit_balance, 0) }}
                </q-td>
                <q-td key="after_audit_balance" :props="props">
                  {{ moneyFormat(props.row.after_audit_balance, 0) }}
                </q-td>
                <q-td key="created_at" :props="props">
                  {{ formatDateTime(props.row.created_at) }}
                </q-td>
                <q-td key="operator_account" :props="props">
                  {{ props.row.operator_account }}
                </q-td>
              </q-tr>
            </template>

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

  <dialog-comp
    v-model="auditDialog"
    :configs="dialogConfigs.auditAdjustment"
    :loading="auditDialogLoading"
    width="100%"
    max-width="37.5rem"
  >
    <template #label>
      <div class="q-card__section q-card__section--vert">
        <div class="dialog_title">{{ $t("member_audit_adjustment") }}</div>
      </div>
    </template>

    <template #mainContent>
      <div class="audit-adjustment-dialog">
        <div class="q-mb-md">
          <q-btn
            :outline="auditMode !== AUDIT_ADJUSTMENT_MODE.Single"
            color="amber-9"
            class="btns"
            @click="changeAuditMode(AUDIT_ADJUSTMENT_MODE.Single)"
          >
            {{ $t("btn.single_adjustment") }}
          </q-btn>
          <q-btn
            :outline="auditMode !== AUDIT_ADJUSTMENT_MODE.Batch"
            color="amber-9"
            class="q-ml-md btns"
            @click="changeAuditMode(AUDIT_ADJUSTMENT_MODE.Batch)"
          >
            {{ $t("btn.batch_adjustment") }}
          </q-btn>
        </div>

        <template v-if="auditMode === AUDIT_ADJUSTMENT_MODE.Batch">
          <div class="q-mb-md">
            <div class="audit-field-label">
              {{ $t("btn.please_select_file") }}
              <span class="audit-field-hint">{{ $t("batch_modify_hint") }}</span>
            </div>
            <div class="row no-wrap items-start q-gutter-sm">
              <q-file
                ref="fileInput"
                v-model="memberListFile"
                outlined
                dense
                bottom-slots
                max-files="1"
                accept=".csv,.xls,.xlsx"
                class="default-input col"
                @update:model-value="handleFileUpload"
              >
                <template #append>
                  <q-btn round dense flat icon="add" @click.stop="triggerFileUpload" />
                </template>
              </q-file>
              <q-btn
                icon="cloud_download"
                color="primary"
                class="audit-download-btn"
                :label="$t('edit_form.sample_download')"
                @click="downloadSampleCsv"
              />
            </div>
          </div>

          <div v-if="batchRows.length > 0" class="audit-validate-table q-mb-md">
            <q-table
              square
              hide-pagination
              :rows-per-page-options="[0]"
              :rows="batchRows"
              :columns="batchColumns"
              row-key="rowKey"
              table-header-class="bg-success"
            >
              <template #body="props">
                <q-tr :props="props">
                  <q-td key="account" :props="props">
                    {{ props.row.account }}
                  </q-td>
                  <q-td key="result" :props="props">
                    <q-icon v-if="props.row.result" name="check" color="green" size="20px" />
                    <q-icon v-else name="close" color="red" size="20px" />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </template>

        <div v-if="auditMode === AUDIT_ADJUSTMENT_MODE.Single" class="q-mb-md">
          <div class="audit-field-label">{{ $t("query_params.member_account") }}<span class="required-dot"></span></div>
          <q-select
            v-model="auditForm.member_account"
            :options="accountOptions"
            use-input
            emit-value
            map-options
            hide-selected
            fill-input
            input-debounce="600"
            outlined
            dense
            class="default-input"
            @filter="filterAccount"
            @input-value="handleAccountInput"
            @update:model-value="handleSingleSelectionChange"
          />
        </div>

        <div class="q-mb-md">
          <div class="audit-field-label">{{ $t("common.currency") }}<span class="required-dot"></span></div>
          <q-select
            v-model="auditForm.currency_id"
            :options="queryStore.currencyList"
            emit-value
            map-options
            outlined
            dense
            class="default-input"
            :option-label="getCurrencyOptionLabel"
            @update:model-value="handleSingleSelectionChange"
          />
        </div>

        <div class="q-mb-md">
          <div class="audit-field-label">{{ $t("query_params.wallet_type") }}</div>
          <q-select
            v-model="auditForm.wallet_type"
            :options="walletOptions"
            emit-value
            map-options
            outlined
            dense
            class="default-input"
            @update:model-value="handleSingleSelectionChange"
          />
        </div>

        <div
          v-if="auditMode === AUDIT_ADJUSTMENT_MODE.Single && hasLoadedAuditBalance"
          class="audit-balance-text q-mb-md"
        >
          {{ remainingAuditBalanceLabel }} : {{ remainingAuditBalanceDisplay }}
        </div>

        <div class="q-mb-md">
          <div class="row items-center audit-field-label">
            <span>{{ $t("adjust_audit_balance") }}</span>
            <span class="audit-field-hint q-ml-sm">{{ $t("audit_leave_blank_hint") }}</span>
            <q-icon name="info" color="black" size="16px" class="q-ml-xs cursor-pointer">
              <q-tooltip anchor="center right" self="center left" class="bg-grey-3 text-body2 text-black shadow-4">
                <div class="audit-tooltip">
                  {{ $t("audit_limit_rule") }}
                </div>
              </q-tooltip>
            </q-icon>
          </div>
          <q-input
            v-if="auditMode === AUDIT_ADJUSTMENT_MODE.Single"
            v-model.trim="auditForm.audit_balance"
            outlined
            dense
            inputmode="decimal"
            class="default-input"
            @update:model-value="handleAuditBalanceInput"
          />
          <q-input v-else outlined dense disable class="default-input audit-disabled-input" />
        </div>

        <div class="q-mb-md">
          <div class="audit-field-label">{{ $t("table_header.remark") }}</div>
          <q-input v-model.trim="auditForm.remark" outlined dense class="default-input" />
        </div>

        <div v-if="auditMode === AUDIT_ADJUSTMENT_MODE.Single && hasLoadedAuditBalance" class="q-mt-md">
          <div class="q-pb-sm">{{ $t("btn.modify_detail") }}</div>
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="singleDetailRows"
            :columns="singleDetailColumns"
            row-key="item"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr :props="props">
                <q-td key="item" :props="props">
                  {{ props.row.item }}
                </q-td>
                <q-td key="before_amount" :props="props">
                  {{ props.row.before_amount }}
                </q-td>
                <q-td key="after_amount" :props="props">
                  {{ props.row.after_amount }}
                </q-td>
              </q-tr>
            </template>
            <template #bottom-row="props">
              <q-tr :props="props">
                <q-td>{{ $t("common.total") }}</q-td>
                <q-td>{{ singleDetailRows[0].before_amount }}</q-td>
                <q-td>{{ singleDetailRows[0].after_amount }}</q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import type { QTableProps } from "quasar"
  import Papa from "papaparse"
  import * as XLSX from "xlsx"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import DialogComp from "@/components/dialogs/index.vue"
  import query from "@/components/query/common.vue"
  import {
    createAuditAdjustment,
    getAuditAdjustmentBalance,
    getAuditAdjustmentRecords,
    getAuditAdjustmentRecordsExport,
    validateAuditAdjustment
  } from "@/api/auditAdjustment"
  import { getMemberQuotaMemberSearch } from "@/api/member"
  import type {
    CreateAuditAdjustment,
    CreateAuditAdjustmentItem,
    GetAuditAdjustmentBalance,
    GetAuditAdjustmentRecords,
    GetAuditAdjustmentRecordsExport
  } from "@/api/request.type"
  import type { AuditAdjustmentBalance } from "@/api/response.type"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { useCommon } from "@/hook/useCommon"
  import { useDialog } from "@/hook/useDialog"
  import { useExport } from "@/hook/useExport"
  import { usePermission } from "@/hook/usePermission"
  import { useRfc3339 } from "@/composables/useRfc3339"
  import { useSearch } from "@/hook/useSearch"
  import { useQueryStore } from "@/stores/queryStore"
  import { BONUS_WALLET_TYPE, CURRENCY_TYPE, ERROR_CODE } from "@/utils/constants"

  const AUDIT_ADJUSTMENT_MODE = {
    Single: "single",
    Batch: "batch"
  } as const

  type AuditAdjustmentMode = (typeof AUDIT_ADJUSTMENT_MODE)[keyof typeof AUDIT_ADJUSTMENT_MODE]

  type AccountOption = {
    label: string
    value: string
  }

  type CurrencyOption = {
    label?: string
    value?: CURRENCY_TYPE.Enums
  }

  type WalletOption = {
    label: string
    value: BONUS_WALLET_TYPE.Enums
  }

  type AuditAdjustmentForm = {
    audit_balance: string
    currency_id: CURRENCY_TYPE.Enums | null
    member_account: string
    remark: string
    wallet_type: BONUS_WALLET_TYPE.Enums
  }

  type ParsedBatchRow = {
    account: string
    audit_balance: string
    rowKey: string
  }

  type ValidatedBatchRow = ParsedBatchRow & {
    result: boolean
  }

  type RawImportRow = Record<string, unknown>

  const { t } = useI18n()
  const $q = useQuasar()
  const { moneyFormat } = useCommon()
  const { formatDateTime } = useRfc3339()
  const { getExportPath } = useExport()
  const queryStore = useQueryStore()
  const { permission } = usePermission()
  const BATCH_MEMBER_LIMIT = 500

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    filterShowOnLoaded: true,
    usePagination: true,
    useMemberAccount: true,
    useWalletType: true,
    useCurrency: true,
    useDatePicker: true,
    customDateTimeLabelI18nKey: "query_params.modify_time"
  })

  const { search, tableData, totalSize } = useSearch(getAuditAdjustmentRecords)
  const {
    dialog: auditDialog,
    openDialog: openAuditDialog,
    loading: auditDialogLoading,
    openLoading: openAuditDialogLoading,
    closeLoading: closeAuditDialogLoading,
    closeDialog: closeAuditDialog
  } = useDialog()

  const dialogConfigs = reactive<{
    auditAdjustment: IDialogConfig
  }>({
    auditAdjustment: {
      dialogLabelI18nKey: "",
      type: DialogType.ADD,
      useActions: true,
      submitFunction: handleAuditAdjustmentSubmit
    }
  })

  const auditMode = ref<AuditAdjustmentMode>(AUDIT_ADJUSTMENT_MODE.Single)
  const accountOptions = ref<AccountOption[]>([])
  const memberListFile = ref<File | null>(null)
  const fileInput = ref<{ pickFiles: () => void } | null>(null)
  const batchRows = ref<ValidatedBatchRow[]>([])
  const currentAuditBalance = ref<string>("0")
  const hasLoadedAuditBalance = ref<boolean>(false)
  const exportLoading = ref<boolean>(false)
  const auditForm = reactive<AuditAdjustmentForm>({
    audit_balance: "",
    currency_id: null,
    member_account: "",
    remark: "",
    wallet_type: BONUS_WALLET_TYPE.Enums.GENERALLY
  })

  const catchQueryForm = ref<GetAuditAdjustmentRecords | null>(null)

  async function onSubmit(queryForm: GetAuditAdjustmentRecords): Promise<void> {
    catchQueryForm.value = queryForm
    await search(queryForm)
  }

  const walletOptions = computed<WalletOption[]>(() => [
    {
      label: t(BONUS_WALLET_TYPE.I18nKeys[BONUS_WALLET_TYPE.Enums.GENERALLY]),
      value: BONUS_WALLET_TYPE.Enums.GENERALLY
    },
    {
      label: t(BONUS_WALLET_TYPE.I18nKeys[BONUS_WALLET_TYPE.Enums.REWARD]),
      value: BONUS_WALLET_TYPE.Enums.REWARD
    }
  ])

  const remainingAuditBalanceLabel = computed<string>(() => t("remain_audit_balance"))

  const remainingAuditBalanceDisplay = computed<string>(() => moneyFormat(currentAuditBalance.value, 2))

  const singleDetailRows = computed(() => [
    {
      item: t("member_audit_adjustment"),
      before_amount: remainingAuditBalanceDisplay.value,
      after_amount: getAuditBalanceDisplay(auditForm.audit_balance)
    }
  ])

  const singleDetailColumns = computed<QTableProps["columns"]>(() => [
    {
      name: "item",
      label: t("table_header.project"),
      field: "item",
      sortable: false,
      align: "center"
    },
    {
      name: "before_amount",
      label: t("adjust_pre_amount"),
      field: "before_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "after_amount",
      label: t("adjust_next_amount"),
      field: "after_amount",
      sortable: false,
      align: "center"
    }
  ])

  const batchColumns = computed<QTableProps["columns"]>(() => [
    {
      name: "account",
      label: t("table_header.member_account"),
      field: "account",
      sortable: false,
      align: "center"
    },
    {
      name: "result",
      label: t("table_header.comparison_results"),
      field: "result",
      sortable: false,
      align: "center"
    }
  ])

  function getWalletTypeLabel(walletType: BONUS_WALLET_TYPE.Enums | null | undefined): string {
    if (walletType === undefined || walletType === null) {
      return "-"
    }

    const i18nKey = BONUS_WALLET_TYPE.I18nKeys[walletType]
    return i18nKey ? t(i18nKey) : "-"
  }

  function getCurrencyLabel(currencyId: CURRENCY_TYPE.Enums | null | undefined): string {
    if (currencyId === undefined || currencyId === null) {
      return "-"
    }

    const currencyName = CURRENCY_TYPE.Enums[currencyId] as string | undefined
    return currencyName || "-"
  }

  function getCurrencyOptionLabel(option: CurrencyOption | number | string): string {
    if (typeof option === "object" && option !== null && option.label) {
      return t(option.label)
    }

    if (typeof option === "object" && option !== null && option.value) {
      return String(option.value)
    }

    return String(option)
  }

  async function openAuditAdjustmentDialog(): Promise<void> {
    resetAuditForm()
    await queryStore.getCurrencyList()
    await openAuditDialog()
  }

  function resetAuditForm(): void {
    auditMode.value = AUDIT_ADJUSTMENT_MODE.Single
    auditForm.audit_balance = ""
    auditForm.currency_id = null
    auditForm.member_account = ""
    auditForm.remark = ""
    auditForm.wallet_type = BONUS_WALLET_TYPE.Enums.GENERALLY
    accountOptions.value = []
    memberListFile.value = null
    batchRows.value = []
    currentAuditBalance.value = "0"
    hasLoadedAuditBalance.value = false
  }

  function changeAuditMode(mode: AuditAdjustmentMode): void {
    auditMode.value = mode
    auditForm.audit_balance = ""
    memberListFile.value = null
    batchRows.value = []
    currentAuditBalance.value = "0"
    hasLoadedAuditBalance.value = false
  }

  function triggerFileUpload(): void {
    fileInput.value?.pickFiles()
  }

  async function filterAccount(value: string, update: (callback: () => void) => void): Promise<void> {
    const keyword = value.trim()
    if (!keyword) {
      accountOptions.value = []
      return
    }

    update(() => {
      void getMemberOptions(keyword)
    })
  }

  async function getMemberOptions(keyword: string): Promise<void> {
    const { data } = await getMemberQuotaMemberSearch({
      account: `${keyword}%`,
      offset: 0,
      size: 100
    })

    accountOptions.value = Array.isArray(data?.list)
      ? data.list.map((item) => ({
          label: item.account,
          value: item.account
        }))
      : []
  }

  function handleAccountInput(value: string): void {
    const memberAccount = value.trim()
    if (auditForm.member_account === memberAccount) {
      return
    }

    auditForm.member_account = memberAccount
    currentAuditBalance.value = "0"
    hasLoadedAuditBalance.value = false
    void handleSingleSelectionChange()
  }

  async function handleSingleSelectionChange(): Promise<void> {
    if (auditMode.value !== AUDIT_ADJUSTMENT_MODE.Single) {
      return
    }

    await fetchCurrentAuditBalance()
  }

  async function fetchCurrentAuditBalance(): Promise<void> {
    hasLoadedAuditBalance.value = false

    if (!auditForm.member_account || !auditForm.currency_id || !auditForm.wallet_type) {
      currentAuditBalance.value = "0"
      return
    }

    const requestParams: GetAuditAdjustmentBalance = {
      account: auditForm.member_account,
      currency_id: auditForm.currency_id,
      wallet_type: auditForm.wallet_type
    }

    currentAuditBalance.value = "0"
    const response = await getAuditAdjustmentBalance(requestParams)

    if (!isCurrentAuditBalanceRequest(requestParams)) {
      return
    }

    if (response.code !== ERROR_CODE.Enums.SUCCESS) {
      notifyError(response.msg)
      currentAuditBalance.value = "0"
      return
    }

    try {
      currentAuditBalance.value = parseAuditBalance(response.data)
      hasLoadedAuditBalance.value = true
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unsupported audit balance response."
      notifyError(message)
      currentAuditBalance.value = "0"
    }
  }

  function isCurrentAuditBalanceRequest(params: GetAuditAdjustmentBalance): boolean {
    return (
      auditMode.value === AUDIT_ADJUSTMENT_MODE.Single &&
      auditForm.member_account === params.account &&
      auditForm.currency_id === params.currency_id &&
      auditForm.wallet_type === params.wallet_type
    )
  }

  function parseAuditBalance(data: AuditAdjustmentBalance): string {
    if (typeof data === "string" || typeof data === "number") {
      return String(data)
    }

    if (typeof data === "object" && data !== null) {
      const balanceFields = ["audit_balance", "balance", "remaining_audit_balance", "remaining_balance"]
      const foundField = balanceFields.find((field) => {
        const value = data[field]
        return typeof value === "string" || typeof value === "number"
      })

      if (foundField) {
        return String(data[foundField])
      }
    }

    throw new Error(`Unsupported audit balance response: ${JSON.stringify(data)}`)
  }

  function handleAuditBalanceInput(value: string | number | null): void {
    auditForm.audit_balance = normalizeAuditBalanceInput(value)
  }

  function normalizeAuditBalanceInput(value: string | number | null): string {
    const rawValue = value === null ? "" : String(value)
    const numericValue = rawValue.replace(/[^\d.]/g, "")
    const [integerPart, ...decimalParts] = numericValue.split(".")
    const hasDecimalPoint = numericValue.includes(".")
    const integerValue = integerPart || (hasDecimalPoint ? "0" : "")

    if (!hasDecimalPoint) {
      return integerValue
    }

    return `${integerValue}.${decimalParts.join("").slice(0, 2)}`
  }

  function getPayloadAuditBalance(value: string): string {
    return value.endsWith(".") ? value.slice(0, -1) : value
  }

  function getAuditBalanceDisplay(value: string): string {
    const payloadValue = getPayloadAuditBalance(value)
    return payloadValue === "" ? "-" : moneyFormat(payloadValue, 2)
  }

  function isValidAuditBalance(value: string): boolean {
    const payloadValue = getPayloadAuditBalance(value)
    return payloadValue !== "" && /^\d+(\.\d{1,2})?$/.test(payloadValue)
  }

  function notifyError(message: string): void {
    $q.notify({
      type: "negative",
      message,
      position: "top",
      timeout: 2000
    })
  }

  function notifyI18nError(i18nKey: string): void {
    notifyError(t(i18nKey))
  }

  function notifySuccess(i18nKey: string): void {
    $q.notify({
      type: "positive",
      message: t(i18nKey),
      position: "top",
      timeout: 300
    })
  }

  function validateCommonFields(): boolean {
    if (!auditForm.currency_id) {
      notifyI18nError("error_msg.please_select_currency")
      return false
    }

    if (auditForm.remark.length > 120) {
      notifyI18nError("remark_exceed_limit")
      return false
    }

    return true
  }

  function validateSingleForm(): boolean {
    if (!validateCommonFields()) {
      return false
    }

    if (!auditForm.member_account) {
      notifyI18nError("error_msg.please_select_member_account")
      return false
    }

    const payloadAuditBalance = getPayloadAuditBalance(auditForm.audit_balance)
    if (!payloadAuditBalance) {
      notifyI18nError("audit_cannot_empty")
      return false
    }

    if (payloadAuditBalance.length > 10) {
      notifyI18nError("audit_balance_exceed_ten")
      return false
    }

    if (!isValidAuditBalance(payloadAuditBalance)) {
      notifyI18nError("audit_cannot_empty")
      return false
    }

    return true
  }

  function validateBatchForm(): boolean {
    if (!validateCommonFields()) {
      return false
    }

    const validRows = getValidBatchRows()
    if (validRows.length === 0) {
      notifyI18nError("error_msg.please_upload_file")
      return false
    }

    const invalidAmountRow = validRows.find((row) => {
      const payloadAuditBalance = getPayloadAuditBalance(row.audit_balance)
      return !payloadAuditBalance || payloadAuditBalance.length > 10 || !isValidAuditBalance(row.audit_balance)
    })

    if (invalidAmountRow) {
      notifyI18nError(!invalidAmountRow.audit_balance ? "audit_cannot_empty" : "audit_balance_exceed_ten")
      return false
    }

    return true
  }

  async function handleAuditAdjustmentSubmit(): Promise<void> {
    if (auditMode.value === AUDIT_ADJUSTMENT_MODE.Single) {
      await submitSingleAuditAdjustment()
      return
    }

    await submitBatchAuditAdjustment()
  }

  async function submitSingleAuditAdjustment(): Promise<void> {
    if (!validateSingleForm() || !auditForm.currency_id) {
      return
    }

    openAuditDialogLoading()

    try {
      const payload: CreateAuditAdjustment = [buildSingleAuditAdjustmentItem(auditForm.currency_id)]
      const response = await createAuditAdjustment(payload)

      if (response.code !== ERROR_CODE.Enums.SUCCESS) {
        notifyError(response.msg)
        return
      }

      notifySuccess("message.add_success")
      closeAuditDialog()
      if (catchQueryForm.value) {
        await onSubmit(catchQueryForm.value)
      }
    } finally {
      closeAuditDialogLoading()
    }
  }

  async function submitBatchAuditAdjustment(): Promise<void> {
    if (!validateBatchForm() || !auditForm.currency_id) {
      return
    }

    openAuditDialogLoading()

    try {
      const payload = buildBatchAuditAdjustmentItems(getValidBatchRows(), auditForm.currency_id)
      const response = await createAuditAdjustment(payload)

      if (response.code !== ERROR_CODE.Enums.SUCCESS) {
        notifyError(response.msg)
        return
      }

      notifySuccess("message.add_success")
      closeAuditDialog()
      if (catchQueryForm.value) {
        await onSubmit(catchQueryForm.value)
      }
    } finally {
      closeAuditDialogLoading()
    }
  }

  function getValidBatchRows(): ValidatedBatchRow[] {
    return batchRows.value.filter((row) => row.result)
  }

  function buildSingleAuditAdjustmentItem(currencyId: CURRENCY_TYPE.Enums): CreateAuditAdjustmentItem {
    return {
      audit_balance: getPayloadAuditBalance(auditForm.audit_balance),
      currency_id: currencyId,
      member_account: auditForm.member_account,
      remark: auditForm.remark,
      wallet_type: auditForm.wallet_type
    }
  }

  function buildBatchAuditAdjustmentItems(
    rows: ValidatedBatchRow[],
    currencyId: CURRENCY_TYPE.Enums
  ): CreateAuditAdjustment {
    return rows.map((row) => ({
      audit_balance: getPayloadAuditBalance(row.audit_balance),
      currency_id: currencyId,
      member_account: row.account,
      remark: auditForm.remark,
      wallet_type: auditForm.wallet_type
    }))
  }

  async function handleFileUpload(file: File | null): Promise<void> {
    if (!file) {
      batchRows.value = []
      return
    }

    openAuditDialogLoading()

    try {
      const parsedRows = await parseImportFile(file)
      if (parsedRows.length > BATCH_MEMBER_LIMIT) {
        notifyI18nError("people_exceed_max")
        batchRows.value = []
        return
      }

      const response = await validateAuditAdjustment({
        file: buildCsvFile(parsedRows, file.name)
      })

      if (response.code !== ERROR_CODE.Enums.SUCCESS) {
        notifyError(response.msg)
        batchRows.value = parsedRows.map((row) => ({
          ...row,
          result: false
        }))
        return
      }

      const validateResults = Array.isArray(response.data) ? response.data : []
      const resultByAccount = new Map(validateResults.map((item) => [item.account.toLowerCase(), item.result]))
      batchRows.value = parsedRows.map((row) => ({
        ...row,
        result: Boolean(resultByAccount.get(row.account.toLowerCase())) && isValidAuditBalance(row.audit_balance)
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to parse import file."
      notifyError(message)
      batchRows.value = []
    } finally {
      closeAuditDialogLoading()
    }
  }

  async function parseImportFile(file: File): Promise<ParsedBatchRow[]> {
    const extension = file.name.split(".").pop()?.toLowerCase()
    if (extension === "xls" || extension === "xlsx") {
      return parseExcelFile(file)
    }

    return parseCsvFile(file)
  }

  function parseCsvFile(file: File): Promise<ParsedBatchRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse<RawImportRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          resolve(toParsedBatchRows(result.data))
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  async function parseExcelFile(file: File): Promise<ParsedBatchRow[]> {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" })
    const firstSheetName = workbook.SheetNames[0]
    if (!firstSheetName) {
      return []
    }

    const worksheet = workbook.Sheets[firstSheetName]
    const rows = XLSX.utils.sheet_to_json<RawImportRow>(worksheet, { defval: "" })
    return toParsedBatchRows(rows)
  }

  function toParsedBatchRows(rows: RawImportRow[]): ParsedBatchRow[] {
    return rows
      .map((row, index) => {
        const values = Object.values(row)
        const account = getImportFieldValue(row, "account", values[0])
        const amount = getImportFieldValue(row, "amount", values[1])

        return {
          account,
          audit_balance: normalizeAuditBalanceInput(amount),
          rowKey: `${index}-${account}`
        }
      })
      .filter((row) => row.account !== "")
  }

  function getImportFieldValue(row: RawImportRow, fieldName: string, fallbackValue: unknown): string {
    const matchedKey = Object.keys(row).find((key) => key.trim().toLowerCase() === fieldName)
    const value = matchedKey ? row[matchedKey] : fallbackValue
    return value === undefined || value === null ? "" : String(value).trim()
  }

  function buildCsvContent(rows: ParsedBatchRow[]): string {
    return [["account", "amount"], ...rows.map((row) => [row.account, getPayloadAuditBalance(row.audit_balance)])]
      .map((row) => row.map(escapeCsvCell).join(","))
      .join("\n")
  }

  function buildCsvFile(rows: ParsedBatchRow[], sourceFileName: string): File {
    const fileName = sourceFileName.replace(/\.[^.]+$/, "") || "audit_adjustment"
    const content = buildCsvContent(rows)
    return new File([content], `${fileName}.csv`, {
      type: "text/csv;charset=utf-8"
    })
  }

  function escapeCsvCell(value: string): string {
    if (!/[",\n\r]/.test(value)) {
      return value
    }

    return `"${value.replace(/"/g, '""')}"`
  }

  function downloadSampleCsv(): void {
    const content = buildCsvContent([])
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${content}`)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "csvDemo.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function onExport(): Promise<void> {
    if (!catchQueryForm.value) {
      notifyError("Missing audit adjustment query parameters.")
      return
    }

    exportLoading.value = true

    try {
      const response = await getAuditAdjustmentRecordsExport(buildExportParams(catchQueryForm.value))

      if (response.code !== ERROR_CODE.Enums.SUCCESS) {
        notifyError(response.msg)
        return
      }

      if (!response.data?.export_uuid) {
        notifyError("Missing audit adjustment export UUID.")
        return
      }

      await getExportPath(response.data.export_uuid)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to export audit adjustment records."
      notifyError(message)
    } finally {
      exportLoading.value = false
    }
  }

  function buildExportParams(queryForm: GetAuditAdjustmentRecords): GetAuditAdjustmentRecordsExport {
    const exportParams: GetAuditAdjustmentRecordsExport = {
      end: queryForm.end,
      start: queryForm.start
    }

    if (queryForm.memberAccount !== undefined) {
      exportParams.memberAccount = queryForm.memberAccount
    }

    if (queryForm.currency !== undefined) {
      exportParams.currency = queryForm.currency
    }

    if (queryForm.wallet_type !== undefined) {
      exportParams.wallet_type = queryForm.wallet_type
    }

    return exportParams
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "member_account",
      label: t("table_header.member_account"),
      field: "member_account",
      sortable: false,
      align: "center"
    },
    {
      name: "wallet_type",
      label: t("table_header.wallet_type"),
      field: "wallet_type",
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
      name: "before_audit_balance",
      label: t("adjust_pre_amount"),
      field: "before_audit_balance",
      sortable: false,
      align: "center"
    },
    {
      name: "after_audit_balance",
      label: t("adjust_next_amount"),
      field: "after_audit_balance",
      sortable: false,
      align: "center"
    },
    {
      name: "created_at",
      label: t("table_header.modify_time"),
      field: "created_at",
      sortable: false,
      align: "center"
    },
    {
      name: "operator_account",
      label: t("table_header.operator"),
      field: "operator_account",
      sortable: false,
      align: "center"
    }
  ])
</script>

<style lang="scss" scoped>
  .audit-adjustment-dialog {
    color: #1f1f1f;
  }

  .audit-field-label {
    font-weight: 600;
    margin-bottom: 0.375rem;
  }

  .audit-field-hint {
    color: #e53935;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .audit-balance-text {
    font-size: 0.875rem;
  }

  .audit-tooltip {
    max-width: 11rem;
    white-space: normal;
  }

  .audit-validate-table {
    max-height: 12.5rem;
    overflow-y: auto;
    width: 75%;
    margin-left: auto;
    margin-right: auto;
  }

  .audit-download-btn {
    min-width: 5rem;
  }

  .audit-disabled-input {
    :deep(.q-field__control) {
      background: #d8d8d8;
    }
  }
</style>
