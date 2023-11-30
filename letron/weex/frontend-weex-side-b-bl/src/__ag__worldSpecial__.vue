<template>
  <div class="__ag__world_main__">
    <web
      ref="webview"
      class="__share_popup_content__"
      :src="url"
      @pagestart="onPageStart"
      @pagefinish="onPageFinish"
      @error="onError"
    ></web>
    <div class="zt-back" @click="goBack" :class="[ipx ? 'back-ipx' : '']">
      <text class="agiconfont __ag__back__">&#xe61d;</text>
    </div>
  </div>
</template>

<script>
import sport from "./components/__ag__sport__.js"
import env from "./components/env.js"
import __ag__sport_api__ from "./components/__ag__sport_api__.js"
import util from "./components/util.js"
import agMinUrl from "./components/__ag__minurl__.js"
import agMinix from "./components/__ag__minix__.js"
import ipx from "./components/__ag__ipx__.vue"
export default {
  mixins: [agMinix, agMinUrl], // 使用mixin
  components: {
    "ag-ipx": ipx,
  },
  data() {
    return {
      env,
      url: "",
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onPageStart() {},
    onPageFinish() {},
    onError() {},
    goBack() {
      util.pop()
    },
    async __ag__loadData__() {
      let map = util.getItem("metaDataMap")
      if (!map) {
        await sport.getListMetaData()
      }
      let domain = map["domain"]
      this.url = `https://m.${domain}/pages/zhuanti?back=0`
    },
  },
}
</script>

<style lang="less">
@import "./style/theme.less";
.__ag__world_main__ {
  width: 750;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: #9b193c;
  align-items: center;
}
.__share_popup_content__ {
  width: 750;
  position: fixed;
  top: 0px;
  bottom: 0px;
}
.zt-back {
  width: 80px;
  height: 80px;
  position: fixed;
  top: 40px;
  left: 0;
  align-items: center;
  justify-content: center;
}
.back-ipx {
  top: 88px;
}
.__ag__back__ {
  font-size: 25wx;
  color: #fff;
}
</style>
