<script setup lang="ts">
interface Props {
  rows: Record<string, any>[]
  expandedRowKey?: string
  isLoading: boolean
  openingWagerCode?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "toggle-row", key: string): void
  (e: "open-detail", row: Record<string, any>): void
}>()

const onToggle = (row: Record<string, any>) => emit("toggle-row", row._rowKey || row.wager_code)

const onOpenDetail = (row: Record<string, any>) => emit("open-detail", row)

const labelCls = "text-xs text-[var(--list-list-subtitle-enabled)]"
const valueCls = "text-sm font-semibold text-[var(--text-text-primary)] break-all"
</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <div v-if="props.isLoading" class="flex justify-center py-8">
      <BaseIcon name="mdi:loading" size="32px" class="animate-spin text-[var(--text-text-secondary)]" />
    </div>

    <div v-else-if="!props.rows.length" class="flex justify-center py-8">
      <NoData />
    </div>

    <template v-else>
      <div
        v-for="row in props.rows"
        :key="row._rowKey || row.wager_code"
        class="w-full rounded-lg border border-[var(--border-border-primary)] bg-[var(--list-list-bg-enabled)] overflow-hidden"
      >
        <button
          type="button"
          class="w-full flex items-center justify-between px-4 py-3"
          @click="onToggle(row)"
        >
          <div class="flex flex-col items-start">
            <span :class="valueCls">{{ row.wager_code }}</span>
            <span :class="labelCls">注單編號</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex flex-col items-end">
              <span :class="valueCls">{{ row.member_account }}</span>
              <span :class="labelCls">會員帳號</span>
            </div>
            <BaseIcon
              :name="props.expandedRowKey === (row._rowKey || row.wager_code) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              size="20px"
              class="text-[var(--text-text-secondary)]"
            />
          </div>
        </button>

        <div
          v-if="props.expandedRowKey === (row._rowKey || row.wager_code)"
          class="border-t border-[var(--border-border-primary)] px-4 py-3 flex flex-col gap-2"
        >
          <div class="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <div :class="labelCls">遊戲場地</div>
              <div :class="valueCls">{{ row.gaming_site_display }}</div>
            </div>
            <div>
              <div :class="labelCls">狀態</div>
              <div :class="valueCls">{{ row.status_display }}</div>
            </div>
            <div>
              <div :class="labelCls">投注時間</div>
              <div :class="valueCls">{{ row.created_at_display }}</div>
            </div>
            <div>
              <div :class="labelCls">結算時間</div>
              <div :class="valueCls">{{ row.settled_at_display }}</div>
            </div>
            <div>
              <div :class="labelCls">投注來源</div>
              <div :class="valueCls">{{ row.channel_code_display }}</div>
            </div>
            <div>
              <div :class="labelCls">產品</div>
              <div :class="valueCls">{{ row.product_display }}</div>
            </div>
            <div>
              <div :class="labelCls">遊戲</div>
              <div :class="valueCls">{{ row.game_display }}</div>
            </div>
            <div>
              <div :class="labelCls">投注金額</div>
              <div :class="valueCls">{{ row.bet_amount_display }}</div>
            </div>
            <div>
              <div :class="labelCls">有效投注</div>
              <div :class="valueCls">{{ row.valid_bet_amount_display }}</div>
            </div>
            <div>
              <div :class="labelCls">派彩</div>
              <button
                type="button"
                class="text-sm font-semibold text-[var(--button-button-bg-primary-left-enabled)] underline text-left"
                :class="{ 'opacity-60 pointer-events-none': props.openingWagerCode === row.wager_code }"
                @click="onOpenDetail(row)"
              >
                {{ row.payout_display }}
              </button>
            </div>
            <div>
              <div :class="labelCls">盈虧</div>
              <div :class="valueCls">{{ row.profit_display }}</div>
            </div>
            <div>
              <div :class="labelCls">活動獎金</div>
              <div :class="valueCls">{{ row.bonus_display }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
