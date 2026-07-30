<template>
  <!-- 金流商 -->
  <querySelect
    v-if="dropdownData.list.length || loading"
    :hide-bottom-space="true"
    v-bind="attrs"
    v-model="model"
    :name="name"
    borderless
    dense
    standout="bg-white text-black"
    rounded
    :label="$t('table_header.payment_provider')"
    :list="dropdownData.list"
    :loading="loading"
    :disable="!cashFlowType || loading"
    :useI18n="false"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, watch, ref } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { getGatewayMerchant } from "@/api/paymentGateway"
  import type * as Response from "@/api/response.type"

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    },
    /** 金流類型 */
    cashFlowType: {
      type: [Number, String],
      required: false,
      default: undefined
    }
  })

  const attrs = useAttrs()

  const model = defineModel<string | number | undefined>()
  const loading = ref(false)

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
    }[]
  }>({
    list: []
  })

  const loadMerchantOptions = async (type: number) => {
    try {
      loading.value = true
      dropdownData.list = []

      const { code, data } = await getGatewayMerchant({ type })

      if (code === 0 && data) {
        dropdownData.list = data.map((item: Response.GatewayMerchantItem) => ({
          label: item.name,
          value: item.name
        }))
      }
    } catch (error) {
      console.error("Failed to load gateway merchant options:", error)
      dropdownData.list = []
    } finally {
      loading.value = false
    }
  }

  // 監聽金流類型變化
  watch(
    () => props.cashFlowType,
    (newType) => {
      // 清空選擇和列表
      model.value = undefined
      dropdownData.list = []

      // 如果有新類型，加載選項
      if (newType) {
        const typeNumber = typeof newType === "string" ? parseInt(newType) : newType
        if (!isNaN(typeNumber)) {
          loadMerchantOptions(typeNumber)
        }
      }
    },
    { immediate: true }
  )
</script>
