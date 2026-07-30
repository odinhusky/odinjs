<script setup lang="ts">
import type { ProductItem } from "@shared-lib/api/commonTypes/gameTypes"
import { PROVIDER_LIST_LAYOUT_OBJ } from "@shared-lib/constants/propsCategoryObj"

type ProviderListLayout = (typeof PROVIDER_LIST_LAYOUT_OBJ)[keyof typeof PROVIDER_LIST_LAYOUT_OBJ]

const props = withDefaults(
  defineProps<{
    providerOptions: ProductItem[]
    selectedProviderCode?: number | null
    getProductTabImage: (productCode: number) => string
    layout?: ProviderListLayout
    listClass?: string
    setProviderItemRef?: (productCode: number, el: HTMLElement | null) => void
  }>(),
  {
    selectedProviderCode: null,
    layout: PROVIDER_LIST_LAYOUT_OBJ.ROW,
    listClass: "",
    setProviderItemRef: undefined
  }
)

const emit = defineEmits<{
  (event: "select-provider", provider: ProductItem): void
}>()

const providerItemRefs = ref<Record<number, HTMLElement | null>>({})
const hasMounted = ref(false)

const onSelectProvider = (provider: ProductItem) => {
  emit("select-provider", provider)
}

const setInternalProviderItemRef = (productCode: number, el: HTMLElement | null) => {
  providerItemRefs.value[Number(productCode)] = el

  if (props.setProviderItemRef) {
    props.setProviderItemRef(Number(productCode), el)
  }
}

const isProviderActive = (provider: ProductItem) => {
  return Number(props.selectedProviderCode) === Number(provider.product_code)
}

const layoutClass = computed(() => {
  if (props.layout === PROVIDER_LIST_LAYOUT_OBJ.GRID) {
    return "grid grid-cols-3 gap-2"
  }
  return "grid grid-flow-col auto-cols-[130px] gap-2 min-w-max"
})

const scrollToActiveProvider = async () => {
  if (props.layout !== PROVIDER_LIST_LAYOUT_OBJ.ROW) return

  const activeCode = Number(props.selectedProviderCode)
  if (!activeCode) return

  await nextTick()
  const activeEl = providerItemRefs.value[activeCode]
  if (!activeEl) return

  activeEl.scrollIntoView({
    behavior: hasMounted.value ? "smooth" : "auto",
    block: "nearest",
    inline: "nearest"
  })
}

watch(
  () => props.selectedProviderCode,
  async () => {
    await scrollToActiveProvider()
  },
  { immediate: true }
)

onMounted(() => {
  hasMounted.value = true
})
</script>

<template>
  <div :class="cx(layoutClass, props.listClass)">
    <ProviderItem
      v-for="provider in props.providerOptions"
      :key="provider.product_code"
      :provider="provider"
      :image-src="props.getProductTabImage(provider.product_code)"
      :is-active="isProviderActive(provider)"
      :set-item-ref="setInternalProviderItemRef"
      @select="onSelectProvider"
    />
  </div>
</template>
