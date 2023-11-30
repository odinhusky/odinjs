<template>
  <div class="__ag__my__">
    <scroller class="__ag__my-scroll__" :show-scrollbar="false">
      <ag-ipx :bg="env.channel.mycolor"></ag-ipx>
      <ag-user-info :info="a__ag__users__"></ag-user-info>
      <ag-my-item
        title="任务中心"
        :isIcons="ag__isIcons__"
        @goJump="__ag__goJump__(6)"
        v-if="showWorldcup"
      >
        <text class="agiconfont __ag__box-image__">&#xe627;</text>
      </ag-my-item>
      <ag-my-item
        v-if="isUser"
        title="关注和预约"
        :isIcons="ag__isIcons__"
        @goJump="__ag__goJump__(0)"
      >
        <text class="agiconfont __ag__box-image__">&#xe66d;</text>
      </ag-my-item>
      <ag-my-item
        v-if="isUser"
        title="修改密码"
        :isIcons="ag__isIcons__"
        @goJump="__ag__goJump__(1)"
      >
        <text class="agiconfont __ag__box-image__ icon-pass">&#xe681;</text>
      </ag-my-item>
      <ag-my-item
        v-if="isUser"
        title="客服反馈"
        :isIcons="ag__isIcons__"
        @goJump="__ag__goJump__(2)"
      >
        <text class="agiconfont __ag__box-image__">&#xe67f;</text>
      </ag-my-item>
      <ag-my-item
        title="关于我们"
        :isIcons="ag__isIcons__"
        @goJump="__ag__goJump__(3)"
      >
        <text class="agiconfont __ag__box-image__">&#xe684;</text>
      </ag-my-item>
      <ag-my-item
        title="设置"
        :isIcons="ag__isIcons__"
        @goJump="__ag__goJump__(4)"
      >
        <text class="agiconfont __ag__box-image__">&#xe672;</text>
      </ag-my-item>
      <ag-my-item
        title="分享应用"
        :isIcons="ag__isIcons__"
        @goJump="__ag__goJump__(5)"
      >
        <text class="agiconfont __ag__box_share__">&#xe6e2;</text>
      </ag-my-item>
      <ag-my-item
        title="我的奖品"
        :isIcons="ag__isIcons__"
        @goJump="__ag__goJump__(7)"
        v-if="showPrize"
      >
        <text class="agiconfont __ag__box_share__" v-if="env.code == 'xg'"
          >&#xe6fc;</text
        >
        <text class="agiconfont __ag__box_share__" v-else>&#xe6db;</text>
      </ag-my-item>
      <div
        class="__ag__setting-btn__"
        :class="[env.brand == 'hb' ? '__ag__setting_hb_btn__' : '']"
        v-if="isUser"
        @click="__ag__submit__"
      >
        <image class="__ag__log_img__" :src="handleImgPath('lout.png')"></image>
        <text class="__ag__setting-out__">退出登录</text>
      </div>
    </scroller>
  </div>
</template>

<script>
import agUserInfo from "./__ag__userInfo__.vue"
import agMyItem from "./__ag__myItem__.vue"
import agMinix from "./__ag__minix__.js"
import agMinUrl from "./__ag__minurl__.js"
import env from "./env.js"
import util from "./util.js"
import bc from "./__ag__bc__.js"
import ipx from "./__ag__ipx__.vue"

export default {
  components: {
    "ag-user-info": agUserInfo,
    "ag-my-item": agMyItem,
    "ag-ipx": ipx,
  },
  mixins: [agMinix, agMinUrl],
  data() {
    return {
      ag__isIcons__: true,
      a__ag__users__: {},
      env,
      metaDataMap: {},
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
    showWorldcup() {
      let map = this.metaDataMap
      if (!map) {
        return false
      }
      let switchWorldcup = map["switchTask"]
      if (switchWorldcup == 1) {
        return true
      }
      return false
    },
    showPrize() {
      let map = this.metaDataMap
      if (!map) {
        return false
      }
      let switchWorldcup = map["switchAward"]
      if (switchWorldcup == 1) {
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

      this.afreshUser()

      this.afreshMetaData()

      bc.onmessage("afreshUser", this.afreshUser)

      bc.onmessage("afreshMetaData", this.afreshMetaData)
    },

    afreshUser() {
      this.a__ag__users__ = util.getItem("user")
    },
    afreshMetaData() {
      let map = util.getItem("metaDataMap")
      this.metaDataMap = map
    },
    __ag__goJump__(n) {
      if (n == 0) {
        util.getPush("__ag__followPointment__")
        return
      }
      if (n == 1) {
        util.getPush("__ag__changePassword__")
        return
      }
      if (n == 2) {
        util.getPush("__ag__myKefu__")
        return
      }
      if (n == 3) {
        util.getPush("__ag__myAbout__")
        return
      }
      if (n == 4) {
        let user = {
          userType: this.a__ag__users__.userType,
        }
        util.getPush("__ag__mySetting__", user)
        return
      }
      if (n == 5) {
        util.getPush("__ag__share__")
        return
      }
      if (n == 6) {
        util.getPush("__ag__renwuzhongxin__")
        return
      }
      if (n == 7) {
        util.getPush("__ag__wodejiangpin__")
        return
      }
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__setting-btn__ {
  width: 686px;
  height: 80px;
  border-radius: 72px;
  color: @primary;
  border-width: 1px;
  border-style: solid;
  border-color: @primary;
  margin-top: 30wx;
  margin-right: 16wx;
  margin-left: 16wx;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__setting_hb_btn__ {
  border-radius: 40px;
}
.__ag__setting-out__ {
  font-size: 40px;
  color: @primary;
  font-weight: 600;
}
.__ag__log_img__ {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.__ag__my__ {
  width: 750px;
  background-color: @white;
  flex-direction: column;
  position: fixed;
  top: 0px;
  bottom: 66wx;
}
.__ag__my-scroll__ {
  flex: 1;
  padding-bottom: 30wx;
}
.my-ipx {
  top: 35wx;
}
.__ag__box-image__ {
  width: 60px;
  height: 60px;
  font-size: 60px;
  line-height: 60px;
  font-family: agiconfont;
}
.__ag__box_share__ {
  width: 60px;
  height: 60px;
  font-size: 50px;
  line-height: 60px;
  font-family: agiconfont;
  text-align: center;
}
</style>
