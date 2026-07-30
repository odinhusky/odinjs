<script setup lang="ts">
interface SwitchOption {
  label: string
  value: string | number
}

interface Props {
  options: SwitchOption[]
  disableValue?: string | number
  label?: string
  dateLabel?: string
  datePlaceholder?: string
  minDate?: Date
}

const props = withDefaults(defineProps<Props>(), {
  disableValue: "disabled",
  label: "停用我的帳戶",
  dateLabel: "停用至",
  datePlaceholder: "請選擇日期",
  minDate: () => new Date()
})

const status = defineModel<string | number>("status", { required: true })
const date = defineModel<string | null>("date", { required: true })

const isDisabled = computed(() => status.value === props.disableValue)
</script>

<template>
  <div class="col-span-2 grid grid-cols-2 gap-3 phone:grid-cols-1">
    <div class="w-full flex flex-col gap-1.5">
      <div class="text-sm leading-5 text-[var(--text-text-primary)]">
        {{ props.label }}
      </div>

      <BaseSelectButton v-model="status" :options="props.options" size="lg" />
    </div>

    <BaseDatePicker
      v-if="isDisabled"
      v-model="date"
      class="w-full"
      :label="props.dateLabel"
      :placeholder="props.datePlaceholder"
      :min-date="props.minDate"
    />
  </div>
</template>
