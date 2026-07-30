<template>
  <q-card-section class="quick-amount-section">
    <div class="quick-amount-title">{{ $t("quick_select_amount") }}</div>
    <q-markup-table square separator="cell" flat bordered class="quick-amount-table">
      <thead>
        <tr>
          <th>{{ $t("table_header.order") }}</th>
          <th>{{ $t("table_header.amount") }}</th>
          <th>{{ $t("table_header.function") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="row.id">
          <td class="order-cell">
            <q-input
              :model-value="rowIndex + 1"
              dense
              outlined
              readonly
              class="order-input"
              input-class="text-center"
            />
          </td>
          <td class="amount-cell">
            <q-number
              :model-value="row.amount"
              :options="quickAmountOptions"
              dense
              square
              borderless
              class="amount-input"
              input-class="text-center"
              placeholder=""
              :readonly="!props.editable"
              @update:model-value="(value) => updateAmount(row.id, value)"
            />
          </td>
          <td class="function-cell">
            <q-btn
              flat
              dense
              no-caps
              color="negative"
              :class="{ 'readonly-action': !props.editable }"
              :label="$t('common.delete')"
              :aria-disabled="!props.editable"
              @click="openDeleteQuickAmountDialog(row.id)"
            />
          </td>
        </tr>
        <tr v-if="canAddQuickAmount">
          <td colspan="3" class="add-cell">
            <q-btn
              flat
              dense
              round
              color="primary"
              icon="add"
              :class="{ 'readonly-action': !props.editable }"
              :aria-disabled="!props.editable"
              @click="addQuickAmountRow"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <dialog-comp v-model="deleteDialog" :configs="deleteDialogConfig" width="360px">
      <template #customerContent>
        <div class="delete-dialog-content">
          <q-avatar color="negative" text-color="white" size="44px">
            <q-icon name="priority_high" size="28px" />
          </q-avatar>
          <div class="delete-dialog-message">{{ $t("message.confirm_delete") }}</div>
        </div>
      </template>
    </dialog-comp>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, watch } from "vue"
  import DialogComp from "@/components/dialogs/index.vue"
  import { DialogType, type IDialogConfig } from "@/components/dialogs/types"
  import { useDialog } from "@/hook/useDialog"
  import { normalizeQuickAmount, normalizeQuickAmounts, type QuickAmountValue } from "./quickAmount"

  type QuickAmountRow = {
    id: number
    amount: string
  }

  const maxQuickAmountRows = 10
  const props = defineProps<{
    modelValue?: string[]
    editable: boolean
  }>()
  const emit = defineEmits<{
    (event: "update:modelValue", value: string[]): void
  }>()

  const rows = ref<QuickAmountRow[]>([])
  const deletingRowId = ref<number | null>(null)
  const nextRowId = ref(1)
  const quickAmountOptions = {
    min: 0,
    prefill: false,
    precision: 2,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    nullValue: ""
  }
  const deleteDialogConfig = reactive<IDialogConfig>({
    type: DialogType.CONFIRM,
    useActions: true,
    submitFunction: confirmDeleteQuickAmount
  })
  const { dialog: deleteDialog, openDialog: openDeleteDialog, closeDialog: closeDeleteDialog } = useDialog()

  const canAddQuickAmount = computed(() => rows.value.length < maxQuickAmountRows)

  function areQuickAmountsEqual(currentAmounts: string[], nextAmounts: string[]): boolean {
    if (currentAmounts.length !== nextAmounts.length) {
      return false
    }

    return currentAmounts.every((amount, amountIndex) => amount === nextAmounts[amountIndex])
  }

  function getCurrentRowAmounts(): string[] {
    return rows.value.map((row) => normalizeQuickAmount(row.amount)).filter((amount) => amount !== "")
  }

  function createQuickAmountRow(amount: string): QuickAmountRow {
    const row = {
      id: nextRowId.value,
      amount
    }
    nextRowId.value += 1

    return row
  }

  function emitQuickAmounts(): void {
    emit("update:modelValue", normalizeQuickAmounts(rows.value.map((row) => row.amount)))
  }

  function addQuickAmountRow(): void {
    if (!props.editable || !canAddQuickAmount.value) {
      return
    }

    rows.value.push(createQuickAmountRow(""))
    emitQuickAmounts()
  }

  function updateAmount(rowId: number, value: QuickAmountValue): void {
    if (!props.editable) {
      return
    }

    rows.value = rows.value.map((row) => {
      if (row.id !== rowId) {
        return row
      }

      return {
        ...row,
        amount: value === null || value === undefined ? "" : String(value)
      }
    })
    emitQuickAmounts()
  }

  function openDeleteQuickAmountDialog(rowId: number): void {
    if (!props.editable) {
      return
    }

    deletingRowId.value = rowId
    openDeleteDialog()
  }

  function confirmDeleteQuickAmount(): void {
    if (!props.editable) {
      closeDeleteDialog()
      return
    }

    if (deletingRowId.value === null) {
      closeDeleteDialog()
      return
    }

    rows.value = rows.value.filter((row) => row.id !== deletingRowId.value)
    deletingRowId.value = null
    emitQuickAmounts()
    closeDeleteDialog()
  }

  watch(
    () => props.modelValue,
    (modelValue) => {
      const nextAmounts = normalizeQuickAmounts(modelValue || [])
      const currentAmounts = getCurrentRowAmounts()

      if (areQuickAmountsEqual(currentAmounts, nextAmounts)) {
        return
      }

      rows.value = nextAmounts.map(createQuickAmountRow)
    },
    {
      deep: true,
      immediate: true
    }
  )
</script>

<style lang="scss" scoped>
  .quick-amount-section {
    padding-top: 16px;
  }

  .quick-amount-title {
    margin-bottom: 12px;
    font-weight: 500;
  }

  .quick-amount-table {
    width: 100%;
  }

  .quick-amount-table.q-markup-table.q-table__container :deep(.q-table thead tr th) {
    height: 32px !important;
    background: #e3f2ff;
    color: #333;
    font-weight: 500;
    text-align: center;
  }

  .quick-amount-table.q-markup-table.q-table__container :deep(.q-table tbody tr td) {
    height: 28px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
    padding: 2px 8px;
    text-align: center;
  }

  .quick-amount-table.q-markup-table.q-table__container :deep(.q-table tbody tr:hover),
  .quick-amount-table.q-markup-table.q-table__container :deep(.q-table tbody tr:hover td),
  .quick-amount-table.q-markup-table.q-table__container :deep(.q-table tbody td:hover),
  .quick-amount-table.q-markup-table.q-table__container :deep(.q-table thead th:hover) {
    background-color: #fff !important;
    transition: none !important;
  }

  .quick-amount-table.q-markup-table.q-table__container :deep(.q-table thead th:hover) {
    background-color: #e3f2ff !important;
  }

  .quick-amount-table.q-markup-table.q-table__container :deep(.q-btn:hover .q-focus-helper) {
    opacity: 0 !important;
  }

  .order-cell {
    width: 33%;
  }

  .amount-cell {
    width: 33%;
  }

  .function-cell {
    width: 34%;
  }

  .order-input {
    width: 36px;
    margin: 0 auto;
  }

  .quick-amount-table.q-markup-table.q-table__container
    :deep(.order-cell .order-input.q-field--outlined .q-field__control) {
    padding: 0 !important;
  }

  .quick-amount-table.q-markup-table.q-table__container :deep(.order-input.q-field--dense .q-field__control),
  .quick-amount-table.q-markup-table.q-table__container :deep(.order-input.q-field--dense .q-field__marginal) {
    height: 25px !important;
    min-height: 25px !important;
  }

  .amount-input {
    width: 160px;
    margin: 0 auto;
  }

  .quick-amount-table.q-markup-table.q-table__container :deep(.amount-input .q-field__input) {
    text-align: center;
  }

  .quick-amount-table.q-markup-table.q-table__container :deep(.amount-input .q-field__control),
  .quick-amount-table.q-markup-table.q-table__container :deep(.amount-input .q-field__control-container),
  .quick-amount-table.q-markup-table.q-table__container :deep(.amount-input .q-field__native),
  .quick-amount-table.q-markup-table.q-table__container :deep(.amount-input .q-field__input) {
    border-bottom: none !important;
    box-shadow: none !important;
  }

  .quick-amount-table.q-markup-table.q-table__container :deep(.amount-input .q-field__control::before),
  .quick-amount-table.q-markup-table.q-table__container :deep(.amount-input .q-field__control::after) {
    border: none !important;
    border-bottom: none !important;
    box-shadow: none !important;
  }

  .add-cell {
    height: 30px;
  }

  .readonly-action {
    cursor: not-allowed;
  }

  .readonly-action :deep(.q-btn__content) {
    cursor: not-allowed;
  }

  .delete-dialog-content {
    display: flex;
    align-items: center;
    gap: 28px;
    padding: 8px 4px;
  }

  .delete-dialog-message {
    color: #333;
    font-size: 18px;
    font-weight: 500;
  }
</style>
