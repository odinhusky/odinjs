<script setup lang="ts">
import { useMemberInboxContext } from "../../composables/useMemberInbox/useMemberInboxContext"

const {
  rows,
  selectedMail,
  selectedMailIndex,
  isDialogVisible,
  canNavigatePrev,
  canNavigateNext,
  closeDialog,
  openPrev,
  openNext
} = useMemberInboxContext()

const selectedMailNumberText = computed(() => {
  if (!selectedMail.value) return "0/0"
  return `${selectedMailIndex.value + 1}/${rows.value.length}`
})
</script>

<template>
  <BaseDialog
    :visible="isDialogVisible"
    :class-obj="{
      root: '!max-w-[540px] phone:!w-screen',
      body: '!p-0',
      header: '!py-4 !px-5',
      title: '!text-xl !leading-7'
    }"
    @close="closeDialog"
  >
    <template #header>
      {{ selectedMail?.title || "我的訊息" }}
    </template>

    <div :class="cx('w-full px-5 py-6', FLEX_COL, 'gap-4')">
      <div class="text-sm leading-5 text-[var(--dialog-dialog-subtitle-content)]">
        {{ selectedMail?.sendAt || "-" }}
      </div>

      <div class="text-base leading-6 text-[var(--dialog-dialog-title-content)] break-words">
        <div v-if="selectedMail?.body">
          {{ selectedMail.body }}
        </div>
        <div v-else>-</div>
      </div>
    </div>

    <template #footer>
      <div class="w-full flex items-center justify-center gap-6">
        <BaseIconBtn icon="mdi:arrow-left" size="md" theme="secondary" :disabled="!canNavigatePrev" @click="openPrev" />

        <div class="text-base leading-6 font-normal text-[var(--dialog-dialog-title-footer)]">
          {{ selectedMailNumberText }}
        </div>

        <BaseIconBtn
          icon="mdi:arrow-right"
          size="md"
          theme="secondary"
          :disabled="!canNavigateNext"
          @click="openNext"
        />
      </div>
    </template>
  </BaseDialog>
</template>
