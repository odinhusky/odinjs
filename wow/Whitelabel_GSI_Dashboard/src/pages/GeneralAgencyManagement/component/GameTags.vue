<template>
  <q-card-section class="q-pb-xs">
    <SelectAllOptionGroup
      openSelectIcon
      :parentValue="form.gameTag"
      :group-options="productTag"
      @update:parentValue="handleproductTag"
      :itemButtonStyle="itemButtonStyle"
      :hideSelectAll="!hideSelectAll"
      :showSelecAllNextToTitle="showSelecAllNextToTitle"
    />
  </q-card-section>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted, reactive, defineEmits } from "vue"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { getProductDropdown } from "@/api/product"

  const queryStore = useQueryStore()

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
  const form = ref({
    gameTag: [] as number[]
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
    /*data.forEach((item) => {
      productTag.push({
        label: item.label,
        value: item.value,
        iconLink: new URL(`./../../../../assets/svg/game_${item.label}.svg`, import.meta.url)
      })
    })
*/
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
  const emit = defineEmits(["update:parentTagValue"])

  const handleproductTag = (value: number[]) => {
    form.value.gameTag = value
    emit("update:parentTagValue", value)
  }
</script>

<style lang="scss" scoped></style>
