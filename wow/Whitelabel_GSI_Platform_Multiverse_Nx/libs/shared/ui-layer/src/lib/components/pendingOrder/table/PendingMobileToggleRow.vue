<script setup lang="ts">
import type { PendingOrderRowView } from "../../../composables/usePendingOrder"

interface Props {
  data: PendingOrderRowView
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "open-detail", row: PendingOrderRowView): void
}>()

const handleOpenDetail = () => {
  if (!props.data.isBankTransfer) return
  emit("open-detail", props.data)
}

const transCodeLinkClassObj = {
  button: "text-[var(--link)] hover:underline focus:underline"
}
</script>

<template>
  <div
    :class="cx('w-full', FLEX_ITEMS_CENTER, 'justify-between gap-3 bg-[var(--list-list-bg-enabled)] p-4 rounded-lg')"
  >
    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-3 min-w-0')">
      <span class="px-2 py-1 rounded-full text-xs leading-4 bg-white/15 text-white font-bold shrink-0">
        {{ props.data.currencyCode }}
      </span>
      <div class="min-w-0">
        <BasePlainBtn
          v-if="props.data.isBankTransfer"
          :class-obj="transCodeLinkClassObj"
          class="text-sm font-bold truncate"
          @click.stop="handleOpenDetail"
        >
          {{ props.data.transCode }}
        </BasePlainBtn>
        <div v-else class="text-sm font-bold text-[var(--table-table-content-title-enabled)] truncate">
          {{ props.data.transCode }}
        </div>
        <div class="text-xs leading-4 text-[var(--table-table-content-title-enabled)] opacity-70 truncate">
          {{ props.data.submitDate }}
        </div>
      </div>
    </div>

    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-2 shrink-0')">
      <div class="text-right">
        <div class="text-sm font-bold text-[var(--table-table-content-title-enabled)]">{{ props.data.amount }}</div>
        <div class="text-xs leading-4 text-[var(--table-table-content-title-enabled)] opacity-70">
          {{ props.data.orderType === 1 ? "存款" : "出金" }}
        </div>
      </div>
    </div>
  </div>
</template>
