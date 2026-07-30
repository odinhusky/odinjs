<template>
  <p>
    {{ t("query_params.product") }}
  </p>
  <!-- 產品類型 -->
  <querySelect
    v-bind="attrs"
    v-model="model"
    :hide-bottom-space="true"
    :name="name"
    outlined
    standout="bg-white text-black"
    :list="dropdownData.list"
    multiple
    class="default-input"
    :useI18n="false"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted, watchEffect } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { getProductDropdown, getProductGameType } from "@/api/product"
  import { useI18n } from "vue-i18n"

  const queryStore = useQueryStore()

  const { t } = useI18n()

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    },
    gameProductCode: {
      type: String,
      required: false,
      default: 0
    }
  })

  defineOptions({ inheritAttrs: false })

  const attrs = useAttrs()

  const model = defineModel<string[] | number[] | undefined>()

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
    }[]
  }>({
    list: []
  })

  watchEffect(() => {
    if (model.value && model.value.length > 0) {
      model.value = model.value.map((e) => `${e}`)
    }
  })

  onMounted(async () => {
    const { data } = await getProductDropdown({ only_actived: true })
    if (!data || !data.length) {
      dropdownData.list.length = 0
      return
    }
    dropdownData.list = data.map((item) => ({
      label: item.product_name || `${item.product_code}`,
      value: item.product_code
    }))
  })
</script>
