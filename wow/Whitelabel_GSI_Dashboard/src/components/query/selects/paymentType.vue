<template>
  <!-- 支付類型 -->
  <p v-if="dropdownData.list.length">
    {{ t("query_params.payment_types") }}
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
  import { useCommon } from "@/hook/useCommon"
  import { getPaymentTypeList } from "@/api/common"
  import { useI18n } from "vue-i18n"

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
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
      dropdownData.list = []
      return
    }

    dropdownData.list = Object.entries(data).map(([key]) => {
      const paymentKey = Number(key)
      return {
        label: FUND_METHOD_TYPE.I18nKeys[paymentKey as keyof typeof FUND_METHOD_TYPE.I18nKeys] ?? key,
        value: paymentKey
      }
    })
  })
</script>
