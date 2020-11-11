<template>
  <div v-if="openOrNot" class="root lightbox_root app_notifier">
    <div class="lightbox_mask"></div>

    <div class="lightbox_container notifier">
      <span>{{ message }}</span>

      <button
        class="close_position close_btn"
        @click.prevent="closeAlert"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppBusNotifier',
  data() {
    return {
      openOrNot: false,
      message: 'AppBusNotifier',
    };
  },
  created() {
    // 在 created 的時候在 Vue 底下註冊監聽 notify:message 這個事件
    this.$bus.$on('notify:message', msg => {
      // 並將接收到的 message 傳給自己的 data, 並且打開燈箱
      this.message = msg;
      this.openOrNot = true;
    });
  },
  beforeDestroy: function () {
    // 元件銷毀前要註銷監聽事件
    this.$bus.$off('notify:message');
  },
  methods: {
    /**
     * @author odin
     * @description
     */
    closeAlert() {
      this.openOrNot = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
