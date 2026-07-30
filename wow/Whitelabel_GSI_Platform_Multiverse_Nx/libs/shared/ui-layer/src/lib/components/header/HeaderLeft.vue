<script setup lang="ts">
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
interface Props {
  collapsed?: boolean
  logoSrc?: string
  homePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  logoSrc: "/images/header_logo.png",
  homePath: ROUTE_PATH.HOME
})

const emit = defineEmits<{
  (e: "toggle-menu"): void
}>()

const handleToggleMenuClick = () => {
  handleGlobalClick({
    target: "handleHeaderLeftToggleMenuBtnClick",
    debounceTimer: 150,
    callback: () => {
      emit("toggle-menu")
    }
  })
}

const handleNavigateToHomeRoute = async (event: MouseEvent) => {
  event.preventDefault()

  handleGlobalClick({
    target: "handleHeaderLogoNavigateToHomeRouteClick",
    debounceTimer: 250,
    callback: async () => {
      await navigateTo(props.homePath)
    }
  })
}
</script>

<template>
  <div class="flex items-center gap-2 min-w-0">
    <BasePlainBtn
      :class-obj="{
        button: cx('h-8 w-8 rounded-md text-white transition-colors')
      }"
      @click="handleToggleMenuClick"
    >
      <BaseIcon
        name="ic:round-menu-open"
        size="2rem"
        :class-name="cx('transition-transform duration-300', collapsed && 'rotate-180')"
      />
    </BasePlainBtn>

    <NuxtLink
      :to="props.homePath"
      class="h-full flex items-center cursor-pointer min-w-0"
      @click="handleNavigateToHomeRoute"
    >
      <BaseImage
        :src="props.logoSrc"
        alt="logo"
        width="183"
        height="34"
        :class-obj="{
          container: cx('h-full  max-h-[34px] phone:max-h-[32px] w-auto', FLEX_ITEMS_CENTER, 'justify-start'),
          image: 'h-full w-auto object-contain'
        }"
      />
    </NuxtLink>
  </div>
</template>
