<script setup lang="ts">
import type { GameItem } from "@shared-lib/api/commonTypes/gameTypes"

interface GameTypeMapItem {
  game_type?: string
}

interface Props {
  game: GameItem
  gameTypeMap: Record<number, GameTypeMapItem>
  isFavoriteMutating?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
  toggleFavorite: []
}>()

const { getGameImage } = useGetImage()

const gameImage = computed(() => getGameImage(props.game, props.gameTypeMap))

const handlePlayNowClick = () => {
  emit("click")
}

const handleFavoriteClick = () => {
  emit("toggleFavorite")
}

const isFavorite = computed(() => {
  return Boolean(props.game.is_favorite || props.game.is_favorited)
})
</script>

<template>
  <div class="group flex w-[161px] phone:w-full flex-col items-center rounded-lg bg-transparent transition">
    <div
      class="relative w-full overflow-hidden rounded-lg border border-white/10 bg-[var(--surface-surface-contrainer)] aspect-square transition-shadow duration-300 group-hover:shadow-[0_0_16px_0_var(--card-card-border-primary-active)]"
    >
      <BaseImage
        :src="gameImage"
        default-src="/images/default/default.webp"
        :alt="props.game.game_name"
        :class-obj="{
          container: 'h-full w-full',
          image: 'h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]',
          placeholder:
            'h-full w-full flex items-center justify-center bg-[linear-gradient(135deg,#111739_0%,#29185a_100%)] text-white/80 px-3'
        }"
      />

      <FavoriteBtn
        :active="isFavorite"
        :disabled="props.isFavoriteMutating"
        :class-obj="{
          button: 'absolute right-2 top-2 z-10 shadow-[0_4px_12px_rgba(0,0,0,0.35)]'
        }"
        @click.stop="handleFavoriteClick"
      />

      <div
        class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <BaseBtn theme="primary" size="md" class="pointer-events-auto" @click.stop="handlePlayNowClick">
          Play now
        </BaseBtn>
      </div>
    </div>

    <p
      class="mt-2 w-full truncate px-1 text-center text-[12px] font-bold leading-4 text-[var(--card-card-title-secondary-enabled)]"
    >
      {{ props.game.game_name }}
    </p>
  </div>
</template>
