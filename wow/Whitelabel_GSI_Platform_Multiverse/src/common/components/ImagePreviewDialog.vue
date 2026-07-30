<template>
  <q-dialog
    ref="dialogRef"
    maximized
    transition-show="fade"
    transition-hide="fade"
    class="image-preview-dialog"
    @hide="onDialogHide"
  >
    <div
      class="pointer-events-auto box-border flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden bg-black/50 text-white backdrop-blur-[1px]"
      @click.self="onDialogCancel"
    >
      <header
        class="flex shrink-0 items-center gap-3 border-b border-white/10 bg-black/20 px-4 py-2 md:px-6"
        :class="images.length > 1 ? 'justify-between' : 'justify-end'"
        @click.stop
      >
        <span v-if="images.length > 1" class="text-sm font-medium text-white/90">
          {{ idx + 1 }} / {{ images.length }}
        </span>
        <q-btn icon="close" flat round dense size="md" color="white" class="text-white" @click="onDialogCancel" />
      </header>

      <div class="relative min-h-0 flex-1 overflow-hidden">
        <q-btn
          v-show="canPrev"
          icon="chevron_left"
          flat
          round
          dense
          size="lg"
          color="white"
          class="absolute left-1 top-1/2 z-20 -translate-y-1/2 bg-black/30 md:left-4"
          @click.stop="goPrev"
        />
        <div
          class="absolute inset-0 flex min-h-0 min-w-0 items-center justify-center overflow-hidden px-2 py-2 md:px-6 md:py-3"
          @click.self="onDialogCancel"
        >
          <img
            :key="currentSrc"
            :src="currentSrc"
            alt=""
            loading="lazy"
            draggable="false"
            class="max-h-full max-w-full object-contain select-none"
            @click.stop
          />
        </div>
        <q-btn
          v-show="canNext"
          icon="chevron_right"
          flat
          round
          dense
          size="lg"
          color="white"
          class="absolute right-1 top-1/2 z-20 -translate-y-1/2 bg-black/30 md:right-4"
          @click.stop="goNext"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from "quasar"
import { computed, onMounted, onUnmounted, ref } from "vue"

const props = defineProps<{
  /** 可預覽的圖片 URL（順序與縮圖一致） */
  images: string[]
  /** 初始選中的索引 */
  initialIndex: number
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

function clampIndex(i: number, len: number) {
  if (len <= 0) return 0
  return Math.min(Math.max(0, i), len - 1)
}

const idx = ref(clampIndex(props.initialIndex, props.images.length))

const currentSrc = computed(() => props.images[idx.value] ?? "")
const canPrev = computed(() => idx.value > 0)
const canNext = computed(() => idx.value < props.images.length - 1)

function goPrev() {
  if (canPrev.value) idx.value -= 1
}

function goNext() {
  if (canNext.value) idx.value += 1
}

function onKeydown(ev: KeyboardEvent) {
  if (ev.key === "ArrowLeft") {
    ev.preventDefault()
    goPrev()
  } else if (ev.key === "ArrowRight") {
    ev.preventDefault()
    goNext()
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown)
})

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown)
})
</script>

<style lang="scss">
/* 全螢幕預覽：避免被外層 dialog / card 的 max-width 影響；禁止內層捲軸，高度交給視窗 */
.image-preview-dialog.q-dialog .q-dialog__inner {
  padding: 0 !important;
  max-width: none !important;
  width: 100%;
  max-height: none !important;
  height: 100%;
  overflow: hidden !important;
  align-items: stretch;
}
</style>
