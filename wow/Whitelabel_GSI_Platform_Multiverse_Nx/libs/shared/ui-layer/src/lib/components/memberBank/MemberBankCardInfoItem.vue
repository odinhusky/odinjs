<script setup lang="ts">
type MemberBankCardInfoItemMode =
  (typeof MEMBER_BANK_CARD_INFO_ITEM_MODE_OBJ)[keyof typeof MEMBER_BANK_CARD_INFO_ITEM_MODE_OBJ]

interface Props {
  label: string
  value?: string | number | null
  mode?: MemberBankCardInfoItemMode
}

const props = withDefaults(defineProps<Props>(), {
  value: "-",
  mode: MEMBER_BANK_CARD_INFO_ITEM_MODE_OBJ.STACK
})

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined || String(props.value).trim() === "") return "-"
  return String(props.value)
})
</script>

<template>
  <div :class="props.mode === MEMBER_BANK_CARD_INFO_ITEM_MODE_OBJ.INLINE ? 'flex items-center gap-1' : 'flex flex-col'">
    <span class="text-xs leading-[18px] text-[var(--card-card-subtitle-primary-enabled)]">
      {{ props.label }}
    </span>

    <span class="text-xs font-semibold leading-[18px] text-[var(--card-card-title-primary-enabled)]">
      {{ displayValue }}
    </span>
  </div>
</template>
