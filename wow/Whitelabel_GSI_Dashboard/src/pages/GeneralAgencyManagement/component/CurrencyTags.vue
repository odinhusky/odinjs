<template>
  <q-card-section class="q-pb-xs">
    <!-- 可開幣別 -->
    <SelectAllOptionGroup
      :parent-value="form.currency"
      :group-options="store.currencyList"
      @update:parentValue="handelCurrencyTags"
      :title="$t('common.available_currencies')"
      :itemButtonStyle="itemButtonStyle"
      :hideSelectAll="hideSelectAll"
      :showSelecAllNextToTitle="showSelecAllNextToTitle"
    />
  </q-card-section>
</template>

<script lang="ts" setup>
  import { computed, defineEmits, reactive, onMounted } from "vue"
  import type { CurrencyAmount } from "@/api/response.type"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { useQueryStore } from "@/stores/queryStore"

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
  const emits = defineEmits(["currencyValue"])
  /*
  const store = usePromotionStore()
  const { promotionItem: form } = storeToRefs(store)
*/
  const store = useQueryStore()
  const form = reactive({
    currency: [] as number[]
  })
  onMounted(async () => {
    await store.getCurrencyList()
  })

  const handelCurrencyTags = (value: number[]) => {
    form.currency = value
    emits("currencyValue", form.currency)
  }
</script>

<style lang="scss" scoped></style>
