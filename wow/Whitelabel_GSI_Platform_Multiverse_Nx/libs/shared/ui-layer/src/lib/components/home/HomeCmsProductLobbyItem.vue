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

const imageBaseUrl = computed(() => removeTrailingSlash(String(runtimeConfig.public.imageBase || "")))
const imageSrc = computed(() => withBase(imageBaseUrl.value, props.entrance.img_path || ""))

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
      class="relative w-full overflow-hidden rounded-lg border border-white/10 bg-[var(--surface-surface-contrainer)] aspect-[190/169]"
    >
      <BaseImage
        :src="imageSrc"
        default-src="/images/default/default.webp"
        :alt="title"
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
      {{ title }}
    </p>
  </div>
</template>
