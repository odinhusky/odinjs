<template>
  <div :class="cx('chatroom-messages', 'flex-1 overflow-hidden p-4 min-h-0', styleObj?.container)">
    <q-scroll-area ref="scrollAreaRef" class="full-height" @scroll="handleScroll">
      <!-- 訊息列表 -->
      <div
        v-for="msg in messages"
        :key="msg.message_id"
        :class="
          cx(
            'message-wrapper',
            'mb-4 flex',
            isMySelf(msg) ? 'justify-end' : 'justify-start',
            isMySelf(msg) ? styleObj?.messageWrapper?.self : styleObj?.messageWrapper?.other
          )
        "
      >
        <div
          :class="
            cx(
              'message-item',
              'p-3 rounded-lg text-white w-[16.25rem]',
              isMySelf(msg) ? 'bg-[var(--bg-19)]' : 'bg-[var(--bg-22)]',
              isMySelf(msg) ? styleObj?.messageItem?.self : styleObj?.messageItem?.other
            )
          "
        >
          <!-- 發送者名稱 -->
          <div
            :class="
              cx(
                'message-sender',
                'mb-1 font-bold text-sm text-[var(--text-02)]',
                isMySelf(msg) ? styleObj?.messageSender?.self : styleObj?.messageSender?.other
              )
            "
          >
            {{ msg.sender }}
          </div>

          <!-- 文字訊息 -->
          <div
            v-if="msg.type === 'text'"
            :class="
              cx(
                'message-content',
                'break-words font-normal whitespace-pre-wrap leading-relaxed',
                isMySelf(msg) ? styleObj?.messageContent?.self : styleObj?.messageContent?.other
              )
            "
          >
            {{ msg.content }}
          </div>

          <!-- 圖片訊息 -->
          <div
            v-else-if="msg.type === 'image'"
            :class="
              cx(
                'message-images',
                'flex flex-wrap gap-2',
                isMySelf(msg) ? styleObj?.messageImages?.self : styleObj?.messageImages?.other
              )
            "
          >
            <q-img
              v-for="(img, idx) in msg.image_info_list"
              :key="idx"
              :src="img.full_path"
              :alt="img.name"
              :class="
                cx(
                  'message-image',
                  'w-[120px] h-[120px] rounded-lg transition-transform duration-200',
                  isMySelf(msg) ? styleObj?.messageImage?.self : styleObj?.messageImage?.other
                )
              "
              fit="contain"
              loading="lazy"
            >
              <!-- TODO: 暫時註解預覽功能 -->
              <!-- @click="$emit('preview-image', img.full_path)" -->
              <!-- cursor-pointer hover:scale-105 -->
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3">
                  <q-icon name="broken_image" size="24px" color="grey-6" />
                </div>
              </template>
            </q-img>
          </div>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { WSChatMessage } from "src/types/websocket-chatroom.types"
import type { MessageListStyleObj } from "../types/messageListTypes"
import { cx } from "src/common/utils/cx"

const props = defineProps<{
  messages: WSChatMessage[]
  currentUserId?: number
  styleObj?: MessageListStyleObj
}>()

const emit = defineEmits<{
  "preview-image": [url: string]
  scroll: [info: any]
}>()

const scrollAreaRef = ref<any>(null)

/**
 * 判斷訊息是否為當前使用者發送
 */
function isMySelf(msg: WSChatMessage): boolean {
  return msg.sender_id === props.currentUserId
}

function handleScroll(info: any) {
  emit("scroll", info)
}

function scrollToBottom() {
  if (scrollAreaRef.value) {
    const scrollTarget = scrollAreaRef.value.getScrollTarget()
    scrollAreaRef.value.setScrollPosition("vertical", scrollTarget.scrollHeight, 300)
  }
}

defineExpose({
  scrollToBottom
})
</script>
