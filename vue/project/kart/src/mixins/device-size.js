const deviceSizeMixinObj = {
  data() {
    return {
      window: {
        fullWidth: 0,
        fullHeight: 0,
      },
    };
  },
  mounted() {
    this.window.fullWidth = window.innerWidth;
    this.window.fullHeight = window.innerHeight;
    // 取得裝置寬高
    window.onresize = () => {
      this.window.fullWidth = window.innerWidth;
      this.window.fullHeight = window.innerHeight;
    };
  },
};

export default deviceSizeMixinObj;
