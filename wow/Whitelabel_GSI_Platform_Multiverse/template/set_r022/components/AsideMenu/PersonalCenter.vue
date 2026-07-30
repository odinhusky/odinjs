<template>
  <section class="personal-center-container">
    <template v-for="item in menuList" :key="item.routeName">
      <div
        v-if="item.isShow"
        class="menu-item"
        :class="{ active: item.activeRouteNames.includes(String(currentRoute.name)) }"
        @click="goTo(item.routeName)"
      >
        <div class="item-icon-wrapper">
          <q-img :src="svgIcon(item.icon)" class="item-icon" />
        </div>
        <div class="item-text">{{ t(item.label) }}</div>
        <q-badge
          v-if="['memberProfile', 'memberInbox'].includes(item.routeName) && inboxUnreadTotal > 0"
          class="member-unread-badge"
          color="negative"
          rounded
          :label="inboxUnreadTotal > 99 ? '99+' : inboxUnreadTotal"
        />
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnv } from "src/common/hooks/useEnv"
import { useWebSocketNotificationStore } from "src/stores/webSocketNotificationStore"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

const { svgIcon } = useSiteImg()
const { t } = useI18n({ useScope: "global" })
const router = useRouter()
const currentRoute = useRoute()
const { isCash } = useEnv()
const webSocketNotificationStore = useWebSocketNotificationStore()
const inboxUnreadTotal = computed(() => webSocketNotificationStore.webSocketNotificationState.unreadCount.total)
const { userInfo, userInfo2 } = useUserInfo()
const isMemberAgent = computed(() => Boolean(userInfo2.value?.is_member_agent || userInfo.value?.is_member_agent))

const menuList = computed(() => [
  {
    label: "menu.memberCenter",
    routeName: "memberProfile",
    activeRouteNames: ["memberProfile"],
    icon: "profile",
    isShow: true,
  },
  {
    label: "menu.history",
    routeName: "history",
    activeRouteNames: ["history", "HistoryAll", "HistoryMember", "HistoryAi"],
    icon: "history",
    isShow: true,
  },
  {
    label: "menu.order",
    routeName: "orders",
    activeRouteNames: ["orders"],
    icon: "order",
    isShow: isCash.value,
  },
  {
    label: "menu.membershipManagement",
    routeName: "MembershipManagement",
    activeRouteNames: ["MembershipManagement"],
    icon: "agent-center",
    isShow: isMemberAgent.value,
  },
  {
    label: "menu.inbox",
    routeName: "memberInbox",
    activeRouteNames: ["memberInbox", "memberOutbox"],
    icon: "inbox",
    isShow: true,
  },
])

const goTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>

<style lang="scss" scoped>
.personal-center-container {
  @apply flex flex-col gap-[.5rem] mt-[.75rem];
  border-top: 1px solid var(--neutral-03);

  .menu-item {
    position: relative;
    @apply flex items-center gap-[.5rem] cursor-pointer rounded-[.5rem];
    padding: 0.5rem 0 0.5rem 0.75rem;
    color: var(--primary-02);
    transition: all 0.3s ease;

    .member-unread-badge {
      position: absolute;
      right: 0.75rem;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
    }

    &:hover {
      background: var(--neutral-04);
    }

    &.active {
      background: var(--primary-01);
      color: var(--text-01);
    }

    .item-icon-wrapper {
      @apply w-[1.25rem] h-[1.25rem] flex items-center justify-center;

      .item-icon {
        @apply w-[1.25rem] h-[1.25rem];
      }
    }

    .item-text {
      font-size: 1rem;
      line-height: 1.5rem;
    }
  }
}
</style>
