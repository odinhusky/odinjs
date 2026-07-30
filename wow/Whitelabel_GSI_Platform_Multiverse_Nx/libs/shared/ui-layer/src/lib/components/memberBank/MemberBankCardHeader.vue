<script setup lang="ts">
import { useI18n } from "#imports"
import { MEMBER_BANK_CARD_MODE_OBJ } from "@shared-lib/constants/propsCategoryObj"
import type { MemberBankCardMode } from "./cardProps"

interface Props {
  title?: string
  cardId: number
  mode?: MemberBankCardMode
  selectableValue?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  mode: MEMBER_BANK_CARD_MODE_OBJ.ACTION,
  selectableValue: null
})
const { t } = useI18n()

const emit = defineEmits<{
  edit: [id: number]
  delete: [id: number]
  select: [id: number]
}>()

const handleEdit = () => {
  emit("edit", props.cardId)
}

const handleDelete = () => {
  emit("delete", props.cardId)
}

const handleSelect = () => {
  emit("select", props.cardId)
}

const shouldShowActions = computed(
  () => props.mode === MEMBER_BANK_CARD_MODE_OBJ.ACTION || props.mode === MEMBER_BANK_CARD_MODE_OBJ.SELECT_ACTION
)

const shouldShowRadio = computed(() => props.mode === MEMBER_BANK_CARD_MODE_OBJ.SELECT)
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <div class="flex items-center gap-2">
      <BaseIcon
        name="mdi:credit-card-outline"
        size="20px"
        gradient-class="bg-[linear-gradient(180deg,var(--color-yellow-50)_0%,var(--color-yellow-500)_100%)]"
      />

      <span class="text-sm font-bold leading-5 text-[var(--card-card-title-primary-enabled)]">
        {{ props.title || t("deposit_account_name") }}
      </span>
    </div>

    <div v-if="shouldShowActions" class="flex items-center gap-2">
      <BaseIconBtn icon="mdi:edit" theme="normal" size="md" @click.stop="handleEdit" />

      <BaseIconBtn
        icon="iconamoon:trash-fill"
        theme="normal"
        size="md"
        :class-obj="{ icon: 'text-[var(--button-button-title-icon-secondary-enabled)]' }"
        @click.stop="handleDelete"
      />
    </div>

    <BaseRadio
      v-else-if="shouldShowRadio"
      :model-value="props.selectableValue"
      :value="props.cardId"
      @update:model-value="handleSelect"
    />
  </div>
</template>
