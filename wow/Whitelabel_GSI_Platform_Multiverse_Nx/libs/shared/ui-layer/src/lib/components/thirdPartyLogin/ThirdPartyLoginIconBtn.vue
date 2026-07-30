<script setup lang="ts">
interface Props {
  iconName: string // 💡 必填項：不給預設值，外部呼叫時一定要傳
  iconSize?: string // 💡 可選項：給預設值，外部呼叫時可以不傳
  disabled?: boolean
  classObj?: {
    btn?: string // 控制外層 BaseBtn 的樣式 (例如大小、背景色微調)
    icon?: string // 控制內層 BaseIcon 的樣式 (例如 icon 大小或顏色)
  }
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  classObj: () => ({}),
  iconSize: "24px"
})

// 💡 宣告點擊事件，讓父層可以 @click 監聽
const emit = defineEmits<{
  (e: "click", event: MouseEvent): void
}>()

const handleIconBtnClick = (event: MouseEvent) => {
  handleGlobalClick({
    target: `handleThirdPartyIcon${props.iconName.replace(/[^a-zA-Z0-9]/g, "") || "Click"}BtnClick`,
    debounceTimer: 150,
    callback: () => {
      emit("click", event)
    }
  })
}
</script>

<template>
  <BaseBtn
    category="text"
    :disabled="disabled"
    :class="
      cx(
        // 佈局與大小
        'flex items-center justify-center w-[52px] h-[52px] rounded-full !p-0',

        // 背景色狀態變化 (對接你的變數)
        '!bg-[var(--icon-icon-bg-enabled)]',
        'hover:!bg-[var(--icon-icon-bg-active)]',
        'active:!bg-[var(--icon-icon-bg-active)]',

        // 允許外部覆寫的 class
        props.classObj?.btn
      )
    "
    @click="handleIconBtnClick"
  >
    <BaseIcon :name="iconName" :size="iconSize" :class="props.classObj?.icon" />
  </BaseBtn>
</template>
