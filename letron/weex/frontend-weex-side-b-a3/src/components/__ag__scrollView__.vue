<template>
  <scroller>
    <refresh>
      <text>Refreshing...</text>
    </refresh>

    <slot></slot>
  </scroller>
</template>

<script>
/* 
	 scroll-y: Boolean 默认值 false 允许横向滚动
	 scroll-x: Boolean 默认值 false 允许纵向滚动
	 animation: Boolean 默认值 false 动画效果
	 upper-threshold: Number 默认值 50 距顶部/左边多远时（单位px），触发 scrolltoupper 事件	
	 lower-threshold: Number 默认值 50 距底部/右边多远时（单位px），触发 scrolltolower 事件	
	 show-scrollbar： Boolean 默认值 false 控制是否出现滚动条
	 refresher-enabled： Boolean 默认值 false 开启自定义下拉刷新
	 refresher-triggered： Boolean 默认值 false 设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
	 refresher-background： string 默认值 "#FFF" 设置自定义下拉刷新区域背景颜色
	 isFreshing： Boolean 默认值 false 是否下拉刷新
	 isLowering： Boolean 默认值 false 是否上拉刷新
	 */
export default {
  props: {
    scrollY: {
      type: Boolean,
      default: false,
    },
    scrollX: {
      type: Boolean,
      default: false,
    },
    current: {
      type: String,
      default: "",
    },
    scrollTop: {
      type: Number,
      default: 0,
    },
    animation: {
      type: Boolean,
      default: false,
    },
    upperThreshold: {
      type: Number,
      default: 50,
    },
    lowerThreshold: {
      type: Number,
      default: 50,
    },
    background: {
      type: String,
      default: "",
    },
    refresherThreshold: {
      type: Number,
      default: 0,
    },
    freshText: {
      type: String,
      default: "",
    },
    lowerText: {
      type: String,
      default: "",
    },
    isFreshing: {
      type: Boolean,
      default: false,
    },
    freshing: {
      type: Boolean,
      default: false,
    },
    isLowering: {
      type: Boolean,
      default: false,
    },
    lowerLoading: {
      type: Boolean,
      default: false,
    },
    triggered: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    downRotate() {
      return "rotate(" + 360 + "deg)"
    },
  },
  methods: {
    // 自定义下拉刷新控件被下拉
    __ag__refresherpulling__() {
      this.$emit("onPulling")
    },
    // 自定义下拉刷新被触发
    __ag__onRefresh__() {
      this.$emit("onRefresh")
    },
    // 自定义下拉刷新被复位
    __ag__onRestore__() {
      this.$emit("onRestore")
    },
    // 自定义下拉刷新被中止
    __ag__onAbort__() {
      this.$emit("onAbort")
    },
    // 上拉
    __ag__scrolltolower__() {
      this.$emit("scrolltolower")
    },
    // 滚动触发
    __ag__onscroll__(e) {
      this.$emit("onscroll", e)
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__mescroll-downwarp__ {
  position: absolute;
  top: -20px;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
}
.__ag__downwarp-content__ {
  display: flex;
  justify-content: center;
}
.__ag__downwarp-tip__ {
  color: @gray4;
}
.__ag__downwarp-progress__ {
  display: inline-block;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 1px solid @gray4;
  border-bottom-color: transparent !important;
  vertical-align: middle;
  margin-right: 10px;
}
.__ag__mescroll-rotate__ {
  animation: mescrollDownRotate 0.6s linear infinite;
}
@keyframes mescrollDownRotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
.__ag__schedule-list-loading__ {
  color: @gray4;
  font-size: 12px;
  text-align: center;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
