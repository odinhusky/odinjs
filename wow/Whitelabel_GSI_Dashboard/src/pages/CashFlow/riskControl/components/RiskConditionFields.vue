<template>
  <div class="flex flex-col gap-2 py-1">
    <q-select
      :model-value="conditionKeys"
      :options="options"
      multiple
      outlined
      dense
      emit-value
      map-options
      use-chips
      color="main-color"
      class="w-full"
      @update:model-value="onConditionKeysChange"
    >
      <template #option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label class="truncate whitespace-nowrap">{{ scope.opt.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template #selected-item="scope">
        <q-chip
          removable
          dense
          color="main-color"
          text-color="white"
          class="max-w-full"
          @remove="scope.removeAtIndex(scope.index)"
        >
          <span class="truncate whitespace-nowrap">{{ scope.opt.label }}</span>
        </q-chip>
      </template>
    </q-select>

    <div v-if="conditionKeys.includes('is_amount_threshold')" class="flex flex-col gap-1">
      <div class="flex items-center" :class="{ 'risk-field-error': amountInvalid }">
        <div class="mr-2 shrink-0">{{ t("risk_control_settings.withdrawal_amount_than") }}</div>
        <q-input
          :model-value="rules.withdrawal_amount_threshold"
          type="text"
          inputmode="numeric"
          outlined
          dense
          class="w-20"
          @keypress="onlyAllowAmountInput"
          @update:model-value="onAmountThresholdChange"
        />
      </div>
      <div v-if="amountInvalid" class="text-sm text-red-500">
        {{ t("common.validate.mustNotBeEmpty") }}
      </div>
    </div>

    <div v-if="showConditionsError" class="text-sm text-red-500">
      {{ t("common.validate.mustNotBeEmpty") }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from "vue"
  import { useI18n } from "vue-i18n"
  import type { WithdrawRiskGlobalRules } from "@/api/withdrawRisk"
  import {
    isAmountThresholdInvalid,
    onlyAllowAmountInput,
    riskConditionFlagsFromKeys,
    riskConditionKeysFromItem,
    sanitizeAmountInput,
    type RiskConditionKey
  } from "../riskControlForm"

  type RiskConditionOption = {
    label: string
    value: RiskConditionKey
  }

  const props = withDefaults(
    defineProps<{
      rules: WithdrawRiskGlobalRules
      options: RiskConditionOption[]
      showConditionsError?: boolean
    }>(),
    {
      showConditionsError: false
    }
  )

  const emit = defineEmits<{
    "update:rules": [rules: WithdrawRiskGlobalRules]
  }>()

  const { t } = useI18n()

  const conditionKeys = computed(() => riskConditionKeysFromItem(props.rules))
  const amountInvalid = computed(() => isAmountThresholdInvalid(props.rules))

  function onConditionKeysChange(keys: RiskConditionKey[]) {
    emit("update:rules", {
      ...props.rules,
      ...riskConditionFlagsFromKeys(keys)
    })
  }

  function onAmountThresholdChange(value: string | number | null | undefined) {
    emit("update:rules", {
      ...props.rules,
      withdrawal_amount_threshold: sanitizeAmountInput(value)
    })
  }
</script>

<style scoped lang="scss">
  .risk-field-error {
    :deep(.q-field__control) {
      border-color: #c10015;
    }
  }
</style>
