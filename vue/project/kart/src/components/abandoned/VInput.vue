<template>
  <input
    :id="id"
    :type="type"
    :class="classname"
    :required="requireOrnot"
    :value="value"
    :readonly="readonly"
    :style="compuedStyles"
    :placeholder="placeholder"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
import { isEmptyObject } from '@/plugins/checker.js';

export default {
  name: 'VInput',
  props: {
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    id: {
      type: String,
      required: false,
    },
    classname: {
      required: false,
    },
    requireOrnot: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      required: false,
    },
    readonly: {
      type: Boolean,
      required: false,
    },
    styles: {
      required: false,
      default: () => {
        return { width: 'auto' };
      },
    },
    placeholder: {
      type: String,
      required: false,
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
