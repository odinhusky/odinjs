<template>
  <q-card-section class="q-pb-xs">
    <!-- 可開幣別 -->
    <SelectAllOptionGroup
      :parent-value="localForm.currency_ids"
      :group-options="currencyList"
      @update:parentValue="handelCurrencyTags"
      :title="$t('common.available_currencies')"
      :itemButtonStyle="itemButtonStyle"
      :hideSelectAll="hideSelectAll"
      :showSelecAllNextToTitle="showSelecAllNextToTitle"
    />
  </q-card-section>
</template>

<script lang="ts" setup>
  import { watch, ref, defineEmits, onMounted, reactive, computed } from "vue"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { CURRENCY_TYPE } from "@/utils/constants"

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
    },
    modelValue: {
      type: Object,
      required: true,
      default: {}
    }
  })

  const store = useQueryStore()

  onMounted(async () => {
    await store.getCurrencyList()
  })

  const handelCurrencyTags = (data: any) => {
    localForm.value.currency_ids = data
  }
  const currencyList = computed(() => {
    return store.currencyList.map((e) => {
      const label = CURRENCY_TYPE.Enums[e.value as CURRENCY_TYPE.Enums]
      const value = e.value
      return { label, value }
    })
  })

  const emit = defineEmits(["update:modelValue"])
  const localForm = ref({ ...props.modelValue })
  watch(
    localForm,
    (newVal) => {
      emit("update:modelValue", newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss" scoped></style>
