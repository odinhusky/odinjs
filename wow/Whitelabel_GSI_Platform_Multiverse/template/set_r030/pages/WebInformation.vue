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

.web-information-layout {
  max-width: 75rem;
  margin: 0 auto;
  padding-bottom: 3.25rem;
  width: 100%;

  @include phone-width {
    padding-bottom: 1.25rem;
  }
}

:deep(.web-information-content) {
  .type-content {
    color: #fff;
    background: #161F2B;
    margin-top: 1.25rem;
    margin-bottom: 1rem;
  }
  .type-content .menu-item.active {
    background: transparent;
  }

  .type-content .menu-item:hover {
    background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%);
  }

  .type-content .menu-item {
    padding: 0.5rem 1.25rem;
  }
  .info-box {
    background-color: #ffffff1a;
    .info-title::before {
      content: "";
      display: inline-block;
      width: 0.25rem;
      height: 1.375rem;
      background-color: #1fab3d;
      margin-right: 0.75rem;
    }

    .info-detail {
      color: #fff;
    }

    .info-title {
      color: #fff;
    }
  }
}
</style>
