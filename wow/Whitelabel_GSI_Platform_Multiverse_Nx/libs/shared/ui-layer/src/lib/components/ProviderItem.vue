<script setup lang="ts">
import type { ProductItem } from "@shared-lib/api/commonTypes/gameTypes"
import type { ComponentPublicInstance } from "vue"

const props = withDefaults(
  defineProps<{
    provider: ProductItem
    imageSrc: string
    isActive?: boolean
    setItemRef?: (productCode: number, el: HTMLElement | null) => void
  }>(),
  {
    isActive: false,
    setItemRef: undefined
  }
)
const emit = defineEmits<{
  (event: "select", provider: ProductItem): void
}>()

const onSelect = () => {
  emit("select", props.provider)
}

const onSetRef = (refValue: Element | ComponentPublicInstance | null) => {
  if (!props.setItemRef) return
  const element =
    refValue instanceof HTMLElement
      ? refValue
      : refValue && "$el" in refValue && refValue.$el instanceof HTMLElement
      ? refValue.$el
      : null
  props.setItemRef(Number(props.provider.product_code), element)
}
</script>

<template>
  <BasePlainBtn
    :ref="onSetRef"
    :class-obj="{
      button: cx(
        FLEX_CENTER,
        'w-full p-4',
        'rounded-lg',
        'border border-transparent transition',
        '!bg-[var(--card-card-bg-primary-enabled)]',
        props.isActive && 'border-[var(--button-button-bg-primary-left-enabled)]'
      )
    }"
    @click="onSelect"
  >
    <BaseImage
      :src="props.imageSrc"
      default-src="/images/default/default.webp"
      :alt="props.provider.product_name"
      :class-obj="{
        container: 'w-[118px] h-[42px]',
        image: 'w-full h-full object-contain'
      }"
    />
  </BasePlainBtn>
</template>
