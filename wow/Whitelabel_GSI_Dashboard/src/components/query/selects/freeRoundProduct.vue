<template>
  <p v-if="dropdownData.list.length">
    {{ t("table_header.product") }}
  </p>
  <querySelect
    :hide-bottom-space="true"
    v-bind="attrs"
    v-model="model"
    :name="name"
    borderless
    dense
    standout="bg-white text-black"
    rounded
    :list="dropdownData.list"
    :loading="loading"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted, watch, ref } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { useCommon } from "@/hook/useCommon"
  import { getFreeRoundProduct } from "@/api/freeRound"
  import { useI18n } from "vue-i18n"

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    },
    /** 貨幣ID */
    currencyId: {
      type: Number,
      required: true
    }
  })

  defineOptions({ inheritAttrs: false })

  const attrs = useAttrs()

  const model = defineModel<string | number | undefined>()

  const { t } = useI18n()
  const emit = defineEmits<{
    "update:gameList": [gameList: Array<{ game_code: string; game_name: string }>]
  }>()

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
    }[]
  }>({
    list: []
  })

  const loading = ref(false)
  let productData: any = null

  const loadProducts = async () => {
    loading.value = true
    try {
      const response = await getFreeRoundProduct(props.currencyId)
      if (response?.data) {
        productData = response.data
        dropdownData.list.length = 0 // 清空现有数据
        console.log(response.data)
        response.data?.products?.forEach(
          (item: {
            product_code?: number
            product_name?: string
            game_list?: Array<{ game_code: string; game_name: string }>
          }) => {
            if (item.product_code && item.product_name) {
              dropdownData.list.push({
                label: item.product_name,
                value: item.product_code
              })
            }
          }
        )
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const getGameListByProduct = (productCode: number) => {
    const selectedProduct = productData?.products?.find(
      (item: {
        product_code?: number
        product_name?: string
        game_list?: Array<{ game_code: string; game_name: string }>
      }) => item.product_code === productCode
    )
    if (selectedProduct?.game_list) {
      emit("update:gameList", selectedProduct.game_list)
    } else {
      emit("update:gameList", [])
    }
  }

  onMounted(() => {
    if (props.currencyId) {
      loadProducts()
    }
  })

  // 监听 currencyId 变化
  watch(
    () => props.currencyId,
    (newCurrencyId) => {
      console.log(newCurrencyId)
      if (newCurrencyId) {
        loadProducts()
      } else {
        dropdownData.list.length = 0
      }
    }
  )

  // 监听产品选择变化
  watch(
    () => model.value,
    (newProductCode) => {
      if (newProductCode && productData) {
        getGameListByProduct(newProductCode as number)
      } else {
        emit("update:gameList", [])
      }
    }
  )
</script>
