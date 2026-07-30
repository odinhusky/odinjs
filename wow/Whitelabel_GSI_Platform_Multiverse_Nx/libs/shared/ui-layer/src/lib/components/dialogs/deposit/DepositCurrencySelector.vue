<script setup lang="ts">
import { getCurrencyFlagSrc } from "@shared-lib/constants/currencyFlagMap"
import { useI18n } from "#imports"

interface CurrencyOption {
  label: string
  value: string
}

interface Props {
  currencyOptions: CurrencyOption[]
  selectedCurrency: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: "change", currency: string): void
}>()
</script>

<template>
  <div v-if="props.currencyOptions.length > 0" :class="cx(FLEX_COL, 'gap-2 deposit-currency-section')">
    <DepositDialogContentTitle>{{ t("member.register.currency") }}</DepositDialogContentTitle>
    <div class="deposit-currency-scroll">
      <div v-for="opt in props.currencyOptions" :key="opt.value" class="deposit-currency-scroll__item">
        <BaseTab
          category="country"
          :active="props.selectedCurrency === opt.value"
          :class-obj="{
            root: 'deposit-currency-tab-root',
            item: 'deposit-currency-tab',
            itemActive: 'deposit-selector-tab--active'
          }"
          @click="
            handleGlobalClick({
              target: `depositCurrencySelect_${opt.value}`,
              payload: opt.value,
              callback: (v) => emit('change', String(v))
            })
          "
        >
          <img
            v-if="getCurrencyFlagSrc(opt.value)"
            :src="getCurrencyFlagSrc(opt.value)"
            :alt="opt.value"
            class="deposit-currency-tab__flag"
          />

          <span>{{ opt.label }}</span>
        </BaseTab>
      </div>
    </div>
  </div>
</template>
