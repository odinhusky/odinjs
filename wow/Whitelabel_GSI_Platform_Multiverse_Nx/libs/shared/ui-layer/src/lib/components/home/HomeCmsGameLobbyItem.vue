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

const handlePlayNowClick = () => {
  emit("click", props.entrance)
}
</script>

<template>
  <div class="group flex w-full flex-col items-center rounded-lg bg-transparent transition cursor-pointer">
    <div
      class="relative w-full overflow-hidden rounded-lg border border-white/10 bg-[var(--surface-surface-contrainer)]"
    >
      <BaseImage
        :src="imageSrc"
        default-src="/images/default/default.webp"
        :alt="title"
        :class-obj="{
          container: 'w-full',
          image: 'w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]',
          placeholder:
            'w-full aspect-[4/3] flex items-center justify-center bg-[linear-gradient(135deg,#111739_0%,#29185a_100%)] text-white/80 px-3'
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
      class="mt-2 w-full truncate px-1 text-center text-[12px] font-bold leading-4 text-[var(--card-card-title-secondary-enabled)]"
    >
      {{ title }}
    </p>
  </div>
</template>
