<script setup lang="ts">
interface Props {
  selectedDateRange?: string[]
  selectedStatus?: number
  statusOptions?: Array<{ label: string; value: number }>
}

const props = withDefaults(defineProps<Props>(), {
  selectedDateRange: () => [],
  selectedStatus: -1,
  statusOptions: () => []
})

const emit = defineEmits<{
  (e: "update:selectedDateRange", value: string[] | null): void
  (e: "update:selectedStatus", value: number): void
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

const pendingFilterSelectClassObj = {
  select:
    "!bg-[var(--input-input-bg-primary-enabled)] [&_.p-select-dropdown]:!bg-transparent [&_.p-select-dropdown]:!border-0 [&_.p-select-dropdown]:!shadow-none [&_.p-select-dropdown]:!w-auto [&_.p-select-dropdown]:!px-0 [&_.p-select-dropdown]:!pr-3 [&_.p-select-label.p-placeholder]:!text-[var(--input-input-placeholder-primary-enabled)]",
  selectLabel: "!pl-4 !pr-1 !py-2",
  dropdown: "!ml-0 !p-0 !bg-transparent !border-0 !shadow-none",
  panel: "[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
}
</script>

<template>
  <div :class="cx(FLEX_ITEMS_STRETCH, 'flex-wrap gap-2')">
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

    <div class="w-[160px] mob:w-full">
      <BaseSelect
        :model-value="props.selectedStatus"
        label="狀態"
        placeholder="全部"
        :options="props.statusOptions"
        option-label="label"
        option-value="value"
        :class-obj="pendingFilterSelectClassObj"
        @update:model-value="emit('update:selectedStatus', Number($event ?? -1))"
      />
    </div>

    <div :class="cx('w-[100px] mob:w-full', FLEX_ITEMS_END)">
      <BaseBtn class="flex w-full" theme="secondary" size="lg" @click="emit('search')"> 搜尋 </BaseBtn>
    </div>
  </div>
</template>
