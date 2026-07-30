<script setup lang="ts">
import type { ReferralStatementDetailListResponseType } from "../../api/apiFunctions/referral_getReferralStatementDetail"
import { formatMoney } from "../../utils/formatMoney"

type StatementDetailRow = ReferralStatementDetailListResponseType["list"][number]

interface CurrencyColumn {
  id: string
  code: string
}

const props = defineProps<{
  row: StatementDetailRow
  currencyColumns: CurrencyColumn[]
}>()

const expanded = ref(false)

const downlineCountClass = computed(() =>
  props.row.cashback_count > 0 ? "text-[var(--link)]" : "text-[var(--container-container-field-secondary)]"
)

const headerButtonClass = computed(() =>
  [
    "w-full p-4 flex items-center justify-between gap-3 text-left",
    expanded.value ? "bg-[var(--list-list-bg-active)]" : ""
  ].join(" ")
)

const toggleExpanded = () => {
  expanded.value = !expanded.value
}

const formatRevenue = (currencyId: string) => {
  const value = props.row.revenues[currencyId]
  return value === undefined || value === null ? "-" : formatMoney(value)
}
</script>

<template>
  <article
    class="overflow-hidden rounded-lg bg-[var(--card-card-bg-primary-enabled)] text-[var(--card-card-title-primary-enabled)]"
  >
    <BasePlainBtn :class-obj="{ button: headerButtonClass }" @click="toggleExpanded">
      <div class="min-w-0">
        <div class="truncate text-base leading-6 font-bold">{{ props.row.member_account }}</div>
        <div class="text-xs leading-[18px] text-[var(--card-card-subtitle-primary-enabled)]">
          {{ $t("menu.userAccount") }}
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <div class="text-right">
          <div :class="cx('text-base leading-6 font-bold', downlineCountClass)">
            {{ props.row.cashback_count }}
          </div>
          <div class="text-xs leading-[18px] text-[var(--card-card-subtitle-primary-enabled)]">
            {{ $t("menu.directMemberCount") }}
          </div>
        </div>
        <BaseIcon
          :name="expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
          size="24px"
          class="text-[var(--color-light-900)]"
        />
      </div>
    </BasePlainBtn>

    <div v-if="expanded" class="border-t border-[var(--border-border-primary)] px-4 pb-4">
      <div class="flex flex-col py-2">
        <div
          v-for="currency in props.currencyColumns"
          :key="currency.id"
          class="flex items-center justify-between gap-3 border-b border-[var(--border-border-primary)] py-2 last:border-b-0"
        >
          <span class="text-sm leading-5 text-[var(--card-card-subtitle-primary-enabled)]">{{ currency.code }}</span>
          <span class="text-sm leading-5 font-bold text-[var(--card-card-title-primary-enabled)]">
            {{ formatRevenue(currency.id) }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>
