<template>
  <div class="__ag__indexhb__">
    <ag-hbtitle :tab="tab"></ag-hbtitle>
    <indexcom
      :class="[tab == 1 ? 'show' : 'hide']"
      :isRefresh="isRefresh"
      @refreshEvent="resetRefresh"
    ></indexcom>
    <ag-match :class="[tab == 2 ? 'show' : 'hide']" :tab="tab"></ag-match>
    <my :class="[tab == 3 ? 'show' : 'hide']"></my>
    <ag-bottombar :tabs="tab" @onclick="onclick"></ag-bottombar>
    <!-- <ag-gengxin :ver="fileWgt"></ag-gengxin> -->
  </div>
</template>

<script>
import indexcom from "./components/__ag__indexCom__.vue"
import my from "./components/__ag__my__.vue"
import agMatch from "./components/__ag__match__.vue"
import agMinix from "./components/__ag__minix__.js"
import module from "./components/__ag__module__.js"
import moduleFun from "./components/__ag__moduleFun__.js"
import __ag__sport__ from "./components/__ag__sport__.js"
import util from "./components/util.js"
import env from "./components/env.js"
import HbTitle from "./components/__ag__headTop__.vue"
import bottomBar from "./components/__ag__bottomBar__.vue"
import gengxin from "./components/__ag__gengxin__.vue"
import __ag__sport_api__ from "./components/__ag__sport_api__.js"

let ImageCropPicker = weex.requireModule(module.__ag__imageCropPicker__)
let imgsuccess = undefined
let loadingUplod = undefined
let imgurl = undefined
let options = {
  width: 300,
  height: 300,
  includeExif: true,
  mediaType: "photo",
  cropping: true,
  includeBase64: true,
}

const backHomeBroadcast = new BroadcastChannel("backHomeBroadcast");

export default {
  name: "App",
  mixins: [agMinix],
  components: {
    agMatch,
    my,
    indexcom,
    "ag-hbtitle": HbTitle,
    "ag-gengxin": gengxin,
    "ag-bottombar": bottomBar,
  },
  data() {
    return {
      tab: 1,
      fileWgt: {},
      isimgloging: false,
      isRefresh: false,
    }
  },
  mounted() {
    // this.__ag__fontFace__()
    backHomeBroadcast.onmessage = (event) => {
      if (event.data.type === "backHomeTrigger" && this.tab == 1) {
       this.resetRefresh(true);
      }
    };
  },
  created() {
    this.__ag__fontFace__()
    let globalEvent = weex.requireModule("globalEvent")
    if (globalEvent) {
      globalEvent.addEventListener(
        "WXApplicationWillResignActiveEvent",
        function (e) {
          __ag__sport__.setBadge(0)
        }
      )
    }
  },
  methods: {
    resetRefresh(bool) {
      this.isRefresh = bool;
    },
    async __ag__loadData__() {
      const that = this
      const imgcorp = new BroadcastChannel("imgcorp")
      imgcorp.onmessage = function (event) {
        that.__ag__imgcorp__(event.data)
      }
      await __ag__sport__.__ag__infoUser_editGuest__(this)
      this.pageAppVer()
      __ag__sport__.initJPushService()
      this.__ag__fontFace__()
      util.setStatusBarStyle(0)
    },
    __ag__imgsuccess__(f) {
      this.isimgloging = true
      console.log("img==1")
      __ag__sport_api__
        .uploadBase64(f)
        .then((resp) => {
          this.isimgloging = false
          console.log("img==", util.toStirng(resp))
          if (resp.success) {
            if (!imgsuccess) {
              imgsuccess = new BroadcastChannel("imgsuccess")
            }

            imgsuccess.postMessage(resp.data)
          }
        })
        .catch((res) => {
          this.isimgloging = false
          util.message(res.message)
        })
    },
    __ag__imgcorp__(data) {
      if (this.isimgloging) {
        if (!loadingUplod) {
          loadingUplod = new BroadcastChannel("loadingUplod")
        }
        loadingUplod.postMessage()
        return
      }
      if (data) {
        options = data.options
      } else {
        options = {
          compressImageMaxHeight: 1000,
          compressImageQuality: 0.8,
          includeExif: true,
          mediaType: "photo",
          cropping: false,
          includeBase64: true,
        }
      }
      let index = data.index || 0

      if (index == 0) {
        ImageCropPicker.openCamera(options, (response) => {
          let result = JSON.stringify(response.data)
          if (response && response.code == "E_SUCCESS") {
            let data = response.data.data
            if (!imgurl) {
              imgurl = new BroadcastChannel("imgurl")
            }
            imgurl.postMessage("data:image/png;base64," + data)
            let f = {
              file: response.data.data,
              filename: "image.png",
            }

            this.__ag__imgsuccess__(f)
          }
        })
      } else {
        ImageCropPicker.openPicker(options, (response) => {
          let result = JSON.stringify(response.data)
          if (response && response.code == "E_SUCCESS") {
            let data = response.data.data
            if (!imgurl) {
              imgurl = new BroadcastChannel("imgurl")
            }
            imgurl.postMessage("data:image/png;base64," + data)
            let f = {
              file: response.data.data,
              filename: "image.png",
            }

            this.__ag__imgsuccess__(f)
          }
        })
      }
    },
    __ag__fontFace__() {
      util.iconfontUtils()
      moduleFun.__ag__check__()
    },
    async pageAppVer() {
      let verIndex = env.verIndex
      let f = {
        type: 1,
        verIndex: verIndex,
        channel: env.channel.ios,
      }
      let resp = await this.__ag__pageAppVer__(f)

      if (resp.data.list && resp.data.list.length > 0) {
        let ver = resp.data.list[0]
        if (verIndex < ver.verIndex) {
          console.log("b---", verIndex, ver.verIndex)
          if (ver.wgt) {
            this.downloadFileWgt(ver.wgt)
          } else {
            this.fileWgt = ver
            // this.onshowModal(ver)
          }
        }
      }
    },
    downloadFileWgt(wgt) {
      moduleFun.__ag__download__(wgt, (e) => {})
    },
    onclick(n) {
      this.tab = n
      if (n == 1) {
        this.pageAppVer()
      }
    },
  },
  destroyed() {
    backHomeBroadcast.close()
  },
}
</script>

<style lang="less" scoped>
@import "./style/default.less";

.iconfont {
  font-family: iconfont;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
/* .wrapper {
    justify-content: center;
    align-items: center;
  }
  .logo {
    width: 424px;
    height: 200px;
  }
  .greeting {
    text-align: center;
    margin-top: 70px;
    font-size: 50px;
    color: #41B883;
  }
  .message {
    margin: 30px;
    font-size: 32px;
    color: #727272;
  } */
.__ag__indexhb__ {
  background-color: @white;
  flex-direction: column;
  width: 750px;
}
.show {
  left: 0;
}
.hide {
  left: 750px;
}
</style>
