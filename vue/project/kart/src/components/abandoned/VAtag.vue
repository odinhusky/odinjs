<template>
  <a
    :id="id"
    :href="href"
    :class="classname"
    :target="target"
    :rel="rel"
    :style="compuedStyles"
  >
    <slot name="content"></slot>
  </a>
</template>

<script>
import { isEmptyObject } from '@/plugins/checker.js';

export default {
  name: 'VAtag',
  props: {
    bodyClass: {
      type: String,
      required: false,
    },
    href: {
      type: String,
      required: false,
    },
    classname: {
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
    target: {
      type: String,
      required: false,
    },
    rel: {
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
