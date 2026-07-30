<template>
  <q-dialog ref="dialogRef" class="member-messenger-dialog" @hide="onDialogHide">
    <q-card class="messenger-compose-dialog-card w-[92vw] max-w-[640px] rounded-2xl">
      <q-card-section class="flex items-center justify-between px-5">
        <div class="messenger-compose-dialog-title text-2xl font-bold">{{ t("member.messenger.newMessage") }}</div>
        <q-btn icon="close" flat round dense class="h-5 w-5" @click="onDialogCancel" />
      </q-card-section>

      <q-card-section class="px-5 py-2.5">
        <div class="messenger-compose-dialog-body space-y-4 rounded-2xl px-2 py-4">
          <div class="flex flex-col gap-2">
            <div class="messenger-compose-dialog-field-label text-sm font-normal">{{ t("member.messenger.subject") }}</div>
            <q-input v-model="subject" class="messenger-compose-subject-field" outlined :disable="isPending" />
          </div>
          <div class="flex flex-col gap-2">
            <div class="messenger-compose-dialog-field-label text-sm font-normal">
              {{ t("member.messenger.content") }}
            </div>
            <q-input
              v-model="content"
              class="messenger-compose-content-field"
              type="textarea"
              outlined
              :disable="isPending"
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="messenger-compose-dialog-field-label text-sm font-normal">{{ t("member.messenger.imageAttachment") }}</div>
            <S3ImageUploader
              v-model="imageKeys"
              :storage-category="S3_STORAGE_CATEGORY.Enums.message"
              :max-files="3"
              :disabled="isPending"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="gap-2 px-4 py-3">
        <q-btn
          flat
          no-caps
          class="messenger-compose-btn-cancel !rounded-lg !border-2 !border-solid !px-6 text-base font-semibold"
          :label="t('common.btn.cancel')"
          :disable="isPending"
          @click="onDialogCancel"
        />
        <q-btn
          unelevated
          no-caps
          class="messenger-compose-btn-submit !rounded-lg !px-6 text-base font-normal"
          :label="t('common.btn.submit')"
          :loading="isPending"
          :disable="!canSubmit || isPending"
          @click="handleSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from "quasar"
import S3ImageUploader from "src/common/components/S3ImageUploader.vue"
import { useOutboxMessageCompose } from "src/common/composables/useMemberMessenger"
import { S3_STORAGE_CATEGORY } from "src/common/utils/constants"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()
const { t } = useI18n()

const { isPending, mutateAsync: composeMutateAsync } = useOutboxMessageCompose()

const subject = ref("")
const content = ref("")
const imageKeys = ref<string[]>([])

const canSubmit = computed(() => subject.value.trim().length > 0 && content.value.trim().length > 0)

async function handleSubmit() {
  if (!canSubmit.value || isPending.value) return
  try {
    await composeMutateAsync({
      subject: subject.value.trim(),
      content: content.value.trim(),
      ...(imageKeys.value.length > 0 ? { images: imageKeys.value } : {}),
    })
    onDialogOK()
  } catch {
    // 失敗時 useApi 已處理 Notify；mutation 會 reject
  }
}
</script>

<style scoped lang="scss">
.messenger-compose-subject-field,
.messenger-compose-content-field {
  :deep(.q-field__control::before) {
    @apply border border-solid;
    box-shadow: 0 0 6px 0 rgb(0 0 0 / 0.2);
  }
}

.messenger-compose-subject-field {
  :deep(.q-field__control) {
    @apply h-10 min-h-10;
  }

  :deep(input.q-field__native) {
    @apply h-10 min-h-0;
    background-color: transparent !important;
  }
}

.messenger-compose-content-field {
  :deep(.q-field__control) {
    @apply h-20 min-h-20;
  }

  :deep(textarea.q-field__native) {
    @apply min-h-20 h-20;
    background-color: transparent !important;
    resize: none;
  }
}
</style>
