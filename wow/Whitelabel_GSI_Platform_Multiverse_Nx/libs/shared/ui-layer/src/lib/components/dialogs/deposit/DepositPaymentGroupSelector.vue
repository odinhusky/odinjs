<script setup lang="ts">
import { useI18n } from "#imports"
import type {
  DepositPaymentGroupOption,
  DepositPaymentGroupRangeOption
} from "../../../composables/useDeposit/depositLifecycle"

interface Props {
  isLoadingDetail: boolean
  isPaymentGroupExpanded: boolean
  paymentGroupOptions: DepositPaymentGroupOption[]
  selectedPaymentGroup: DepositPaymentGroupOption | null
  selectedPaymentGroupId: number
  selectedPaymentGroupRangeOptions: DepositPaymentGroupRangeOption[]
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: "toggle"): void
  (e: "select", id: number): void
}>()
</script>

<template>
  <div :class="cx(FLEX_COL, 'gap-2 deposit-channel-section')">
    <DepositDialogContentTitle>{{ t("query_params.payment_types") }}</DepositDialogContentTitle>

    <BasePlainBtn
      type="button"
      :class="
        cx(
          FLEX_ITEMS_CENTER,
          'deposit-channel-summary',
          props.selectedPaymentGroup && 'deposit-channel-summary--selected'
        )
      "
      @click="
        handleGlobalClick({
          target: 'depositPaymentGroupToggle',
          callback: () => emit('toggle')
        })
      "
    >
      <template v-if="props.selectedPaymentGroup">
        <div :class="cx(FLEX_ITEMS_CENTER, 'gap-3 min-w-0')">
          <div class="deposit-channel-summary__logo">
            <BaseImage
              :src="props.selectedPaymentGroup.imgUrl"
              :default-src="'/images/default/default.webp'"
              :class-obj="{ image: 'w-full h-full object-contain' }"
            />
          </div>
          <span class="deposit-channel-summary__name">
            {{ props.selectedPaymentGroup.name }}
          </span>
        </div>
        <div :class="cx(FLEX_ITEMS_CENTER, 'gap-2 shrink-0')">
          <span class="deposit-channel-summary__range">
            {{ props.selectedPaymentGroup.rangeText }}
          </span>
          <BaseIcon
            name="mdi:chevron-down"
            size="18px"
            class="deposit-channel-summary__chevron"
            :class="props.isPaymentGroupExpanded ? 'rotate-180' : ''"
          />
        </div>
      </template>

      <template v-else>
        <span class="deposit-channel-summary__placeholder">{{ t("table_header.please_select") }}</span>
        <BaseIcon
          name="mdi:chevron-down"
          size="18px"
          class="deposit-channel-summary__chevron"
          :class="props.isPaymentGroupExpanded ? 'rotate-180' : ''"
        />
      </template>
    </BasePlainBtn>

    <div v-if="props.isPaymentGroupExpanded" class="deposit-channel-list">
      <div v-if="props.paymentGroupOptions.length === 0 && !props.isLoadingDetail" class="py-4">
        <NoData type="empty" :class-obj="{ root: 'min-h-[120px]' }" />
      </div>
      <div v-else class="deposit-channel-grid">
        <BasePlainBtn
          v-for="group in props.paymentGroupOptions"
          :key="group.id"
          type="button"
          :class="
            cx(
              FLEX_ITEMS_CENTER,
              'deposit-channel-card',
              props.selectedPaymentGroupId === Number(group.id) && 'deposit-channel-card--active'
            )
          "
          @click="
            handleGlobalClick({
              target: `depositPaymentGroupSelect_${group.id}`,
              payload: group.id,
              callback: (id) => emit('select', Number(id))
            })
          "
        >
          <div class="deposit-channel-card__logo">
            <BaseImage
              :src="group.imgUrl"
              :default-src="'/images/default/default.webp'"
              :class-obj="{ image: 'w-full h-full object-contain' }"
            />
          </div>
          <div :class="cx(FLEX_COL, 'min-w-0 gap-1')">
            <span class="deposit-channel-card__name">
              {{ group.name }}
            </span>
            <span v-if="group.rangeText" class="deposit-channel-card__range">
              {{ group.rangeText }}
            </span>
          </div>
        </BasePlainBtn>
      </div>
    </div>

    <div v-if="props.selectedPaymentGroupRangeOptions.length > 0" class="deposit-channel-range-list">
      <span v-for="range in props.selectedPaymentGroupRangeOptions" :key="range.id" class="deposit-channel-range-pill">
        {{ range.label }}
      </span>
    </div>

    <p v-if="props.selectedPaymentGroupRangeOptions.length > 0" class="deposit-channel-range-notice">
      {{ t("deposit_category_amount_limit_notice") }}
    </p>
  </div>
</template>
