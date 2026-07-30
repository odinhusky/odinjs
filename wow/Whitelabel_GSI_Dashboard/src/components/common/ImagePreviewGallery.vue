<template>
  <div class="image-preview-gallery">
    <div v-if="normalizedImages.length" class="flex flex-wrap gap-2">
      <img
        v-for="(image, index) in normalizedImages"
        :key="`${image}-${index}`"
        :src="image"
        alt="preview"
        class="rounded object-cover"
        :class="failedImageMap[index] ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
        :style="{ width: thumbSize, height: thumbSize, display: 'block' }"
        @error="onThumbError(index)"
        @click="openPreview(index)"
      />
    </div>
    <slot v-else name="empty">
      <span>-</span>
    </slot>

    <q-dialog v-model="previewVisible" maximized>
      <q-card class="bg-black">
        <q-card-section class="row items-center justify-between text-white">
          <div>{{ currentIndex + 1 }} / {{ previewImages.length }}</div>
          <q-btn flat round dense icon="close" color="white" @click="previewVisible = false" />
        </q-card-section>

        <q-card-section class="q-pa-none">
          <q-carousel
            v-model="currentIndex"
            animated
            swipeable
            navigation
            arrows
            infinite
            height="calc(100vh - 64px)"
            class="bg-black text-white"
          >
            <q-carousel-slide v-for="(image, index) in previewImages" :key="`${image}-slide-${index}`" :name="index">
              <div class="flex h-full w-full items-center justify-center">
                <img :src="image" alt="preview-large" class="h-full w-full object-contain" />
              </div>
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue"
  import { useDynamicResourceUrl } from "@/composables/useDynamicResourceUrl"

  const props = withDefaults(
    defineProps<{
      images?: string[]
      thumbSize?: string
    }>(),
    {
      images: () => [],
      thumbSize: "80px"
    }
  )

  const previewVisible = ref(false)
  const currentIndex = ref(0)
  const failedImageMap = ref<Record<number, boolean>>({})

  const { normalizeDynamicResourceUrl } = useDynamicResourceUrl()

  const normalizedImages = computed(() =>
    (props.images || [])
      .map((item) => normalizeDynamicResourceUrl(String(item || "")))
      .filter((item) => item.length > 0)
  )

  const previewImageEntries = computed(() =>
    normalizedImages.value
      .map((image, index) => ({ image, index }))
      .filter((entry) => !failedImageMap.value[entry.index])
  )

  const previewImages = computed(() => previewImageEntries.value.map((entry) => entry.image))

  watch(
    normalizedImages,
    () => {
      failedImageMap.value = {}
      previewVisible.value = false
      currentIndex.value = 0
    },
    { deep: true }
  )

  const onThumbError = (index: number) => {
    failedImageMap.value = {
      ...failedImageMap.value,
      [index]: true
    }
  }

  const openPreview = (index: number) => {
    if (failedImageMap.value[index]) {
      return
    }
    const previewIndex = previewImageEntries.value.findIndex((entry) => entry.index === index)
    if (previewIndex < 0) {
      return
    }
    currentIndex.value = previewIndex
    previewVisible.value = true
  }
</script>
