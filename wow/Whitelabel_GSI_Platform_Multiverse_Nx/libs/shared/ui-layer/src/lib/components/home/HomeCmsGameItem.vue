<script setup lang="ts">
import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
const props = defineProps<{
  entrance: CmsEntranceItem
}>()

const emit = defineEmits<{
  (event: "click", entrance: CmsEntranceItem): void
}>()

const runtimeConfig = useRuntimeConfig()
const { locale } = useI18n()

const imageSrc = computed(() =>
  buildCmsEntranceImageSrc(props.entrance, {
    imageBase: String(runtimeConfig.public.imageBase || ""),
    origin: process.client ? window.location.origin : "",
    staticResourceUrl: String(runtimeConfig.public.staticResourceUrl || ""),
    staticResourceProxyTarget: String(runtimeConfig.public.staticResourceProxyTarget || "")
  })
)

const title = computed(() => {
  const lang = locale.value
  const titles = props.entrance.lang ?? {}
  return (titles[lang as keyof typeof titles] as string) || (titles["en"] as string) || ""
})

const handleClick = () => {
  handleGlobalClick({
    target: "home-cms-game-item-click",
    payload: props.entrance,
    callback: (entrance) => {
      emit("click", entrance!)
    }
  })
}
</script>

<template>
  <div class="flex flex-col items-center gap-1 cursor-pointer group" @click="handleClick">
    <div class="w-full overflow-hidden rounded-lg">
      <BaseImage
        :src="imageSrc"
        :alt="title"
        :class-obj="{
          container: 'w-full',
          image: 'w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105'
        }"
      />
    </div>
    <span class="text-xs text-[var(--base-content)] text-center leading-tight truncate w-full">
      {{ title }}
    </span>
  </div>
</template>
