<template>
  <q-dialog v-model="dialogModel" persistent class="interest-dialog-wrapper">
    <div class="interest-dialog-shell">
      <q-card class="interest-description-dialog min-principal-dialog">
        <q-card-section class="dialog-header">
          <span class="w-[33.6px]"></span>
          <span class="dialog-title">{{ $t("interest.tip") }}</span>
          <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
        </q-card-section>
        <q-card-section class="dialog-content min-principal-content">
          <div class="min-principal-message">
            {{ $t("interest.minPrincipalError", { principal }) }}
          </div>
        </q-card-section>
        <q-card-actions class="dialog-actions">
          <q-btn class="confirm-btn" :label="$t('common.btn.confirm')" v-close-popup />
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
const dialogModel = defineModel<boolean>({ required: true })

defineProps({
  principal: {
    type: String,
    required: true,
  },
})
</script>

<style scoped lang="scss">
@import "./interest-dialog";
</style>
