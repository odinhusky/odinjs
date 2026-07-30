<script setup lang="ts">
import { useI18n } from "#imports"

interface Props {
  visible: boolean
  cardName?: string
  deleting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cardName: "",
  deleting: false
})
const { t } = useI18n()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const handleClose = () => {
  if (props.deleting) return
  emit("close")
}

const handleConfirm = () => {
  if (props.deleting) return
  emit("confirm")
}

const displayCardName = computed((): string => props.cardName || t("table_header.bank_card"))
</script>

<template>
  <BaseDialog :visible="props.visible" :class-obj="{}" @close="handleClose">
    <template #header>{{ t("common.btn.delete") }}</template>

    <div class="text-base leading-6 font-normal text-[var(--dialog-dialog-title-content)]">
      是否{{ t("common.btn.delete") }}{{ displayCardName }}？
    </div>

    <template #footer>
      <div class="w-full grid grid-cols-2 gap-4 phone:grid-cols-1">
        <BaseBtn theme="primary" category="outline" size="xl" :disabled="props.deleting" @click="handleClose">
          {{ t("common.btn.cancel") }}
        </BaseBtn>

        <BaseBtn size="xl" :loading="props.deleting" :disabled="props.deleting" @click="handleConfirm">
          {{ t("common.btn.confirm") }}
        </BaseBtn>
      </div>
    </template>
  </BaseDialog>
</template>
