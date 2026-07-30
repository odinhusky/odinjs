<script setup lang="ts">
type RankTab = "latestBet" | "latestWin"

interface RankBoardSwitcherClassObj {
  tabWrapper?: string
  tabItem?: string
  tabRoot?: string
}

interface Props {
  activeTab: RankTab
  classObj?: RankBoardSwitcherClassObj
}

const props = withDefaults(defineProps<Props>(), {
  classObj: () => ({})
})

const emit = defineEmits<{
  (e: "change", value: RankTab): void
}>()
</script>

<template>
  <div
    :class="
      cx(
        'w-fit',
        'flex rounded-[100px]',
        'bg-[var(--tab-tab-bg-rounded-primary-enabled)] p-2',
        props.classObj?.tabWrapper
      )
    "
  >
    <BaseTab
      category="round"
      :active="props.activeTab === 'latestBet'"
      :class-obj="{
        item: cx(
          'h-9 text-sm leading-5 font-semibold',
          props.activeTab !== 'latestBet' ? '!bg-transparent' : '',
          props.classObj?.tabItem
        ),
        root: cx('overflow-hidden rounded-[34px]', props.classObj?.tabRoot)
      }"
      @click="emit('change', 'latestBet')"
    >
      Latest bets
    </BaseTab>

    <BaseTab
      category="round"
      :active="props.activeTab === 'latestWin'"
      :class-obj="{
        item: cx(
          'h-9 text-sm leading-5 font-semibold',
          props.activeTab !== 'latestWin' ? '!bg-transparent' : '',
          props.classObj?.tabItem
        ),
        root: cx('overflow-hidden rounded-[34px]', props.classObj?.tabRoot)
      }"
      @click="emit('change', 'latestWin')"
    >
      Latest Big Wins
    </BaseTab>
  </div>
</template>
