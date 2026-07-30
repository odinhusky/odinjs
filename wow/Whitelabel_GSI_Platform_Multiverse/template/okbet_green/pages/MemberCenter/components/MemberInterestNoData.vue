<template>
  <div class="member-interest-no-data">
    <img :src="noDataImg" alt="no-data" />
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import noDataImg from "app/template/okbet_green/assets/images/interest/no-data.png"

defineProps({
  text: {
    type: String,
    required: true
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";

.member-interest-no-data {
  width: 100%;
  min-height: inherit;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;

  @include pad-width {
    padding: 2rem 1rem;
  }

  img {
    width: 100%;
    max-width: 17.3125rem;
    height: auto;
    margin-bottom: 0.5rem;

    @include pad-width {
      max-width: 12.5rem;
    }
  }

  span {
    color: $text-gray;
    font-size: 0.875rem;
    font-weight: 600;

    @include pad-width {
      font-size: 0.75rem;
    }
  }
}
</style>
