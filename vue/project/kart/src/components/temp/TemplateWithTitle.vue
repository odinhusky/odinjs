<template>
  <div class="root _root">
    <main class="main-10">
      <h2 class="page_title _title">{{ $t('') }}</h2>
    </main>
  </div>
</template>

<script>
// import Img from "@/components/Img.vue";

export default {
  name: 'TemplateWithTitle',
  components: {},
  props: {
    aaa: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
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
