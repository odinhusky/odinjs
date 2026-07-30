<template>
  <div class="web-information-layout">
    <WebInformation />
  </div>
</template>

<script lang="ts" setup>
import WebInformation from "src/common/components/WebInformation/Index.vue"
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r027/assets/css/_variable.scss";

.web-information-layout {
  max-width: 75rem;
  margin: 0 auto;
  padding-bottom: 3.25rem;
  width: 100%;

  @include phone-width {
    padding-bottom: 1.25rem;
  }

  :deep(.web-information-content) {
    .type-content {
      background: $secondary06;

      .menu-item {
        color: $neutral01;
        &.active {
          background: $gradient01;
        }
      }
    }

    .info-box {
      background-color: var(--neutral-02);

      .info-title {
        color: $neutral01;
        border-bottom: 1px solid $neutral04;

        &::before {
          background-color: $primany01;
        }
      }

      .info-detail {
        color: $neutral01;
      }
    }
  }
}
</style>
