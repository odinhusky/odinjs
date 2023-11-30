<template>
  <div class="__ag__setting-main__" :class="[ipx ? 'setting-ipx' : '']">
    <ag-hbtitle :isback="true" title="设置"></ag-hbtitle>
    <div class="__ag__settingcontent__">
      <ag-my-item title="消息提醒" :isright="true" @goJump="__ag__onTips__">
        <text v-if="platform == 'iOS'" class="agiconfont __ag__feedback__"
          >&#xe67f;</text
        >
        <switch
          class="__ag__switch__"
          @change="__ag__shockChange__"
          :checked="isShock"
        >
        </switch>
      </ag-my-item>
      <ag-my-item title="检查更新" @goJump="__ag__goJump__(0)"> </ag-my-item>
      <ag-my-item title="清理缓存" @goJump="__ag__goJump__(1)"> </ag-my-item>
    </div>
  </div>
</template>

<script>
import agMyItem from "./components/__ag__myItem__.vue"
import agMinix from "./components/__ag__minix__.js"
import HbTitle from "./components/__ag__headTop__.vue"
import agswitch from "./components/__ag__switch__.vue"
import util from "./components/util.js"
import env from "./components/env.js"
import moduleFun from "./components/__ag__moduleFun__.js"
let modal = weex.requireModule("modal")
export default {
  components: {
    "ag-my-item": agMyItem,
    "ag-hbtitle": HbTitle,
    "ag-switch": agswitch,
  },
  mixins: [agMinix],
  data() {
    return {
      loading: false,
      env,
      platform: "",
      isShock: false,
    }
  },
  computed: {},
  created() {
    this.platform = WXEnvironment.platform
    this.isShock = !util.getItem("isShock")
  },
  methods: {
    __ag__shockChange__(e) {
      if (!modal) {
        modal = weex.requireModule("modal")
      }
      let isShock = e.value
      // this.isShock = true
      if (this.isShock && !isShock) {
        let that = this
        that.isShock = isShock
        modal.confirm(
          {
            message: "关闭将无法收到实时消息通知，是否继续？",
            duration: 0.3,
            okTitle: "确定",
            cancelTitle: "取消",
          },
          function (value) {
            if (value == "确定") {
              that.isShock = false
              util.setItem("isShock", !that.isShock)
            }
            if (value == "取消") {
              that.isShock = true
            }
          }
        )
      } else {
        this.isShock = isShock
        util.setItem("isShock", !isShock)
      }
    },
    __ag__onTips__() {
      if (this.platform == "iOS") {
        util.message(
          "iPhone需要在‘设置-声音与触感’启用‘振动’配置，否则无法震动"
        )
        return
      }
    },
    __ag__goJump__(n) {
      if (n == 0) {
        this.appUpdate()
      } else {
        if (this.loading) {
          return
        }
        this.loading = true
        util.message("清理缓存成功")
        this.loading = false
      }
    },
    async appUpdate() {
      let verIndex = env.verIndex
      let f = {
        type: 1,
        verIndex: verIndex,
        channel: env.channel.ios,
      }
      util.message("正在检查")
      try {
        let resp = await this.__ag__pageAppVer__(f)
        // console.log("@@ appUpdate Resp", JSON.stringify(resp))

        if (resp.data.list && resp.data.list.length > 0) {
          let ver = resp.data.list[0]
          // console.log("@@ verIndex", ver, verIndex)
          if (verIndex < ver.verIndex) {
            // console.log("@@ bbb")
            if (ver.wgt) {
              // console.log("@@ aaa")
              util.message("正在下载")
              this.downloadFileWgt(ver.wgt)
            } else {
              // this.onshowModal(ver)
              util.message("发现新版本")
            }
          } else {
            util.message("已经是最新版本")
          }
        } else {
          util.message("已经是最新版本")
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    downloadFileWgt(wgt) {
      moduleFun.__ag__download__(wgt, (e) => {
        util.message("更新完成")
      })
    },
  },
}
</script>

<style lang="less" scoped>
@import "./style/theme.less";
.__ag__feedback__ {
  font-size: 18wx;
  margin-left: 6px;
}
.__ag__setting-main__ {
  width: 750px;
  position: fixed;
  top: 120px;
  bottom: 0;
  background-color: @white;
}

.setting-ipx {
  top: 200px;
}
.__ag__settingcontent__ {
  width: 750px;
  flex: 1;
}
.__ag__switch__ {
  position: absolute;
  right: 20px;
  top: -10px;
}
</style>
