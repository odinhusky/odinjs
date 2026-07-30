<script setup lang="ts">
import { useI18n } from "#imports"
import type { BankCardItemType } from "@shared-lib/api/apiFunctions/bank_getBankCardList"
import { MEMBER_BANK_CARD_MODE_OBJ } from "@shared-lib/constants/propsCategoryObj"
import type { MemberBankCardBaseProps, MemberBankCardSelectableProps } from "./cardProps"
import MemberBankCardInfoItem from "./MemberBankCardInfoItem.vue"

interface Props extends MemberBankCardBaseProps<BankCardItemType>, MemberBankCardSelectableProps {}

const props = withDefaults(defineProps<Props>(), {
  mode: "action",
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

const maskedAccountNumber = computed(() => {
  const source = props.card.account_number || ""
  if (source.length <= 8) return source
  return `${source.slice(0, 4)} ${source.slice(4, 8)} ${"*".repeat(Math.max(0, source.length - 8))}`
})

const providerLabel = computed(() => {
  return props.card.ewallet_provider_name ? t("table_header.payment_provider") : t("edit_form.bank_account")
})

const providerValue = computed(() => {
  return props.card.ewallet_provider_name || props.card.bank_name
})

const isSelectable = computed(
  () => props.mode === MEMBER_BANK_CARD_MODE_OBJ.SELECT || props.mode === MEMBER_BANK_CARD_MODE_OBJ.SELECT_ACTION
)

const cardClass = computed(() => {
  return cx(
    "w-full p-4",
    "relative  overflow-hidden outline-none",
    "rounded-2xl",
    "border border-[var(--border-border-line)]",
    "bg-[var(--surface-surface-contrainer)]",
    "text-left",
    "transition-colors duration-200",
    // before: background line texture
    "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:right-0 before:z-[2] before:inset-0 before:bg-[url('/images/bankCard/bank-lines-bg.png')] before:bg-[length:100%_100%] before:bg-no-repeat before:bg-bottom",

    // after: corner glow background
    "after:pointer-events-none after:absolute after:inset-0 after:z-[3] after:bg-[url('/images/bankCard/bank-card-light-bg.png')] after:bg-cover after:bg-no-repeat after:bg-center",

    isSelectable.value && props.selected && "border-[var(--card-card-border-primary-active,_#f97316)]",
    isSelectable.value && "cursor-pointer focus-visible:border-[var(--card-card-border-primary-active,_#f97316)]",
    props.disabled && "opacity-70 cursor-not-allowed"
  )
})

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
</script>

<template>
  <BasePlainBtn :class="cardClass" @click="handleSelect">
    <div class="w-full relative z-[4] flex flex-col gap-6">
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
        :class="
          cx(
            FLEX_CENTER,
            'text-center text-base font-semibold leading-6 text-[var(--card-card-title-primary-enabled)] break-all'
          )
        "
      >
        {{ maskedAccountNumber }}
      </div>

      <div class="grid grid-cols-3 gap-2">
        <MemberBankCardInfoItem :label="providerLabel" :value="providerValue" />

        <MemberBankCardInfoItem :label="t('member.bank.bankBranch')" :value="props.card.branch" />

        <MemberBankCardInfoItem :label="t('bank_column.gateway')" :value="props.card.payment_gateway_name" />
      </div>
    </div>
  </BasePlainBtn>
</template>
