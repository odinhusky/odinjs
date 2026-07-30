<script setup lang="ts">
const { languageList, currentLang, currentLocale, changeLanguage } = useLanguage()

const selectedCode = computed({
  get: () => String(currentLocale.value || ""),
  set: async (value: string) => {
    await changeLanguage(value)
  }
})

const languageOptions = computed(() =>
  languageList.value.map((item) => ({ label: item.name, value: item.code, icon: item.icon }))
)

const currentFlagSrc = computed(() => {
  if (!currentLang.value?.icon) return ""
  return `/images/flagSquare/${currentLang.value.icon}.png`
})
</script>

<template>
  <div :class="cx('w-auto max-w-[150px]', 'shrink-0 flex-none')">
    <BaseSelect
      v-model="selectedCode"
      :options="languageOptions"
      option-label="label"
      option-value="value"
      :class-obj="{
        selectLabel: 'p-0',
        dropdown: 'p-0 w-5 h-5 phone:hidden',
        select:
          '!h-10 phone:!h-auto !rounded-full !p-3 phone:!p-0 phone:w-auto !bg-transparent !border-[var(--border-border-primary)] ',
        panel:
          '!rounded-2xl !border-none !py-3 !bg-[linear-gradient(90deg,var(--sidebar-sidebar-sub-bg-left)_0%,var(--sidebar-sidebar-sub-bg-right)_100%)]',
        item: '!bg-transparent !text-white',
        optionSelected: '!bg-transparent !bg-none',
        optionHover: '!bg-transparent !bg-none'
      }"
    >
      <template #value="slotProps">
        <div class="w-full flex items-center gap-2">
          <div class="h-6 w-6 rounded-full text-[10px] flex items-center justify-center overflow-hidden">
            <BaseImage
              v-if="currentFlagSrc"
              :src="currentFlagSrc"
              :class-obj="{ container: 'w-full h-full', image: 'w-full h-full object-cover' }"
            />
            <span v-else>{{ String(selectedCode).slice(0, 2).toUpperCase() }}</span>
          </div>
          <span
            class="flex-1 min-w-0 !text-sm leading-5 !text-[var(--sidebar-sidebar-item-title-enabled)] truncate phone:hidden"
            >{{ currentLang?.name || slotProps.placeholder }}</span
          >
        </div>
      </template>

      <template #option="slotProps">
        <LanguageOption
          :code="slotProps.option.value"
          :name="slotProps.option.label"
          :icon="slotProps.option.icon"
          :model-value="selectedCode"
          @update:model-value="selectedCode = $event"
        />
      </template>
    </BaseSelect>
  </div>
</template>
