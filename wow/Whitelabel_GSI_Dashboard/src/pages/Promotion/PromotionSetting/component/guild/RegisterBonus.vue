<template>
  <div class="promotion_guild">
    <p>
      <strong>{{ $t("promotion.reg1") }}</strong>
    </p>
    <p></p>
    <ul>
      <li>
        {{ $t("promotion.reg2") }}
        <ul>
          <li>
            {{ $t("promotion.reg3") }}
          </li>
          <li>{{ $t("promotion.reg4") }}</li>
        </ul>
      </li>
      <li>{{ $t("promotion.reg5") }}</li>
      <ul>
        <li>{{ $t("promotion.reg6") }}</li>
        <li>{{ $t("promotion.reg7") }}</li>
      </ul>

      <li>{{ $t("promotion.reg8") }}</li>
      <li>{{ $t("promotion.reg9") }}</li>
      <ul>
        <li>{{ $t("promotion.reg10") }}</li>
        <li>{{ $t("promotion.reg11") }}</li>
      </ul>
    </ul>
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
