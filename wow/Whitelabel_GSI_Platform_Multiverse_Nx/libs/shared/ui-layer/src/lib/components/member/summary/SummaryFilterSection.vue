<script setup lang="ts">
interface CurrencyOptionItem {
  label: string
  value: string
  currencyId?: number
}

interface Props {
  selectedDateRange: [string, string]
  onlineTimeText: string
  selectedCurrency: string
  currencyOptions: CurrencyOptionItem[]
  isLoading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  openDateDialog: []
  updateCurrency: [value: string]
}>()
</script>

<template>
  <section class="w-full flex flex-col gap-3">
    <div class="w-full flex items-center justify-between gap-2 phone:flex-col phone:items-stretch">
      <div class="w-[300px] phone:w-full relative">
        <BaseDatePicker
          :model-value="props.selectedDateRange"
          label="查詢時間"
          selection-mode="range"
          placeholder="yyyy-mm-dd - yyyy-mm-dd"
          :class-obj="{
            input:
              '!w-full !bg-[var(--input-input-bg-primary-enabled)] [&_*]:!pointer-events-none [&_.p-inputtext]:!pr-10 [&_.p-inputtext]:!h-[40px]'
          }"
        />

        <BasePlainBtn
          :class-obj="{
            button: 'absolute inset-0 z-20 w-full h-full'
          }"
          @click="emit('openDateDialog')"
        >
          <span class="sr-only">開啟日期區間</span>
        </BasePlainBtn>
      </div>
    </div>

    <div class="w-full flex items-center justify-between gap-2">
      <div class="text-sm leading-none text-[var(--text-text-primary)] self-end">
        當前在線時間：
        <span class="text-[var(--text-text-third)]">{{ props.onlineTimeText }}</span>
      </div>

      <div class="w-[110px] mob:hidden">
        <BaseSelect
          :model-value="props.selectedCurrency"
          :options="props.currencyOptions"
          option-label="label"
          option-value="value"
          :disabled="props.isLoading"
          :class-obj="{
            select: cx(
              '!rounded-full',
              '!bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)]',
              '!border-transparent',
              '[&_.p-select-label]:!font-bold',
              '[&_.p-select-label]:!text-sm',
              '[&_.p-select-label]:!leading-5',
              '!h-[27px]'
            ),
            selectLabel: '!pl-4 !pr-1 !py-1',
            dropdown: '!pr-2 !text-[var(--button-button-title-primary-enabled)]',
            panel: 'max-h-[220px]'
          }"
          @update:model-value="emit('updateCurrency', String($event || ''))"
        />
      </div>
    </div>
  </section>
</template>
