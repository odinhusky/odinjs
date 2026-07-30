<script setup lang="ts">
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()
const { isDown } = useCustomBreakpoints()
const { collapsed, toggleCollapsed } = useSideMenu()
const { handleMemberAction } = useMemberAction()

const username = computed(() => {
  const profile = userProfileStore.profile
  return profile?.nickname || profile?.account || authStore.loginData?.account || "Guest"
})

const avatarSrc = computed(() => userProfileStore.profile?.avatar_path || "")

const handleToggleMenu = () => {
  toggleCollapsed()
}

const handleLogin = () => {
  handleGlobalClick({
    target: "handleHeaderLoginBtnClick",
    debounceTimer: 250,
    callback: async () => {
      await navigateTo(ROUTE_PATH.LOGIN.PASSWORD)
    }
  })
}

const handleSignUp = () => {
  handleGlobalClick({
    target: "handleHeaderSignUpBtnClick",
    debounceTimer: 250,
    callback: async () => {
      await navigateTo(ROUTE_PATH.REGISTER)
    }
  })
}
</script>

<template>
  <header :class="cx('w-full', 'fixed top-0 left-0 right-0 z-40', 'bg-[var(--surface-surface-header)]')">
    <div :class="cx('h-[72px] pt-5 px-3 pb-3  phone:h-14 phone:p-3', FLEX_ITEMS_CENTER, 'gap-3 phone:gap-2')">
      <HeaderLeft :collapsed="collapsed" @toggle-menu="handleToggleMenu" />

      <div class="ml-auto flex items-center gap-2 md:gap-3">
        <template v-if="authStore.isLoggedIn">
          <CurrencyInfo />
          <MemberBlock :username="username" :avatar-src="avatarSrc" @action="handleMemberAction" />
        </template>

        <template v-else>
          <BaseBtn
            :size="isDown.phone ? 'md' : 'xl'"
            category="outline"
            :class-obj="{ button: 'whitespace-nowrap shrink-0' }"
            @click="handleLogin"
          >
            Log In
          </BaseBtn>
          <BaseBtn
            :size="isDown.phone ? 'md' : 'xl'"
            :class-obj="{ button: 'whitespace-nowrap shrink-0' }"
            @click="handleSignUp"
          >
            Sign Up
          </BaseBtn>
        </template>

        <LanguageSelect />
      </div>
    </div>
  </header>
</template>
