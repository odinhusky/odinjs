<template>
  <img
    v-if="src"
    :src="src"
    :srcset="srcset || undefined"
    :sizes="sizes"
    :alt="alt"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchpriority"
    :draggable="draggable"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import type * as Response from "src/api/response.type"
import { BANNER_IMAGE_SIZES, useBanner } from "src/common/composables/useBanner"
import { computed } from "vue"

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    banner: Response.Banner
    sizes?: string
    alt?: string
    loading?: "lazy" | "eager"
    decoding?: "async" | "auto" | "sync"
    fetchpriority?: "high" | "low" | "auto"
    draggable?: boolean
  }>(),
  {
    sizes: BANNER_IMAGE_SIZES.FULL_WIDTH,
    alt: "",
    loading: "lazy",
    decoding: "async",
    fetchpriority: "auto",
    draggable: false,
  }
)

const { getBannerImage, getBannerImageSrcSet } = useBanner()

const src = computed(() => getBannerImage(props.banner) ?? "")
const srcset = computed(() => getBannerImageSrcSet(props.banner))
</script>
