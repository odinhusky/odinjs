<script setup lang="ts">
import Dialog from "primevue/dialog"

interface Props {
  classObj?: {
    root?: string // 整個彈窗的根節點 (大小、圓角、陰影)
    mask?: string // 背景遮罩層 (模糊、透明度)
    content?: string // PrimeVue 內部的 content wrapper
    header?: string // 頂部 Header 容器 (背景色、間距)
    title?: string // 標題文字區塊 (字體大小、對齊)
    closeBtn?: string // 關閉按鈕 (定位、顏色)
    body?: string // 下方內容滾動區 (間距、背景色)
    footer?: string // 底部 Footer 容器
  }
}

const props = withDefaults(defineProps<Props>(), {
  classObj: () => ({})
})

const visible = defineModel<boolean>("visible", { default: false })
defineEmits(["close"])
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :showHeader="false"
    :pt="{
      root: {
        class: cx(
          'border-none bg-transparent shadow-2xl rounded-2xl iphone:rounded-none overflow-hidden',
          'w-full max-w-[550px] h-auto max-h-[90vh]',
          'phone:!w-screen phone:!max-w-none phone:!h-dvh phone:!max-h-none phone:!m-0 phone:!rounded-none',
          props.classObj?.root
        )
      },
      content: { class: cx('p-0 h-full flex flex-col', props.classObj?.content) },
      mask: { class: cx('backdrop-blur-sm bg-black/40', props.classObj?.mask) }
    }"
  >
    <div
      :class="
        cx('flex items-center justify-center relative p-4 bg-[var(--dialog-dialog-bg-header)]', props.classObj?.header)
      "
    >
      <div
        :class="
          cx(
            'flex-1 text-center font-bold text-xl leading-7 text-[var(--dialog-dialog-title-content)]',
            props.classObj?.title
          )
        "
      >
        <slot name="header" />
      </div>

      <BaseIcon
        name="mdi:close"
        size="20px"
        :class="
          cx(
            'block absolute top-5 right-5 text-[var(--dialog-dialog-title-header)] cursor-pointer transition-opacity hover:opacity-80',
            props.classObj?.closeBtn
          )
        "
        @click="$emit('close')"
      />
    </div>

    <div
      :class="
        cx(
          FLEX_COL,
          CONTAINER_PADDING,
          SCROLLBAR_HIDDEN,
          'flex-1 overflow-y-auto text-white bg-[var(--dialog-dialog-bg-content)]',
          props.classObj?.body
        )
      "
    >
      <slot />
    </div>

    <div :class="cx('mt-auto', CONTAINER_PADDING, 'bg-[var(--dialog-dialog-bg-header)]', props.classObj?.footer)">
      <slot name="footer" />
    </div>
  </Dialog>
</template>
