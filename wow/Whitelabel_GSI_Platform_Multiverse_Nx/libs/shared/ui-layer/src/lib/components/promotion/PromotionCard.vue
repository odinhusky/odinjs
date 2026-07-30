<script setup lang="ts">
defineProps<{
  title: string
  imageSrc: string
  to?: string
  dateText?: string
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="group flex w-full flex-col rounded-lg bg-[var(--card-card-bg-primary-enabled)] p-4 text-left no-underline transition-transform hover:-translate-y-0.5 phone:p-4"
  >
    <BaseImage
      :src="imageSrc"
      :alt="title"
      :class-obj="{
        container: 'block aspect-[2.44/1] w-full overflow-hidden rounded-md bg-[var(--container-container-bg-secondary)]',
        image: 'h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]',
        placeholder: 'h-full min-h-0 bg-[var(--container-container-bg-secondary)]'
      }"
    />
    <div v-if="dateText" class="mt-3 text-xs leading-4 text-[var(--color-light-700)]">
      {{ dateText }}
    </div>
    <div class="mt-3 min-h-8 text-xl font-bold leading-7 text-[var(--text-text-primary)] phone:text-xl phone:leading-7">
      {{ title }}
    </div>
  </NuxtLink>

  <button
    v-else
    type="button"
    class="group flex w-full flex-col rounded-lg bg-[var(--card-card-bg-primary-enabled)] p-4 text-left transition-transform hover:-translate-y-0.5 phone:p-4"
    @click="emit('click')"
  >
    <BaseImage
      :src="imageSrc"
      :alt="title"
      :class-obj="{
        container: 'block aspect-[2.44/1] w-full overflow-hidden rounded-md bg-[var(--container-container-bg-secondary)]',
        image: 'h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]',
        placeholder: 'h-full min-h-0 bg-[var(--container-container-bg-secondary)]'
      }"
    />
    <div v-if="dateText" class="mt-3 text-xs leading-4 text-[var(--color-light-700)]">
      {{ dateText }}
    </div>
    <div class="mt-3 min-h-8 text-xl font-bold leading-7 text-[var(--text-text-primary)] phone:text-xl phone:leading-7">
      {{ title }}
    </div>
  </button>
</template>
