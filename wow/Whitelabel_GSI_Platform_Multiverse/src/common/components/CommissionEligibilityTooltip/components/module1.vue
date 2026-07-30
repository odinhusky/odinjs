<template>
  <q-icon v-if="visible" ref="iconRef" name="help_outline" class="commission-eligibility-icon" @click.stop="togglePin">
    <q-tooltip
      v-model="show"
      anchor="top middle"
      self="bottom middle"
      class="commission-eligibility-tooltip"
      :offset="[0, 8]"
      :no-parent-event="pinned"
    >
      <div class="commission-eligibility-tooltip-title">{{ t("menu.commissionEligibilityTitle") }}</div>
      <div class="commission-eligibility-tooltip-condition">{{ conditionText }}</div>
    </q-tooltip>
  </q-icon>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

const props = withDefaults(
  defineProps<{
    depositThreshold?: number
    validBetThreshold?: number
  }>(),
  {
    depositThreshold: 0,
    validBetThreshold: 0
  }
)

const { t } = useI18n()

const visible = computed(() => Number(props.depositThreshold) > 0 || Number(props.validBetThreshold) > 0)

const conditionText = computed(() => {
  const hasDeposit = Number(props.depositThreshold) > 0
  const hasValidBet = Number(props.validBetThreshold) > 0
  if (hasDeposit && hasValidBet) {
    return t("menu.commissionEligibilityBoth", {
      deposit: props.depositThreshold,
      validBet: props.validBetThreshold
    })
  }
  if (hasDeposit) {
    return t("menu.commissionEligibilityDeposit", { deposit: props.depositThreshold })
  }
  return t("menu.commissionEligibilityValidBet", { validBet: props.validBetThreshold })
})

const pinned = ref(false)
const show = ref(false)

const togglePin = () => {
  pinned.value = !pinned.value
  show.value = pinned.value
}

const onDocumentClick = (e: MouseEvent) => {
  if (!pinned.value) return
  const target = e.target as HTMLElement | null
  if (!target) return
  if (target.closest(".commission-eligibility-icon") || target.closest(".commission-eligibility-tooltip")) return
  pinned.value = false
  show.value = false
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick)
})
</script>

<style scoped lang="scss">
.commission-eligibility-icon {
  @apply cursor-pointer align-middle ml-1 opacity-80 hover:opacity-100;
}
</style>

<style lang="scss">
.commission-eligibility-tooltip {
  @apply px-4 py-3 max-w-[20rem];
  background: var(--neutral-01);
  color: unset;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.32);
  font-size: 0.875rem;
  line-height: 1.4;

  .commission-eligibility-tooltip-title {
    @apply font-semibold mb-1;
    color: unset;
  }

  .commission-eligibility-tooltip-condition {
    color: unset;
  }
}
</style>
