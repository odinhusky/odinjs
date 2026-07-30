<template>
  <HeaderTitleBack
    v-if="isMobile"
    variant="setR022"
    title-i18n="member.mail.myMessages"
    q-card-class="member-inbox-mobile-dialog"
  >
    <template #right>
      <q-btn flat icon="mail" class="notification-inbox-btn">
        <q-badge
          v-if="inboxUnreadTotal > 0"
          class="notification-inbox-badge"
          color="negative"
          rounded
          :label="inboxUnreadTotal > 99 ? '99+' : inboxUnreadTotal"
        />
      </q-btn>
    </template>
    <div class="member-messenger-tabs-pill">
      <MemberMessenger />
    </div>
  </HeaderTitleBack>

  <div v-else class="inbox-area">
    <div class="top-area flex items-center gap-2">
      <span>{{ $t("member.mail.myMessages") }}</span>
      <q-badge
        v-if="inboxUnreadTotal > 0"
        color="negative"
        rounded
        :label="inboxUnreadTotal > 99 ? '99+' : inboxUnreadTotal"
      />
    </div>
    <div class="member-messenger-tabs-pill">
      <MemberMessenger />
    </div>
  </div>
</template>

<script lang="ts" setup>
import MemberMessenger from "src/common/components/MemberMessenger/index.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useWebSocketNotificationStore } from "src/stores/webSocketNotificationStore"
import { MemberMessengerRouteNamesKey } from "src/symbols"
import { computed, provide, toRef } from "vue"

const messengerRouteNames = { inbox: "memberInbox", outbox: "memberOutbox" } as const
const webSocketNotificationStore = useWebSocketNotificationStore()
const inboxUnreadTotal = computed(() => webSocketNotificationStore.webSocketNotificationState.unreadCount.total)
provide(MemberMessengerRouteNamesKey, messengerRouteNames)

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "pc")
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.notification-inbox-btn {
  position: relative;
}
.notification-inbox-badge {
  position: absolute;
  top: -3px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
}
@import "app/template/set_r022/assets/css/_variable.scss";

.inbox-area {
  width: 100%;
  max-width: 87.5rem;
  padding: 1.4625rem 0 10%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .top-area {
    width: 100%;
    border-radius: 0.5rem;
    padding: 1.3125rem 1.25rem;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .member-messenger-tabs-pill {
    padding-left: 1.25rem;

    :deep(.member-messenger:not(.member-messenger--mobile)) {
      padding-top: 0;
    }
  }
}
</style>

<style lang="scss">
@import "app/template/set_r022/assets/css/memberMessenger";

.full-screen-container.member-inbox-mobile-dialog {
  .member-messenger-tabs-pill {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }
}
</style>
