<script setup lang="ts">
import { GAME_TYPE_BANNER_IMAGE_MAP } from "@shared-lib/constants/lobbyBanner"

interface Props {
  lobbyTitle: string
  gameTypeId: number
}

const props = defineProps<Props>()

const bannerItemSrc = computed(() => {
  return GAME_TYPE_BANNER_IMAGE_MAP[props.gameTypeId] ?? "/images/lobby/lobby-banner-item-other.png"
})
</script>

<template>
  <div
    class="w-full bg-[url('/images/lobby/lobby-bg.png')] mob:bg-[url('/images/lobby/lobby-bg-mobile.png')] bg-cover bg-no-repeat bg-center"
    :class="cx(LOBBY_CONTAINER_PADDING_CLASS, '!pb-0')"
  >
    <div :class="cx('w-full', LAYOUT_MAX_WIDTH, 'mx-auto')">
      <div class="w-full h-[115px] mob:h-[78px] flex items-center justify-between">
        <h1 class="text-[var(--game-banner-text)] text-[36px] mob:text-[28px] font-bold leading-10 mob:leading-8">
          {{ lobbyTitle }}
        </h1>

        <BaseImage
          :src="bannerItemSrc"
          alt="lobby banner"
          :class-obj="{
            container: cx('h-full self-end phone:w-[300px] mob:w-[161px]'),
            image: 'w-full h-full object-contain object-bottom'
          }"
        />
      </div>
    </div>
  </div>
</template>
