<template>
  <q-dialog v-model="model" v-bind="attrs" transition-show="fade" transition-hide="fade" class="base-dialog-wrapper">
    <q-card class="base-dialog-content" :style="{ 'max-width': maxWidth }">
      <q-card-section class="base-dialog-header">
        <span class="space"></span>
        <slot v-if="slots['title']" name="title"></slot>
        <h3 v-else class="base-dialog-title">{{ props.title }}</h3>
        <!-- <q-btn class="base-close-btn hide-hover" flat round dense v-close-popup @click="$emit('closeDialog')" /> -->
        <q-btn class="base-close-btn" flat round dense v-close-popup @click="$emit('closeDialog')">
          <q-icon name="close"></q-icon>
        </q-btn>
      </q-card-section>
      <q-card-section class="base-dialog-body">
        <slot></slot>
      </q-card-section>
      <slot v-if="slots['footer']" name="footer"></slot>
      <q-card-section v-if="useFooter" class="base-dialog-footer">
        <q-btn class="btn-footer hide-hover" @click="$emit('footerBtnClick')">{{ footerBtnTitle }}</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_r030/hooks/useSiteImg"
import { defineEmits, defineModel, defineProps, useAttrs, useSlots } from "vue"

const model = defineModel<boolean | undefined>()
const attrs = useAttrs()
const slots = useSlots()
const emits = defineEmits(["closeDialog", "footerBtnClick"])
const { svgIcon } = useSiteImg()

const props = defineProps({
  title: {
    type: [String],
    required: false,
    default: () => ""
  },
  maxWidth: {
    type: [String],
    required: false,
    default: () => ""
  },
  useFooter: {
    type: [Boolean],
    required: false,
    default: () => false
  },
  footerBtnTitle: {
    type: [String],
    required: false,
    default: () => ""
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r030/assets/css/_variable.scss";

.base-dialog-content {
  max-width: 37.5rem !important;
  width: 100%;
  max-height: 25rem;
  padding: 0;
  border-radius: 0.5rem;
  background: #111827;
  overflow: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  .base-dialog-header {

    .space {
      width: 1.25rem;
    }
    @apply flex items-center justify-between;
    padding: 1rem 1.25rem;
    background: #0B0F19;
    color: $neutral01;

    .base-dialog-title {
      font-family: NotoSans;
      font-weight: 700;
      font-size: 1.125rem;
      line-height: 1.5rem;
    }

    .base-close-btn {
      min-width: auto;
      min-height: auto;
      color: $neutral01;

      .q-img {
        width: 1.125rem;
        height: 1.125rem;
      }
    }
  }

  .base-dialog-body {
    @apply overflow-y-auto;
    padding: 1.25rem;
    margin: 0 0.75rem 0.75rem;
    background: transparent;
    border-radius: 0.5rem;
    color: $neutral02;
    font-family: OpenSans;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.5;

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .base-dialog-footer {
    @apply flex;
    padding: 0 0.75rem 0.75rem;

    .btn-footer {
      @apply w-full;
      padding: 0.625rem;
      border-radius: 0.625rem;
      background: linear-gradient(90deg, #22c55e 0%, #1fab3d 100%);
      color: $neutral01;
    }
  }
}
</style>

<style lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r030/assets/css/_variable.scss";

.base-dialog-wrapper {
  .q-dialog__backdrop {
    background: #00000066 !important;
  }
  .q-dialog__inner {
    @include phone-width {
      padding: 6.25rem 0.875rem 0;
      &.flex-center {
        align-items: start;
      }
    }
  }
}
</style>
