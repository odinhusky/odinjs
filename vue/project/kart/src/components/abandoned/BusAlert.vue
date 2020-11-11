<template>
  <div v-if="openOrNot" class="alert_body">
    <div class="alert_mask"></div>
    <div class="alert_box">
      <slot name="icon"></slot>

      <div v-if="title !== ''" class="text_part">
        <h2 class="alert_title">{{ title }}</h2>
        <p v-if="subtitle !== ''" class="alert_subtitle">{{ subtitle }}</p>
      </div>

      <slot name="content"></slot>

      <button
        v-if="isShowCancel"
        class="close_position close_btn"
        @click.prevent="closeAlert"
      ></button>
    </div>
  </div>
</template>

<script>
// import VImg from "@/components/VImg.vue";

export default {
  name: 'BusAlert',
  components: {
    // VImg
  },
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
    isShowCancel: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      openOrNot: false,
    };
  },
  created() {
    /**
     * @author odin
     * @description 打開Alert元件
     * @description 自定義名稱: open
     * @description 使用時: this.$emit('自定義名稱')
     */
    this.$bus.$on('alert:open', () => {
      this.openAlert();
    });

    /**
     * @author odin
     * @description 打開Alert元件
     * @description 自定義名稱: close
     * @description 使用時: this.$emit('自定義名稱')
     */
    this.$bus.$on('alert:close', () => {
      this.closeAlert();
    });
  },
  beforeDestroy() {
    console.log(this);
    // 註銷
    // this.$bus.$off('open')
    // this.$bus.$off('close')
  },
  methods: {
    openAlert() {
      this.openOrNot = true;
    },
    closeAlert() {
      this.openOrNot = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
