<template>
  <div class="root_"></div>
</template>

<script>
// Resources
import commonMixinObj from '@/mixins/common.js';

// Component
// import Img from "@/components/Img.vue";

export default {
  name: 'Template',
  components: {},
  props: {
    aaa: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  mixins: [commonMixinObj],
  data() {
    return {
      data: 1,
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
