<script setup lang="ts">
interface Props {
  src: string
  imageAlt?: string
  classObj?: {
    root?: string
    imageWrap?: string
    imageClass?: string
    content?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  imageAlt: "no-data",
  imageClass: "w-[140px] h-auto",
  classObj: () => ({})
})
</script>

<template>
  <div
    :class="
      cx(
        FULL,
        FLEX_CENTER,
        FLEX_COL,
        'gap-5 min-h-[240px] text-center bg-transparent',
        'px-4 py-6',
        props.classObj?.root
      )
    "
  >
    <div :class="cx('shrink-0', props.classObj?.imageWrap)">
      <BaseImage :src="props.src" :alt="props.imageAlt" :class-obj="{ image: props.classObj?.imageClass }" />
    </div>

    <div :class="cx('w-full', props.classObj?.content)">
      <slot />
    </div>
  </div>
</template>
