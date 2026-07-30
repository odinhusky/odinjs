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
    loading: false,
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
@import "app/template/set_r022/assets/css/membershipManagement.scss";
</style>
