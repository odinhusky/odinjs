<script setup lang="ts">
import { useI18n } from "#imports"

type NoDataType = "empty" | "gift" | "card"

interface Props {
  type?: NoDataType
  title?: string
  description?: string
  classObj?: {
    root?: string
    title?: string
    description?: string
    imageWrap?: string
    imageClass?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  type: "empty",
  title: "",
  description: "",
  classObj: () => ({})
})
const { t } = useI18n()

const noDataConfigMap = {
  empty: {
    image: "/images/noData/noData_empty.png",
    defaultTitleKey: "tableHeader.noData",
    defaultTitle: "",
    defaultDescription: "",
    imageWrap: "w-[120px] h-auto",
    imageClass: "w-full h-full"
  },
  gift: {
    image: "/images/noData/noData_gift.png",
    defaultTitle: "目前等級暫無可領取獎勵",
    defaultDescription: "請繼續投注累積成長值，提升等級後即可領取。",
    imageWrap: "w-[120px] h-auto",
    imageClass: "w-full h-full"
  },
  card: {
    image: "/images/noData/noData_card.png",
    defaultTitle: "暫無銀行資料，請先新增銀行資訊",
    defaultDescription: "",
    imageWrap: "w-[120px] h-auto",
    imageClass: "w-full h-full"
  }
} as const

const currentConfig = computed(() => noDataConfigMap[props.type])
const currentTitle = computed((): string => {
  if (props.title) return props.title
  if ("defaultTitleKey" in currentConfig.value) return t(currentConfig.value.defaultTitleKey)
  return currentConfig.value.defaultTitle
})
</script>

<template>
  <BaseNoData
    :src="currentConfig.image"
    :class-obj="{
      root: cx('min-h-[300px] phone:min-h-[220px]', props.classObj?.root),
      imageWrap: cx(currentConfig.imageWrap, props.classObj?.imageWrap),
      imageClass: cx(currentConfig.imageClass, props.classObj?.imageClass)
    }"
  >
    <div class="flex flex-col items-center gap-3">
      <div :class="cx('text-[var(--text-text-primary)] text-base leading-6 font-bold', props.classObj?.title)">
        {{ currentTitle }}
      </div>

      <div
        v-if="props.description || currentConfig.defaultDescription"
        :class="cx('text-[var(--text-text-primary)] text-sm leading-5', props.classObj?.description)"
      >
        {{ props.description || currentConfig.defaultDescription }}
      </div>

      <div v-if="$slots.action" class="pt-1">
        <slot name="action" />
      </div>
    </div>
  </BaseNoData>
</template>
