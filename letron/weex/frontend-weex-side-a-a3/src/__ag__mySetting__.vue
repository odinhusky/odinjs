<template>
  <div class="__ag__setting-main__">
    <ag-hbtitle :isback="true" title="设置"></ag-hbtitle>
    <div class="__ag__settingcontent__" :class="[ipx ? 'setting-ipx' : '']">
      <ag-my-item
        title="检查更新"
        :isIcons="ag__isIcons__"
        @goJump="__ag__goJump__(0)"
        class="__ag__border__"
      >
        <image class="__ag__box_image__" :src="staticPath('sx.png')"></image>
      </ag-my-item>
      <ag-my-item
        title="清理缓存"
        :isIcons="ag__isIcons__"
        :isReftes="true"
        @goJump="__ag__goJump__(1)"
        class="__ag__border__"
      >
        <image class="__ag__box_image__" :src="staticPath('ql.png')"></image>
      </ag-my-item>

      <ag-my-item
        title="注销账号"
        :isIcons="ag__isIcons__"
        @goJump="__ag__cancellation__"
        v-if="isUser"
        class="__ag__border__"
      >
        <image
          class="__ag__box_image__"
          :src="__ag__url__('/static/a3/sc.png')"
        ></image>
      </ag-my-item>

      <div class="__ag__setting-btn__" v-if="isUser" @click="__ag__submit__">
        <text class="__ag__setting-out__">退出登录</text>
      </div>
    </div>
  </div>
</template>

<script>
import agMyItem from "./components/__ag__myItem__.vue"
import agMinix from "./components/__ag__minix__.js"
import HbTitle from "./components/__ag__headTop__.vue"
import env from "./components/env.js"
import a__ag__util__ from "./components/util.js"
import agMinUrl from "./components/__ag__minurl__.js"
import moduleFun from "./components/__ag__moduleFun__.js"

export default {
  components: {
    "ag-my-item": agMyItem,
    "ag-hbtitle": HbTitle,
  },
  mixins: [agMinix, agMinUrl],
  data() {
    return {
      userInfo: {},
      env,
      ag__isIcons__: true,
    }
  },
  computed: {
    isUser() {
      if (this.userInfo && this.userInfo.userType <= 2) {
        return true
      }
      return false
    },
  },
  methods: {
    // 注销账号
    __ag__cancellation__() {
      a__ag__util__.getPush("__ag__cancellation__")
    },
    __ag__goJump__(n) {
      if (n == 0) {
        this.a__ag__pageAppVer__()
      } else {
        a__ag__util__.message("缓存已清理")
      }
    },
    async a__ag__pageAppVer__() {
      let verIndex = env.verIndex
      let f = {
        type: 1,
        verIndex: verIndex,
        channel: env.channel.ios,
      }
      a__ag__util__.message("正在检查")
      let resp = await this.__ag__pageAppVer__(f)
      if (resp.data.list && resp.data.list.length > 0) {
        let ver = resp.data.list[0]
        // console.log('verIndex',ver,verIndex)
        if (verIndex < ver.verIndex) {
          // console.log('bbb')
          if (ver.wgt) {
            // console.log('aaa')
            a__ag__util__.message("正在下载")
            this.downloadFileWgt(ver.wgt)
          } else {
            // this.onshowModal(ver)
            a__ag__util__.message("发现新版本")
          }
        } else {
          a__ag__util__.message("已经是最新版本")
        }
      } else {
        a__ag__util__.message("已经是最新版本")
      }
    },
    downloadFileWgt(wgt) {
      moduleFun.__ag__download__(wgt, (e) => {
        a__ag__util__.message("更新完成")
      })
    },
    async __ag__loadData__() {
      this.userInfo = a__ag__util__.getUrlParam(weex.config.bundleUrl)
    },
  },
}
</script>

<style lang="less">
@import "./style/default.less";

.iconfont {
  font-family: iconfont;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.__ag__setting-main__ {
  width: @fullWidth;
  background-color: @white;
}
.__ag__settingcontent__ {
  position: fixed;
  top: @contentOriginalPositionTop;
  bottom: 0px;
  width: @fullWidth;
  border-top-left-radius: @contentBorderRadius;
  border-top-right-radius: @contentBorderRadius;
  overflow: hidden;
  background-color: @white;
  padding-top: 20px;
}
.setting-ipx {
  top: @ipxPositionTop;
}
.__ag__setting-btn__ {
  width: 520px;
  height: 70px;
  line-height: 70px;
  border-width: 2px;
  border-style: solid;
  border-color: @primary;
  margin-left: 25px;
  margin-top: 50wx;
  border-radius: 24wx;
  background-color: @white;
  align-self: center;
}
.__ag__setting-out__ {
  font-family: "Source Han Sans SC";
  font-style: normal;
  font-weight: 500;
  font-size: 16wx;
  line-height: 70px;
  text-align: center;
  color: @primary;
}
.__ag__setting_item__ {
  height: 100px;
  padding-left: 40px;
  padding-right: 40px;
  background-color: @white;
}
.__ag__box_rg__ {
  flex-direction: row;
  align-items: center;
}
.__ag__item-icon__ {
  font-size: 40px;
}
.__ag__box_image__ {
  width: 60px;
  height: 60px;
}
.__ag__border__ {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: @border;
}
</style>
