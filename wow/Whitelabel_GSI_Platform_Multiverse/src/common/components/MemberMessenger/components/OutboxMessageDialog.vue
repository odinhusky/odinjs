<template>
  <q-dialog ref="dialogRef" class="outbox-message-dialog member-messenger-dialog" @hide="onDialogHide">
    <q-card class="outbox-message-dialog-card w-[92vw] max-w-[1024px] rounded-2xl">
      <q-card-section class="flex h-16 items-center justify-between !py-0">
        <div class="outbox-message-dialog-title min-w-0 flex-1 pr-2 text-2xl font-bold">
          {{ t("member.messenger.viewMessage") }}
        </div>
        <q-btn icon="close" flat round dense class="h-5 w-5" @click="onDialogCancel" />
      </q-card-section>

      <q-separator />

      <q-card-section v-if="isPending" class="flex justify-center py-12">
        <q-spinner color="primary" size="40px" />
      </q-card-section>

      <q-card-section v-else class="p-4 pt-2.5 sm:p-5 sm:pt-2.5">
        <div
          class="grid h-[40rem] grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden sm:grid-cols-5 sm:grid-rows-1 sm:gap-x-0"
        >
          <div
            class="outbox-message-dialog-chat-col order-2 flex h-full min-h-0 flex-col gap-0 sm:order-none sm:col-span-3 sm:border-r sm:pr-5"
          >
            <div
              class="flex h-full min-h-0 flex-col overflow-hidden outbox-message-dialog-chat-frame rounded-t-lg rounded-b-lg border"
            >
              <!-- 聊天室：對話紀錄與圖片 -->
              <section class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden outbox-message-dialog-chat-log p-3">
                <div
                  v-if="resolvedReplies.length > 0"
                  class="grid min-h-0 min-w-0 flex-1 grid-cols-1 content-start gap-1 overflow-y-auto overflow-x-hidden"
                >
                  <div
                    v-for="(reply, idx) in resolvedReplies"
                    :key="`${reply.created_at}-${idx}`"
                    class="w-full min-w-0 justify-self-stretch"
                  >
                    <div
                      class="flex w-full min-w-0"
                      :class="
                        reply.sender_type === MemberMessengerReplySenderType.Admin ? 'justify-start' : 'justify-end'
                      "
                    >
                      <div
                        class="outbox-message-bubble flex max-w-[90%] min-w-0 flex-col overflow-hidden rounded-[16px] border"
                        :class="
                          reply.sender_type === MemberMessengerReplySenderType.Admin
                            ? 'outbox-message-bubble--admin'
                            : 'outbox-message-bubble--player'
                        "
                      >
                        <div class="flex min-w-0 flex-col gap-2 px-2 py-4">
                          <div class="flex min-w-0 items-center">
                            <span class="outbox-message-bubble__sender min-w-0 flex-1 truncate text-sm font-bold leading-5">
                              {{
                                reply.sender_type === MemberMessengerReplySenderType.Admin
                                  ? t("member.messenger.admin")
                                  : memberAccount
                              }}
                            </span>
                            <span class="min-w-4 shrink-0" aria-hidden="true" />
                            <span class="outbox-message-bubble__time shrink-0 text-xs font-normal leading-4">
                              {{ formatDateTime(reply.created_at) }}
                            </span>
                          </div>
                          <div class="outbox-message-bubble__content whitespace-pre-wrap text-sm font-normal leading-6">
                            {{ reply.content }}
                          </div>
                          <div
                            v-if="reply.images.length > 0"
                            class="flex min-w-0 flex-row flex-wrap gap-1"
                            :class="
                              reply.sender_type === MemberMessengerReplySenderType.Admin
                                ? 'justify-start'
                                : 'justify-end'
                            "
                          >
                            <div
                              v-for="(img, imgIdx) in reply.images"
                              :key="img"
                              class="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-lg select-none sm:size-24"
                              @click="openReplyImagePreview(reply.images, imgIdx)"
                            >
                              <img :src="img" alt="" loading="lazy" class="size-full object-cover" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="min-h-0 flex-1 text-sm outbox-message-dialog-empty-hint">-</div>
              </section>

              <!-- 回覆區：文字輸入與圖片上傳（對話已關閉時隱藏） -->
              <section
                v-if="!isThreadClosed"
                class="shrink-0 overflow-y-auto outbox-message-dialog-reply-panel p-2.5"
              >
                <div class="flex items-center gap-2">
                  <q-input
                    v-model="replyContent"
                    type="textarea"
                    autogrow
                    dense
                    outlined
                    class="outbox-message-dialog-reply-input flex-1"
                    :disable="isReplying"
                    placeholder="輸入訊息..."
                  />
                  <q-btn
                    unelevated
                    round
                    dense
                    padding="none"
                    class="outbox-message-dialog-send-btn !h-8 !w-8"
                    :disable="!canSubmitReply || isReplying"
                    :loading="isReplying"
                    @click="handleReplySubmit"
                  >
                    <Icon icon="mdi:send-variant" width="24" class="outbox-message-dialog-send-icon" />
                  </q-btn>
                </div>
                <S3ImageUploader
                  v-model="replyImageKeys"
                  :storage-category="S3_STORAGE_CATEGORY.Enums.message"
                  :max-files="3"
                  :disabled="isReplying"
                />
              </section>
            </div>
          </div>

          <!-- 側欄：時間、會員、主旨與原始訊息內容 -->
          <section
            class="order-1 flex min-h-0 flex-col rounded-none border-0 p-0 sm:order-none sm:col-span-2 sm:h-full sm:pl-5"
          >
            <div v-if="detail" class="flex min-h-0 flex-1 flex-col space-y-2.5 overflow-hidden">
              <div class="text-sm font-bold outbox-message-dialog-sidebar-time">
                {{ formatDateTime(detail.created_at) }}
              </div>

              <div class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg outbox-message-dialog-sidebar-panel p-2.5">
                <div class="flex min-h-0 flex-1 flex-col items-center gap-2.5 overflow-hidden text-center">
                  <div
                    class="flex w-full shrink-0 flex-row items-center gap-2 sm:w-auto sm:flex-col sm:items-center sm:gap-2.5"
                  >
                    <div
                      class="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full outbox-message-dialog-avatar sm:h-[60px] sm:w-[60px]"
                      role="img"
                      :aria-label="memberAccount"
                    >
                      <Icon icon="mdi:account" class="size-4 outbox-message-dialog-avatar-icon sm:size-10" />
                    </div>
                    <div
                      class="min-w-0 flex-1 truncate text-left text-sm font-normal outbox-message-dialog-member-name sm:flex-none sm:text-center"
                    >
                      {{ memberAccount }}
                    </div>
                  </div>

                  <div
                    class="flex min-h-0 w-full min-w-0 flex-1 flex-nowrap flex-col overflow-hidden rounded-lg outbox-message-dialog-detail-card p-2.5 text-left"
                  >
                    <div class="shrink-0">
                      <div
                        class="mt-1 whitespace-pre-wrap text-center text-lg font-bold leading-7 outbox-message-dialog-subject"
                      >
                        {{ detail.subject }}
                      </div>
                      <q-separator class="outbox-message-dialog-separator my-2" />
                    </div>

                    <!-- 圖片與內文同欄直向排列；flex-nowrap 避免父層有定高時內文被排到右欄 -->
                    <div class="mt-2 flex min-h-0 w-full min-w-0 flex-1 flex-col flex-nowrap gap-2 overflow-hidden">
                      <div
                        v-if="resolvedImages.length > 0"
                        class="grid w-full shrink-0 grid-cols-3 items-start gap-1.5"
                      >
                        <div
                          v-for="(img, idx) in resolvedImages"
                          :key="img"
                          class="relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border outbox-message-dialog-detail-image"
                          @click="openImagePreview(idx)"
                        >
                          <q-img :src="img" fit="cover" class="!absolute inset-0 h-full w-full" />
                        </div>
                      </div>

                      <!-- 僅此區塊在內容過長時捲動；與圖片區上下相接、不重疊 -->
                      <div
                        class="flex w-full min-w-0 min-h-[4lh] flex-1 flex-col flex-nowrap overflow-hidden text-sm font-normal leading-6 sm:min-h-0"
                      >
                        <div
                          class="box-border h-[4lh] max-h-[4lh] w-full min-w-0 shrink-0 overflow-y-auto whitespace-pre-wrap text-sm font-normal leading-6 outbox-message-dialog-detail-content sm:h-auto sm:max-h-none sm:min-h-0 sm:flex-1"
                        >
                          {{ detail.content }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm outbox-message-dialog-empty-hint">-</div>
          </section>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { useQueryClient } from "@tanstack/vue-query"
import { useDialogPluginComponent, useQuasar } from "quasar"
import type { MemberMessengerOutboxReply } from "src/api/memberMessenger.type"
import ImagePreviewDialog from "src/common/components/ImagePreviewDialog.vue"
import S3ImageUploader from "src/common/components/S3ImageUploader.vue"
import { useDynamicImage } from "src/common/composables/useDynamicImage"
import {
  memberMessengerQueryKeys,
  useOutboxMessage,
  useOutboxMessageReply,
} from "src/common/composables/useMemberMessenger"
import { useRfc3339 } from "src/common/composables/useRfc3339"
import { S3_STORAGE_CATEGORY } from "src/common/utils/constants"
import { MemberMessengerReplySenderType } from "src/common/utils/constants/memberMessenger"
import { useUserInfoStore } from "src/stores/userInfoStore"
import { computed, ref, toRef, watch } from "vue"
import { useI18n } from "vue-i18n"

defineOptions({
  name: "outboxMessageDialog",
})

const props = defineProps<{
  messageId: number
  /** 列表列 {@link MemberMessengerPanelRow.statusType}；`closed` 時隱藏回覆區 */
  statusType?: string
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const { buildImageUrl } = useDynamicImage()
const { formatDateTime } = useRfc3339()
const { t } = useI18n()
const userInfoStore = useUserInfoStore()

const queryClient = useQueryClient()
const { data, isPending, isError } = useOutboxMessage(toRef(props, "messageId"))
const { isPending: isReplying, mutateAsync: replyMutateAsync } = useOutboxMessageReply()

const detail = computed(() => data.value)
const isThreadClosed = computed(() => props.statusType === "closed")
const memberAccount = computed(() => userInfoStore.userInfo?.username || "-")
const replyContent = ref("")
const replyImageKeys = ref<string[]>([])
const canSubmitReply = computed(() => replyContent.value.trim().length > 0 || replyImageKeys.value.length > 0)

const resolvedImages = computed(() => {
  const images = detail.value?.images
  if (!images?.length) return []
  return images.map((path) => buildImageUrl(path ?? "")).filter(Boolean)
})

const resolvedReplies = computed<MemberMessengerOutboxReply[]>(() => {
  const replies = detail.value?.replies
  if (!Array.isArray(replies) || replies.length === 0) return []

  return replies.map((reply) => ({
    sender_type: normalizeReplySenderType(reply.sender_type),
    content: String(reply.content ?? ""),
    images: Array.isArray(reply.images)
      ? reply.images.map((path) => buildImageUrl(String(path ?? ""))).filter(Boolean)
      : [],
    created_at: String(reply.created_at ?? ""),
  }))
})

function normalizeReplySenderType(raw: unknown): number {
  const n = Number(raw)
  if (n === MemberMessengerReplySenderType.Admin) return MemberMessengerReplySenderType.Admin
  return MemberMessengerReplySenderType.Player
}

function openImagePreview(initialIndex: number) {
  if (resolvedImages.value.length === 0) return
  $q.dialog({
    component: ImagePreviewDialog,
    componentProps: {
      images: resolvedImages.value,
      initialIndex,
    },
  })
}

function openReplyImagePreview(images: string[], initialIndex: number) {
  if (images.length === 0) return
  $q.dialog({
    component: ImagePreviewDialog,
    componentProps: {
      images,
      initialIndex,
    },
  })
}

async function handleReplySubmit() {
  if (isThreadClosed.value || !canSubmitReply.value || isReplying.value) return
  try {
    await replyMutateAsync({
      messageId: props.messageId,
      content: replyContent.value.trim(),
      ...(replyImageKeys.value.length > 0 ? { images: replyImageKeys.value } : {}),
    })
    replyContent.value = ""
    replyImageKeys.value = []
    await queryClient.invalidateQueries({ queryKey: memberMessengerQueryKeys.outbox() })
  } catch {
    // 失敗時 useApi 已處理 Notify；mutation 會 reject
  }
}

watch(
  isError,
  (hasError) => {
    if (!hasError) return
    onDialogCancel()
  },
  { immediate: true }
)
</script>

<style lang="scss">
@media (min-width: 600px) {
  .outbox-message-dialog .q-dialog__inner--minimized > div {
    @apply max-w-[1024px] !important;
  }
}
</style>
