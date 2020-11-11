<template>
  <div v-if="openOrNot" class="root loading_root app_loading">
    <img src="../assets/img/v2/loading.gif" class="loading_img" />
  </div>
</template>

<script>
export default {
  name: 'AppBusLoading',
  data() {
    return {
      openOrNot: false,
      message: 'AppBusLoading',
    };
  },
  created() {
    // 在 created 的時候在 Vue 底下註冊監聽 alert:message 這個事件
    this.$bus.$on('loading:on', () => {
      // 並將接收到的 message 傳給自己的 data, 並且打開燈箱
      this.openOrNot = true;
    });

    this.$bus.$on('loading:off', () => {
      // 並將接收到的 message 傳給自己的 data, 並且打開燈箱
      this.openOrNot = false;
    });
  },
  beforeDestroy: function () {
    // 元件銷毀前要註銷監聽事件
    this.$bus.$off('loading:on');
    this.$bus.$off('loading:off');
  },
};

// 開啟: this.$bus.$emit('loading:on');
// 關閉: this.$bus.$emit('loading:off');
</script>

<style lang="scss" scoped></style>
