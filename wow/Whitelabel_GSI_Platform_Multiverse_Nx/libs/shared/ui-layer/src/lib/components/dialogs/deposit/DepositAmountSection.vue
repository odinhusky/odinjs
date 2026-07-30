<script setup lang="ts">
import { useI18n } from "#imports"

interface Props {
  amountNumber: number | null
  amount: string
  depositMin: string
  depositMax: string
  amountRangeText: string
  quickAmounts: string[]
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: "update-amount-number", val: number | null): void
  (e: "quick-select", val: string): void
}>()

const getLimitNumber = (value: string): number | null => {
  const amount = Number(String(value || "").replace(/,/g, ""))
  return Number.isFinite(amount) && amount > 0 ? amount : null
}

const formatLimitText = (value: string): string => {
  const amount = getLimitNumber(value)
  if (amount === null) return value

  return amount.toLocaleString("en-US", { maximumFractionDigits: 2 })
}

const normalizeAmountText = (value: string): string => {
  return String(value || "").replace(/,/g, "").trim()
}

const hasAmountRangeError = computed((): boolean => {
  if (props.amountNumber === null) return false

  const minimum = getLimitNumber(props.depositMin)
  const maximum = getLimitNumber(props.depositMax)

  return Boolean(
    (minimum !== null && props.amountNumber < minimum) || (maximum !== null && props.amountNumber > maximum)
  )
})

const amountLimitLabel = computed((): string => {
  return t("member.withdrawal.withdraw_limit", {
    min: formatLimitText(props.depositMin),
    max: formatLimitText(props.depositMax)
  })
})

const amountRangeErrorMessage = computed((): string => {
  if (!hasAmountRangeError.value) return ""

  return amountLimitLabel.value
})
</script>

<template>
  <div :class="cx(FLEX_COL, 'gap-2 deposit-amount-section')">
    <DepositDialogContentTitle>{{ t("collaboration.deposit_amount") }}</DepositDialogContentTitle>
    <BaseNumberInput
      :model-value="props.amountNumber"
      :max-fraction-digits="0"
      :placeholder="amountLimitLabel"
      :invalid="hasAmountRangeError"
      :error-message="amountRangeErrorMessage"
      :class-obj="{ root: 'w-full', input: 'deposit-amount-input' }"
      @input="emit('update-amount-number', $event)"
      @update:model-value="emit('update-amount-number', $event as number | null)"
    />

    <div v-if="props.quickAmounts.length > 0" class="deposit-quick-amounts">
      <BaseBtn
        v-for="qa in props.quickAmounts"
        :key="qa"
        category="number"
        :active="normalizeAmountText(props.amount) === normalizeAmountText(qa)"
        :class-obj="{ button: 'deposit-quick-amount' }"
        @click="
          handleGlobalClick({
            target: `depositQuickAmount_${qa}`,
            payload: qa,
            callback: (v) => emit('quick-select', String(v))
          })
        "
      >
        {{ qa }}
      </BaseBtn>
    </div>
  </div>
</template>
