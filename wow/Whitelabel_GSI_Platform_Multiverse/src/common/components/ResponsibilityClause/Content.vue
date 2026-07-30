<template>
  <div v-if="visible && hasContent" class="responsibility-clause-content" v-html="clauseData?.content"></div>
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
  hasContent: [value: boolean]
}>()

const { data: clauseData } = useResponsibilityClauseQuery({
  position: () => props.position,
})
const hasContent = computed(() => clauseData.value?.hasContent ?? false)
const visible = computed(() => props.visible)

watch(
  hasContent,
  (value) => {
    emit("hasContent", value)
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.responsibility-clause-content {
  width: 100%;
  font-size: 12px;
  overflow-wrap: anywhere;
  word-break: break-word;

  :deep(*) {
    font-size: inherit;
  }

  :deep(p) {
    margin: 0 0 0.25rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(ol),
  :deep(ul) {
    margin: 0 0 0.25rem;
    padding-left: 1.5em;
  }

  :deep(ol) {
    list-style: decimal outside;
  }

  :deep(ul) {
    list-style: disc outside;
  }

  :deep(li) {
    display: list-item;
  }

  :deep(a) {
    color: var(--q-primary, #1976d2);
    text-decoration: underline;
  }
}
</style>
