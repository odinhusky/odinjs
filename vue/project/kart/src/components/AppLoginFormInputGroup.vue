<template>
  <div
    class="input_gp"
    :class="{ focused: focusOrNot, error: errorOrNot, ...classname }"
  >
    <div class="icon_body icon_left">
      <img :src="iconPath" class="icon_img" />
    </div>

    <div class="form_unit">
      <slot name="input"></slot>
    </div>

    <div class="icon_body icon_error">
      <img :src="errorPath" class="icon_error_VImg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLoginFormInputGroup',
  props: {
    iconPath: {
      type: String,
      required: true,
    },
    errorPath: {
      type: String,
      required: true,
    },
    focusOrNot: {
      type: Boolean,
      required: true,
    },
    errorOrNot: {
      type: Boolean,
      required: true,
    },
    classname: {
      type: Object,
      required: false,
    },
  },
};
</script>
