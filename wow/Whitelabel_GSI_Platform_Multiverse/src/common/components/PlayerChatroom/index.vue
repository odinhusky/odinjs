<template>
  <div class="player-chatroom">
    <!-- 聊天室浮動按鈕 -->
    <ChatroomFab
      :is-open="webSocketChatState.isChatRoomOpen"
      :unread-count="webSocketChatState.unreadCount"
      :fab-style-obj="fabStyleObj"
      @toggle="handleToggleChatRoom"
    />

    <!-- 聊天室展開面板 -->
    <div
      v-if="webSocketChatState.isChatRoomOpen"
      :class="
        cx(
          'chatroom-panel',
          'flex flex-col z-[2000]',
          isMobile
            ? cx(
                'chatroom-panel--mobile fixed left-0 right-0 bottom-0 w-full h-[18.75rem] rounded-t-xl focus-within:bg-[var(--bg-17)]',
                chatroomPanelStyleObj?.mobileClass
              )
            : cx(
                'chatroom-panel--desktop fixed right-0 bottom-0 w-[21.25rem] h-screen max-h-[60.625rem] overflow-hidden rounded-[0.625rem] bg-[var(--bg-17)]',
                chatroomPanelStyleObj?.desktopClass
              ),
          chatroomPanelStyleObj?.panelClass
        )
      "
      @drop.prevent="handleDrop"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
    >
      <!-- 拖曳遮罩層 -->
      <div
        v-if="!isMobile && isDragging"
        :class="
          cx(
            'drag-overlay',
            'absolute inset-0 z-[9999] flex items-center justify-center bg-[var(--secondary-12)] pointer-events-none opacity-80',
            chatroomPanelStyleObj?.dragOverlayClass
          )
        "
      >
        <!-- <div class="text-center">
          <q-icon name="cloud_upload" size="4rem" class="text-white opacity-80" />
          <div class="text-white text-lg mt-2 opacity-80">{{ $t("member.profile.uploadImage") }}</div>
        </div> -->
      </div>

      <!-- 手機板關閉按鈕 -->
      <MobileHideChatroomBtn
        v-if="isMobile"
        :mobile-hide-chatroom-btn-props="mobileHideChatroomBtnProps"
        @toggle="handleToggleChatRoom"
      />

      <!-- 訊息列表區域 -->
      <MessageList
        ref="messageListRef"
        :messages="webSocketChatState.messages"
        :current-user-id="authStore.user_id"
        :is-loading="webSocketChatState.isLoadingHistory"
        :style-obj="messageListStyleObj"
        @scroll="handleScroll"
      />

      <!-- 輸入區域 -->
      <MessageInput
        v-model="messageInput"
        :disabled="!isConnected || webSocketChatState.needNickname"
        :rules="contentRules"
        :style-obj="messageInputStyleObj"
        @send="handleSendMessage"
        @select-image="handleSelectImage"
      />

      <!-- 暱稱設定遮罩層 -->
      <NicknameSetting
        v-model="nicknameInput"
        :show="webSocketChatState.needNickname"
        :rules="nicknameRules"
        :style-obj="nicknameSettingStyleObj"
        @submit="handleUpdateNickname"
      />
    </div>

    <!-- 圖片預覽 -->
    <!-- TODO: 暫時註解，等需要時再開啟 -->
    <!-- <q-dialog v-model="imagePreviewDialog">
      <q-card>
        <q-img :src="previewImageUrl" fit="contain" style="max-height: 80vh" />
        <q-card-actions align="right">
          <q-btn flat label="關閉" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog> -->

    <!-- 圖片上傳（隱藏） -->
    <input ref="fileInputRef" type="file" accept="image/*" multiple style="display: none" @change="handleFileChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, toRef } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { storeToRefs } from "pinia"
import { useWebSocketChat } from "src/common/composables/useWebSocketChat"
import { useWebSocketChatStore } from "src/stores/webSocketChatStore"
import { useAuthStore } from "src/stores/authStore"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useNicknameValidation } from "./composables/useNicknameValidation"
import { useContentValidation } from "./composables/useContentValidation"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useDynamicImage } from "src/common/composables/useDynamicImage"
import { useS3Upload } from "src/common/composables/useS3Upload"
import { useEnv } from "src/common/hooks/useEnv"
import { S3_STORAGE_CATEGORY } from "src/common/utils/constants"
import ChatroomFab from "./components/ChatroomFab.vue"
import MessageList from "./components/MessageList.vue"
import MessageInput from "./components/MessageInput.vue"
import NicknameSetting from "./components/NicknameSetting.vue"
import MobileHideChatroomBtn from "./components/MobileHideChatroomBtn.vue"
import { cx } from "src/common/utils/cx"
import type { ChatroomFabStyleObj } from "./types/chatroomFabTypes"
import type { MobileHideChatroomBtnStyleObj } from "./types/mobileHideChatroomBtnTypes"
import type { NicknameSettingStyleObj } from "./types/nicknameSettingTypes"
import type { MessageInputStyleObj } from "./types/messageInputTypes"
import type { MessageListStyleObj } from "./types/messageListTypes"
import type { ChatroomPanelStyleObj } from "./types/chatroomPanelTypes"

const props = defineProps<{
  fabStyleObj?: ChatroomFabStyleObj
  mobileHideChatroomBtnProps?: MobileHideChatroomBtnStyleObj
  nicknameSettingStyleObj?: NicknameSettingStyleObj
  messageInputStyleObj?: MessageInputStyleObj
  messageListStyleObj?: MessageListStyleObj
  chatroomPanelStyleObj?: ChatroomPanelStyleObj
}>()

const { t: $t } = useI18n()
const $q = useQuasar()
const webSocketChatStore = useWebSocketChatStore()
const { webSocketChatState } = storeToRefs(webSocketChatStore)
const authStore = useAuthStore()
const { eventEmit } = useEventBus()

const { isConnected, connect, sendText, sendImage, updateNickname } = useWebSocketChat()
const { getNicknameRules } = useNicknameValidation()
const { getContentRules } = useContentValidation()
const { isDown } = useMediaQuery()
const { uploadSingleFile } = useS3Upload()
const { buildImageUrl } = useDynamicImage()
const { envData, removePrefixDeep } = useEnv()

// ==================== Refs ====================

const messageInput = ref("")
const nicknameInput = ref("")
const messageListRef = ref<InstanceType<typeof MessageList> | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
// const imagePreviewDialog = ref(false)
// const previewImageUrl = ref("")
const isDragging = ref(false)

// ==================== Computed ====================

const isMobile = toRef(isDown, "phone")
const nicknameRules = computed(() => getNicknameRules())
const contentRules = computed(() => getContentRules())

// ==================== Methods ====================

function handleToggleChatRoom() {
  // 未登入時打開登入彈窗
  if (!authStore.isLogin) {
    eventEmit("openLogin", true)
    return
  }

  const willOpen = !webSocketChatState.value.isChatRoomOpen

  if (willOpen) {
    webSocketChatStore.setChatRoomOpen(true)
    // 連線邏輯交給 watch(isChatRoomOpen) 處理，避免重複調用
    nextTick(() => scrollToBottom())
  } else {
    webSocketChatStore.setChatRoomOpen(false)
    if (messageInput.value.trim()) {
      webSocketChatStore.setDraftMessage(messageInput.value)
    }
  }
}

function handleSendMessage(message: string) {
  if (sendText(message)) {
    messageInput.value = ""
    nextTick(() => scrollToBottom())
  }
}

function handleUpdateNickname(nickname: string) {
  updateNickname(nickname)
  nicknameInput.value = ""
}

function handleSelectImage() {
  fileInputRef.value?.click()
}

function handleDragEnter(event: DragEvent) {
  if (isMobile.value) return
  event.preventDefault()
  isDragging.value = true
}

function handleDragOver(event: DragEvent) {
  if (isMobile.value) return
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  if (isMobile.value) return
  event.preventDefault()
  isDragging.value = false
}

async function handleDrop(event: DragEvent) {
  if (isMobile.value) return
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return

  // 過濾出圖片檔案
  const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
  if (imageFiles.length === 0) {
    $q.notify({
      type: "warning",
      message: $t("alarm.pleaseSelectImage") || "Please select image files", // 請選擇圖片檔案
      position: "top"
    })
    return
  }

  // 使用相同的上傳邏輯
  await uploadImages(imageFiles)
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files || files.length === 0) return

  await uploadImages(Array.from(files))

  if (fileInputRef.value) {
    fileInputRef.value.value = ""
  }
}

async function uploadImages(files: File[]) {
  try {
    $q.loading.show({ message: "Loading..." })

    const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
    const imageInfoList: Array<{ name: string; full_path: string; path: string }> = []

    // 逐一上傳每個檔案到 S3
    for (const file of Array.from(files)) {
      const { status, data, msg } = await uploadSingleFile({
        file,
        storage_category: S3_STORAGE_CATEGORY.Enums.chatroom
      })

      if (status && data) {
        // data 包含 { file, objectKey, expiresAt }
        const uploadedData = data as { file: File; objectKey: string; expiresAt: string }

        // 移除 objectKey 中的前綴
        const cleanedData = removePrefixDeep(
          { objectKey: uploadedData.objectKey },
          `${VITE_APP_DYNAMIC_RESOURCE_URL}/`,
          ["objectKey"]
        )

        const relativePath = cleanedData.objectKey || uploadedData.objectKey
        const fullPath = relativePath.startsWith("http") ? relativePath : buildImageUrl(relativePath)

        imageInfoList.push({
          name: file.name,
          full_path: fullPath,
          path: relativePath
        })
      } else {
        console.error("Upload failed:", msg)
        $q.notify({
          type: "negative",
          message: msg || `${$t("common.uploadImage")}${$t("report.failed")}`,
          position: "top"
        })
      }
    }

    // 發送圖片資訊到後端（後端會廣播給所有人，包括自己）
    if (imageInfoList.length > 0) {
      sendImage(imageInfoList)
    }
  } catch (error) {
    console.error("上傳圖片失敗:", error)
    $q.notify({
      type: "negative",
      message: `${$t("common.uploadImage")}${$t("report.failed")}`,
      position: "top"
    })
  } finally {
    $q.loading.hide()
  }
}

// TODO: 暫時註解，等需要時再開啟
// function handlePreviewImage(url: string) {
//   previewImageUrl.value = url
//   imagePreviewDialog.value = true
// }

function scrollToBottom() {
  messageListRef.value?.scrollToBottom()
}

function handleScroll(info: any) {
  const { verticalPosition, verticalSize, verticalContainerSize } = info
  const isAtBottom = verticalPosition + verticalContainerSize >= verticalSize - 50
  webSocketChatStore.setScrolledToBottom(isAtBottom)
}

// ==================== Watch ====================

watch(
  () => webSocketChatState.value.messages.length,
  () => {
    if (webSocketChatState.value.isScrolledToBottom) {
      nextTick(() => scrollToBottom())
    }
  }
)

watch(
  () => webSocketChatState.value.isChatRoomOpen,
  (isOpen) => {
    if (isOpen) {
      if (webSocketChatState.value.draftMessage) {
        messageInput.value = webSocketChatState.value.draftMessage
        webSocketChatStore.clearDraftMessage()
      }
      if (!isConnected.value) connect()
    }
  }
)
</script>
