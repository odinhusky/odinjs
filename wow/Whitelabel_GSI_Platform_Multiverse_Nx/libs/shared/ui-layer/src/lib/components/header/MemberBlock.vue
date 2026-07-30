<script setup lang="ts">
interface Props {
  username?: string
  avatarSrc?: string
}

withDefaults(defineProps<Props>(), {
  username: "Guest",
  avatarSrc: ""
})

const menuRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const { memberActionItems } = useMemberAction()

const emit = defineEmits<{
  (e: "action", key: string): void
}>()

const toggle = () => {
  handleGlobalClick({
    target: "handleMemberBlockToggleMenuClick",
    debounceTimer: 150,
    callback: () => {
      isOpen.value = !isOpen.value
    }
  })
}

const handleAction = (key: string) => {
  handleGlobalClick({
    target: `handleMemberBlock${key.replace(/[^a-zA-Z0-9]/g, "") || "Action"}Click`,
    debounceTimer: 200,
    callback: () => {
      emit("action", key)
      isOpen.value = false
    }
  })
}

onMounted(() => {
  const onDocClick = (event: MouseEvent) => {
    const target = event.target as Node
    if (!menuRef.value?.contains(target)) {
      isOpen.value = false
    }
  }
  document.addEventListener("click", onDocClick)
  onUnmounted(() => document.removeEventListener("click", onDocClick))
})
</script>

<template>
  <div ref="menuRef" class="relative phone:hidden">
    <BasePlainBtn
      :class-obj="{
        button: cx(
          'h-12 px-3 py-1 rounded-lg',
          'bg-[var(--card-card-bg-secondary-enabled)]',
          FLEX_ITEMS_CENTER,
          'gap-2'
        )
      }"
      @click="toggle"
    >
      <BaseAvatar :avatar-src="avatarSrc" :username="username" />
      <span
        :class="
          cx(
            'text-[var(--card-card-title-primary-enabled)]',
            'text-sm leading-4 min-w-0 break-word whitespace-normal text-left'
          )
        "
      >
        {{ username }}
      </span>
    </BasePlainBtn>

    <div v-if="isOpen" class="absolute right-0 top-[calc(100%+8px)] z-30">
      <MemberBlockList :items="memberActionItems" @item-click="handleAction" />
    </div>
  </div>
</template>
