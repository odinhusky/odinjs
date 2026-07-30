<script setup lang="ts">
interface MemberActionItem {
  key: string
  label: string
  icon: string
}

interface Props {
  items?: MemberActionItem[]
}

withDefaults(defineProps<Props>(), {
  items: () => [
    { key: "profile", label: "個人資訊", icon: "mdi:account-circle-outline" },
    { key: "history", label: "歷史", icon: "mdi:history" },
    { key: "logout", label: "登出", icon: "mdi:logout" }
  ]
})

const emit = defineEmits<{
  (e: "item-click", key: string): void
}>()

const handleMemberBlockListItemClick = (key: string) => {
  handleGlobalClick({
    target: `handleMemberBlockList${key.replace(/[^a-zA-Z0-9]/g, "") || "Item"}Click`,
    debounceTimer: 200,
    callback: () => {
      emit("item-click", key)
    }
  })
}
</script>

<template>
  <div
    class="min-w-[240px] rounded-xl p-2 bg-[linear-gradient(135deg,#080c3f_0%,#05072f_100%)] border border-white/10 shadow-xl"
  >
    <ActionListBtn
      v-for="item in items"
      :key="item.key"
      :label="item.label"
      :icon="item.icon"
      active-mode="icon"
      :hover-like-active="true"
      :class-obj="{
        button: 'px-3 py-2 rounded-lg',
        iconWrap: 'h-6 w-6 rounded-md',
        text: 'text-sm leading-5 text-white/80'
      }"
      @click="handleMemberBlockListItemClick(item.key)"
    />
  </div>
</template>
