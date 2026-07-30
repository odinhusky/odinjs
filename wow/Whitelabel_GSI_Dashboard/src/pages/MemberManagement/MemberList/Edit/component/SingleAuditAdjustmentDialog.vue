<template>
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
          <q-btn color="amber-9" class="btns">
            {{ $t("btn.single_adjustment") }}
          </q-btn>
        </div>

        <div class="q-mb-md">
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

        <div v-if="hasLoadedAuditBalance" class="audit-balance-text q-mb-md">
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
            v-model.trim="auditForm.audit_balance"
            outlined
            dense
            inputmode="decimal"
            class="default-input"
            @update:model-value="handleAuditBalanceInput"
          />
        </div>

        <div class="q-mb-md">
          <div class="audit-field-label">{{ $t("table_header.remark") }}</div>
          <q-input v-model.trim="auditForm.remark" outlined dense class="default-input" />
        </div>

        <div v-if="hasLoadedAuditBalance" class="q-mt-md">
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

  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { createAuditAdjustment, getAuditAdjustmentBalance } from "@/api/auditAdjustment"
  import { getMemberQuotaMemberSearch } from "@/api/member"
  import type { CreateAuditAdjustment, CreateAuditAdjustmentItem, GetAuditAdjustmentBalance } from "@/api/request.type"
  import type { AuditAdjustmentBalance } from "@/api/response.type"
  import { useCommon } from "@/hook/useCommon"
  import { useDialog } from "@/hook/useDialog"
  import { useQueryStore } from "@/stores/queryStore"
  import { BONUS_WALLET_TYPE, CURRENCY_TYPE, ERROR_CODE } from "@/utils/constants"

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

  const emit = defineEmits(["submitted"])
  const { t, te } = useI18n()
  const $q = useQuasar()
  const { moneyFormat } = useCommon()
  const queryStore = useQueryStore()

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
      submitFunction: submitSingleAuditAdjustment
    }
  })

  const accountOptions = ref<AccountOption[]>([])
  const currentAuditBalance = ref<string>("0")
  const hasLoadedAuditBalance = ref<boolean>(false)
  const auditForm = reactive<AuditAdjustmentForm>({
    audit_balance: "",
    currency_id: null,
    member_account: "",
    remark: "",
    wallet_type: BONUS_WALLET_TYPE.Enums.GENERALLY
  })

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

  function getCurrencyOptionLabel(option: CurrencyOption | number | string): string {
    if (typeof option === "object" && option !== null) {
      if (typeof option.value === "number") {
        const currencyName = CURRENCY_TYPE.Enums[option.value] as string | undefined
        if (currencyName) {
          return currencyName
        }
      }

      if (option.label) {
        return te(option.label) ? t(option.label) : option.label.replace(/^currency\./, "")
      }

      return option.value === undefined ? "" : String(option.value)
    }

    if (typeof option === "number") {
      const currencyName = CURRENCY_TYPE.Enums[option] as string | undefined
      return currencyName || String(option)
    }

    return option.replace(/^currency\./, "")
  }

  async function openPrefilledAuditAdjustmentDialog(memberAccount: string): Promise<void> {
    resetAuditForm()
    auditForm.member_account = memberAccount
    accountOptions.value = [
      {
        label: memberAccount,
        value: memberAccount
      }
    ]
    await queryStore.getCurrencyList()
    await openAuditDialog()
  }

  defineExpose({
    openPrefilledAuditAdjustmentDialog
  })

  function resetAuditForm(): void {
    auditForm.audit_balance = ""
    auditForm.currency_id = null
    auditForm.member_account = ""
    auditForm.remark = ""
    auditForm.wallet_type = BONUS_WALLET_TYPE.Enums.GENERALLY
    accountOptions.value = []
    currentAuditBalance.value = "0"
    hasLoadedAuditBalance.value = false
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

  function validateSingleForm(): boolean {
    if (!auditForm.currency_id) {
      notifyI18nError("error_msg.please_select_currency")
      return false
    }

    if (auditForm.remark.length > 120) {
      notifyI18nError("remark_exceed_limit")
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
      emit("submitted")
    } finally {
      closeAuditDialogLoading()
    }
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
</style>
