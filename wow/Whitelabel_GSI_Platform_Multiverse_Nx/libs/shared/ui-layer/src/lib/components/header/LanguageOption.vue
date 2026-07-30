<script setup lang="ts">
interface Props {
  code: string
  name: string
  icon?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: "",
  modelValue: ""
})

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const iconSrc = computed(() => (props.icon ? `/images/flagSquare/${props.icon}.png` : ""))

const handleLanguageOptionClick = () => {
  handleGlobalClick({
    target: `handleLanguageOption${props.code.replace(/[^a-zA-Z0-9]/g, "") || "Select"}Click`,
    debounceTimer: 150,
    callback: () => {
      emit("update:modelValue", props.code)
    }
  })
}

const handleLanguageOptionRadioClick = () => {
  handleGlobalClick({
    target: `handleLanguageOption${props.code.replace(/[^a-zA-Z0-9]/g, "") || "Radio"}RadioClick`,
    debounceTimer: 150,
    callback: () => {
      emit("update:modelValue", props.code)
    }
  })
}
</script>

<template>
  <BasePlainBtn
    :class-obj="{
      button: 'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-white/90 transition-colors'
    }"
    @click="handleLanguageOptionClick"
  >
    <div class="h-5 w-5 rounded-full overflow-hidden flex items-center justify-center text-xs shrink-0">
      <BaseImage
        v-if="iconSrc"
        :src="iconSrc"
        :class-obj="{ container: 'w-full h-full', image: 'w-full h-full object-cover' }"
      />
      <span v-else>{{ code.slice(0, 2).toUpperCase() }}</span>
    </div>

    <span class="text-sm leading-5 text-left flex-1 truncate">{{ name }}</span>

    <BaseRadio
      :model-value="modelValue"
      :value="props.code"
      :input-id="`lang-${props.code}`"
      @update:model-value="handleLanguageOptionRadioClick"
    />
  </BasePlainBtn>
</template>
