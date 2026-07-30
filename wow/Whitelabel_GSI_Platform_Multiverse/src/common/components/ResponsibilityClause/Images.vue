<template>
  <div v-if="visible && hasImages" class="responsibility-clause-images">
    <img
      v-for="(image, index) in clauseData.images"
      :key="`${image}-${index}`"
      :src="image"
      alt="game-responsibly"
      class="responsibility-clause-image"
    />
  </div>
</template>

<script setup lang="ts">
import type * as Request from "src/api/request.type"
import { useResponsibilityClauseQuery } from "src/common/apiHooks/responsibilityClause/useResponsibilityClauseQuery"
import { computed, watch } from "vue"

const props = withDefaults(
  defineProps<{
    position: Request.GetResponsibilityClause["position"]
    visible?: boolean
  }>(),
  {
    visible: true,
  }
)

const emit = defineEmits<{
  hasImages: [value: boolean]
}>()

const { data: clauseData } = useResponsibilityClauseQuery({
  position: () => props.position,
})
const hasImages = computed(() => clauseData.value?.hasImages ?? false)
const visible = computed(() => props.visible)

watch(
  hasImages,
  (value) => {
    emit("hasImages", value)
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.responsibility-clause-images {
  --responsibility-clause-image-gap: 12px;

  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: var(--responsibility-clause-image-gap);
}

.responsibility-clause-image {
  width: calc((100% - (var(--responsibility-clause-image-gap) * 2)) / 3);
  min-width: 0;
  max-height: 1.5625rem;
  max-width: calc((100% - (var(--responsibility-clause-image-gap) * 2)) / 3);
  flex: 0 1 calc((100% - (var(--responsibility-clause-image-gap) * 2)) / 3);
  object-fit: contain;
}
</style>
