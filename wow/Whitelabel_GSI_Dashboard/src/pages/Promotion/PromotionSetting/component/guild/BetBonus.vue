<template>
  <div class="promotion_guild">
    <p>
      <strong>{{ $t("promotion.bet1") }}</strong>
    </p>
    <p></p>
    <ul>
      <li>
        {{ $t("promotion.bet2") }}
        <ul>
          <li>{{ $t("promotion.bet3") }}</li>
          <li>
            {{ $t("promotion.bet4") }}
            <ul>
              <li>{{ $t("promotion.bet5") }}</li>
              <li>{{ $t("promotion.bet6") }}</li>
            </ul>
          </li>
          <li>
            {{ $t("promotion.bet7") }}
          </li>
        </ul>
      </li>
      <li>
        {{ $t("promotion.bet8") }}
        <ul>
          <li>{{ $t("promotion.bet9") }}</li>
          <li>{{ $t("promotion.bet10") }}</li>
        </ul>
      </li>
      <li>{{ $t("promotion.bet11") }}</li>
      <li>
        {{ $t("promotion.bet12") }}
        <ul>
          <li>
            {{ $t("promotion.bet13") }}
          </li>
          <li>{{ $t("promotion.bet14") }}</li>
        </ul>
      </li>
      <li>
        {{ $t("promotion.bet15") }}
        <ul>
          <li>{{ $t("promotion.bet16") }}</li>
          <li>
            {{ $t("promotion.bet17") }}
          </li>
          <li>{{ $t("promotion.bet18") }}</li>
          <li>
            {{ $t("promotion.bet19") }}
          </li>
          <li>{{ $t("promotion.bet20") }}</li>
          <li>{{ $t("promotion.bet21") }}</li>
        </ul>
      </li>
      <li>
        {{ $t("promotion.bet22") }}
        <ul>
          <li>{{ $t("promotion.bet23") }}</li>
          <li>{{ $t("promotion.bet24") }}</li>
        </ul>
      </li>
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
