<template>
  <div class="__ag__webdiv__">
    <ag-hbtitle :isback="true" :title="title"></ag-hbtitle>
    <div class="__ag__web_content__" :class="[ipx ? 'web-ipx' : '']">
      <web
        class="__ag__web__"
        ref="myWeb"
        @pagestart="onPageStart"
        @pagefinish="onPageFinish"
        @error="onError"
        :src="url"
        v-if="url"
      ></web>
    </div>
  </div>
</template>

<script>
import agMinix from "./components/__ag__minix__.js"
import agMinUrl from "./components/__ag__minurl__.js"

import agUtil from "./components/util.js"
import HbTitle from "./components/__ag__headTop__.vue"
export default {
  mixins: [agMinix, agMinUrl],
  components: {
    "ag-hbtitle": HbTitle,
  },
  data() {
    return {
      url: "",
      title: "",
    }
  },
  mounted() {
    let data = agUtil.getUrlParam(weex.config.bundleUrl)

    if (data.title == "Privacy") {
      this.title = "隐私政策"
      this.url = this.staticPath("privacy.html")
    } else if (data.title == "Service") {
      this.title = "用户协议"
      this.url = this.staticPath("eula.html")
    }
  },
  methods: {
    onPageStart: function (e) {
      // util.message("onPageStart"+e)
      // console.log(e)
      // page start load
    },
    onPageFinish: function (e) {
      // util.message("onPageFinish"+e)
      // console.log("@@ onPageFinish e=>", JSON.stringify(e))
      // page finish load
      // this.scrollToTop()
    },
    onError: function (e) {
      // util.message("onPageFinish"+e)
      // console.log(e)
      // page load error
    },
  },
}
</script>

<style lang="less" scoped>
@import "./style/default.less";
.__ag__webdiv__ {
  width: 750px;
  background-color: @white;
}
.__ag__web_content__ {
  position: fixed;
  top: 142px;
  bottom: 0px;
  width: 750px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: @white;
  overflow: hidden;
}
.web-ipx {
  top: 250px;
}
.__ag__web__ {
  flex: 1;
}
</style>
