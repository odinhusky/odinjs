<script setup lang="ts">
interface Props {
  username?: string
}

const props = withDefaults(defineProps<Props>(), {
  username: "user name"
})

const emit = defineEmits<{
  "edit-avatar": []
}>()

const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()

const shouldShowBriefInfo = computed(() => authStore.isLoggedIn)

const profileUsername = computed(() => {
  const profile = userProfileStore.profile
  return profile?.nickname || profile?.account || authStore.loginData?.account || props.username
})

const profileAvatarSrc = computed(() => userProfileStore.profile?.avatar_path || "")

const handleEditAvatar = () => {
  handleGlobalClick({
    target: "handleMemberAsideEditAvatarClick",
    debounceTimer: 150,
    callback: () => {
      emit("edit-avatar")
    }
  })
}
</script>

<template>
  <div v-if="shouldShowBriefInfo" :class="cx(FLEX_ITEMS_CENTER, 'flex-col gap-3')">
    <div class="relative">
      <BasePlainBtn class="rounded-full" @click="handleEditAvatar">
        <BaseGradientBorderContainer :type="'circle'" :size="48">
          <BaseAvatar
            :avatar-src="profileAvatarSrc"
            :size="48"
            :class-obj="{
              wrapper: cx(FULL),
              avatar: cx(FULL),
              avatarDummy: cx(
                FULL,
                'bg-[var(--sidebar-sidebar-bg,#000025)] text-[var(--sidebar-sidebar-item-icon-enabled)]'
              )
            }"
          />
        </BaseGradientBorderContainer>
      </BasePlainBtn>

      <BasePlainBtn class="absolute bottom-0 right-0" @click="handleEditAvatar">
        <BaseGradientBorderContainer
          :type="'circle'"
          :size="20"
          :class-obj="{ root: 'rounded-full', inner: cx(FLEX_CENTER, 'rounded-full text-white') }"
        >
          <BaseIcon name="mdi:pencil" size="12px" />
        </BaseGradientBorderContainer>
      </BasePlainBtn>
    </div>

    <div
      :class="
        cx(
          'w-full px-[10px]',
          'text-center text-base leading-6 text-[var(--sidebar-sidebar-item-title-enabled)] font-semibold',
          'break-all whitespace-normal',
          FLEX_CENTER,
          'flex-wrap'
        )
      "
    >
      <span class="block">Hi,</span>
      <span class="block">{{ profileUsername }}</span>
    </div>
  </div>
</template>
