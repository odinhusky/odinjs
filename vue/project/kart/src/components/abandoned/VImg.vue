<template>
  <img
    :id="id"
    :src="src"
    :srcset="srcset"
    :alt="alt"
    :class="classname"
    :width="width"
    :height="height"
    :style="styles"
  />
</template>

<script>
import { isEmptyObject } from '@/plugins/checker.js';

export default {
  name: 'VImg',
  props: {
    src: {
      type: String,
      required: true,
    },
    srcset: {
      type: String,
      required: false,
      default: '',
    },
    alt: {
      type: String,
      required: false,
      default: '',
    },
    classname: {
      // type: Object,
      required: false,
    },
    id: {
      type: String,
      required: false,
      default: '',
    },
    width: {
      type: String,
      required: false,
      default: '',
    },
    height: {
      type: String,
      required: false,
      default: '',
    },
    styles: {
      // type: Object,
      required: false,
    },
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
