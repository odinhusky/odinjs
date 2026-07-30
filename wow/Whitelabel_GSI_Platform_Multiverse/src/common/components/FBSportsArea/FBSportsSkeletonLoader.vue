<template>
  <div class="fb-sports-skeleton">
    <q-skeleton type="rect" class="fb-sports-skeleton__header" />
    <div class="fb-sports-skeleton__grid">
      <q-skeleton v-for="index in 6" :key="index" type="rect" class="fb-sports-skeleton__card" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.fb-sports-skeleton {
  @apply flex h-full w-full flex-col gap-3 p-3;

  &__header {
    @apply h-12 w-full rounded;
  }

  &__grid {
    @apply grid flex-1 grid-cols-2 gap-3;
  }

  &__card {
    @apply min-h-24 rounded;
  }
}
</style>
