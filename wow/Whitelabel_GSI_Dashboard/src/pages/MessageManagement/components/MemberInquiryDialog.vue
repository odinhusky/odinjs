<template>
  <q-dialog ref="dialogRef" class="member-inquiry-dialog" @hide="onDialogHide">
    <q-card class="w-[64rem] max-h-[90vh] max-w-[98vw] overflow-hidden">
      <q-card-section class="border-b border-gray-200">
        <div class="flex items-center justify-between gap-3">
          <div class="text-lg font-semibold">{{ t("btn.check_the_details") }}</div>
          <q-btn flat round dense color="grey-7" @click="onDialogCancel">
            <Icon icon="mdi:close" width="20" />
          </q-btn>
        </div>
      </q-card-section>

      <q-card-section class="space-y-3 overflow-y-auto pb-4">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <q-card flat bordered class="h-[40rem]" style="background-color: var(--neutral-02, #f5f5f5)">
              <q-card-section
                class="q-pa-xs grid h-full min-h-0 gap-3"
                :class="
                  Number(summary.status) === MemberInquiryStatus.CLOSED ? 'grid-rows-[1fr]' : 'grid-rows-[1fr_auto]'
                "
              >
                <q-card flat bordered class="h-full min-h-0 bg-white">
                  <q-card-section class="h-full space-y-3 overflow-y-auto">
                    <div v-if="normalizedReplies.length" class="space-y-3">
                      <div
                        v-for="(reply, index) in normalizedReplies"
                        :key="`${reply.time}-${index}-${reply.content}`"
                        class="w-full"
                        :class="
                          reply.senderType === MemberInquiryReplySenderType.ADMIN
                            ? 'flex justify-end'
                            : 'flex justify-start'
                        "
                      >
                        <div class="flex w-[85%] items-start gap-3">
                          <div
                            v-if="reply.senderType !== MemberInquiryReplySenderType.ADMIN"
                            class="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-blue-600 text-white"
                          >
                            <Icon icon="mdi:user" width="24" />
                          </div>
                          <div
                            class="min-w-0 flex-1 rounded-md px-3 py-2 text-sm"
                            :style="{
                              backgroundColor:
                                reply.senderType === MemberInquiryReplySenderType.ADMIN ? '#EFF7FF' : '#E5E5E5'
                            }"
                          >
                            <div class="mb-1 flex items-center justify-between gap-2">
                              <div
                                class="font-semibold"
                                :class="
                                  reply.senderType === MemberInquiryReplySenderType.ADMIN
                                    ? 'text-blue-700'
                                    : 'text-gray-900'
                                "
                              >
                                {{
                                  reply.senderType === MemberInquiryReplySenderType.ADMIN
                                    ? t("message_management.member_inquiries.admin")
                                    : reply.senderName || "-"
                                }}
                              </div>
                              <div class="text-xs text-gray-500">
                                {{ reply.time ? formatDateTime(reply.time) : "-" }}
                              </div>
                            </div>
                            <div class="whitespace-pre-wrap break-words text-gray-800">
                              {{ reply.content || "-" }}
                            </div>
                            <div v-if="reply.images?.length" class="mt-2">
                              <ImagePreviewGallery :images="reply.images" thumb-size="64px" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <q-card v-if="Number(summary.status) !== MemberInquiryStatus.CLOSED" flat class="bg-transparent">
                  <q-card-section class="p-3">
                    <q-form ref="replyFormRef" class="flex h-full min-h-0 flex-col gap-2" @submit.prevent="onReply">
                      <div class="mt-auto flex w-full flex-nowrap items-center gap-3">
                        <q-input
                          v-model="adminReply"
                          class="min-w-0 flex-1"
                          dense
                          outlined
                          hide-bottom-space
                          bg-color="white"
                          :placeholder="t('common.please_enter_content')"
                        />
                        <q-btn
                          unelevated
                          color="positive"
                          class="h-[2.5rem] w-[3.5rem] shrink-0"
                          :loading="replyLoading"
                          type="submit"
                        >
                          <Icon icon="mdi:send-variant" width="18" class="text-white" />
                        </q-btn>
                      </div>

                      <div class="w-full">
                        <S3ImageUploader v-model="replyImages" :storage-category="S3_STORAGE_CATEGORY.Enums.message" />
                      </div>
                    </q-form>
                  </q-card-section>
                </q-card>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <div class="flex h-[40rem] min-h-0 flex-col gap-3">
              <div class="text-sm font-medium text-gray-900">
                {{ summary.last_msg_at ? formatDateTime(summary.last_msg_at) : "-" }}
              </div>

              <q-card flat bordered class="min-h-0 flex-1 overflow-hidden bg-blue-50">
                <q-card-section class="h-full min-h-0 space-y-3">
                  <div class="flex flex-col items-center gap-2 text-center">
                    <div class="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-blue-600 text-white">
                      <Icon icon="mdi:user" width="24" />
                    </div>
                    <div class="min-w-0">
                      <div class="text-sm font-semibold text-blue-700">{{ summary.member_account || "-" }}</div>
                    </div>
                  </div>
                  <q-card flat bordered class="min-w-0 bg-white">
                    <q-card-section class="min-w-0 space-y-3">
                      <div class="space-y-1 text-center">
                        <div class="text-sm text-gray-600">{{ t("table_header.subject") }}</div>
                        <div class="text-base font-semibold text-gray-900">{{ inquiry.subject || "-" }}</div>
                      </div>

                      <q-separator />

                      <div class="space-y-1" v-if="inquiryDetail.images?.length">
                        <ImagePreviewGallery :images="inquiryDetail.images" thumb-size="80px" />
                      </div>

                      <div class="min-w-0 space-y-1">
                        <div
                          class="max-h-[20rem] overflow-y-auto max-w-full whitespace-pre-wrap break-all text-sm text-gray-900"
                        >
                          {{ inquiryDetail.content || "-" }}
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue"
  import { QForm, useDialogPluginComponent, useQuasar } from "quasar"
  import { Icon } from "@iconify/vue"
  import { useI18n } from "vue-i18n"
  import { useRfc3339 } from "@/composables/useRfc3339"
  import ImagePreviewGallery from "@/components/common/ImagePreviewGallery.vue"
  import S3ImageUploader from "@/components/common/S3ImageUploader.vue"
  import { S3_STORAGE_CATEGORY } from "@/utils/constants"
  import {
    getMemberInquiryDetail,
    MemberInquiryReplySenderType,
    MemberInquiryStatus,
    replyMemberInquiry,
    type Response
  } from "@/api/messageManagement"

  const props = defineProps<{
    inquiry: Response.MemberInquiryDetail
    summary: {
      member_account: string
      last_msg_at: string
      status: number
    }
  }>()

  defineEmits([...useDialogPluginComponent.emits])
  const { t } = useI18n()
  const $q = useQuasar()
  const { formatDateTime } = useRfc3339()
  const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
  const summary = computed(() => props.summary)
  const adminReply = ref("")
  const replyImages = ref<string[]>([])
  const replyLoading = ref(false)
  const replyFormRef = ref<QForm | null>(null)
  const inquiryDetail = ref<Response.MemberInquiryDetail>(props.inquiry)
  const normalizedReplies = computed(() => {
    const source = Array.isArray(inquiryDetail.value.replies) ? inquiryDetail.value.replies : []
    return source.map((item) => {
      if (typeof item === "string") {
        return {
          senderType: MemberInquiryReplySenderType.USER,
          senderName: "",
          time: "",
          content: item
        }
      }
      const reply = item as {
        sender_type?: number
        sender_account?: string
        sender_name?: string
        time?: string
        created_at?: string
        content?: string
        message?: string
        images?: string[]
      }
      return {
        senderType: Number(reply.sender_type || MemberInquiryReplySenderType.USER),
        senderName: String(reply.sender_account || reply.sender_name || ""),
        time: String(reply.time || reply.created_at || ""),
        content: String(reply.content || reply.message || ""),
        images: Array.isArray(reply.images) ? reply.images : []
      }
    })
  })

  const onReply = async () => {
    const content = String(adminReply.value || "").trim()
    if (!content) {
      $q.notify({
        type: "negative",
        message: t("common.please_enter_content"),
        position: "top",
        timeout: 1000
      })
      return
    }

    replyLoading.value = true
    const res = await replyMemberInquiry(inquiryDetail.value.id, {
      content,
      images: replyImages.value.length ? [...replyImages.value] : undefined
    })
    replyLoading.value = false

    if (res.code !== 0) {
      $q.notify({
        type: "negative",
        message: res.msg || t("message.error"),
        position: "top",
        timeout: 1000
      })
      return
    }

    const detailRes = await getMemberInquiryDetail(inquiryDetail.value.id)
    if (detailRes.code === 0 && detailRes.data) {
      inquiryDetail.value = detailRes.data
    }
    adminReply.value = ""
    replyImages.value = []
    $q.notify({
      type: "positive",
      message: t("message.success"),
      position: "top",
      timeout: 300
    })
  }
</script>

<style>
  .member-inquiry-dialog .q-dialog__inner--minimized > div {
    width: min(64rem, 98vw);
    max-width: 98vw !important;
  }
</style>
