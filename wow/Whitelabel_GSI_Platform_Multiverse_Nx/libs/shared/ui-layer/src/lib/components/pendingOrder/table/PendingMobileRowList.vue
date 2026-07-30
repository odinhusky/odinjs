<script setup lang="ts">
import type { PendingOrderRowView } from "../../../composables/usePendingOrder"

interface Props {
  data: PendingOrderRowView
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "copy", transCode: string): void
  (e: "open-detail", row: PendingOrderRowView): void
  (e: "upload", row: PendingOrderRowView): void
  (e: "cancel", row: PendingOrderRowView): void
}>()

const handleCopy = () => emit("copy", props.data.transCode)
const handleOpenDetail = () => {
  if (!props.data.isBankTransfer) return
  emit("open-detail", props.data)
}
const handleUpload = (row: PendingOrderRowView) => emit("upload", row)
const handleCancel = (row: PendingOrderRowView) => emit("cancel", row)

const transCodeLinkClassObj = {
  button: "text-[var(--link)] hover:underline focus:underline"
}
</script>

<template>
  <div class="flex p-2 items-center border-b border-[var(--border-border-primary)]">
    <div class="w-1/2 text-xs leading-[18px] text-[var(--table-table-content-title-enabled)]">編號</div>
    <div class="w-1/2 ml-auto flex items-center justify-end gap-1">
      <BasePlainBtn
        v-if="props.data.isBankTransfer"
        :class-obj="transCodeLinkClassObj"
        class="text-right text-xs leading-[18px] font-bold break-all"
        @click="handleOpenDetail"
      >
        {{ props.data.transCode }}
      </BasePlainBtn>
      <span
        v-else
        class="text-right text-xs leading-[18px] font-bold text-[var(--table-table-content-title-enabled)] break-all"
      >
        {{ props.data.transCode }}
      </span>
      <BaseIconBtn
        icon="bxs:copy"
        size="sm"
        theme="normal"
        :class="'!bg-transparent !shadow-none !border-0 !p-0 !rounded-none !text-[var(--text-text-primary)]'"
        @click="handleCopy"
      />
    </div>
  </div>

  <div class="flex p-2 items-center border-b border-[var(--border-border-primary)]">
    <div class="w-1/2 text-xs leading-[18px] text-[var(--table-table-content-title-enabled)]">金流類型</div>
    <div
      class="w-1/2 ml-auto text-right text-xs leading-[18px] font-bold text-[var(--table-table-content-title-enabled)] break-all"
    >
      {{ props.data.paymentTypeLabel }}
    </div>
  </div>

  <div class="flex p-2 items-center border-b border-[var(--border-border-primary)]">
    <div class="w-1/2 text-xs leading-[18px] text-[var(--table-table-content-title-enabled)]">支付商</div>
    <div
      class="w-1/2 ml-auto text-right text-xs leading-[18px] font-bold text-[var(--table-table-content-title-enabled)] break-all"
    >
      {{ props.data.paymentGatewayName }}
    </div>
  </div>

  <div class="flex p-2 items-center border-b border-[var(--border-border-primary)]">
    <div class="w-1/2 text-xs leading-[18px] text-[var(--table-table-content-title-enabled)]">幣別</div>
    <div
      class="w-1/2 ml-auto text-right text-xs leading-[18px] font-bold text-[var(--table-table-content-title-enabled)] break-all"
    >
      {{ props.data.currencyCode }}
    </div>
  </div>

  <div class="flex p-2 items-center border-b border-[var(--border-border-primary)]">
    <div class="w-1/2 text-xs leading-[18px] text-[var(--table-table-content-title-enabled)]">金額</div>
    <div
      class="w-1/2 ml-auto text-right text-xs leading-[18px] font-bold text-[var(--table-table-content-title-enabled)] break-all"
    >
      {{ props.data.amount }}
    </div>
  </div>

  <div class="flex p-2 items-center border-b border-[var(--border-border-primary)]">
    <div class="w-1/2 text-xs leading-[18px] text-[var(--table-table-content-title-enabled)]">實際金額</div>
    <div
      class="w-1/2 ml-auto text-right text-xs leading-[18px] font-bold text-[var(--table-table-content-title-enabled)] break-all"
    >
      {{ props.data.actualAmount }}
    </div>
  </div>

  <div class="flex p-2 items-center border-b border-[var(--border-border-primary)]">
    <div class="w-1/2 text-xs leading-[18px] text-[var(--table-table-content-title-enabled)]">申請日期</div>
    <div
      class="w-1/2 ml-auto text-right text-xs leading-[18px] font-bold text-[var(--table-table-content-title-enabled)] break-all"
    >
      {{ props.data.submitDate }}
    </div>
  </div>

  <div class="flex p-2 items-center border-b border-[var(--border-border-primary)]">
    <div class="w-1/2 text-xs leading-[18px] text-[var(--table-table-content-title-enabled)]">狀態</div>
    <div class="w-1/2 ml-auto flex justify-end">
      <BaseBadge size="md" :theme="props.data.statusTheme">
        {{ props.data.statusLabel }}
      </BaseBadge>
    </div>
  </div>

  <div class="flex p-2 items-center border-b border-[var(--border-border-primary)]">
    <PendingActionCell mobile :data="props.data" @upload="handleUpload" @cancel="handleCancel" />
  </div>
</template>
