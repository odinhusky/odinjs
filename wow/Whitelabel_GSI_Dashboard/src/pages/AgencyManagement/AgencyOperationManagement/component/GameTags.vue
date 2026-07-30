<template>
  <q-card-section class="q-pb-xs">
    <SelectAllOptionGroup
      openSelectIcon
      :parentValue="localForm.product_code"
      :group-options="productTag"
      @update:parentValue="handleproductTag"
      :itemButtonStyle="itemButtonStyle"
      :hideSelectAll="!hideSelectAll"
      :showSelecAllNextToTitle="showSelecAllNextToTitle"
    />
  </q-card-section>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive, defineEmits, watch } from "vue"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { getProductDropdown } from "@/api/product"

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

  interface GameTag {
    label: string
    value: number
    iconLink: URL
  }

  interface productItem {
    product_code: number
    product_name: string
    game_type: string
  }
  const productTag = reactive<GameTag[]>([])
  onMounted(async () => {
    const { data }: { data: productItem[] } = await getProductDropdown()

    const fliterProducts = Array.from(new Set(data.map((p) => p.product_code))).map((code) => {
      return data.find((p) => p.product_code === code)
    })
    if (fliterProducts.length > 0) {
      for (const product of fliterProducts) {
        const newItem = {
          label: product?.product_name,
          value: product?.product_code
        } as GameTag
        productTag.push(newItem)
      }
    } else {
      productTag.length = 0
    }
  })

  const handleproductTag = (value: number[]) => {
    localForm.value.product_code = value
  }

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
