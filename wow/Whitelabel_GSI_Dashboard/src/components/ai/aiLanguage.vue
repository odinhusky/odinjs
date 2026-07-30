<template>
  <div class="flex items-center">
    <div class="q-pt-none mr-4">{{ $t("edit_form.ai_translation_apply_other_languages") }}</div>

    <div class="q-pt-none">
      <q-btn class="apply-btn" unelevated color="primary" size="16px" @click="emit('applyLanguage')">
        {{ $t("btn.apply") }}
      </q-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
  const emit = defineEmits(["applyLanguage"])
</script>
<style lang="scss" scoped>
  .apply-btn {
    min-height: 32px;
    height: 32px;
    font-size: 12px !important;
  }
</style>
