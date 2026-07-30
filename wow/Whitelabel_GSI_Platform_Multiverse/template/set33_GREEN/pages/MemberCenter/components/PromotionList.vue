<template>
  <div class="promotion-container">
    <div
      class="promotion-container-in"
      :class="{
        active: props.activeId === props.item.id
      }"
    >
      <div class="p_select_inner">
        <div class="p_select">
          {{ props.item.title }}
          <ul>
            <li>
              {{
                $t(`member.deposit.depositOver`, {
                  amount: props.item.reward.condition
                })
              }}
            </li>
            <li v-if="props.item.reward.type === 0 || hasFreeRound">
              {{
                $t(`member.deposit.depositreward`, {
                  rewardPercent: hasFreeRound ? $t(`menu.freeSpin`) : props.item.reward.amount
                })
              }}
            </li>
            <li v-else-if="!hasFreeRound">
              {{
                $t(`member.deposit.rewardPercent`, {
                  rewardPercent: props.item.reward.amount
                })
              }}
            </li>
            <template v-if="hasFreeRound">
              <li v-for="(round, idx) in props.item.reward.free_round_settings" :key="idx">
                {{ `[${round.game_name} ${round.product_name} ${round.rounds} ${$t("ai.times")}]` }}
              </li>
            </template>
            <PromotionAuditRate
              v-if="!(hasFreeRound && Number(props.item.audit_rate ?? props.item.reward.audit_rate) === 0)"
              :audit-rate="props.item.audit_rate ?? props.item.reward.audit_rate"
            />
          </ul>
        </div>
        <div class="af-txt-wrap">
          {{ $t("member.deposit.rewardTitle") }}
          <div class="txt-lg">
            <template v-if="hasFreeRound">
              <div v-for="(round, idx) in props.item.reward.free_round_settings" :key="idx">
                {{ `${$t("menu.freeSpin")} ${round.rounds} ${$t("ai.times")}` }}
              </div>
            </template>
            <template v-else>
              {{ props.item.reward.reward_amount }}
            </template>
          </div>
        </div>
      </div>

      <!--p_select_inner end-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import PromotionAuditRate from "src/common/components/Deposit/PromotionAuditRate.vue"

type FreeRoundSetting = {
  game_code?: string
  game_name: string
  product_code?: number
  product_name: string
  rounds: number
}

const props = defineProps<{
  activeId: number
  item: {
    id: number | string
    title: string
    audit_rate?: number | string | null
    reward: {
      type: number
      amount: number | string
      reward_amount: number | string
      condition: number | string
      free_round_settings?: FreeRoundSetting[] | null
      audit_rate?: number | string | null
    }
  }
}>()

const { t: $t } = useI18n()

const hasFreeRound = computed(
  () => Array.isArray(props.item.reward.free_round_settings) && props.item.reward.free_round_settings.length > 0
)
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.promotion-container
  height: auto
  width: 45%
  position: relative
  max-width: 45%
  cursor: pointer
  .p_select_inner
    @apply flex items-center
    color: #ffffff
    text-align: center
    padding: .625rem
    gap: 1.25rem
    +phone-width
      flex-direction: column
      gap: .4375rem
      padding-left: .625rem
      padding-right: .625rem
    .p_select
      padding: .5rem
      margin-left: 0
      border-right: .0625rem solid rgb(71, 184, 61)
      padding-left: 0rem
      text-align: left
      padding-right: 1.25rem
      min-height: 6.875rem
      width: 65%
      +phone-width
        border-right: none
        border-bottom: .0625rem solid rgb(71, 184, 61)
        width: 100%
      ul
        list-style: disc
        padding-left: 1rem
        margin: 0rem
  .promotion-container-in
    border: .0625rem solid #0A3A20
    border-radius: .5rem
    width: 100%
    background: #0A3A20
  .active
    border: .0625rem solid rgb(71, 184, 61)
</style>
