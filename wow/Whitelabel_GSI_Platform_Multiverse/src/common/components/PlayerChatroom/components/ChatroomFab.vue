<template>
  <button
    v-if="!isDown.phone || (isDown.phone && !isOpen)"
    :class="
      cx(
        'chatroom-fab',
        'fixed bottom-[30.3125rem] translate-y-1/2 z-[2000]',
        'flex flex-col justify-center items-center gap-2',
        'min-h-[6rem] phone:min-h-[initial] p-2.5 rounded-l-lg',
        'text-white',
        'transition-all duration-300 ease-in-out',
        'hover:opacity-90',
        'bg-[var(--bg-09)]',
        isOpen ? 'right-[21.25rem]' : 'right-0',
        fabStyleObj?.button
      )
    "
    @click="$emit('toggle')"
  >
    <!-- 未讀數紅點徽章 -->
    <div
      v-if="typeof unreadCount === 'number' && unreadCount > 0 && !isOpen"
      :class="
        cx(
          'absolute -top-1 -left-1',
          'w-4 h-4 px-1',
          'flex items-center justify-center',
          'text-white',
          'rounded-full text-xs font-bold',
          fabStyleObj?.badge
        )
      "
    >
      <!-- {{ unreadCount > 99 ? "99+" : unreadCount }} -->
    </div>

    <q-icon name="sms" :size="fabStyleObj?.iconSize || '32px'" :class="cx('chatroom-fab__icon', fabStyleObj?.icon)" />

    <!-- <q-icon
      :name="isOpen ? 'east' : 'west'"
      :size="fabStyleObj?.iconSize || '20px'"
      :class="cx('chatroom-fab__icon', fabStyleObj?.icon)"
    />

    <span
      :class="
        cx(
          'chatroom-fab__text',
          'whitespace-nowrap writing-mode-vertical text-sm font-bold tracking-[0.375rem]',
          fabStyleObj?.text
        )
      "
    >
      {{ $t("chat_room.chat_room") }}
    </span> -->
  </button>
</template>

<script setup lang="ts">
import { getCurrentInstance } from "vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import type { ChatroomFabStyleObj } from "../types/chatroomFabTypes"

defineProps<{
  isOpen: boolean
  unreadCount?: number
  fabStyleObj?: ChatroomFabStyleObj
}>()

defineEmits<{
  toggle: []
}>()

const { cx } = getCurrentInstance()!.appContext.config.globalProperties
const { isDown } = useMediaQuery()
</script>

<style scoped>
.writing-mode-vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
</style>
