<template>
  <button :id="id" :type="type" :style="compuedStyles" :class="classname">
    <slot name="content"></slot>
  </button>
</template>

<script>
import { isEmptyObject } from '@/plugins/checker.js';

export default {
  name: 'VBtn',
  props: {
    type: {
      type: String,
      required: false,
    },
    classname: {
      type: Object,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
    styles: {
      type: Object,
      required: false,
      default: function () {
        return { width: 'inherit' };
      },
    },
  },
  data() {
    return {
      data: 1,
    };
  },
  computed: {
    /**
     * @author odin
     * @description 轉換style的物件成為行內樣式字串
     */
    compuedStyles() {
      if (isEmptyObject(this.styles)) {
        return Object.entries(this.styles)
          .map(([k, v]) => `${k}:${v}`)
          .join(';');
      } else {
        return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
