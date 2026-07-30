<template>
  <div
    class="promotion-container"
    :class="{
      active: props.activeId === props.item.id
    }"
  >
    <div class="item-left">
      <p class="deposit-promotion-title">{{ props.item.title }}</p>
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

    <div class="item-right">
      {{ $t("member.deposit.rewardTitle") }}
      <div class="amount">
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

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.promotion-container {
  @apply flex items-center justify-center;
  cursor: pointer;
  border: 1px solid #ffffff80;
  border-radius: 0.625rem;
  width: 100%;
  max-width: 25rem;
  min-height: 10.5625rem;
  padding: 1.25rem;
  color: #ffffffb2;

  @include phone-width {
    flex-direction: column;
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    max-width: unset;
    min-height: 15.5rem;
    min-width: 9.375rem;
    margin-right: 0.625rem;
  }

  &.active {
    border: 1px solid transparent;
    background: rgba(255, 255, 255, 0.3);
    position: relative;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-width: 2px;
      border-style: solid;
      border-color: transparent;
      border-radius: 0.6rem;
      background-image: linear-gradient(0deg, #ff7a00 1.47%, #ffc002 79.41%);
      background-origin: border-box;
      mask-image: linear-gradient(white, white), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: exclude, add;
    }
  }

  .item-left {
    @include fontStyle();
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-right: 0.0625rem solid #ffffff80;
    width: 50%;
    height: 100%;

    @include phone-width {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 0.0625rem solid #ffffff80;
      margin-bottom: 0.625rem;
      padding-bottom: 0.625rem;
    }

    .deposit-promotion-title {
      @include fontStyle(1rem);
      margin-bottom: 0.625rem;
      color: $secondary03;
    }

    ul {
      width: 100%;
      list-style: disc;
      text-align: left;
      padding-left: 1.25rem;
    }
  }

  .item-right {
    @include fontStyle(1rem);
    @apply flex flex-col items-center;
    width: 50%;
    text-align: center;

    @include phone-width {
      width: 100%;
      height: auto;
    }

    .amount {
      color: #05e900;
      margin-top: 0.625rem;
    }
  }
}
</style>
