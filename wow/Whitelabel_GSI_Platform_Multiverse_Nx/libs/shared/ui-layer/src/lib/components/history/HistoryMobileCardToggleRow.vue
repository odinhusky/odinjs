<script setup lang="ts">
interface Props {
  data: Record<string, any>
  expanded: boolean
}

defineProps<Props>()

const cardTitleClass = cx("text-sm font-bold leading-[18px] text-[var(--text-text-primary)]")
const subTitleClass = cx("text-[10px] leading-[normal] text-[var(--list-list-subtitle-enabled)]")
</script>

<template>
  <div :class="cx('w-full', FLEX_ITEMS_CENTER, 'gap-3 bg-[var(--list-list-bg-enabled)]', 'p-4', 'rounded-lg')">
    <BaseBadge size="sm" theme="base">
      {{ data.currencyCode }}
    </BaseBadge>

    <div class="min-w-0 flex-1">
      <div :class="cardTitleClass">
        {{ data.updatedAt }}
      </div>
      <div :class="subTitleClass">帳變時間</div>
    </div>

    <div class="text-right">
      <div :class="cardTitleClass">
        {{ data.afterBalance }}
      </div>
      <div :class="subTitleClass">變帳後金額</div>
    </div>

    <!-- <BaseIcon :name="expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'" size="22px" /> -->
  </div>
</template>
