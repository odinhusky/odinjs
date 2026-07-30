<script setup lang="ts">
import type { VipRewardBenefit } from "@shared-lib/api/apiFunctions/vip_getVipList"
import { VIP_BENEFIT_DEFINITIONS } from "@shared-lib/constants/vipBenefits"

interface Props {
  rewardBenefit?: VipRewardBenefit | null
  currencyCode?: string
  theme?: "inside" | "outside"
}

const props = withDefaults(defineProps<Props>(), {
  rewardBenefit: null,
  currencyCode: "",
  theme: "inside"
})

const benefitEntries = computed(() => {
  const data = props.rewardBenefit
  if (!data) return []

  return VIP_BENEFIT_DEFINITIONS.map((item) => {
    const value = data[item.column]
    const num = Number(value)
    const visible = !Number.isNaN(num) && num > 0

    return {
      key: String(item.column),
      title: item.label,
      value: visible ? formatMoney(num) : "",
      visible
    }
  })
})

const isOutsideTheme = computed(() => props.theme === "outside")

const visibleEntries = computed(() => benefitEntries.value.filter((item) => item.visible))
</script>

<template>
  <div
    :class="
      cx(FLEX_COL, isOutsideTheme ? 'gap-1 p-4 rounded-lg bg-[var(--surface-surface-pagination)]' : 'gap-3', 'w-full')
    "
  >
    <p
      :class="
        cx(
          'text-[var(--card-card-title-primary-enabled)]',
          isOutsideTheme ? 'text-sm font-normal leading-5' : 'text-sm font-bold leading-none'
        )
      "
    >
      {{ props.currencyCode }}
    </p>

    <div
      :class="
        cx(
          'w-full min-h-[48px] flex items-center gap-1',
          isOutsideTheme ? 'p-0' : 'p-2 rounded bg-[var(--card-card-bg-third-enabled)]'
        )
      "
    >
      <template v-if="visibleEntries.length">
        <template v-for="(item, index) in visibleEntries" :key="item.key">
          <VipBenefitBlock
            :title="item.title"
            :value="item.value"
            :class-obj="{
              root: cx('!basis-0 !grow !items-start text-left'),
              title: cx(isOutsideTheme && 'text-[var(--text-text-title)]'),
              value: cx()
            }"
          />

          <div v-if="index < visibleEntries.length - 1" class="w-px h-[30px] bg-[var(--border-border-line)] shrink-0" />
        </template>
      </template>

      <VipBenefitBlock
        v-else
        title="Upgrade Bonus"
        value=""
        :class-obj="{
          root: 'invisible !basis-0 !grow !items-start text-left min-h-[48px]'
        }"
      />
    </div>
  </div>
</template>
