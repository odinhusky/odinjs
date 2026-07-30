<template>
  <!-- 金流類型 -->
  <p v-if="dropdownData.list.length">
    {{ t(props.labelI18nKey) }}
  </p>
  <querySelect
    v-if="dropdownData.list.length"
    :hide-bottom-space="true"
    v-bind="attrs"
    v-model="model"
    :name="name"
    borderless
    dense
    standout="bg-white text-black"
    rounded
    :list="dropdownData.list"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { FUND_METHOD_TYPE } from "@/utils/constants"
  import { getPaymentTypeList } from "@/api/common"
  import { useI18n } from "vue-i18n"

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    },
    labelI18nKey: {
      type: String,
      required: false,
      default: "query_params.fund_method"
    }
  })

  defineOptions({ inheritAttrs: false })

  const attrs = useAttrs()

  const model = defineModel<string | number | undefined>()

  const { t } = useI18n()

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
    }[]
  }>({
    list: []
  })

  onMounted(async () => {
    const { data } = await getPaymentTypeList()
    if (!data || !Object.keys(data).length) {
      dropdownData.list.length = 0
      return
    }
    const tempList = Object.values(data).map((value) => {
      console.log(value)
      const paymentKey = parseInt(value.id)
      return {
        label: FUND_METHOD_TYPE.I18nKeys[paymentKey as keyof typeof FUND_METHOD_TYPE.I18nKeys] ?? value.id,
        value: paymentKey
      }
    })
    console.log(tempList, data)

    const excludedValues = [FUND_METHOD_TYPE.Enums.ApplePay, FUND_METHOD_TYPE.Enums.Paypal]

    const filteredData = tempList.filter((item) => !excludedValues.includes(item.value))

    dropdownData.list.push(...filteredData)
  })
</script>
