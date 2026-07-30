<template>
  <PanelBase
    :tab="MemberMessengerTab.Inbox"
    :status-option-defs="INBOX_STATUS_FILTER_OPTIONS"
    @view="handleView"
  />
</template>

<script lang="ts" setup>
import { useQueryClient } from "@tanstack/vue-query"
import { useQuasar } from "quasar"
import {
  type MemberMessengerPanelRow,
  memberMessengerQueryKeys
} from "src/common/composables/useMemberMessenger"
import { useWebSocketNotification } from "src/common/composables/useWebSocketNotification"
import { INBOX_STATUS_FILTER_OPTIONS, MemberMessengerTab } from "src/common/utils/constants/memberMessenger"

import InboxMessageDialog from "./InboxMessageDialog.vue"
import PanelBase from "./PanelBase.vue"

const queryClient = useQueryClient()
const $q = useQuasar()
const { refreshUnreadCount } = useWebSocketNotification()

function handleView(row: MemberMessengerPanelRow) {
  const dialog = $q.dialog({
    component: InboxMessageDialog,
    componentProps: {
      messageId: row.id,
    },
  })

  if (row.statusType === "unread") {
    dialog.onDismiss(async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: memberMessengerQueryKeys.inbox() }),
        refreshUnreadCount(),
      ])
    })
  }
}
</script>
