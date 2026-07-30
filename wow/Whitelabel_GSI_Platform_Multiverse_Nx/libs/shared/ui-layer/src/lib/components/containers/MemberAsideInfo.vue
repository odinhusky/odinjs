<script setup lang="ts">
interface MemberAsideAction {
  key: string
  label: string
  icon: string
}

interface Props {
  actions?: readonly MemberAsideAction[]
  activeKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  activeKey: ""
})

const emit = defineEmits<{
  select: [key: string]
  "edit-avatar": []
}>()

const { isDown } = useCustomBreakpoints()
const memberAsideStore = useMemberAsideStore()

const resolvedActions = computed(() => {
  if (props.actions.length > 0) {
    return props.actions
  }

  return memberAsideStore.memberAsideActions
})

const handleSelect = (key: string) => {
  emit("select", key)
}
</script>

<template>
  <div :class="cx(FLEX_COL, 'gap-3')">
    <MemberAsideBreifInfo @edit-avatar="emit('edit-avatar')" />

    <div :class="cx('w-full')">
      <ActionListBtn
        v-for="action in resolvedActions"
        :key="action.key"
        :label="action.label"
        :icon="action.icon"
        :active="action.key === props.activeKey && !isDown.phone"
        active-mode="icon"
        :hover-like-active="false"
        @click="handleSelect(action.key)"
      />
    </div>
  </div>
</template>
