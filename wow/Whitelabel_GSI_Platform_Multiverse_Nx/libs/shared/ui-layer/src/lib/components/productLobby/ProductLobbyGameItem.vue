<script setup lang="ts">
import type { ProductItem } from "@shared-lib/api/commonTypes/gameTypes"

interface GameTypeMapItem {
  game_type?: string
}

interface Props {
  product: ProductItem
  gameTypeMap: Record<number, GameTypeMapItem>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const runtimeConfig = useRuntimeConfig()
const siteKey = computed(() => String(runtimeConfig.public.siteKey || "set_r017"))

const { getImage, imageBase } = useGetImage()

const gameTypeString = computed(() => {
  return toGameTypeString({
    gameType: props.product.game_type,
    gameTypeMap: props.gameTypeMap
  })
})

const withImageBase = (path: string) => withBase(imageBase.value, path)

const getProductSquareImage = () => {
  // 舊專案邏輯：有 square_image 時優先使用 API 回傳路徑並帶 updated_at 防快取
  if (props.product.square_image) {
    return withImageBase(withImageVersion(props.product.square_image, props.product.updated_at))
  }

  if (!gameTypeString.value || !props.product.product_code) {
    return ""
  }

  console.log("@@ getProductSquareImage params:", { product: props.product, gameTypeString: gameTypeString.value })

  return getImage(`/images/products/${siteKey.value}/${gameTypeString.value}/${props.product.product_code}.png`)
}

const fallbackSquareImage = computed(() => {
  if (!props.product.product_code) {
    return "/images/default/default.webp"
  }

  if (gameTypeString.value) {
    return getImage(`/images/products/${siteKey.value}/${gameTypeString.value}/${props.product.product_code}.png`)
  }

  if (!gameTypeString.value || !props.product.product_code) {
    return "/images/default/default.webp"
  }

  return getImage(
    `/images/products/${siteKey.value}/${gameTypeString.value.toLowerCase()}/${props.product.product_code}.png`
  )
})

const handlePlayNowClick = () => {
  emit("click")
}
</script>

<template>
  <div class="group flex w-full flex-col items-center rounded-lg bg-transparent transition">
    <div
      class="relative w-full overflow-hidden rounded-lg border border-white/10 bg-[var(--surface-surface-contrainer)] aspect-[190/169] transition-shadow duration-300 group-hover:shadow-[0_0_16px_0_var(--card-card-border-primary-active)]"
    >
      <BaseImage
        :src="getProductSquareImage()"
        :default-src="fallbackSquareImage"
        :alt="props.product.product_name"
        :class-obj="{
          container: 'h-full w-full',
          image: 'h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]',
          placeholder:
            'h-full w-full flex items-center justify-center bg-[linear-gradient(135deg,#111739_0%,#29185a_100%)] text-white/80 px-3'
        }"
      />

      <div
        class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <BaseBtn theme="primary" size="md" class="pointer-events-auto" @click.stop="handlePlayNowClick">
          Play now
        </BaseBtn>
      </div>
    </div>

    <p
      class="mt-2 w-full truncate px-1 text-center text-[14px] font-bold leading-5 text-[var(--card-card-title-secondary-enabled)]"
    >
      {{ props.product.product_name }}
    </p>
  </div>
</template>
