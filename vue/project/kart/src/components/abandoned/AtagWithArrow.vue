<template>
  <div class="atag_center">
    <slot></slot>
  </div>
</template>

<script>
// import Img from "@/components/Img.vue";

export default {
  name: 'AtagWithArrow',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
