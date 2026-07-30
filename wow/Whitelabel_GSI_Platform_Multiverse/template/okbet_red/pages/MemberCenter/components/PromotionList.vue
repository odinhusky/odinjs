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
          <p>{{ props.item.title }}</p>
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
        <div
          class="triangle"
          :class="{
            triangle_act: props.activeId === props.item.id
          }"
        >
          <i class="fas fa-check inner-icon"></i>
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
@import "src/common/css/_variable.sass"
@import "app/template/okbet_red/assets/css/_variable.sass"

.promotion-container
  height: auto
  width: 45%
  position: relative
  max-width: 45%
  cursor: pointer
  .p_select_inner
    @apply flex items-center
    color: #FFF4F4
    text-align: center
    padding: 10px
    gap: 20px
    +phone-width
      flex-direction: column
      gap: 7px
      padding-left: 10px
      padding-right: 10px
    .p_select
      padding: 8px
      margin-left: 0
      border-right: 1px solid $border-soft-yellow-color
      padding-left: 0px
      text-align: left
      padding-right: 20px
      min-height: 110px
      width: 65%
      white-space: normal !important
      +phone-width
        border-right: none
        border-bottom: 1px solid $border-soft-yellow-color
        width: 100%
      ul
        list-style: disc
        padding-left: 16px
        margin: 0px
  .promotion-container-in
    border: 2px solid $border-pale-gray-color
    border-radius: 8px
    width: 100%
    background: $background-light-color
  .active
    border: 2px solid $secondary-color
    color: $secondary-color
  .triangle
    width: 0
    height: 0
    border-top: 0px solid transparent
    border-right: 0px solid transparent
    border-bottom: 25px solid $secondary-color
    border-left: 25px solid transparent
    position: absolute
    display: none
    right: 0
    bottom: 0
    i
      position: absolute
      right: 2px
      bottom: -25px
      color: $text-light-color
      font-size: 0.8rem
  .triangle_act
    display: block
</style>
