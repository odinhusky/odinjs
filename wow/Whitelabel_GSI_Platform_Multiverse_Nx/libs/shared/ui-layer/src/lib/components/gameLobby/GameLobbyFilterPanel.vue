<script setup lang="ts">
import type { ProductItem } from "@shared-lib/api/commonTypes/gameTypes"
import { PROVIDER_LIST_LAYOUT_OBJ } from "@shared-lib/constants/propsCategoryObj"

type GameTagOption = {
  label: string
  value: number
}

const props = defineProps<{
  gameLobbySpacingClass?: string
  providerOptions: ProductItem[]
  selectedProvider: ProductItem | null
  selectedTag: number
  searchKeyword: string
  gameTagOptions: GameTagOption[]
  showProviderPanel: boolean
  getProductTabImage: (productCode: number) => string
  setProviderItemRef: (productCode: number, el: HTMLElement | null) => void
}>()

const emit = defineEmits<{
  (event: "update:searchKeyword", value: string): void
  (event: "update:selectedTag", value: number): void
  (event: "selectProvider", provider: ProductItem): void
  (event: "toggleProviderPanel"): void
}>()

const onSearchKeywordChange = (value: string | number) => {
  emit("update:searchKeyword", String(value || ""))
}

const onSelectedTagChange = (value: string | number) => {
  emit("update:selectedTag", Number(value))
}

const onSelectProvider = (provider: ProductItem) => {
  emit("selectProvider", provider)
}

const onToggleProviderPanel = () => {
  emit("toggleProviderPanel")
}
</script>

<template>
  <div :class="cx('relative', props.gameLobbySpacingClass || '')">
    <div
      :class="cx(FLEX_ITEMS_CENTER, 'gap-3 mob:gap-1', 'rounded-lg', 'bg-[var(--surface-surface-contrainer)]', 'p-3')"
    >
      <div
        class="flex-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <ProviderList
          :provider-options="props.providerOptions"
          :selected-provider-code="props.selectedProvider?.product_code"
          :get-product-tab-image="props.getProductTabImage"
          :layout="PROVIDER_LIST_LAYOUT_OBJ.ROW"
          @select-provider="onSelectProvider"
        />
      </div>

      <BaseIconBtn
        icon="mdi:chevron-down"
        theme="secondary"
        size="md"
        :class-obj="{
          button: cx('transition-transform'),
          icon: cx({ 'rotate-180': props.showProviderPanel })
        }"
        @click="onToggleProviderPanel"
      />
    </div>

    <div :class="cx(FLEX_ITEMS_CENTER, 'justify-between gap-3')">
      <div class="w-[320px]">
        <BaseInput
          :model-value="props.searchKeyword"
          placeholder="搜尋遊戲..."
          left-icon="mdi:magnify"
          :class-obj="{
            input: '!h-10'
          }"
          @update:model-value="onSearchKeywordChange"
        />
      </div>

      <div :class="cx(FLEX_ITEMS_CENTER, 'gap-3')">
        <BaseIcon
          name="mage:filter-fill"
          size="20px"
          className="text-[var(--icon-icon-primary-enabled)] phone:hidden"
        />

        <span
          :class="cx('block phone:hidden text-lg leading-none font-bold text-[var(--text-text-primary)] capitalize')"
          >排序</span
        >

        <div :class="cx(FLEX_CENTER, 'w-[120px] phone:w-[100px]')">
          <BaseSelect
            :model-value="props.selectedTag"
            :options="props.gameTagOptions"
            option-label="label"
            option-value="value"
            placeholder="全部"
            :class-obj="{
              select: '!w-full !min-h-10'
            }"
            @update:model-value="onSelectedTagChange"
          />
        </div>
      </div>
    </div>

    <div
      v-show="props.showProviderPanel"
      :class="
        cx(
          'absolute z-20 top-[104px] right-0 md:right-4',
          'w-[500px] phone:w-full h-auto p-3',
          'rounded-lg',
          'bg-[var(--surface-surface-contrainer)]',
          'shadow-[0_0_12px_var(--tag-tag-bg-primary-left-enabled)]'
        )
      "
    >
      <div
        class="h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <ProviderList
          :provider-options="props.providerOptions"
          :selected-provider-code="props.selectedProvider?.product_code"
          :get-product-tab-image="props.getProductTabImage"
          :set-provider-item-ref="props.setProviderItemRef"
          :layout="PROVIDER_LIST_LAYOUT_OBJ.GRID"
          @select-provider="onSelectProvider"
        />
      </div>
    </div>
  </div>
</template>
