<script setup lang="ts">
interface Props {
  title?: string
  headerTitle?: string
  contentTitle?: string
  subtitle?: string
  showAside?: boolean
  mobileContentVisible?: boolean
  disableContentMaxWidth?: boolean
  showContentTitleOnMobile?: boolean
  /** 外層 section max-width；給代理中心類整頁 1200 用，預設不限制 */
  sectionMaxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  headerTitle: "",
  contentTitle: "",
  subtitle: "",
  showAside: false,
  mobileContentVisible: true,
  disableContentMaxWidth: false,
  showContentTitleOnMobile: false,
  sectionMaxWidth: ""
})

const emit = defineEmits<{
  back: []
}>()

const { isDown } = useCustomBreakpoints()

const shouldShowMenu = computed(() => {
  if (!props.showAside) return false
  if (!isDown.phone) return true
  return !props.mobileContentVisible
})

const shouldShowContent = computed(() => {
  if (!props.showAside) return true
  if (!isDown.phone) return true
  return props.mobileContentVisible
})

const handleBack = () => {
  emit("back")
}

const titleContainerClass = cx(FLEX_COL, "gap-3", "w-full")

const titleClass = cx("text-2xl leading-7 font-bold text-[var(--text-text-primary)]")

const subTitleClass = cx("text-sm leading-5 text-[var(--text-text-primary)]")

const resolvedHeaderTitle = computed(() => props.headerTitle || props.title)
const resolvedContentTitle = computed(() => props.contentTitle || props.title)
const shouldShowContentTitle = computed(() => {
  if (!props.showAside) return false
  if (!isDown.phone) return true
  return props.showContentTitleOnMobile
})
const topSlotContainerClass = computed(() =>
  cx(
    "absolute top-0 translate-y-[-100%] left-0 z-[30]",
    "phone:relative phone:translate-y-[initial]",
    "w-full min-w-0",
    OVERFLOW_X_AUTO_HIDDEN
  )
)
const contentInnerClass = computed(() =>
  cx(
    "w-full min-w-0 min-h-0 h-full box-border mob:p-3 flex-1",
    !props.disableContentMaxWidth && "max-w-[560px]",
    FLEX_COL
  )
)
</script>

<template>
  <section
    class="box-border h-full min-h-0 overflow-x-hidden px-5 py-8 mob:p-4"
    :class="props.sectionMaxWidth && 'mx-auto w-full'"
    :style="props.sectionMaxWidth ? { maxWidth: props.sectionMaxWidth } : undefined"
  >
    <div class="w-full h-full min-h-0 flex flex-col">
      <!-- 外層標題 -->
      <div :class="titleContainerClass">
        <div :class="cx(FLEX_ITEMS_CENTER, 'gap-3')">
          <BaseIconBtn
            v-if="showAside && isDown.phone && mobileContentVisible"
            icon="mdi:arrow-left"
            theme="secondary"
            size="md"
            @click="handleBack"
          />

          <div :class="cx(titleClass)">
            {{ resolvedHeaderTitle }}
          </div>
        </div>

        <p v-if="subtitle && isDown.phone && mobileContentVisible" :class="subTitleClass">
          {{ subtitle }}
        </p>
      </div>

      <div class="mt-4 flex gap-5 phone:flex-col flex-1 min-h-0 min-w-0">
        <aside
          v-if="shouldShowMenu"
          :class="
            cx('w-[182px] h-fit flex-shrink-0 rounded-lg', 'bg-[var(--sidebar-sidebar-bg)]', 'py-6', 'phone:w-full')
          "
        >
          <slot name="aside" />
        </aside>

        <!-- 內層內容 -->
        <div v-if="shouldShowContent" class="flex-1 min-h-0 min-w-0 relative md:flex md:flex-col">
          <div v-if="$slots.top" :class="topSlotContainerClass">
            <slot name="top" />
          </div>

          <!-- tabs slot：渲染在深色 card 外，讓 tab 列落在 page background 上而非 card 內 -->
          <div v-if="$slots.tabs" :class="cx(OVERFLOW_X_AUTO_HIDDEN, 'w-full shrink-0')">
            <slot name="tabs" />
          </div>

          <div
            :class="
              cx(
                FLEX_COL,
                'items-center gap-4 flex-1 min-h-0 min-w-0 w-full h-full',
                $slots.tabs ? 'rounded-tr-2xl rounded-br-2xl rounded-bl-2xl' : 'rounded-2xl',
                'bg-[var(--surface-surface-contrainer)]',
                'px-6 py-5 mob:p-3',
                $slots.tabs && '[box-shadow:0_-2px_8px_rgba(0,0,0,0.35)]'
              )
            "
          >
            <!-- 內層標題 -->
            <div v-if="shouldShowContentTitle" :class="titleContainerClass">
              <div :class="cx(FLEX_ITEMS_CENTER, 'justify-between gap-3 w-full')">
                <div :class="cx(titleClass)">
                  {{ resolvedContentTitle }}
                </div>

                <div v-if="$slots.contentTitleRight" class="shrink-0">
                  <slot name="contentTitleRight" />
                </div>
              </div>

              <p v-if="subtitle && (!isDown.phone || !showContentTitleOnMobile)" :class="subTitleClass">
                {{ subtitle }}
              </p>
            </div>

            <div :class="contentInnerClass">
              <div class="flex-1 min-h-0 min-w-0">
                <slot />
              </div>

              <div v-if="$slots.actions" class="w-full mt-auto pt-4 shrink-0">
                <slot name="actions" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
