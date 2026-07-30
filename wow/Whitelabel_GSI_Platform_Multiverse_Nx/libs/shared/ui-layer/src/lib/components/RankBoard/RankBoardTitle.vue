<script setup lang="ts">
interface RankBoardTitleClassObj {
  title?: string
}

interface Props {
  title?: string
  classObj?: RankBoardTitleClassObj
}

const props = withDefaults(defineProps<Props>(), {
  title: "Latest Bet And Big Wins",
  classObj: () => ({})
})
</script>

<template>
  <h3
    :class="
      cx(
        '!m-0 !p-0 text-xl text-[var(--text-text-title)] not-italic font-bold leading-7 capitalize phone:text-base phone:leading-6',
        props.classObj?.title
      )
    "
  >
    {{ props.title }}
  </h3>
</template>
