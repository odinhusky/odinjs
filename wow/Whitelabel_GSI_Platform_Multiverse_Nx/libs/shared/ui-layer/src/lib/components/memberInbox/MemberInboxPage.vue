<script setup lang="ts">
import { MEMBER_ASIDE_KEYS } from "../../constants/memberAside"

const inbox = useMemberInbox()
provideMemberInboxContext(inbox)

const { rows, handleOpenDetail } = inbox

const { isDown } = useCustomBreakpoints()
const { mobileContentVisible, handleAsideSelect, handleBackToAside } = useMemberAsideNavigation(MEMBER_ASIDE_KEYS.INBOX)
</script>

<template>
  <MemberContainer
    header-title="會員中心"
    content-title="我的訊息"
    :show-aside="true"
    :mobile-content-visible="mobileContentVisible"
    :disable-content-max-width="true"
    @back="handleBackToAside"
  >
    <template #aside>
      <MemberAsideInfo :active-key="MEMBER_ASIDE_KEYS.INBOX" @select="handleAsideSelect" />
    </template>

    <div class="w-full h-full min-h-0">
      <div v-if="isDown.mob" class="w-full h-full min-h-0 overflow-y-auto pr-1">
        <template v-if="rows.length > 0">
          <BasePlainBtn
            v-for="row in rows"
            :key="row.id"
            :class-obj="{
              button: cx(
                'group w-full rounded-xl p-3 mb-2 text-left border border-[var(--border-border-primary)]',
                'bg-[var(--table-table-content-bg-light)] transition-colors duration-150',
                'hover:bg-[var(--list-list-bg-hover)] active:bg-[var(--list-list-bg-active)]'
              )
            }"
            @click="handleOpenDetail(row.id)"
          >
            <div class="w-full flex items-center gap-4">
              <div class="min-w-0 flex-1 mr-auto">
                <div
                  class="flex items-center gap-2 text-sm leading-5 text-[var(--list-list-subtitle-active)] opacity-70"
                >
                  <span>{{ row.sendAt }}</span>
                  <span v-if="!row.isRead" class="w-2 h-2 rounded-full bg-[var(--tag-tag-title-info)]" />
                </div>

                <div
                  class="mt-1 text-base leading-6 font-bold text-[var(--list-list-title-active)] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
                >
                  {{ row.title }}
                </div>
              </div>

              <BaseIconBtn
                icon="mdi:arrow-right"
                theme="normal"
                size="md"
                :class-obj="{
                  button:
                    'pointer-events-none group-hover:!bg-[var(--button-button-bg-icon-tertiary-hover)] group-hover:!text-[var(--button-button-title-icon-tertiary-hover)] group-hover:!border-[var(--button-button-border-icon-tertiary-hover)] group-active:!bg-[var(--button-button-bg-icon-tertiary-hover)] group-active:!text-[var(--button-button-title-icon-tertiary-active)] group-active:!border-[var(--button-button-border-icon-tertiary-active)]'
                }"
              />
            </div>
          </BasePlainBtn>
        </template>

        <NoData v-else type="empty" />
      </div>

      <MemberInboxTablePanel v-else />
    </div>

    <MemberInboxDetailDialog />
  </MemberContainer>
</template>
