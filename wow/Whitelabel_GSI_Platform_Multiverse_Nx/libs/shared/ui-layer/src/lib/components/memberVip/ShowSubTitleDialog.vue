<script setup lang="ts">
interface Props {
  visible: boolean
  title?: string
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: "VIP",
  subtitle: ""
})

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  handleGlobalClick({
    target: "handleMemberVipSubtitleDialogCloseClick",
    debounceTimer: 120,
    callback: () => emit("close")
  })
}
</script>

<template>
  <BaseDialog
    :visible="props.visible"
    :class-obj="{
      root: '!max-w-[520px] phone:!w-screen',
      title: '!text-2xl phone:!text-xl',
      body: '!py-6 !px-6 phone:!px-4'
    }"
    @close="handleClose"
  >
    <template #header>
      {{ props.title }}
    </template>

    <div class="text-sm leading-6 text-[var(--text-text-primary)] whitespace-pre-wrap">
      {{ props.subtitle }}
    </div>

    <template #footer>
      <BaseBtn theme="secondary" size="xl" class="w-full" @click="handleClose">關閉</BaseBtn>
    </template>
  </BaseDialog>
</template>
