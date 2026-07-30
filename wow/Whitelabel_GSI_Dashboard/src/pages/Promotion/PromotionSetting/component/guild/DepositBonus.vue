<template>
  <div class="promotion_guild">
    <p>
      <strong> {{ $t("promotion.deposit1") }}</strong>
    </p>
    <p>{{ $t("promotion.deposit2") }}</p>
    <ol>
      <li>{{ $t("promotion.deposit3") }}</li>
      <li>
        {{ $t("promotion.deposit4") }}
        <ol>
          <li>{{ $t("promotion.deposit5") }}</li>
          <li>
            {{ $t("promotion.deposit6") }}
          </li>
          <li>{{ $t("promotion.deposit7") }}</li>
        </ol>
      </li>
      <li>
        {{ $t("promotion.deposit8") }}
        <ol>
          <li>{{ $t("promotion.deposit9") }}</li>
          <li>
            {{ $t("promotion.deposit10") }}
          </li>
        </ol>
      </li>
    </ol>
    <p>{{ $t("promotion.deposit11") }}</p>
    <p></p>
    <ul>
      <li>{{ $t("promotion.deposit12") }}</li>
      <li>
        {{ $t("promotion.deposit13") }}
        <ul>
          <li>{{ $t("promotion.deposit14") }}</li>
          <li>{{ $t("promotion.deposit15") }}</li>
        </ul>
      </li>
      <li>{{ $t("promotion.deposit16") }}</li>
      <li>
        {{ $t("promotion.deposit17") }}
        <ul>
          <li>
            {{ $t("promotion.deposit18") }}
          </li>
          <li>{{ $t("promotion.deposit19") }}</li>
        </ul>
      </li>
      <li>{{ $t("promotion.deposit20") }}</li>
      <li>{{ $t("promotion.deposit21") }}</li>
      <li>
        {{ $t("promotion.deposit22") }}
      </li>
      <li>
        {{ $t("promotion.deposit23") }}
      </li>
      <li>{{ $t("promotion.deposit24") }}</li>
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
