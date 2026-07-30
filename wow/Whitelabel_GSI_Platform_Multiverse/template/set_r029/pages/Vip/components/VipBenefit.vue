<template>
  <div class="benefit-row" :class="{ h5: isDown.iphone }">
    <div class="icon">
      <q-img loading="lazy" :src="props.imgSrc"></q-img>
    </div>
    <div class="info">
      <p class="title">
        {{ props.title }}
      </p>
      <p class="text">
        {{ Number(props.value) >= 0 ? moneyFormat(props.value) : 0 }}
        <span v-if="props.useCurrency" class="ml-1">
          {{ currency }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { moneyFormat } = useCommon()
const { isDown } = useMediaQuery()

const props = defineProps({
  imgSrc: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  currency: {
    type: String,
    required: false,
    default: ""
  },
  useCurrency: {
    type: Boolean,
    required: false,
    default: false
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r029/assets/css/_variable.scss";

.benefit-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;

  .icon {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 9999px;
    background: $r029-text-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    .q-img {
      width: 70%;
      height: 70%;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-left: 1rem;
    border-left: 1px solid #ffffff1a;

    .title {
      font-family: OpenSans;
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1rem;
      color: $r029-text-secondary;
    }

    .text {
      font-family: OpenSans;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.375rem;
      color: $r029-text-primary;
    }
  }

  &.h5 {
    gap: 0.75rem;
    padding: 0.5rem 0;

    .icon {
      width: 2.25rem;
      height: 2.25rem;
    }

    .info {
      gap: 0.125rem;
      padding-left: 0.75rem;

      .title {
        font-size: 0.6875rem;
        line-height: 0.875rem;
      }

      .text {
        font-size: 0.875rem;
        line-height: 1.125rem;
      }
    }
  }
}
</style>
