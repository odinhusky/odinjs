<template>
  <q-btn
    :label="label || $t('common.btn.search')"
    text-color="white"
    unelevated
    class="agent-center-search-btn"
    :type="resolvedType"
    :loading="loading"
    no-caps
    @click="handleClick"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    label?: string
    type?: "button" | "submit" | "reset"
    loading?: boolean
    action?: () => void | Promise<void>
  }>(),
  {
    label: "",
    loading: false
  }
)

const emit = defineEmits<{
  (event: "click", value: Event): void
}>()

const resolvedType = computed(() => props.type ?? (props.action ? "button" : "submit"))

const handleClick = (event: Event) => {
  emit("click", event)
  void props.action?.()
}
</script>

<style lang="scss" scoped>
@import "app/template/set_r033/assets/css/_variable.scss";

.agent-center-search-btn {
  flex: 0 0 6.25rem;
  align-self: flex-end;
  width: 6.25rem;
  min-width: 6.25rem;
  height: 2.5rem;
  margin-left: auto;
  padding: 0.625rem;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%);
  color: var(--btn-text-05);
  font-family: "Noto Sans", NotoSans, "Noto Sans TC", sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;

  :deep(.q-btn__content) {
    min-width: 5rem;
    justify-content: center;
    line-height: 1rem;
  }

  &::before {
    box-shadow: none;
  }

  @media (max-width: 768px) {
    flex-basis: auto;
    align-self: stretch;
    width: 100%;
    min-width: 0;
    height: 2.5rem;

    :deep(.q-btn__content) {
      line-height: 1rem;
    }
  }
}
</style>
