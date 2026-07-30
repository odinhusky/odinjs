<script setup lang="ts">
interface Props {
  modelValue?: number
  totalRecords?: number
  rows?: number
  maxVisiblePages?: number
  classObj?: {
    root?: string
    pageButton?: string
    activePageButton?: string
    inactivePageButton?: string
    navButton?: string
    ellipsis?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  totalRecords: 0,
  rows: 10,
  maxVisiblePages: 5,
  classObj: () => ({})
})

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void
  (e: "change", value: number): void
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalRecords / Math.max(props.rows, 1))))

const canPrev = computed(() => props.modelValue > 1)
const canNext = computed(() => props.modelValue < totalPages.value)

const pageWindow = computed<(number | string)[]>(() => {
  const pages = totalPages.value
  const current = props.modelValue
  const maxVisible = Math.max(3, props.maxVisiblePages)

  if (pages <= maxVisible) {
    return Array.from({ length: pages }, (_, index) => index + 1)
  }

  const innerCount = maxVisible - 2
  let start = Math.max(2, current - Math.floor(innerCount / 2))
  let end = Math.min(pages - 1, start + innerCount - 1)

  if (end - start + 1 < innerCount) {
    start = Math.max(2, end - innerCount + 1)
  }

  const result: (number | string)[] = [1]

  if (start > 2) {
    result.push("...")
  }

  for (let page = start; page <= end; page += 1) {
    result.push(page)
  }

  if (end < pages - 1) {
    result.push("...")
  }

  result.push(pages)
  return result
})

const navButtonClass = cx(
  "inline-flex w-8 h-8 p-1 flex-col justify-center items-center rounded-lg aspect-square",
  "bg-[var(--pagination-pagination-bg-disable)] text-[var(--pagination-pagination-title-disable)]",
  "disabled:opacity-40 disabled:cursor-not-allowed"
)

const pageButtonBaseClass = cx(
  "inline-flex w-8 h-8 p-1 flex-col justify-center items-center rounded-lg aspect-square",
  "text-sm leading-5 font-bold"
)

const pageButtonActiveClass =
  "bg-[var(--pagination-pagination-bg-active)] text-[var(--pagination-pagination-title-active)]"
const pageButtonInactiveClass =
  "bg-[var(--pagination-pagination-bg-enabled)] text-[var(--pagination-pagination-title-enabled)]"

const emitPage = (page: number) => {
  const target = Math.min(Math.max(page, 1), totalPages.value)
  emit("update:modelValue", target)
  emit("change", target)
}
</script>

<template>
  <nav :class="cx('inline-flex items-center gap-2', props.classObj?.root)">
    <button
      type="button"
      :disabled="!canPrev"
      :class="cx(navButtonClass, props.classObj?.navButton)"
      @click="emitPage(props.modelValue - 1)"
    >
      <BaseIcon name="mdi:chevron-left" size="18px" />
    </button>

    <template v-for="(page, index) in pageWindow" :key="`${page}-${index}`">
      <span
        v-if="page === '...'"
        :class="
          cx(
            'inline-flex w-8 h-8 items-center justify-center text-sm font-bold text-white/70',
            props.classObj?.ellipsis
          )
        "
      >
        ...
      </span>

      <button
        v-else
        type="button"
        :class="
          cx(
            pageButtonBaseClass,
            page === props.modelValue ? pageButtonActiveClass : pageButtonInactiveClass,
            props.classObj?.pageButton,
            page === props.modelValue ? props.classObj?.activePageButton : props.classObj?.inactivePageButton
          )
        "
        @click="emitPage(Number(page))"
      >
        {{ page }}
      </button>
    </template>

    <button
      type="button"
      :disabled="!canNext"
      :class="cx(navButtonClass, props.classObj?.navButton)"
      @click="emitPage(props.modelValue + 1)"
    >
      <BaseIcon name="mdi:chevron-right" size="18px" />
    </button>
  </nav>
</template>
