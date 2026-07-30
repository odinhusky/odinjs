<template>
  <AgeWarningDialog id="age-warning-dialog" />
</template>

<script lang="ts" setup>
import AgeWarningDialog from "src/common/components/AgeWarningDialog/Index.vue"
</script>

<style lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r027/assets/css/_variable.scss";

// q-dialog content is teleported, so these overrides must be global.
.age-warning-wrapper {
  background: var(--dialog-bg) !important;
}

.age-warning-wrapper .warning-content-wrapper .q-card {
  background: var(--dialog-bg) !important;
}

.bg-age-verification-enter-color {
  background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important;
  color: var(--btn-text-01) !important;
}

.bg-age-verification-exit-color {
  background: var(--btn-bg-05) !important;
  border: 1px solid var(--btn-border-01) !important;
  color: var(--btn-text-01) !important;
}
</style>
