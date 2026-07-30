<template>
  <button
    :class="
      cx(
        'chatroom-close-btn',
        'absolute left-1 top-1/2 -translate-y-1/2',
        'w-5 h-5 rounded',
        'flex items-center justify-center',
        'bg-[var(--bg-09)]',
        'text-white',
        'transition-all duration-300',
        'hover:opacity-90',
        'z-[2001]',
        mobileHideChatroomBtnProps?.button
      )
    "
    @click="$emit('toggle')"
  >
    <q-icon
      name="sms"
      :size="mobileHideChatroomBtnProps?.iconSize || '20px'"
      :class="cx('chatroom-close-btn__icon', mobileHideChatroomBtnProps?.icon)"
    />
  </button>
</template>

<script setup lang="ts">
import { getCurrentInstance } from "vue"
import type { MobileHideChatroomBtnStyleObj } from "../types/mobileHideChatroomBtnTypes"

defineProps<{
  mobileHideChatroomBtnProps?: MobileHideChatroomBtnStyleObj
}>()

defineEmits<{
  toggle: []
}>()

const { cx } = getCurrentInstance()!.appContext.config.globalProperties
</script>
