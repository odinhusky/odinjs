<template>
  <PanelBase :tab="MemberMessengerTab.Outbox" :status-option-defs="OUTBOX_STATUS_FILTER_OPTIONS" @view="handleView">
    <template #row-actions-extra="{ row }">
      <q-btn
        v-if="row.statusType !== 'closed'"
        flat
        dense
        no-caps
        padding="4px 12px"
        class="outbox-close-thread-btn-desktop"
        :label="t('member.messenger.closeChat')"
        :loading="closingId === row.id"
        @click.stop="handleCloseThread(row)"
      />
    </template>
    <template #row-actions-extra-mobile="{ row }">
      <div v-if="row.statusType !== 'closed'" class="min-w-0 overflow-hidden">
        <q-btn
          flat
          dense
          no-caps
          padding="4px 12px"
          class="outbox-close-thread-btn-mobile w-full min-h-10 min-w-0"
          :label="t('member.messenger.closeChat')"
          :loading="closingId === row.id"
          @click.stop="handleCloseThread(row)"
        />
      </div>
    </template>
    <template #toolbar-extra>
      <q-btn
        color="primary"
        no-caps
        class="member-messenger-compose-btn member-messenger-search-btn !rounded-lg min-h-10"
        @click="openComposeDialog"
      >
        <span class="inline-flex min-w-0 items-center justify-center gap-1.5">
          {{ t("member.messenger.newMessage") }}
          <Icon icon="mdi:plus-circle-outline" width="20" height="20" class="shrink-0" aria-hidden="true" />
        </span>
      </q-btn>
    </template>
  </PanelBase>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { useQueryClient } from "@tanstack/vue-query"
import { useQuasar } from "quasar"
import { useConfirmDialog } from "src/common/composables/useConfirmDialog"
import {
  type MemberMessengerPanelRow,
  memberMessengerQueryKeys,
  useOutboxMessageClose,
} from "src/common/composables/useMemberMessenger"
import { MemberMessengerTab, OUTBOX_STATUS_FILTER_OPTIONS } from "src/common/utils/constants/memberMessenger"
import { ref } from "vue"
import { useI18n } from "vue-i18n"

import OutboxComposeDialog from "./OutboxComposeDialog.vue"
import OutboxMessageDialog from "./OutboxMessageDialog.vue"
import PanelBase from "./PanelBase.vue"

const { t } = useI18n()
const queryClient = useQueryClient()
const $q = useQuasar()
const { openConfirmDialog } = useConfirmDialog()
const closingId = ref<number | null>(null)
const { mutateAsync: closeOutboxMutateAsync } = useOutboxMessageClose()

function handleView(row: MemberMessengerPanelRow) {
  $q.dialog({
    component: OutboxMessageDialog,
    componentProps: {
      messageId: row.id,
      statusType: row.statusType,
    },
  })
}

function openComposeDialog() {
  $q.dialog({
    component: OutboxComposeDialog,
  }).onOk(async () => {
    await queryClient.invalidateQueries({ queryKey: memberMessengerQueryKeys.outbox() })
  })
}

function handleCloseThread(row: MemberMessengerPanelRow) {
  if (row.statusType === "closed" || closingId.value != null) return

  openConfirmDialog({
    title: t("member.messenger.action.close.confirm.title"),
    message: t("member.messenger.action.close.confirm.message"),
    dialogClass: "member-messenger-confirm-dialog",
    backdropScrim: "rgba(0, 0, 0, 0.75)",
  }).onOk(async () => {
    closingId.value = row.id
    try {
      await closeOutboxMutateAsync(row.id)
      await queryClient.invalidateQueries({ queryKey: memberMessengerQueryKeys.outbox() })
    } catch {
      // 失敗時 useApi 已處理 Notify；mutation 會 reject
    } finally {
      closingId.value = null
    }
  })
}
</script>

<style lang="scss" scoped>
.outbox-close-thread-btn-desktop,
.outbox-close-thread-btn-mobile {
  &.q-btn--dense :deep(.q-btn__wrapper),
  :deep(.q-btn__wrapper) {
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }
}

.outbox-close-thread-btn-mobile {
  @apply text-[0.8125rem];
}

.outbox-close-thread-btn-mobile :deep(.q-btn__wrapper) {
  @apply shadow-none !important;
}

.outbox-close-thread-btn-mobile :deep(.q-btn__wrapper::before) {
  @apply shadow-none !important;
}
</style>
