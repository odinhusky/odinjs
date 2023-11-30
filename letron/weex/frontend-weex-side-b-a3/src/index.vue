<template>
  <div class="__ag__indexhb__">
    <!-- <ag-hbtitle :topTab="tab"  @onclick="onclick"></ag-hbtitle> -->
    <indexcom
      :class="[tab == 1 ? 'show' : 'hide']"
      :topTab="tab"
      @gomatch="onclick"
    ></indexcom>

    <ag-match
      :class="[tab == 2 ? 'show' : 'hide']"
      :topTab="tab"
      :currentIndex="currentIndex"
    ></ag-match>

    <msg-chat :class="[tab == 3 ? 'show' : 'hide']" :topTab="tab"></msg-chat>

    <friend-list :class="[tab == 4 ? 'show' : 'hide']" :topTab="tab"></friend-list>

    <my :class="[tab == 5 ? 'show' : 'hide']"></my>
    －
    <ag-bottom-luckbar
      :topTab="tab"
      @onclick="onclick"
      v-if="switchWorldcup"
    ></ag-bottom-luckbar>

    <ag-bottombar :topTab="tab" @onclick="onclick" v-else></ag-bottombar>

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

    <!-- 首次进入app弹窗 -->
    <ag-popup
      class="__ag__lives_popup__"
      v-if="showLuckPopup && tab == 1"
      :isAnimate="showLuckPopup"
    >
      <div class="index-modal" :style="luckStyle">
        <image class="modal-bg" :src="handleImgPath('bg.png')"></image>
        <image style="width: 350px; height: 120px" :src="handleImgPath('yq.png')"></image>
        <image
          style="width: 450px; height: 350px"
          :src="handleImgPath('bongb.png')"
        ></image>
        <text class="index-btn" @click.stop="onLuckDraw">立即抽奖</text>
      </div>
      <image
        :src="handleImgPath('popup-close.png')"
        class="index-close"
        @click="showLuckPopup = false"
      ></image>
    </ag-popup>
  </div>
</template>

<script>
import indexcom from "./components/__ag__indexCom__.vue";
import my from "./components/__ag__my__.vue";
import agMatch from "./components/__ag__match__.vue";
import msgChat from "./components/__ag__msgChat__.vue";
import friendList from "./components/__ag__friendList__.vue";
import agMinix from "./components/__ag__minix__.js";
import agMinUrl from "./components/__ag__minurl__.js";
import moduleFun from "./components/__ag__moduleFun__.js";
import util from "./components/util.js";
import bc from "./components/__ag__bc__.js";
import __ag__sport__ from "./components/__ag__sport__.js";
import __ag__sport_api__ from "./components/__ag__sport_api__.js";
import env from "./components/env.js";
import bottomBar from "./components/__ag__bottomBar__.vue";
import bottomLuckBar from "./components/__ag__bottomLuckBar__.vue";
import matchLivesItem from "./components/__ag__matchLivesItem__.vue";
import agPopup from "./components/__ag__popup__.vue";
import gengxin from "./components/__ag__gengxin__.vue";
import require from "./components/__ag__requireModule__.js";
let ImageCropPicker = require.imageCropPicker;
let imgurl = undefined;
let options = {
  width: 300,
  height: 300,
  includeExif: true,
  mediaType: "photo",
  cropping: true,
  includeBase64: true,
};

export default {
  name: "App",
  mixins: [agMinix, agMinUrl],
  components: {
    agMatch,
    my,
    indexcom,
    msgChat,
    friendList,
    agPopup,
    matchLivesItem,
    "ag-bottombar": bottomBar,
    "ag-bottom-luckbar": bottomLuckBar,
    "ag-gengxin": gengxin,
  },
  data() {
    return {
      tab: "1",
      env,
      verTime: 0,
      showLivesPopup: false,
      fileWgt: {},
      matchLiveItem: {},
      matchUpItem: {},
      showLuckPopup: false,
      currentIndex: 0,
      switchWorldcup: false,
    };
  },
  async created() {
    __ag__sport__.__ag__infoUser_editGuest__(this);
    this.__ag__fontFace__();
    __ag__sport__.initJPushService();

    let globalEvent = weex.requireModule("globalEvent");
    globalEvent.addEventListener("landscape", function (e) {
      bc.postMessage("landscape", e);
    });
    __ag__sport__.setBadge(0);
    let map = util.getItem("metaDataMap");
    if (map) {
      this.getMetaDataMap();
    } else {
      await __ag__sport__.getListMetaData();
      this.getMetaDataMap();
    }
  },
  methods: {
    getMetaDataMap() {
      let map = util.getItem("metaDataMap");
      this.switchWorldcup = map["switchWorldcup"] == 1 ? true : false;
      if (this.switchWorldcup) {
        this.judgeFirstEntry();
      }
    },
    async __ag__loadData__() {
      this.pageVer();
      let that = this;
      const login = new BroadcastChannel("onlogin");
      login.onmessage = function (event) {
        that.onlogin(event.data);
      };
      const matchlive = new BroadcastChannel("matchlive");
      matchlive.onmessage = function (event) {
        that.matchlive(event.data);
      };
      const imgcorp = new BroadcastChannel("imgcorp");
      imgcorp.onmessage = function (event) {
        that.__ag__imgcorp__(event.data);
      };
      bc.onmessage("afreshMetaData", this.getMetaDataMap);

      bc.onmessage("switchTab", this.switchTab);
      // this.__ag__fontFace__()
    },
    __ag__imgsuccess__(f) {
      // console.log('co---',util.toString(f))
      __ag__sport_api__
        .uploadBase64(f)
        .then((resp) => {
          if (resp.success) {
            const imgsuccess = new BroadcastChannel("imgsuccess");
            imgsuccess.postMessage(resp.data);
          }
        })
        .catch((res) => {
          util.message(res.message);
        });
    },
    __ag__imgcorp__(data) {
      if (data) {
        options = data;
      } else {
        options = {
          compressImageMaxHeight: 1000,
          compressImageQuality: 0.8,
          includeExif: true,
          mediaType: "photo",
          cropping: false,
          includeBase64: true,
        };
      }

      ImageCropPicker.openPicker(options, (response) => {
        // 成功返回 {code:'E_SUCCESS', data:{...}}
        // let result = JSON.stringify(response.data)

        if (response && response.code == "E_SUCCESS") {
          let data = response.data.data;
          // console.log('co---111',util.toString(response.data));
          if (!imgurl) {
            imgurl = new BroadcastChannel("imgurl");
          }
          imgurl.postMessage("data:image/png;base64," + data);
          let f = {
            file: response.data.data,
            filename: "image.png",
          };
          this.__ag__imgsuccess__(f);
        }
      });
    },
    matchlive(data) {
      this.showLivesPopup = true;
      this.matchLiveItem = data.liveitem;
      this.matchUpItem = data.upitem;
    },
    onlogin(user) {
      let token = util.dt < 3 ? user.tokenApp : user.token;
      __ag__sport__.indexopenws(user, token);
    },
    dataURItoBlob(dataurl) {
      let format = "image/jpeg";
      let bstr = atob(dataurl);
      let ab = bstr.length;
      let u8arr = new Uint8Array(ab);
      for (let i = 0; i < ab; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      // let blob = null
      // try {
      // 	blob = new Blob([u8arr], {
      //         type: format
      //     });
      // } catch (e) {
      // 	console.log("error==",util.toString(e))
      // }
      return u8arr;
    },
    async pageAppVer() {
      let verIndex = env.verIndex;
      let f = {
        type: 1,
        verIndex: verIndex,
        channel: env.channel.ios,
      };
      try {
        let resp = await this.__ag__pageAppVer__(f);
        if (resp.data.list && resp.data.list.length > 0) {
          let ver = resp.data.list[0];
          console.log("v---111", verIndex, ver.verIndex);
          if (verIndex < ver.verIndex) {
            // console.log('bbb')
            if (ver.wgt) {
              // console.log('aaa')
              this.downloadFileWgt(ver.wgt);
            } else {
              // this.onshowModal(ver)
              this.fileWgt = ver;
            }
          }
        }
      } catch (err) {
        // util.message('热更失败')
      }
    },
    downloadFileWgt(wgt) {
      moduleFun.__ag__download__(wgt, (e) => {});
    },
    __ag__fontFace__() {
      // util.message(WXEnvironment)
      util.iconfontUtils();
      moduleFun.__ag__check__();
      util.fontUtils();
    },
    onclick(n) {
      this.tab = n;
      this.currentIndex = null;
      if (n == 1) {
        this.pageVer();
      }
      if (n == 5) {
        util.statusbar(1);
      } else {
        util.statusbar(0);
      }
      // __ag__sport__.setBadge(0)
    },
    switchTab(e) {
      if (e.data) {
        this.tab = e.data.tab;
        this.currentIndex = e.data.index;
      }
    },
    pageVer() {
      let time = new Date().getTime();
      if (this.verTime + 3000 < time) {
        this.verTime = time;
        this.pageAppVer();
      }
    },
    onLuckDraw() {
      this.showLuckPopup = false;
      util.getPush("__ag__luckDraw__");
    },
    // 判断每天是否第一次进入app
    judgeFirstEntry() {
      __ag__sport_api__
        .listMetaData({ label: "switchPopupIndex" })
        .then((resp) => {
          if (resp.data && resp.data.length) {
            if (resp.data[0].value == 1) {
              let firstTime = util.getItem("firstDate");
              let now = new Date().toLocaleDateString();
              let time = Date.parse(new Date(now));
              if (!firstTime) {
                this.showLuck();
                util.setItem("firstDate", JSON.stringify(time));
              } else {
                if (time > firstTime) {
                  this.showLuck();
                  util.setItem("firstDate", JSON.stringify(time));
                } else {
                  this.showLuckPopup = false;
                }
              }
            } else {
              util.removeItem("firstDate");
            }
          }
        })
        .catch((err) => {});
    },
    showLuck() {
      setTimeout(() => {
        this.showLuckPopup = true;
      }, 5000);
    },
  },
};
</script>

<style lang="less" scoped>
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
  background-color: @gray5;
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
  background-color: @black70;
  position: fixed;
  top: 0px;
  bottom: 0px;
  align-items: center;
  justify-content: center;
}
.index-modal {
  width: 750px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  position: relative;
}
.modal-bg {
  width: 750px;
  position: absolute;
  top: 0px;
  bottom: -100px;
}
.index-btn {
  height: 75px;
  background-image: linear-gradient(to right, @primary, @primaryLinearEnd);
  box-shadow: 6px 6px 8px @black25, 0px 5px 0px @red27;
  border-radius: 75px;
  font-style: normal;
  font-weight: 400;
  font-size: 18wx;
  line-height: 75px;
  text-align: center;
  letter-spacing: 2px;
  color: @white;
  text-shadow: 1px 1px 0px @red25;
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 20px;
}
.index-close {
  width: 60px;
  height: 60px;
  margin-top: 20px;
}
</style>
