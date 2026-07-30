<template>
  <div
    class="member-messenger"
    :class="
      isMobile
        ? 'member-messenger--mobile flex h-full min-h-0 w-full min-w-0 max-w-full flex-col gap-5 overflow-hidden px-4 pt-0'
        : 'flex min-h-0 flex-auto flex-col gap-6 pt-6'
    "
  >
    <q-tabs
      v-model="tab"
      no-caps
      dense
      align="left"
      class="member-messenger-tabs shrink-0"
      :class="{ 'member-messenger-tabs--mobile': isMobile }"
    >
      <q-tab :name="MemberMessengerTab.Inbox" :label="t('member.messenger.inbox')" />
      <q-tab :name="MemberMessengerTab.Outbox" :label="t('member.messenger.outbox')" />
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      animated
      class="member-messenger-panels flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden"
    >
      <q-tab-panel
        :name="MemberMessengerTab.Inbox"
        class="member-messenger-tab-panel flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden !p-0"
      >
        <InboxPanel v-if="tab === MemberMessengerTab.Inbox" />
      </q-tab-panel>
      <q-tab-panel
        :name="MemberMessengerTab.Outbox"
        class="member-messenger-tab-panel flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden !p-0"
      >
        <OutboxPanel v-if="tab === MemberMessengerTab.Outbox" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script lang="ts" setup>
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { MemberMessengerTab } from "src/common/utils/constants/memberMessenger"
import { MemberMessengerRouteNamesKey } from "src/symbols"
import { inject, provide, ref, toRef, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

import InboxPanel from "./components/InboxPanel.vue"
import OutboxPanel from "./components/OutboxPanel.vue"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const routeNameMap = inject(MemberMessengerRouteNamesKey, null)
const { isDown } = useMediaQuery()
/** 與會員中心收件匣頁一致：寬度 ≤ pc 視為行動版 */
const isMobile = toRef(isDown, "pc")

provide("isMobile", isMobile)

function tabFromRouteName(name: unknown): MemberMessengerTab {
  if (!routeNameMap || name == null || typeof name !== "string") {
    return MemberMessengerTab.Inbox
  }
  if (name === routeNameMap.outbox) {
    return MemberMessengerTab.Outbox
  }
  return MemberMessengerTab.Inbox
}

const tab = ref(tabFromRouteName(route.name))

watch(
  () => route.name,
  (n) => {
    const next = tabFromRouteName(n)
    if (tab.value !== next) {
      tab.value = next
    }
  }
)

watch(tab, (newTab) => {
  if (!routeNameMap) {
    return
  }
  const targetName = newTab === MemberMessengerTab.Outbox ? routeNameMap.outbox : routeNameMap.inbox
  if (route.name === targetName) {
    return
  }
  router.replace({
    name: targetName,
    query: route.query,
    hash: route.hash,
  })
})
</script>

<style lang="scss" scoped>
.member-messenger--mobile {
  box-sizing: border-box;
}

.member-messenger-panels {
  :deep(.q-tab-panels) {
    @apply min-w-0 w-full max-w-full overflow-hidden;
  }

  :deep(.q-tab-panel) {
    @apply min-w-0 w-full max-w-full overflow-x-hidden;
  }
}

.member-messenger-tabs {
  @apply mt-[15px] w-full min-w-0 max-w-full border-b border-transparent font-[OpenSans];

  :deep(.q-tabs__content) {
    @apply w-full min-w-0 max-w-full justify-start;
  }

  :deep(.q-tab) {
    @apply min-w-[13.9063rem] text-center text-xl capitalize leading-9;
  }

  :deep(.q-tab.q-tab--active) {
    @apply font-semibold;
  }

  :deep(.q-focus-helper) {
    @apply opacity-0;
  }

  @apply phone:mt-2.5;
}

.member-messenger-tabs--mobile {
  :deep(.q-tab) {
    @apply min-w-0 flex-1 bg-transparent px-5 py-2.5 text-base;
  }

  :deep(.q-tab.q-tab--active) {
    @apply bg-transparent;
  }

  :deep(.q-focus-helper) {
    @apply opacity-0;
  }
}
</style>

<style lang="scss">
/* set_r022 MemberInbox 外層 .member-messenger-tabs-pill */
.member-messenger-tabs-pill .member-messenger .member-messenger-tabs {
  @apply border-b-0;

  .q-tabs__content {
    @apply justify-start gap-0;
  }

  .q-tab {
    @apply mr-5 h-[3.125rem] w-auto min-w-0 rounded-3xl border border-solid px-6 py-0 text-base capitalize leading-tight phone:mr-2.5 phone:h-10 phone:px-4 phone:text-sm;

    .q-tab__indicator {
      @apply hidden;
    }

    .q-focus-helper {
      @apply opacity-0;
    }
  }
}
</style>
