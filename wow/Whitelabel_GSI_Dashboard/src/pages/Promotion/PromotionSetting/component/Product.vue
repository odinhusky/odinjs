<template>
  <q-card-section class="q-pb-xs" v-if="isLoading">
    <q-radio v-model="form.choice_game_type" :val="1" :label="$t('common.product_type')" />

    <SelectAllOptionGroup
      :parent-value="form.game_type"
      :group-options="productType"
      :topStyle="false"
      @update:parentValue="handelproductType"
      class="q-mb-md"
    />

    <q-radio v-model="form.choice_game_type" :val="2" :label="$t('common.product_code')" />
    <q-input
      outlined
      bottom-slots
      v-model="search"
      :label="$t('common.enter_keywords')"
      @update:model-value="handleInput()"
      style="width: 30%"
      class="q-mt-md"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <SelectAllOptionGroup
      :parent-value="form.product_code"
      :group-options="ProductCodeSearch"
      :topStyle="false"
      @update:parentValue="handelproductCode"
    />
  </q-card-section>
</template>

<script lang="ts" setup>
  import { useQuasar } from "quasar"

  import { onMounted, reactive, ref, watch } from "vue"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { useStepper } from "@/hook/useStepper"
  import { storeToRefs } from "pinia"

  import { getProductGameType, getProductDropdown } from "@/api/product"

  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"

  const store = usePromotionStore()
  const { promotionItem: form } = storeToRefs(store)
  const isLoading = ref(false)
  const { nextPrevStep } = useStepper()
  interface GameType {
    label: string
    value: number
  }
  const $q = useQuasar()

  const search = ref("")
  const productType = reactive<GameType[]>([])
  const productCode = reactive<GameType[]>([])

  const ProductCodeSearch = reactive<GameType[]>([])
  let fliterProduct = reactive<GameType[]>([])
  console.log("form", form.value)

  onMounted(async () => {

    console.log("form", form.value)
    Promise.all([getProductGameType(), getProductDropdown({ only_actived: true })])
      .then(([pType, pCode]) => {
        pType.data.forEach((item) => {
          productType.push({
            label: item.game_type,
            value: item.id
          })
        })
        pCode.data.forEach((item) => {
          productCode.push({
            label: item.product_name,
            value: item.product_code
          })
        })

        const uniqueValues = new Map()

        productCode.forEach((item) => {
          if (!uniqueValues.has(item.value)) {
            uniqueValues.set(item.value, item)
          }
        })

        fliterProduct = Array.from(uniqueValues.values())

        ProductCodeSearch.push(...fliterProduct)

        //編輯時判斷哪個有資料
        if (form.value && Array.isArray(form.value.game_type) && form.value.game_type.length > 0) {
          form.value.choice_game_type = 1
        } else if (form.value && Array.isArray(form.value.product_code) && form.value.product_code.length > 0) {
          form.value.choice_game_type = 2
        }
        isLoading.value = true
      })
      .catch((e: any) => {})

    console.log("form", form.value)
  })
  const handelproductType = (value: []) => {
    form.value.game_type = value
    if (form.value.game_type.length > 0) {
      form.value.choice_game_type = 1
    }
    console.log("form", form.value)
  }
  const handelproductCode = (value: []) => {
    form.value.product_code = value
    if (form.value.product_code.length > 0) {
      form.value.choice_game_type = 2
    }
    console.log("form", form.value)
  }

  watch(
    () => form.value.choice_game_type,
    (val: number) => {
      if (val === 1) {
        form.value.product_code = []
      } else {
        form.value.game_type = []
      }
      console.log("form", form.value)
    },
    { immediate: false }
  )

  const handleInput = () => {
    ProductCodeSearch.length = 0 // Clear the array before filtering
    const keyword = search.value.trim().toLowerCase()
    if (keyword === "") {
      ProductCodeSearch.push(...fliterProduct)
    } else {
      ProductCodeSearch.push(...fliterProduct.filter((item) => item.label.toLowerCase().startsWith(keyword)))
    }

    console.log("form", form.value)
  }
</script>

<style lang="scss" scoped></style>
