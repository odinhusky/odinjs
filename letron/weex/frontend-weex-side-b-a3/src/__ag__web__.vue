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
import agMinUrl from "./components/__ag__minurl__.js"
import util from "./components/util.js"
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
    const data = util.getUrlParam(weex.config.bundleUrl)

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
      // console.log(e)
      // page finish load
    },
    onError: function (e) {
      // util.message("onPageFinish"+e)
      // console.log(e)
      // page load error
    },
  },
}
</script>

<style scoped>
.__ag__webdiv__ {
  position: fixed;
  top: 50px;
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
