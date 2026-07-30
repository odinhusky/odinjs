<script setup lang="ts">
import { useI18n } from "#imports"
import type { BankCardItemType } from "@shared-lib/api/apiFunctions/bank_getBankCardList"
import {
  MEMBER_BANK_CARD_MODE_OBJ,
  MEMBER_BANK_CARD_INFO_ITEM_MODE_OBJ
} from "@shared-lib/constants/propsCategoryObj"
import type { MemberBankCardBaseProps, MemberBankCardSelectableProps } from "./cardProps"
import MemberBankCardInfoItem from "./MemberBankCardInfoItem.vue"

interface Props extends MemberBankCardBaseProps<BankCardItemType>, MemberBankCardSelectableProps {}

const props = withDefaults(defineProps<Props>(), {
  mode: MEMBER_BANK_CARD_MODE_OBJ.ACTION,
  selected: false,
  selectableValue: null,
  disabled: false
})
const { t } = useI18n()

const emit = defineEmits<{
  edit: [id: number]
  delete: [id: number]
  select: [id: number]
}>()

const isSelectable = computed(
  () => props.mode === MEMBER_BANK_CARD_MODE_OBJ.SELECT || props.mode === MEMBER_BANK_CARD_MODE_OBJ.SELECT_ACTION
)

const handleSelect = () => {
  if (!isSelectable.value || props.disabled) return
  emit("select", props.card.id)
}

const handleHeaderEdit = (id: number) => {
  emit("edit", id)
}

const handleHeaderDelete = (id: number) => {
  emit("delete", id)
}

const handleHeaderSelect = (id: number) => {
  emit("select", id)
}

const cardClass = computed(() => {
  return cx(
    "relative w-full rounded-[var(--spacing-p-4,_16px)] p-4",
    "border border-[var(--card-card-border-secondary-enabled,_rgba(255,255,255,0.06))]",
    "bg-[var(--surface-surface-contrainer)] overflow-hidden text-left",
    "transition-colors duration-200",

    // after: 右上左下的光暈背景
    "after:pointer-events-none after:absolute after:inset-0 after:z-[3] after:bg-[url('/images/bankCard/virtaul-bank-card-light-bg.png')] after:bg-cover after:bg-no-repeat after:bg-center",

    isSelectable.value &&
      "cursor-pointer focus-visible:border-[var(--card-card-border-primary-active,#f97316)] focus-visible:outline-none",
    isSelectable.value && props.selected && "border-[var(--card-card-border-primary-active,#f97316)]",
    props.disabled && "opacity-70 cursor-not-allowed"
  )
})
</script>

<template>
  <BasePlainBtn :class="cardClass" @click="handleSelect">
    <div class="w-full relative z-[4] flex flex-col gap-2">
      <MemberBankCardHeader
        :title="props.card.name || t('deposit_account_name')"
        :card-id="props.card.id"
        :mode="props.mode"
        :selectable-value="props.selectableValue"
        @edit="handleHeaderEdit"
        @delete="handleHeaderDelete"
        @select="handleHeaderSelect"
      />

      <div
        class="text-sm leading-5 font-semibold text-[var(--card-card-title-primary-enabled)] break-all phone:text-[20px] phone:leading-[26px]"
      >
        {{ props.card.wallet_address || "-" }}
      </div>

      <MemberBankCardInfoItem
        :label="t('deposit_network')"
        :value="props.card.chain"
        :mode="MEMBER_BANK_CARD_INFO_ITEM_MODE_OBJ.INLINE"
      />
    </div>
  </BasePlainBtn>
</template>
