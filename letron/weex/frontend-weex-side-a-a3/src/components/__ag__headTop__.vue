<template>
  <div
    class="__ag__hbtitle__"
    :class="[
      ipx ? 'title-ipx' : '',
      !ipx && tab == 2 ? 'title-match' : '',
      ipx && tab == 2 ? 'title-match-ipx' : '',
      isBl ? 'title-logo' : '',
    ]"
  >
    <div
      class="__ag__hbtitlediv__"
      :class="[isback ? '__ag__hbtitlediv_back__' : '']"
    >
      <div class="__ag__hbtitletop__" v-if="isback && !isLogin">
        <image
          :src="staticPath('back.png')"
          class="__ag__back__"
          @click.stop="__ag__onBackPress__"
        ></image>
        <text class="__ag__hbtitletoptext__" v-if="title">{{ title }}</text>
        <text class="__ag__back__"></text>
      </div>
      <div
        class="__ag__hbtitleright__"
        :class="[isLogin ? 'loginStyle' : '']"
        v-if="isLogin || (!isback && tab != 2)"
      >
        <image
          :src="staticPath('back.png')"
          class="login__back"
          v-if="isLogin"
          @click.stop="__ag__onBackPress__"
        ></image>

        <image class="__ag__hbtitleimg__" :src="staticPath('logo-t.png')" />
      </div>
    </div>
  </div>
</template>

<script>
import a__ag__util__ from "./util.js"
import agMinix from "./__ag__minix__.js"
import agMinUrl from "./__ag__minurl__.js"
import env from "./env.js"

const backHomeBroadcast = new BroadcastChannel("backHomeBroadcast")

export default {
  mixins: [agMinix, agMinUrl],
  name: "ag-hbtitle",
  props: {
    isback: {
      type: Boolean,
      default: false,
    },
    isBl: {
      type: Boolean,
      default: false,
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    tab: {
      type: Number,
      default: 1,
    },
  },
  watch: {},
  mounted() {},
  data() {
    return {
      tab: 1,
      env,
    }
  },
  methods: {
    __ag__onBackPress__() {
      backHomeBroadcast.postMessage({ type: "backHomeTrigger" });
      a__ag__util__.pop()
    },
  },
  destroyed() {
    backHomeBroadcast.close()
  },
}
</script>

<style lang="less" scoped>
@import "../style/default.less";
.iconfont {
  font-family: iconfont;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.__ag__hbtitle__ {
  position: fixed;
  top: 100px;
  width: @fullWidth;
  height: @headerTopOriginalHeight;
  background-color: @primary;
  // background-image: linear-gradient(to bottom, #fdc501, #fd9b3a);
  z-index: 99999;
  left: 0;
  right: 0;
  padding-top: 44px;
}
.title-ipx {
  height: @headerTopHeight;
  top: 0px;
  padding-top: @titleIpxPaddingTop;
}
.title-match {
  height: 56px;
  background-color: @primary;
  // background-image: linear-gradient(to bottom, #fdc501, #fdc501);
}
.title-match-ipx {
  height: 110px;
  padding-top: 0px;
}
.title-logo {
  background-color: @primary;
  // background-image: linear-gradient(to bottom, #fdc501, #fdc501);
}
.__ag__hbtitlediv__ {
  width: @fullWidth;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.__ag__hbtitlediv_back__ {
  align-items: flex-end;
}
.__ag__hbtitletop__ {
  width: @fullWidth;
  height: 80px;
  padding-left: 32px;
  padding-right: 32px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 60px;
  z-index: 999;
}
.__ag__hbtitletoptext__ {
  color: @white;
  font-size: 18wx;
  font-weight: 500;
}

.__ag__hbtitleright__ {
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: 15px;
  // background-color: red;
  position: relative;
  z-index: 9;
}
.loginStyle {
  height: 200px;
}

.login__back {
  width: @backImgWidth;
  height: @backImgHeight;

  position: absolute;
  left: 30px;
  top: 70px;
}

.__ag__hbtitleimg__ {
  width: 300px;
  height: 96px;
}
.__ag__backdiv__ {
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
}
.__ag__back__ {
  width: @backImgWidth;
  height: @backImgHeight;
}
.__ag__hbmy__ {
  font-size: 68px;
  color: @white;
}
.__ag__myimg__ {
  width: 66px;
  height: 66px;
}
.__ag__book__ {
  width: 65px;
  height: 65px;
}
</style>
