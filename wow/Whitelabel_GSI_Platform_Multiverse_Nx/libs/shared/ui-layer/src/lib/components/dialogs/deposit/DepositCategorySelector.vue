<script setup lang="ts">
import { useI18n } from "#imports"
import { CURRENCY_TYPE_ENUMS } from "@shared-lib/constants/enums/currencyType"
import type { DepositCategoryOption } from "../../../composables/useDeposit/depositLifecycle"

interface Props {
  categoryOptions: DepositCategoryOption[]
  selectedCategory: CURRENCY_TYPE_ENUMS | ""
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: "change", category: CURRENCY_TYPE_ENUMS): void
}>()

const categoryIconSrcMap: Record<CURRENCY_TYPE_ENUMS, string> = {
  [CURRENCY_TYPE_ENUMS.FIAT]: new URL("../../../../assets/images/deposit/fiat-method.png", import.meta.url).href,
  [CURRENCY_TYPE_ENUMS.CRYPTO]: new URL("../../../../assets/images/deposit/crypto-method.png", import.meta.url).href
}

const getCategoryIconSrc = (value: CURRENCY_TYPE_ENUMS): string => {
  return categoryIconSrcMap[value]
}
</script>

<template>
  <div v-if="props.categoryOptions.length > 0" :class="cx(FLEX_COL, 'gap-2')">
    <DepositDialogContentTitle>{{ t("dialog_select_method") }}</DepositDialogContentTitle>

    <div class="deposit-method-grid">
      <BaseTab
        v-for="opt in props.categoryOptions"
        :key="opt.value"
        category="square"
        :active="props.selectedCategory === opt.value"
        :class-obj="{ root: 'w-full', item: 'w-full deposit-method-tab', itemActive: 'deposit-selector-tab--active' }"
        @click="
          handleGlobalClick({
            target: `depositCategorySelect_${opt.value}`,
            payload: opt.value,
            callback: (v) => emit('change', Number(v) as CURRENCY_TYPE_ENUMS)
          })
        "
      >
        <div class="deposit-method-icon">
          <img :src="getCategoryIconSrc(opt.value)" :alt="t(opt.labelKey)" class="deposit-method-icon__image" />
        </div>
        <span>{{ t(opt.labelKey) }}</span>
      </BaseTab>
    </div>
  </div>
</template>
