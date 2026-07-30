<script setup lang="ts">
interface DatePresetOption {
  key: "today" | "days3" | "days7"
  label: string
}

interface Props {
  selectedDatePreset?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedDatePreset: "today"
})

const datePresetOptions: DatePresetOption[] = [
  { key: "today", label: "當天" },
  { key: "days3", label: "3天" },
  { key: "days7", label: "7天" }
]

const visible = defineModel<boolean>("visible", { default: false })
const dateRange = defineModel<string[]>("dateRange", { default: () => [] })

const emit = defineEmits<{
  close: []
  applyPreset: [key: string]
  confirm: []
}>()

const handleClose = () => {
  visible.value = false
  emit("close")
}
</script>

<template>
  <BaseDialog
    v-model:visible="visible"
    :class-obj="{
      root: 'max-w-[360px] phone:!w-[calc(100%-20px)] phone:!max-h-none phone:!h-auto phone:!rounded-xl',
      body: '!p-4',
      header: '!py-4 !px-4',
      title: '!text-base'
    }"
    @close="handleClose"
  >
    <template #header> 查詢時間 </template>

    <div class="w-full flex flex-col gap-3">
      <div class="flex gap-2 w-full">
        <BasePlainBtn
          v-for="preset in datePresetOptions"
          :key="preset.key"
          :class-obj="{
            button: cx(
              'flex-1 !w-full h-8 px-2 rounded-full text-sm leading-5 font-bold transition-colors',
              'flex items-center justify-center',
              props.selectedDatePreset === preset.key
                ? 'bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)] text-[var(--button-button-title-primary-enabled)]'
                : 'bg-[var(--tab-tab-bg-square-primary-enabled)] text-[var(--text-text-primary)]'
            )
          }"
          @click="emit('applyPreset', preset.key)"
        >
          {{ preset.label }}
        </BasePlainBtn>
      </div>

      <BaseDatePicker
        v-model="dateRange"
        selection-mode="range"
        placeholder="yyyy-mm-dd - yyyy-mm-dd"
        :class-obj="{
          input: '!w-full [&_.p-inputtext]:!h-[38px]'
        }"
      />
    </div>

    <template #footer>
      <BaseBtn theme="primary" size="xl" class="w-full" :class-obj="{ button: 'w-full' }" @click="emit('confirm')">
        確定
      </BaseBtn>
    </template>
  </BaseDialog>
</template>
