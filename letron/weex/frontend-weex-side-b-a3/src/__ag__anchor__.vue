<template>
  <div class="__ag__uplive__" :class="[ipx ? 'ipx' : '']">
    <ag-hbtitle :isback="true" title="主播"></ag-hbtitle>
    <loading class="__loading_main__" :class="[loadinging ? 'show' : 'hide']">
      <loading-indicator class="loading_text" ref="loading"></loading-indicator>
      <text class="__ag__refreshtext__">加载中...</text>
    </loading>
    <div class="__ag__uplivecontent__">
      <anchor-list :isindex="false" @refresh="refresh"></anchor-list>
    </div>
  </div>
</template>

<script>
import agMinix from "./components/__ag__minix__.js"
import HbTitle from "./components/__ag__headTop__.vue"
import anchorlist from "./components/__ag__anchorList__.vue"
const animation = weex.requireModule("animation")
export default {
  mixins: [agMinix],
  components: {
    "ag-hbtitle": HbTitle,
    "anchor-list": anchorlist,
  },
  data() {
    return {
      loadinging: true,
    }
  },
  computed: {},
  mounted() {
    let rotate = this.$refs.loading

    animation.transition(rotate, {
      styles: {
        transform: "rotate(0deg)",
      },
      duration: 5000, //ms
      timingFunction: "linear",
    })
  },
  methods: {
    refresh() {
      this.loadinging = false
    },
  },
}
</script>

<style lang="less" scoped>
@import "./style/theme.less";
.__ag__uplive__ {
  width: 750px;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 128px;
  bottom: 0px;
  background-color: @gray5;
}
.ipx {
  top: 166px;
}
.__ag__uplivecontent__ {
  flex: 1;
  padding: 16px;
  flex-direction: column;
  align-items: center;
  padding-bottom: 170px;
  padding-top: 48px;
}
.__loading_main__ {
  width: 750px;
  height: 100px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 200px;
}
.show {
  left: 0;
}
.hide {
  left: 750px;
}
.loading_text {
  color: @black;
  transform: rotate(3600deg);
  margin-right: 25px;
}
</style>
