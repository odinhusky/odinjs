<template>
  <div id="app">
    <!-- <router-view name="nav" /> -->
    <router-view v-if="isRouterAlive" />
    <!-- 文字燈箱 -->
    <AppBusNotifier />
    <!-- Loading -->
    <AppBusLoading />
  </div>
</template>

<script>
// Resource
import AppBusNotifier from '@/components/AppBusNotifier';
import AppBusLoading from '@/components/AppBusLoading';

export default {
  name: 'App',
  components: {
    AppBusNotifier,
    AppBusLoading,
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  created() {
    // 把store的內容拿出來並更新store
    if (window.localStorage.getItem('state')) {
      // console.log('updateState!!');
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(window.localStorage.getItem('state')),
        ),
      );
    }

    // localStorage 儲存 store
    window.addEventListener('beforeunload', () => {
      window.localStorage.setItem('state', JSON.stringify(this.$store.state));
    });
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      // data改變時重新render時會掉用的function
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/scss/all';
</style>
