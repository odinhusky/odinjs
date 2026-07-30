<script setup lang="ts">
import { PROMOTION_CONDITION_ENUMS } from "@shared-lib/constants/enums/promotionCondition"
import type { MemberVipItem } from "../../composables/useMemberVip"
import type { UserStatistics } from "@shared-lib/api/commonTypes/vipTypes"

interface Props {
  vip: MemberVipItem
  nextVip: MemberVipItem | null
  isCurrent: boolean
  isActive: boolean
  selectedCurrencyId: number
  selectedCurrencyCode: string
  userStatisticsMap: Record<number, UserStatistics>
  levelUpTitle: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  select: [id: number]
}>()

const isSubTitleDialogVisible = ref(false)
const subtitleTextRef = ref<HTMLElement | null>(null)
const showSubtitleMore = ref(false)

const sourceConditions = computed(() => {
  return props.nextVip?.conditions?.length ? props.nextVip.conditions : props.vip.conditions
})

const selectedCondition = computed(() => {
  const conditions = sourceConditions.value || []
  return conditions.find((item) => item.currency_id === props.selectedCurrencyId) || conditions[0]
})

const rewardBenefit = computed(() => {
  return props.vip.rewardBenefits.find((item) => item.currency_id === props.selectedCurrencyId) || null
})

const resolvePercent = (numerator: string | number, denominator: string | number) => {
  const numeratorValue = Number(numerator)
  const denominatorValue = Number(denominator)

  if (Number.isNaN(numeratorValue) || Number.isNaN(denominatorValue) || denominatorValue <= 0) return 0
  return Math.min(100, Math.max(0, (numeratorValue / denominatorValue) * 100))
}

const progressValue = computed(() => {
  if (!props.nextVip) return 100

  const condition = selectedCondition.value
  if (!condition) return 0

  const stats = props.userStatisticsMap[condition.currency_id]
  const depositPercent = resolvePercent(stats?.total_deposit || 0, condition.deposit_amount)
  const betPercent = resolvePercent(stats?.total_valid_bet_amount || 0, condition.valid_bet_amount)

  const promotionCondition = props.nextVip?.promotion_condition

  if (promotionCondition === PROMOTION_CONDITION_ENUMS.BET) {
    return betPercent
  }

  if (promotionCondition === PROMOTION_CONDITION_ENUMS.DEPOSIT) {
    return depositPercent
  }

  return (depositPercent + betPercent) / 2
})

const progressPercentText = computed(() => `${progressValue.value.toFixed(1)}%`)
const nextLevelTitle = computed(() => props.nextVip?.title || "MAX")

const handleOpenSubTitleDialog = () => {
  handleGlobalClick({
    target: `handleMemberVipSubTitleMoreClick-${props.vip.id}`,
    debounceTimer: 150,
    callback: () => {
      isSubTitleDialogVisible.value = true
    }
  })
}

const handleSelectCard = () => {
  handleGlobalClick({
    target: `handleMemberVipCardSelectClick-${props.vip.id}`,
    debounceTimer: 120,
    callback: () => {
      emit("select", props.vip.id)
    }
  })
}

const handleCloseSubTitleDialog = () => {
  isSubTitleDialogVisible.value = false
}

const measureSubTitle = () => {
  const el = subtitleTextRef.value
  if (!el) return
  showSubtitleMore.value = el.scrollHeight > el.clientHeight + 1
}

onMounted(() => {
  measureSubTitle()
})

watch(() => props.levelUpTitle, measureSubTitle)
</script>

<template>
  <article
    :class="
      cx(
        FLEX_COL,
        'relative w-[424px] min-h-[312px] rounded-lg border-2 p-5 gap-3',
        'bg-[linear-gradient(90deg,var(--sidebar-sidebar-sub-bg-left)_0%,var(--sidebar-sidebar-sub-bg-right)_100%)]',
        'border-[var(--card-card-border-secondary-enabled)]',
        !isActive && 'hover:border-[var(--card-card-border-primary-hover)]',
        isActive && 'border-[var(--card-card-border-primary-active)]',
        'mob:w-[95%] mob:min-h-[280px]'
      )
    "
    @click="handleSelectCard"
  >
    <BaseBadge
      v-if="isCurrent"
      :size="BASE_BADGE_SIZE_OBJ.SM"
      :theme="BASE_BADGE_THEME_OBJ.PRIMARY"
      :class-obj="{ root: 'absolute top-3 left-3' }"
    >
      Current
    </BaseBadge>

    <BaseImage
      :src="props.vip.img"
      :class-obj="{ container: 'w-[100px] h-[126px] py-[13px] mx-auto', image: 'object-contain' }"
    />

    <h4
      class="text-center text-4xl font-bold leading-10 bg-[linear-gradient(90deg,var(--text-text-accent)_26.87%,var(--text-text-negative)_72.81%)] bg-clip-text text-transparent"
    >
      {{ props.vip.title }}
    </h4>

    <div class="flex items-start justify-center gap-2 min-h-[40px]">
      <p
        ref="subtitleTextRef"
        class="text-center text-sm leading-5 text-[var(--card-card-subtitle-primary-enabled)] line-clamp-2 flex-1 min-w-0"
      >
        {{ props.levelUpTitle }}
      </p>

      <BaseBtn
        v-if="showSubtitleMore"
        size="sm"
        theme="secondary"
        category="outline"
        class="shrink-0"
        @click="handleOpenSubTitleDialog"
      >
        More
      </BaseBtn>
    </div>

    <BaseProgressBar
      :value="progressValue"
      :height="7"
      :theme="BASE_PROGRESS_BAR_THEME_OBJ.PRIMARY"
      :class-obj="{
        wrapper: 'mt-1 gap-1',
        track: 'relative'
      }"
    >
      <template #top>
        <p class="text-[10px] font-normal leading-none text-[var(--progress-bar-progress-title-primary)]">
          升級進度: {{ progressPercentText }}
        </p>
      </template>

      <template #bottom>
        <div class="w-full flex items-center justify-between">
          <span class="text-[10px] font-normal leading-none text-[var(--progress-bar-progress-title-primary)]">
            {{ props.vip.title }}
          </span>
          <span class="text-[10px] font-normal leading-none text-[var(--progress-bar-progress-title-primary)]">
            {{ nextLevelTitle }}
          </span>
        </div>
      </template>
    </BaseProgressBar>

    <VipBenefitZone :reward-benefit="rewardBenefit" :currency-code="props.selectedCurrencyCode" theme="inside" />

    <ShowSubTitleDialog
      :visible="isSubTitleDialogVisible"
      :title="props.vip.title"
      :subtitle="props.levelUpTitle"
      @close="handleCloseSubTitleDialog"
    />
  </article>
</template>
