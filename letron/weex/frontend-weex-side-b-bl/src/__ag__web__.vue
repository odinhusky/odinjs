<template>
  <div class="__ag__webdiv__" :class="[ipx ? 'about-ipx' : '']">
    <ag-hbtitle :isback="true" :title="title"></ag-hbtitle>
    <web
      class="__ag__web__"
      @pagestart="onPageStart"
      @pagefinish="onPageFinish"
      @error="onError"
      :src="url"
      v-if="url"
    ></web>
  </div>
</template>

<script>
import agMinix from "./components/__ag__minix__.js"
import util from "./components/util.js"
import HbTitle from "./components/__ag__headTop__.vue"

export default {
  mixins: [agMinix],
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
    let data = util.getUrlParam(weex.config.bundleUrl)
    this.url = data.url
    if (data.title == "Privacy") {
      this.title = "隐私政策"
    } else if (data.title == "Service") {
      this.title = "用户协议"
    }
  },
  methods: {
    onPageStart: function (e) {
      // util.message("onPageStart"+e)
      // page start load
    },
    onPageFinish: function (e) {
      // util.message("onPageFinish"+e)
      // page finish load
    },
    onError: function (e) {
      // util.message("onPageFinish"+e)
      // page load error
    },
  },
}
</script>

<style>
.__ag__webdiv__ {
  position: fixed;
  top: 0px;
  bottom: 0px;
  width: 750px;
  padding-top: 80px;
}
.about-ipx {
  padding-top: 148px;
}
.__ag__web__ {
  width: 750px;
  flex: 1;
}
</style>
