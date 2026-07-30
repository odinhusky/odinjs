<script setup lang="ts">
import {
  BET_RECORD_DATE_TYPE_MODE_OPTIONS,
  type BetRecordDateTypeMode
} from "../../composables/useMembershipManagement/types"

interface Props {
  wagerCode: string
  memberAccount: string
  dateRange: string[] | null
  dateTypeMode: BetRecordDateTypeMode
  isSearching: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "update:wagerCode", value: string): void
  (e: "update:memberAccount", value: string): void
  (e: "update:dateRange", value: string[] | null): void
  (e: "update:dateTypeMode", value: BetRecordDateTypeMode): void
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

const inputClass = cx(
  "w-full rounded-lg px-4 py-2 text-base leading-6",
  "bg-[var(--input-input-bg-primary-enabled)] text-[var(--text-text-primary)]",
  "border-2 border-[var(--input-input-border-primary-enabled)]",
  "placeholder:text-[var(--input-input-placeholder-primary-enabled)]",
  "outline-none focus:border-[var(--input-input-border-primary-focused)]"
)

const labelCls = "text-sm leading-5 text-[var(--text-text-primary)]"

const dateTypeSelectClassObj = {
  select:
    "!bg-[var(--input-input-bg-primary-enabled)] [&_.p-select-dropdown]:!bg-transparent [&_.p-select-dropdown]:!border-0 [&_.p-select-dropdown]:!shadow-none [&_.p-select-dropdown]:!w-auto [&_.p-select-dropdown]:!px-0 [&_.p-select-dropdown]:!pr-3",
  selectLabel: "!pl-4 !pr-1 !py-2",
  dropdown: "!ml-0 !p-0 !bg-transparent !border-0 !shadow-none"
}

const onSearch = () => emit("search")
</script>

<template>
  <!-- PC: 注單編號 / 會員帳號 / 查詢時間（date type + date range） / 搜尋；label 在上 -->
  <div v-if="!isDown.phone" :class="cx(FLEX_ITEMS_END, 'flex-wrap gap-3 w-full')">
    <div class="flex flex-col gap-1 w-[180px]">
      <span :class="labelCls">注單編號</span>
      <input
        :class="inputClass"
        :value="wagerCode"
        placeholder="請輸入..."
        @input="emit('update:wagerCode', ($event.target as HTMLInputElement).value)"
        @keyup.enter="onSearch"
      />
    </div>

    <div class="flex flex-col gap-1 w-[180px]">
      <span :class="labelCls">會員帳號</span>
      <input
        :class="inputClass"
        :value="memberAccount"
        placeholder="請輸入..."
        @input="emit('update:memberAccount', ($event.target as HTMLInputElement).value)"
        @keyup.enter="onSearch"
      />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="labelCls">查詢時間</span>
      <div class="flex gap-2">
        <div class="w-[130px]">
          <BaseSelect
            :model-value="dateTypeMode"
            :options="BET_RECORD_DATE_TYPE_MODE_OPTIONS"
            option-label="label"
            option-value="value"
            :class-obj="dateTypeSelectClassObj"
            @update:model-value="emit('update:dateTypeMode', $event as BetRecordDateTypeMode)"
          />
        </div>
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
    </div>

    <BaseBtn theme="secondary" size="lg" :loading="isSearching" class="shrink-0 w-[100px]" @click="onSearch">
      搜尋
    </BaseBtn>
  </div>

  <!-- H5: 會員帳號 / 帳變類型(對應 wagerCode) / 查詢時間 / 搜尋；label 在上 -->
  <div v-else :class="cx(FLEX_COL, 'w-full gap-4')">
    <div class="flex flex-col gap-1">
      <span :class="labelCls">會員帳號</span>
      <input
        :class="inputClass"
        :value="memberAccount"
        placeholder="請輸入..."
        @input="emit('update:memberAccount', ($event.target as HTMLInputElement).value)"
        @keyup.enter="onSearch"
      />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="labelCls">帳變類型</span>
      <input
        :class="inputClass"
        :value="wagerCode"
        placeholder="請輸入..."
        @input="emit('update:wagerCode', ($event.target as HTMLInputElement).value)"
        @keyup.enter="onSearch"
      />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="labelCls">查詢時間</span>
      <div class="flex gap-2 w-full">
        <div class="w-[89px] shrink-0">
          <BaseSelect
            :model-value="dateTypeMode"
            :options="BET_RECORD_DATE_TYPE_MODE_OPTIONS"
            option-label="label"
            option-value="value"
            :class-obj="dateTypeSelectClassObj"
            @update:model-value="emit('update:dateTypeMode', $event as BetRecordDateTypeMode)"
          />
        </div>
        <div class="flex-1 min-w-0">
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
      </div>
    </div>

    <BaseBtn theme="secondary" size="lg" :loading="isSearching" class="w-full" @click="onSearch">
      搜尋
    </BaseBtn>
  </div>
</template>
