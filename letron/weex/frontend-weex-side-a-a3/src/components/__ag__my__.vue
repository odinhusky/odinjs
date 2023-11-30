<template>
  <div class="__ag__my__" :class="[ipx ? 'my-ipx' : '']">
    <ag-user-info :info="a__ag__users__"></ag-user-info>
    <!-- <ag-my-item
      title="我的关注"
      :isIcons="ag__isIcons__"
      @goJump="__ag__goJump__(3)"
      class="__ag__border__"
      v-if="isUser"
    >
      <image
        class="__ag__box_image__"
        :src="__ag__url__('/static/a3/gywm.png')"
      ></image>
    </ag-my-item> -->
    <ag-my-item
      v-if="isUser"
      title="客服反馈"
      :isIcons="ag__isIcons__"
      @goJump="__ag__goJump__(0)"
      class="__ag__border__"
    >
      <image class="__ag__box_image__" :src="staticPath('kf.png')"></image>
    </ag-my-item>
    <ag-my-item
      title="设置"
      :isIcons="ag__isIcons__"
      @goJump="__ag__goJump__(1)"
      class="__ag__border__"
    >
      <image class="__ag__box_image__" :src="staticPath('sz.png')"></image>
    </ag-my-item>
    <ag-my-item
      title="关于我们"
      :isIcons="ag__isIcons__"
      @goJump="__ag__goJump__(2)"
      class="__ag__border__ __ag__border_last__"
    >
      <image class="__ag__box_image__" :src="staticPath('gywm.png')"></image>
    </ag-my-item>
  </div>
</template>

<script>
import agUserInfo from "./__ag__userInfo__.vue"
import agMyItem from "./__ag__myItem__.vue"
import agMinix from "./__ag__minix__.js"
import __ag__util from "./util.js"
import env from "./env.js"
import agMinUrl from "./__ag__minurl__.js"
export default {
  components: {
    "ag-user-info": agUserInfo,
    "ag-my-item": agMyItem,
  },
  mixins: [agMinix, agMinUrl],
  data() {
    return {
      ag__isIcons__: true,
      a__ag__users__: {},
      env,
    }
  },
  computed: {
    isUser() {
      let user = this.a__ag__users__
      if (user && user.userType <= 2) {
        return true
      }
      return false
    },
  },
  mounted() {},
  methods: {
    async __ag__loadData__() {
      const Steve = new BroadcastChannel("onlogin")
      let that = this
      Steve.onmessage = function (event) {
        that.a__ag__users__ = event.data
      }
      const afreshUser = new BroadcastChannel("afreshUser")
      afreshUser.onmessage = function (event) {
        that.afreshUser()
      }
    },
    afreshUser() {
      this.a__ag__users__ = __ag__util.getItem("user")
    },
    __ag__goJump__(n) {
      if (n == 0) {
        __ag__util.getPush("__ag__myKefu__")
        return
      }
      if (n == 1) {
        let user = {
          userType: this.a__ag__users__.userType,
        }
        __ag__util.getPush("__ag__mySetting__", user)
        // this.$router.push('/setting')
        return
      }
      if (n == 2) {
        __ag__util.getPush("__ag__myAbout__")
        return
      }
      if (n == 3) {
        __ag__util.getPush("__ag__myFollow__")
        return
      }
    },
  },
}
</script>

<style lang="less">
@import "../style/default.less";

.iconfont {
  font-family: iconfont;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.__ag__my__ {
  width: @fullWidth;
  /* background-color: #E0E0E0; */
  flex-direction: column;
  position: fixed;
  top: @contentOriginalPositionTop;
  bottom: 0px;
  padding-bottom: 134px;
  border-top-left-radius: @contentBorderRadius;
  border-top-right-radius: @contentBorderRadius;
  background-color: @white;
  overflow: hidden;
}
.my-ipx {
  top: @ipxPositionTop;
  padding-bottom: @ipxPaddingTop;
}
.__ag__box_image__ {
  width: 60px;
  height: 60px;
}
.__ag__box_about__ {
  font-size: 60px;
  color: #d9f19a;
}
.__ag__border__ {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: @border;
}
.__ag__border_last__ {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: @border;
}
</style>
