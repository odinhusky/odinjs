<template>
  <div class="promotion_guild">
    <p>
      <strong>{{ $t("promotion.custom1") }}</strong>
    </p>
    <p></p>
    <p>
      {{ $t("promotion.custom2") }}
    </p>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from "vue-i18n"

  const { t } = useI18n()
</script>

<style lang="scss" scoped>
  .edit-input {
    border: 0.0625rem solid #c2c2ca;
    border-radius: 0.25rem;
    padding: 0.0313rem 0.625rem;
  }
  .promotion_guild {
    li {
      margin-bottom: 0.625rem;
    }
  }
</style>
