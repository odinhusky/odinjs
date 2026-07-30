<script setup lang="ts">
interface Props {
  walletOptions?: Array<{ label: string; value: string }>
  walletTypeOptions?: Array<{ label: string; value: number }>
  selectedCurrency?: string
  selectedWalletType?: number
  selectedBetMethod?: number
  selectedDateRange?: string[]
  validBetAmount?: string | number
  winLossAmount?: string | number
  betMethodOptions?: Array<{ label: string; value: number }>
  showWalletTypeFilter?: boolean
  showBetMethodFilter?: boolean
  showBetSummary?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  walletOptions: () => [],
  walletTypeOptions: () => [],
  betMethodOptions: () => [],
  selectedCurrency: "",
  selectedWalletType: 0,
  selectedBetMethod: -1,
  selectedDateRange: () => [],
  validBetAmount: "0",
  winLossAmount: "0",
  showWalletTypeFilter: true,
  showBetMethodFilter: false,
  showBetSummary: false
})

const emit = defineEmits<{
  (e: "update:selectedCurrency", value: string): void
  (e: "update:selectedWalletType", value: number): void
  (e: "update:selectedBetMethod", value: number): void
  (e: "update:selectedDateRange", value: string[] | null): void
  (e: "search"): void
}>()

const filterRangeDates = computed<string[] | null>({
  get: () => {
    if (!Array.isArray(props.selectedDateRange) || props.selectedDateRange.length < 2) return null
    return props.selectedDateRange
  },
  set: (value) => {
    if (value == null) {
      emit("update:selectedDateRange", null)
      return
    }

    if (!Array.isArray(value) || value.length < 2 || !value[0] || !value[1]) return

    emit("update:selectedDateRange", [value[0], value[1]])
  }
})

const shouldShowCurrencyFilter = computed(() => (props.walletOptions?.length || 0) > 0)

const historyFilterSelectClassObj = {
  select:
    "!bg-[var(--input-input-bg-primary-enabled)] [&_.p-select-dropdown]:!bg-transparent [&_.p-select-dropdown]:!border-0 [&_.p-select-dropdown]:!shadow-none [&_.p-select-dropdown]:!w-auto [&_.p-select-dropdown]:!px-0 [&_.p-select-dropdown]:!pr-3 [&_.p-select-label.p-placeholder]:!text-[var(--input-input-placeholder-primary-enabled)]",
  selectLabel: "!pl-4 !pr-1 !py-2",
  dropdown: "!ml-0 !p-0 !bg-transparent !border-0 !shadow-none",
  panel: "[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
}

const totalSectionClass = cx(
  "min-h-7 rounded px-[10px] py-2",
  FLEX_CENTER,
  "gap-2",
  "bg-[var(--tab-tab-bg-square-primary-enabled)]",
  "border border-[var(--tag-tag-border-primary)]"
)

const totalSectionTileClass = cx("text-[var(--card-card-subtitle-primary-enabled)] text-sm leading-5")
const totalSectionAmountClass = cx("text-xl leading-7 font-bold text-[var(--text-text-primary)]")
</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <div :class="cx(FLEX_ITEMS_STRETCH, 'flex-wrap gap-2')">
      <div v-if="shouldShowCurrencyFilter" class="w-[160px] mob:w-full">
        <BaseSelect
          :model-value="props.selectedCurrency"
          label="幣種"
          placeholder="全部"
          :options="props.walletOptions"
          option-label="label"
          option-value="value"
          :class-obj="historyFilterSelectClassObj"
          @update:model-value="emit('update:selectedCurrency', String($event || ''))"
        />
      </div>

      <div v-if="props.showBetMethodFilter" class="w-[160px] mob:w-full">
        <BaseSelect
          :model-value="props.selectedBetMethod"
          label="投注方式"
          placeholder="全部"
          :options="props.betMethodOptions"
          option-label="label"
          option-value="value"
          :class-obj="historyFilterSelectClassObj"
          @update:model-value="emit('update:selectedBetMethod', Number($event ?? -1))"
        />
      </div>

      <div v-if="props.showWalletTypeFilter" class="w-[160px] mob:w-full">
        <BaseSelect
          :model-value="props.selectedWalletType"
          label="錢包類型"
          placeholder="全部"
          :options="props.walletTypeOptions"
          option-label="label"
          option-value="value"
          :class-obj="historyFilterSelectClassObj"
          @update:model-value="emit('update:selectedWalletType', Number($event || 0))"
        />
      </div>

      <div class="w-[285px] mob:w-full">
        <BaseDatePicker
          v-model="filterRangeDates"
          selection-mode="range"
          label="時間區間"
          placeholder="yyyy-mm-dd ~ yyyy-mm-dd"
          :show-clear-button="true"
          clear-label="X"
          :class-obj="{
            root: '!w-full !max-w-none',
            input: '!w-full',
            panelRoot: 'phone:!w-full'
          }"
        />
      </div>

      <div :class="cx('w-[100px] mob:w-full', FLEX_ITEMS_END)">
        <BaseBtn class="flex w-full" theme="secondary" size="lg" @click="emit('search')"> 搜尋 </BaseBtn>
      </div>
    </div>

    <div v-if="props.showBetSummary" class="grid grid-cols-2 gap-3 phone:grid-cols-1">
      <div :class="cx(totalSectionClass)">
        <span :class="cx(totalSectionTileClass)">有效投注額</span>
        <span :class="cx(totalSectionAmountClass)">{{ props.validBetAmount }}</span>
      </div>
      <div :class="cx(totalSectionClass)">
        <span :class="cx(totalSectionTileClass)">輸贏</span>
        <span :class="cx(totalSectionAmountClass)">{{ props.winLossAmount }}</span>
      </div>
    </div>
  </div>
</template>
