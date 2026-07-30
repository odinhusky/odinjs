<script setup lang="ts">
interface Props {
  currencyId: number | null
  currencyOptions: { label: string; value: number }[]
  dateRange: string[] | null
  isSearching: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "update:currencyId", value: number | null): void
  (e: "update:dateRange", value: string[] | null): void
  (e: "search"): void
}>()

const { isDown } = useCustomBreakpoints()

const filterRangeDates = computed<string[] | null>({
  get: () => {
    if (!Array.isArray(props.dateRange) || props.dateRange.length < 2) return props.dateRange ?? null
    return props.dateRange
  },
  set: (value) => {
    if (value == null) {
      emit("update:dateRange", null)
      return
    }
    if (!Array.isArray(value) || value.length < 2 || !value[0] || !value[1]) return
    emit("update:dateRange", [value[0], value[1]])
  }
})

const labelCls = "text-sm leading-5 text-[var(--text-text-primary)]"

const baseSelectClassObj = {
  select:
    "!bg-[var(--input-input-bg-primary-enabled)] [&_.p-select-dropdown]:!bg-transparent [&_.p-select-dropdown]:!border-0 [&_.p-select-dropdown]:!shadow-none [&_.p-select-dropdown]:!w-auto [&_.p-select-dropdown]:!px-0 [&_.p-select-dropdown]:!pr-3",
  selectLabel: "!pl-4 !pr-1 !py-2",
  dropdown: "!ml-0 !p-0 !bg-transparent !border-0 !shadow-none"
}

const onSearch = () => emit("search")
</script>

<template>
  <!-- PC: 幣別 / 查詢時間（date range）/ 搜尋；label 在上 -->
  <div v-if="!isDown.phone" :class="cx(FLEX_ITEMS_END, 'flex-wrap gap-3 w-full')">
    <div class="flex flex-col gap-1 w-[240px]">
      <span :class="labelCls">幣別</span>
      <BaseSelect
        :model-value="currencyId"
        :options="currencyOptions"
        option-label="label"
        option-value="value"
        placeholder="請選擇"
        :class-obj="baseSelectClassObj"
        @update:model-value="emit('update:currencyId', $event === null ? null : Number($event))"
      />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="labelCls">查詢時間</span>
      <div class="w-[285px]">
        <BaseDatePicker
          v-model="filterRangeDates"
          selection-mode="range"
          placeholder="yyyy-mm-dd ~ yyyy-mm-dd"
          :show-clear-button="true"
          clear-label="X"
          :class-obj="{
            root: '!w-full !max-w-none',
            input: '!w-full'
          }"
        />
      </div>
    </div>

    <BaseBtn theme="secondary" size="lg" :loading="isSearching" class="shrink-0 w-[100px]" @click="onSearch">
      搜尋
    </BaseBtn>
  </div>

  <!-- H5: Figma 為幣別 / 查詢時間 / 搜尋。 -->
  <div v-else :class="cx(FLEX_COL, 'w-full gap-4')">
    <div class="flex flex-col gap-1">
      <span :class="labelCls">幣別</span>
      <BaseSelect
        :model-value="currencyId"
        :options="currencyOptions"
        option-label="label"
        option-value="value"
        placeholder="請選擇"
        :class-obj="baseSelectClassObj"
        @update:model-value="emit('update:currencyId', $event === null ? null : Number($event))"
      />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="labelCls">查詢時間</span>
      <BaseDatePicker
        v-model="filterRangeDates"
        selection-mode="range"
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

    <BaseBtn theme="secondary" size="lg" :loading="isSearching" class="w-full" @click="onSearch">
      搜尋
    </BaseBtn>
  </div>
</template>
