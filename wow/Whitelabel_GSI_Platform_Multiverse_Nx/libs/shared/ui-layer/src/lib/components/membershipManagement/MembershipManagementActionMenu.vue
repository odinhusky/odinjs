<script setup lang="ts">
import { onClickOutside } from "@vueuse/core"

interface Props {
  row: Record<string, any>
  isCredit: boolean
  layout: "dropdown" | "buttons"
}

const props = defineProps<Props>()

const emit = defineEmits<{
  add: [row: Record<string, any>]
  minus: [row: Record<string, any>]
  edit: [row: Record<string, any>]
  "view-lower-level": [row: Record<string, any>]
}>()

const showDropdown = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const menuPosition = ref({ top: 0, left: 0 })

const MENU_WIDTH = 115

const updatePosition = () => {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  menuPosition.value = {
    top: rect.bottom + 4,
    left: Math.max(8, rect.right - MENU_WIDTH)
  }
}

const handleToggle = async () => {
  if (showDropdown.value) {
    showDropdown.value = false
    return
  }
  updatePosition()
  showDropdown.value = true
  await nextTick()
}

onClickOutside(menuRef, (e) => {
  // 別把點 trigger 也當作 outside（不然會立刻關回去）
  if (triggerRef.value?.contains(e.target as Node)) return
  showDropdown.value = false
})

// 滾動 / resize 時關閉，避免位置錯位
const handleClose = () => { showDropdown.value = false }
onMounted(() => {
  window.addEventListener("scroll", handleClose, true)
  window.addEventListener("resize", handleClose)
})
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleClose, true)
  window.removeEventListener("resize", handleClose)
})

// Figma: 115×35 Hug, padding p-2 p-3, gap p-1；hover/active 用橘紅漸層（button-primary）
const menuItemClass = cx(
  "w-full h-[35px] px-3 py-2 text-left text-sm whitespace-nowrap",
  "text-[var(--text-text-primary)]",
  "hover:bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)]",
  "hover:text-[var(--button-button-title-primary-enabled)]"
)

const btnClass = cx(
  "flex-1 rounded-lg border py-2 text-sm",
  "text-[var(--button-button-bg-primary-left-enabled)]",
  "border-[var(--button-button-bg-primary-left-enabled)]",
  "hover:bg-[var(--list-list-bg-active)]"
)
</script>

<template>
  <!-- PC dropdown -->
  <div v-if="props.layout === 'dropdown'" ref="triggerRef" class="inline-block">
    <!-- Figma: dropdown trigger 用 dropdown-bg-primary-active (#573EDC) 紫色 -->
    <button
      :class="cx(
        'inline-flex items-center justify-center gap-1 px-3 py-2 h-8 rounded-lg text-sm whitespace-nowrap',
        'bg-[var(--dropdown-dropdown-bg-primary-active,#573EDC)]',
        'text-[var(--text-text-primary)]',
        'hover:opacity-90'
      )"
      @click="handleToggle"
    >
      操作
      <BaseIcon name="mdi:chevron-down" size="16px" />
    </button>

    <Teleport to="body">
      <div
        v-if="showDropdown"
        ref="menuRef"
        :style="{
          position: 'fixed',
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
          width: `${MENU_WIDTH}px`,
          zIndex: 9999
        }"
        :class="cx(
          'rounded-lg overflow-hidden flex flex-col gap-0',
          'bg-[var(--surface-surface-contrainer,#171717)]',
          'border border-[var(--border-border-primary,_rgba(255,255,255,0.2))]',
          'shadow-[0_8px_8px_var(--border-border-primary,rgba(255,255,255,0.2))]'
        )"
      >
        <button v-if="isCredit" :class="menuItemClass" @click="emit('add', props.row); showDropdown = false">加款</button>
        <button v-if="isCredit" :class="menuItemClass" @click="emit('minus', props.row); showDropdown = false">扣款</button>
        <button :class="menuItemClass" @click="emit('edit', props.row); showDropdown = false">編輯</button>
        <button :class="menuItemClass" @click="emit('view-lower-level', props.row); showDropdown = false">查看下級</button>
      </div>
    </Teleport>
  </div>

  <!-- Mobile credit expanded 2×2 buttons -->
  <div v-else-if="props.layout === 'buttons' && isCredit" class="grid grid-cols-2 gap-2 w-full">
    <button :class="btnClass" @click="emit('add', props.row)">加款</button>
    <button :class="btnClass" @click="emit('minus', props.row)">扣款</button>
    <button :class="btnClass" @click="emit('edit', props.row)">編輯</button>
    <button :class="btnClass" @click="emit('view-lower-level', props.row)">查看下級</button>
  </div>
</template>
