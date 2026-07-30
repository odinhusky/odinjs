<script setup lang="ts">
import type { MemberProfileTabKey } from "../../composables/useMemberProfileTabs"

interface MemberProfileTopTabItem {
  key: MemberProfileTabKey
  label: string
  to: string
}

interface Props {
  tabOptions: MemberProfileTopTabItem[]
  activeTabKey: MemberProfileTabKey
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [value: MemberProfileTabKey]
}>()

const handleChange = (key: MemberProfileTabKey) => {
  emit("change", key)
}
</script>

<template>
  <div :class="cx(FLEX_ITEMS_CENTER, 'flex-nowrap w-max')">
    <BaseTab
      v-for="tab in props.tabOptions"
      :key="tab.key"
      category="default"
      :active="props.activeTabKey === tab.key"
      :class-obj="{ item: 'shrink-0 min-w-fit px-5 py-2 whitespace-nowrap' }"
      @click="handleChange(tab.key)"
    >
      {{ tab.label }}
    </BaseTab>
  </div>
</template>
