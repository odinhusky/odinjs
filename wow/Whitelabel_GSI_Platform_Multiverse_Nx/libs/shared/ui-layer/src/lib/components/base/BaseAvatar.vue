<script setup lang="ts">
import BaseImage from "@shared-lib/components/base/BaseImage.vue"

interface BaseAvatarProps {
  avatarSrc?: string
  username?: string
  size?: number
  class?: string | string[] | Record<string, boolean>
  classObj?: {
    wrapper?: string // 最外層容器
    avatar?: string // 針對 根節點 (button)
    avatarDummy?: string // 沒有 avatarSrc 時的預設頭像樣式
  }
}

const baseAvatarProps = withDefaults(defineProps<BaseAvatarProps>(), {
  size: 36
})

const isAvatarValid = ref(false)

const avatarSizeStyle = computed(() => ({
  width: `${baseAvatarProps.size}px`,
  height: `${baseAvatarProps.size}px`
}))

const fallbackIconSize = computed(() => `${(baseAvatarProps.size / 4) * 3}px`)

const validateAvatarSrc = async (src: string) => {
  if (!src) {
    isAvatarValid.value = false
    return
  }

  await new Promise<void>((resolve) => {
    const image = new Image()
    image.onload = () => {
      isAvatarValid.value = true
      resolve()
    }
    image.onerror = () => {
      isAvatarValid.value = false
      resolve()
    }
    image.src = src
  })
}

watch(
  () => baseAvatarProps.avatarSrc,
  (nextSrc) => {
    isAvatarValid.value = false
    void validateAvatarSrc(nextSrc || "")
  },
  { immediate: true }
)
</script>

<template>
  <div :class="cx(baseAvatarProps.classObj?.wrapper)">
    <BaseImage
      v-bind="$attrs"
      v-if="isAvatarValid && baseAvatarProps.avatarSrc"
      :src="baseAvatarProps.avatarSrc"
      :class-obj="{
        container: cx('rounded-full overflow-hidden', baseAvatarProps.classObj?.avatar),
        image: 'h-full w-full object-cover'
      }"
      :style="avatarSizeStyle"
    />

    <div
      v-else
      :class="cx(FLEX_CENTER, 'rounded-full text-white text-sm', baseAvatarProps.classObj?.avatarDummy)"
      :style="avatarSizeStyle"
    >
      <BaseIcon name="material-symbols:person" :size="fallbackIconSize" />

      <!--
      <span v-if="baseAvatarProps.username">{{ baseAvatarProps.username.charAt(0).toUpperCase() }}</span>
      -->
    </div>
  </div>
</template>
