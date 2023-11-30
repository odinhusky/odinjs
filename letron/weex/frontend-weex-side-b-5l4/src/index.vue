<template>
  <div class="__ag__indexhb__">
    <!-- <ag-hbtitle :topTab="tab"  @onclick="onclick"></ag-hbtitle> -->
    <indexcom
      :class="[tab == 1 ? 'show' : 'hide']"
      :topTab="tab"
      @gomatch="onclick"
    ></indexcom>
    <ag-match :class="[tab == 2 ? 'show' : 'hide']" :topTab="tab"></ag-match>
    <msg-chat :class="[tab == 3 ? 'show' : 'hide']" :topTab="tab"></msg-chat>
    <friend-list
      :class="[tab == 4 ? 'show' : 'hide']"
      :topTab="tab"
    ></friend-list>
    <my :class="[tab == 5 ? 'show' : 'hide']"></my>
    <ag-bottombar :topTab="tab" @onclick="onclick"></ag-bottombar>
    <ag-gengxin :ver="fileWgt"></ag-gengxin>

    <!-- 比赛直播弹窗 -->
    <ag-popup
      class="__ag__lives_popup__"
      v-if="showLivesPopup"
      @closePopup="showLivesPopup = false"
      :isAnimate="showLivesPopup"
    >
      <match-lives-item
        @closePopup="showLivesPopup = false"
        :upitem="matchUpItem"
        :liveitem="matchLiveItem"
      ></match-lives-item>
    </ag-popup>
  </div>
</template>

<script>
import indexcom from "./components/__ag__indexCom__.vue"
import my from "./components/__ag__my__.vue"
import agMatch from "./components/__ag__match__.vue"
import msgChat from "./components/__ag__msgChat__.vue"
import friendList from "./components/__ag__friendList__.vue"
import agMinix from "./components/__ag__minix__.js"
import moduleFun from "./components/__ag__moduleFun__.js"
import util from "./components/util.js"
import bc from "./components/__ag__bc__.js"
import __ag__sport__ from "./components/__ag__sport__.js"
import __ag__sport_api__ from "./components/__ag__sport_api__.js"
import env from "./components/env.js"
import bottomBar from "./components/__ag__bottomBar__.vue"
import matchLivesItem from "./components/__ag__matchLivesItem__.vue"
import agPopup from "./components/__ag__popup__.vue"
import gengxin from "./components/__ag__gengxin__.vue"
import require from "./components/__ag__requireModule__.js"

import { get, clone } from "lodash"
import { base64stringReset } from "./components/imgEncode.js"

let ImageCropPicker = require.imageCropPicker
let imgurl = undefined
let options = {
  width: 300,
  height: 300,
  includeExif: true,
  mediaType: "photo",
  cropping: true,
  includeBase64: true,
}
export default {
  name: "App",
  mixins: [agMinix],
  components: {
    agMatch,
    my,
    indexcom,
    msgChat,
    friendList,
    agPopup,
    matchLivesItem,
    "ag-bottombar": bottomBar,
    "ag-gengxin": gengxin,
  },
  data() {
    return {
      tab: "1",
      verTime: 0,
      showLivesPopup: false,
      fileWgt: {},
      matchLiveItem: {},
      matchUpItem: {},
    }
  },
  created() {
    __ag__sport__.__ag__infoUser_editGuest__(this)
    this.__ag__fontFace__()
    __ag__sport__.initJPushService()

    let globalEvent = weex.requireModule("globalEvent")
    globalEvent.addEventListener("landscape", function (e) {
      bc.postMessage("landscape", e)
    })
    __ag__sport__.setBadge(0)
  },
  mounted() {},
  methods: {
    async __ag__loadData__() {
      let that = this
      const login = new BroadcastChannel("onlogin")
      login.onmessage = function (event) {
        that.onlogin(event.data)
      }
      const matchlive = new BroadcastChannel("matchlive")
      matchlive.onmessage = function (event) {
        that.matchlive(event.data)
      }
      const imgcorp = new BroadcastChannel("imgcorp")
      imgcorp.onmessage = function (event) {
        that.__ag__imgcorp__(event.data)
      }
      // this.__ag__fontFace__()
      this.pageVer()
    },
    __ag__imgsuccess__(f, p) {
      const { isEnCode } = p
      const { uploadBase64, upload } = __ag__sport_api__
      const uploadAPI = isEnCode ? upload : uploadBase64

      uploadAPI(f)
        .then((resp) => {
          if (resp.success) {
            const obj = {
              data: resp.data,
              param: { ...p },
            }
            const imgsuccess = new BroadcastChannel("imgsuccess")
            imgsuccess.postMessage(obj)
          }
        })
        .catch((res) => {
          util.message(res.message)
        })
    },
    __ag__imgcorp__(data) {
      let isEnCode = false
      let target = ""
      if (data) {
        // 判斷是否是來自於要加密的元件
        isEnCode = get(data, "isEnCode", false)

        // 紀錄 target 是誰
        target = get(data, "target", "")

        // 處理 option
        const optionsObj = clone(data)
        delete optionsObj.isEnCode
        delete optionsObj.target

        options = optionsObj
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

      ImageCropPicker.openPicker(options, (response) => {
        // 成功返回 {code:'E_SUCCESS', data:{...}}
        // let result = JSON.stringify(response.data)

        if (response && response.code == "E_SUCCESS") {
          const base64Str = response.data.data

          // & 處理 imgurl 的推播
          if (!imgurl) {
            imgurl = new BroadcastChannel("imgurl")
          }

          imgurl.postMessage("data:image/png;base64," + base64Str)

          // 其他參數
          const p = {
            isEnCode,
            target,
          }

          // & 決定要使用哪個方式上傳
          if (isEnCode) {
            const enCodedBase64Str = base64stringReset(base64Str, 100)
            // 使用原本 base64 上傳方式
            const f = {
              file: enCodedBase64Str,
              filename: "image.gls",
            }

            this.__ag__imgsuccess__(f, p)
          } else {
            // 使用原本 base64 上傳方式
            const f = {
              file: base64Str,
              filename: "image.png",
            }

            this.__ag__imgsuccess__(f, p)
          }
        }
      })
    },
    matchlive(data) {
      this.showLivesPopup = true
      this.matchLiveItem = data.liveitem
      this.matchUpItem = data.upitem
    },
    onlogin(user) {
      let token = util.dt < 3 ? user.tokenApp : user.token
      __ag__sport__.indexopenws(user, token)
    },
    dataURItoBlob(dataurl) {
      let format = "image/jpeg"
      let bstr = atob(dataurl)
      let ab = bstr.length
      let u8arr = new Uint8Array(ab)
      for (let i = 0; i < ab; i++) {
        u8arr[i] = bstr.charCodeAt(i)
      }
      // let blob = null
      // try {
      // 	blob = new Blob([u8arr], {
      //         type: format
      //     });
      // } catch (e) {

      // }
      return u8arr
    },
    async pageAppVer() {
      let verIndex = env.verIndex
      let f = {
        type: 1,
        verIndex: verIndex,
        channel: env.channel.ios,
      }
      try {
        let resp = await this.__ag__pageAppVer__(f)
        if (resp.data.list && resp.data.list.length > 0) {
          let ver = resp.data.list[0]

          if (verIndex < ver.verIndex) {
            if (ver.wgt) {
              this.downloadFileWgt(ver.wgt)
            } else {
              // this.onshowModal(ver)
              this.fileWgt = ver
            }
          }
        }
      } catch (err) {
        // util.message('热更失败')
      }
    },
    downloadFileWgt(wgt) {
      moduleFun.__ag__download__(wgt, (e) => {})
    },
    __ag__fontFace__() {
      // util.message(WXEnvironment)
      util.iconfontUtils()
      moduleFun.__ag__check__()
    },
    onclick(n) {
      this.tab = n
      if (n == 1) {
        this.pageVer()
      }
      if (n == 5) {
        util.statusbar(1)
      } else {
        util.statusbar(0)
      }
      // __ag__sport__.setBadge(0)
    },
    pageVer() {
      let time = new Date().getTime()
      if (this.verTime + 3000 < time) {
        this.verTime = time
        this.pageAppVer()
      }
    },
  },
}
</script>

<style scoped>
@import "./style/theme.less";
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
  background-color: #f2f3f4;
  flex-direction: column;
  /* width: 750px; */
}
.show {
  left: 0;
}
.hide {
  left: 750px;
}
.__ag__lives_popup__ {
  width: 750px;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0px;
  bottom: 0px;
  align-items: center;
  justify-content: center;
}
</style>
