<template>
  <q-dialog v-model="dialogModel" persistent class="interest-dialog-wrapper">
    <div class="interest-dialog-shell">
      <q-card class="interest-description-dialog redeem-dialog">
        <q-card-section class="dialog-header">
          <span class="w-[33.6px]"></span>
          <span class="dialog-title">{{ $t("interest.return_title") }}</span>
          <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
        </q-card-section>
        <q-card-section class="dialog-content min-principal-content">
          <div class="min-principal-message">
            {{ isUnderOneDay ? $t("interest.return_rule_1") : $t("interest.return_rule_2") }}
          </div>
        </q-card-section>
        <q-card-actions class="redemptions-dialog-actions">
          <q-btn class="cancel-btn" flat :label="$t('common.btn.cancel')" v-close-popup />
          <q-btn class="confirm-btn" unelevated :label="$t('common.btn.confirm')" @click="emit('confirm')" />
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
const dialogModel = defineModel<boolean>({ required: true })

defineProps({
  isUnderOneDay: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  confirm: []
}>()
</script>

<style scoped lang="scss">
@import "./interest-dialog";
</style>
