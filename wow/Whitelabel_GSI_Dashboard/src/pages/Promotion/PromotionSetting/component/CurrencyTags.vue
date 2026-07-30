<template>
  <q-card-section class="q-pa-md q-ma-md rounded-borders activity-info" style="background-color: #fcf8ff">
    <!-- 可開幣別 -->
    <SelectAllOptionGroup
      :parent-value="checkCurreny.list"
      :group-options="currencyTags"
      @update:parentValue="handelCurrencyTags"
      :selectAllLabel="'All'"
      :title="$t('common.available_currencies')"
      :itemButtonStyle="props.itemButtonStyle"
      :hideSelectAll="props.hideSelectAll"
      :showSelecAllNextToTitle="props.showSelecAllNextToTitle"
    />
  </q-card-section>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, watch, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQueryStore } from "@/stores/queryStore"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { storeToRefs } from "pinia"
  import { CURRENCY_TYPE, PROMOTION_REWARD_TYPE } from "@/utils/constants"
  import type * as Request from "@/api/request.type"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { getGatewayList } from "@/api/promotion"

  const { t } = useI18n()
  const props = defineProps({
    itemButtonStyle: {
      type: Boolean,
      required: false,
      default: false
    },
    hideSelectAll: {
      type: Boolean,
      required: false,
      default: false
    },
    showSelecAllNextToTitle: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  const queryStore = useQueryStore()
  const promotionStore = usePromotionStore()
  const { promotionItem: form } = storeToRefs(promotionStore)

  const checkCurreny = reactive<{
    list: string[]
  }>({ list: [] })
  const currencyTags = computed(() =>
    queryStore.currencyList.map((e) => {
      const label = t(CURRENCY_TYPE.I18nKeys[e.value as CURRENCY_TYPE.Enums])
      const value = CURRENCY_TYPE.Enums[e.value as CURRENCY_TYPE.Enums]
      return {
        label,
        value
      }
    })
  )

  const handelCurrencyTags = (value: string[]) => {
    checkCurreny.list = value
  }

  const gatewayList = ref<Request.promotionGatewayItem[]>([])
  const updateFilteredGatewayList = () => {
    const rewardCurrencyValueList = form.value.reward
      .map((e) => CURRENCY_TYPE.Enums[e.currency as keyof typeof CURRENCY_TYPE.Enums])
      .filter((currency) => currency !== undefined)

    form.value.filteredGatewayList = gatewayList.value.filter((item) => rewardCurrencyValueList.includes(item.currency))
  }
  watch(
    checkCurreny,
    (newValue) => {
      if (newValue.list.length === 0) {
        //如果沒有選任何幣種
        form.value.reward = []
        form.value.filteredGatewayList = []
        form.value.payment_gateway = []
        return
      }

      form.value.reward = form.value.reward.filter((e) => !!e.currency)
      const rewardCurrencyList = form.value.reward.map((e) => e.currency)
      newValue.list.forEach((currency) => {
        if (!rewardCurrencyList.includes(currency)) {
          const rewardObj: Request.PromotionRewardItem = {
            currency: currency,
            condition: 0,
            type: PROMOTION_REWARD_TYPE.Enums.FixedAmount,
            amount: 0,
            limit: ""
          }
          form.value.reward.push(rewardObj)
        }
      })
      form.value.reward = form.value.reward.filter((e) => newValue.list.includes(e.currency))
      // 更新支付資料
      updateFilteredGatewayList()
    },
    { deep: true }
  )
  onMounted(async () => {
    await queryStore.getCurrencyList()
    checkCurreny.list = form.value.reward.map((e) => e.currency)
    const params = { display: true }
    const { data } = await getGatewayList(params)
    if (data.list.length) {
      gatewayList.value = data.list
    }

    // 更新支付資料
    updateFilteredGatewayList()
  })
</script>

<style lang="scss" scoped></style>
