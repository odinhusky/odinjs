<template>
  <PlayerChatroom
    :fab-style-obj="{
      button: 'fab-bg-color',
      icon: 'fab-icon-color',
      iconSize: isMobile ? '20px' : '32px',
      text: `fab-text-color ${isMobile ? 'text-sm' : ''}`,
      badge: 'bg-[var(--emotional-01)] bg-[#FF3B3B]'
    }"
    :chatroom-panel-style-obj="{
      desktopClass: 'bg-[#00000099]',
      mobileClass: 'focus-within:bg-[#00000099]'
    }"
    :nickname-setting-style-obj="{
      container: 'nickname-container',
      title: 'nickname-title text-red',
      input: 'nickname-custom-input text-[#bcbcbc]',
      button: 'bg-gradient01'
    }"
    :mobile-hide-chatroom-btn-props="{
      button: 'mobile-hide-chatroom-btn',
      icon: 'mobile-hide-chatroom-icon'
    }"
    :message-input-style-obj="{
      container: 'message-input-container',
      imageButton: 'message-input-image-button',
      textarea: 'message-custom-textarea',
      sendButton: 'message-input-send-button'
    }"
    :message-list-style-obj="{
      messageItem: {
        self: 'message-self-item rounded-[0.625rem]',
        other: 'message-other-item rounded-[0.625rem]'
      },
      messageSender: {
        self: 'text-white',
        other: 'message-other-sender'
      },
      messageContent: {
        other: 'message-other-content'
      }
    }"
  />
</template>

<script lang="ts" setup>
import { toRef } from "vue"
import PlayerChatroom from "src/common/components/PlayerChatroom/index.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "phone")
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";

// chatroom settings
.fab-bg-color,
:deep(.fab-bg-color) {
  background-color: $pale-blue-color !important;
}

.fab-icon-color,
:deep(.fab-icon-color) {
  color: #bcbcbc !important;
}

.fab-text-color,
:deep(.fab-text-color) {
  color: #676767 !important;
}

.nickname-container,
:deep(.nickname-container) {
  background-color: $common-white-color !important;
}

.nickname-title,
:deep(.nickname-title) {
  color: $primary-color !important;
}

/* 1. nickname input 修改 文字 顏色 */
:deep(.nickname-custom-input .q-field__native) {
  color: #676767 !important;
}

/* 2. nickname input 修改 Label 顏色 */
:deep(.nickname-custom-input .q-field__label) {
  color: #bcbcbc !important;
}

/* 3. nickname input 修改邊框 (Quasar Outlined 模式的邊框是由 :before 控制的) */
:deep(.nickname-custom-input .q-field__control:before) {
  box-shadow: 0px 0px 4px 0px #00000066 !important;
  border: 2px solid #9fa0a1 !important;
}

:deep(.mobile-hide-chatroom-btn) {
  background-color: $secondary-color !important;
}

:deep(.mobile-hide-chatroom-icon) {
  color: #bcbcbc !important;
}
:deep(.message-input-container) {
  background-color: #c6ddff !important;
}
:deep(.message-input-image-button) {
  background-color: #efefef !important;
  color: $secondary-color !important;
}

:deep(.message-custom-textarea) {
  @apply rounded-[1.25rem];
  background-color: #fbfcfd !important;
  border: none !important;
}

:deep(.message-custom-textarea .q-field__native) {
  color: $common-black-color !important;
}

// /* text-area 修改 Label 顏色 */
:deep(.message-custom-textarea .q-field__label) {
  color: $common-black-color !important;
}

// /* text-area  修改邊框 (Quasar Outlined 模式的邊框是由 :before 控制的) */
:deep(.message-custom-textarea .q-field__control:before) {
  border: none !important;
}

:deep(.message-custom-textarea.q-field--focused .q-field__control:after) {
  /* Quasar 使用 :after 來顯示 focus 時的高亮邊框 */
  border-color: transparent !important;
  border-width: 0 !important;
}

:deep(.message-input-send-button) {
  background-color: $primary-color !important;
}

:deep(.message-self-item) {
  background-color: $primary-color !important;
}

:deep(.message-other-item) {
  background-color: $common-white-color !important;
}

:deep(.message-other-sender) {
  color: $common-black-color !important;
}

:deep(.message-other-content) {
  color: #676767 !important;
}
</style>
