<template>
  <div class="__ag__nvideo-main__" @click="__ag__click__" v-if="src">
    <div class="__ag__video-box__" ref="__ag__nvideo__" @click="__ag__click__">
      <video
        :style="videoStyle"
        :src="sourceUrl"
        auto-play="true"
        @start="onstart"
        :controls="controls"
        :play-status="state"
        @fail="playFail"
        @click="__ag__click__"
      ></video>
    </div>

    <!-- 弹幕列表 -->
    <ag-danmu-list
      ref="danmu"
      :isFull="isFull"
      :fullDevice="fullDevice"
    ></ag-danmu-list>

    <!-- 视频加载失败  -->
    <div class="__ag__video_error__" v-if="isVideoError" :style="errortyle">
      <text class="agiconfont __video_error__" @click="onRefresh"
        >&#xe66c;</text
      >
    </div>

    <!-- 高清、标清弹窗 -->
    <ag-video-quality
      ref="quality"
      :fullDevice="fullDevice"
      :isFull="isFull"
      @full="onFull"
    ></ag-video-quality>

    <!-- 高清弹窗提示 -->
    <div
      class="__hdmi_popup__"
      v-if="isHdmi"
      :class="[
        isFull && !ivx ? '__hdmi_rotate__' : '',
        isFull && ivx ? '__hdmi_rotate_ivx__' : '',
      ]"
      :style="hdmiLeft"
    >
      <text class="__hdmi_text__">您正畅享高清画质</text>
      <text class="__hdmi_btn__" @click="isHdmi = false">确定</text>
    </div>

    <!-- 直播标题、操作栏 -->
    <div
      class="__ag__top_control__"
      ref="__ag__close__"
      :style="controlStyle"
      @click.stop=""
    >
      <div
        class="__ag__top_control_lf__"
        :class="[isFull ? 'full__lf_content' : '']"
      >
        <!-- 返回按钮 -->
        <text class="agiconfont __video_close__" @click="cancelFull"
          >&#xe61d;</text
        >
        <!-- 标题 -->
        <div class="__ag__top_title__">
          <text class="__ag__title_text__">{{ matchInfo.teamNamea }}</text>
          <text class="__ag__title_text__ __ag__title_text_vs__">vs</text>
          <text class="__ag__title_text__">{{ matchInfo.teamNameb }}</text>
        </div>
      </div>
      <div
        class="__ag__top_control_rg__"
        v-if="!isFull"
        :class="[isFull ? 'full__rg_content' : '']"
      >
        <component :is="isAirplay" class="__ag__control_rg_image__">
          <image
            class="__ag__rg_image__"
            style="margin-top: 3px"
            :src="handleImgPath('tv.png')"
            mode="aspectFit"
          ></image>
        </component>

        <!-- <hongairplayba class="__ag__control_rg_image__"  v-if="env.code == 'hb8v2'">
					<image class="__ag__rg_image__" style="margin-top: 3px;" :src="__ag__url__('static/a3/tv.png')" mode="aspectFit"></image>
				</hongairplayba>
				<airplay v-else-if="env.code == 'zfv2'">
					<image class="__ag__rg_image__" style="margin-top: 3px;" :src="__ag__url__('static/a3/tv.png')" mode="aspectFit"></image>
				</airplay>
				<agairplay class="__ag__control_rg_image__" v-else>
					<image class="__ag__rg_image__" style="margin-top: 3px;" :src="__ag__url__('static/a3/tv.png')" mode="aspectFit"></image>
				</agairplay> -->

        <div class="__ag__control_rg_image__" @click.stop="__ag__onShare__">
          <image
            class="__ag__rg_image__"
            :src="handleImgPath('share.png')"
            mode="aspectFit"
          ></image>
        </div>
      </div>
      <div
        class="__ag__top_control_rg__"
        v-else
        :class="[isFull ? 'full__rg_content' : '']"
      >
        <text class="__ag__control_rg_line__"></text>
        <text class="__ag__control_rg_text__">正在直播</text>
      </div>
    </div>

    <!-- 投票图标 -->
    <image
      v-if="showVotes"
      :src="handleImgPath('topiao.png')"
      class="__ag__toupiao_img__"
      @click="__ag__onVote__"
    />

    <!-- 自定义控件 -->
    <ag-video-control
      v-if="src"
      :isPlay="isPlay"
      :state="state"
      :isFull="isFull"
      :fullDevice="fullDevice"
      :isLimpid="isLimpid"
      :isMute="isMute"
      :isVolume="isVolume"
      :isDanmu="isDanmu"
      :showDanmu="showDanmu"
      @play="onplay"
      @pause="onPause"
      @full="onFull"
      @limpid="changeLimpid"
      @refresh="onRefresh"
      @muted="onMuted"
      @changeKeyboard="changeKeyboard"
      @danmu="onDanmu"
      ref="__ag__control__"
    >
    </ag-video-control>

    <!-- 视频加载中 -->
    <div
      class="__ag__video_loading__"
      v-if="isVideoLoading"
      :style="loadingtyle"
    >
      <image
        resize="contain"
        :src="handleImgPath(logo)"
        class="__ag__logo__"
        :class="[env.id == 1 ? 'wl-logo' : '']"
      />
      <text class="__video_loading_text__">正在加载...</text>
      <image class="__video_loading_image__" :src="handleImgPath(line)"></image>
    </div>

    <!-- 分享 -->
    <ag-share :url="url" v-if="isShare" @close="onCloseShare"></ag-share>

    <!-- 投票 -->
    <ag-vote
      :tab="tab"
      :isVote="isVotes"
      :voteItem="voteItem"
      :keyboardSize="keyboardSize"
      :user="user"
      :roomId="roomId"
      :fullDevice="fullDevice"
      :isFull="isFull"
      @endMessageVote="__ag__endMessageVote__"
      @addMessageVote="addMessageVote"
      @voteClose="voteClose"
      @resultVote="resultVote"
      @full="onFull"
    >
    </ag-vote>
  </div>
</template>

<script>
import agVideoQuality from "./__ag__videoQuality__.vue"
import agVideoControl from "./__ag__videoControls__.vue"
import danmuList from "./__ag__danmuList__.vue"
import agShare from "./__ag__share__.vue"
import vote from "./__ag__vote__.vue"
import bc from "./__ag__bc__.js"
import util from "./util.js"
import env from "./env.js"
import agMinUrl from "./__ag__minurl__.js"
import agMinix from "./__ag__minix__.js"
import api from "./__ag__sport_api__.js"
const animation = weex.requireModule("animation")
const dom = weex.requireModule("dom")

export default {
  components: {
    "ag-video-quality": agVideoQuality,
    "ag-video-control": agVideoControl,
    "ag-danmu-list": danmuList,
    "ag-share": agShare,
    "ag-vote": vote,
  },
  mixins: [agMinUrl, agMinix],
  props: {
    src: {
      type: String,
      default: "",
    },
    fullDevice: {
      type: Object,
      default: function () {
        return { width: 0, height: 0 }
      },
    },
    user: {
      type: Object,
      default: function () {
        return {}
      },
    },
    full: {
      type: Boolean,
      default: false,
    },
    isDanmu: {
      type: Boolean,
      default: true,
    },
    showDanmu: {
      type: Boolean,
      default: true,
    },
    matchInfo: {
      type: Object,
      default: function () {
        return {}
      },
    },
    uid: {
      type: String,
      default: "",
    },
    roomId: {
      type: String,
      default: "",
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    showVote: {
      type: Boolean,
      default: false,
    },
    isVote: {
      type: Boolean,
      default: false,
    },
    voteItem: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      env,
      sourceUrl: this.src,
      state: "pause",
      controls: "nocontrols",
      isPlay: true,
      isFull: false,
      isHideBar: false,
      controlerShowTimer: "",
      isHdmi: false,
      isMute: false,
      keyboardSize: "0px",
      isVolume: false,
      isVideoLoading: false,
      liveUrl: "",
      logo: env.loadLogo,
      line: env.line,
      isVideoError: false,
      url: "",
      isShare: false,
      tab: "0",
      isVote: true,
      qrUrl: "",
    }
  },
  watch: {
    src(n, o) {
      this.sourceUrl = n
      if (n != o) {
        // this.onstart()
      }

      console.log(
        "@@ src changed videoeStyle=>",
        JSON.stringify(this.videoStyle)
      )
    },
    full(n) {
      this.isFull = n
    },
    isLoading(n) {
      this.isVideoLoading = n
    },
  },
  computed: {
    isAirplay() {
      let a = "agairplay"
      if (env.code == "hb8v2") {
        a = "hongairplayba"
      } else if (env.code == "zfv2") {
        a = "airplay"
      } else if (env.code == "xg") {
        a = "shuiairplayguo"
      } else {
        a = "agairplay"
      }
      return a
    },
    showVotes() {
      if (this.isFull && this.showVote) {
        return true
      }
      return false
    },
    isVotes() {
      if (this.isFull && this.isVote) {
        return true
      }
      return false
    },
    videoStyle() {
      let style = {}
      if (this.isFull) {
        style.height = "750px"
        // style.width = this.fullDevice.height.toFixed(2) + "px"
        style.width = Math.round(this.fullDevice.height / 10) * 10 + "px"
        // style.width = "1620px"
      } else {
        style.height = "421.875px"
        style.width = "750px"
      }
      return style
    },
    loadingtyle() {
      let style = {}
      if (this.isFull) {
        style.height = "750px"
        style.width = this.fullDevice.height.toFixed(2) + "px"
      } else {
        style.height = "421.875px"
        style.width = "750px"
      }
      return style
    },
    errortyle() {
      let style = {}
      if (this.isFull) {
        style.left = (this.fullDevice.height.toFixed(2) - 80) / 2 + "px"
        style.top = (750 - 140) / 2 + "px"
      } else {
        style.left = (750 - 80) / 2 + "px"
      }
      return style
    },
    isLimpid() {
      let user = this.user
      if (user && user.userType < 3) {
        return true
      }
      return false
    },
    hdmiLeft() {
      let style = {}
      let lf = this.fullDevice.height.toFixed(2) - 630
      if (this.isFull) {
        style.left = lf / 2 + "px"
        if (this.ivx) {
          style.transform = "rotate(90deg)"
          style.left = (375 - 264) / 2 + "px"
        }
      } else {
        style.left = "60px"
        if (this.ivx) {
          style.transform = "rotate(0deg)"
        }
      }

      return style
    },
    ipx() {
      let deviceModel = weex.config.env.deviceModel
      // if(deviceModel == 'x86_64'){
      // 	return false
      // }
      if (deviceModel >= "iPhone10,6") {
        if (deviceModel == "iPhone12,8") {
          return false
        }
        return true
      }
      if (deviceModel == "iPhone10,3") {
        return true
      }

      return false
    },
    controlStyle() {
      let style = {}
      if (this.isFull) {
        style.height = "40wx"
        style.width = this.fullDevice.height.toFixed(2) + "px"
      } else {
        style.height = "40wx"
        style.width = "750px"
      }

      return style
    },
  },
  destroyed() {
    this.state = "pause"
  },
  mounted() {
    this.isVideoLoading = this.isLoading
    this.changeBar()
    this.__ag__loadData__()
  },
  created() {
    this.isVolume = util.isVolume()
  },
  methods: {
    __ag__loadData__() {
      bc.onmessage("onplay", this.onplay)
      bc.onmessage("onPause", this.onPause)
      this.__ag__getShareUrl__()
    },
    __ag__getShareUrl__() {
      api
        .listMetaData({ label: "shareUrl" })
        .then((resp) => {
          if (resp.data && resp.data.length) {
            this.qrUrl = resp.data[0].value + "/pages/down/h5"
          }
        })
        .catch((res) => {})

      api
        .listMetaData({ label: "domain" })
        .then((resp) => {
          if (resp.data && resp.data.length) {
            let url = resp.data[0].value
            this.liveUrl = url + "/pages/live/live?from=index&uid=" + this.uid
          }
        })
        .catch((err) => {})
    },
    onstart(event) {
      this.state = "start"
      this.clearTimeout()
      this.changeBar()
      setTimeout(() => {
        this.$emit("changeLoading", false)
        if (this.state == "start" || this.state == "play") {
          this.isPlay = true
          this.$emit("playStatus", true)
        }
      }, 1000)
    },
    onplay() {
      this.state = "play"
      this.isPlay = true
      this.isVideoError = false
      this.clearTimeout()
      this.changeBar()
      this.$emit("playStatus", this.isPlay)
      this.$emit("changeLoading", false)
    },
    onPause() {
      this.state = "pause"
      this.isPlay = false
      this.$emit("playStatus", this.isPlay)
      this.clearTimeout()
      this.changeBar()
    },
    onRefresh() {
      this.isVideoError = false
      this.isHideBar = false
      this.$emit("refresh")
      this.clearTimeout()
      this.changeBar()
    },
    playFail() {
      this.state = "fail"
      this.isPlay = false
      this.clearTimeout()
      this.changeBar()
      this.$emit("playError")
      this.$emit("changeLoading", false)
      setTimeout(() => {
        this.isVideoError = true
      }, 200)
    },
    onMuted(m) {
      this.isMute = m > 0 ? false : true
    },
    onDanmu() {
      this.clearTimeout()
      this.changeBar()
    },
    onFull(f) {
      this.isFull = f == 1 ? true : false
      this.isHideBar = false
      bc.postMessage("changeFull", f)
    },
    cancelFull() {
      if (this.isFull) {
        bc.postMessage("changeFull", 0)
        util.setLandscape(0)
        return
      }
      this.$emit("close")
      // util.pop()
    },
    __ag__click__() {
      this.isHideBar = !this.isHideBar
      if (this.keyboardSize == "0px") {
        this.changeHideBar()
      }
      if (!this.isHideBar) {
        this.changeBar()
      }
      this.$emit("closeInput")

      let k = this.$refs.__ag__control__
      if (k) {
        k.hideKeyboard()
      }
    },
    changeLimpid(l) {
      if (l) {
        // util.message('您正畅享高清画质');
        this.isHdmi = true
        this.clearTimeout()
        return
      }
      this.isHdmi = false
      let q = this.$refs.quality
      if (q) {
        q.computeTime()
      }
      // this.clearTimeout()
    },
    changeHideBar() {
      let landscape = false
      let el = this.$refs.__ag__control__
      let y = this.isHideBar ? 100 : 0
      let cl = this.$refs.__ag__close__
      let cy = this.isHideBar ? -168 : 0
      landscape = util.isLandscape()
      if (landscape) {
        cy = this.isHideBar ? -168 : 0
      }

      if (el) {
        animation.transition(el, {
          styles: {
            transform: `translateY(${y}px)`,
            transformOrigin: "center center",
          },
          duration: 500, //ms
          timingFunction: "ease",
          delay: 0, //ms
        })
      }

      if (cl) {
        animation.transition(cl, {
          styles: {
            transform: `translateY(${cy}px)`,
            transformOrigin: "center center",
          },
          duration: 500, //ms
          timingFunction: "ease",
          delay: 0, //ms
        })
      }
      this.clearTimeout()
    },
    changeBar() {
      if (this.controlerShowTimer) {
        clearTimeout(this.controlerShowTimer)
      }
      this.controlerShowTimer = setTimeout(() => {
        this.isHideBar = true
        this.changeHideBar()
      }, 5000)
    },
    clearTimeout() {
      if (this.controlerShowTimer) {
        clearTimeout(this.controlerShowTimer)
      }
    },
    changeKeyboard(n) {
      this.keyboardSize = n
      if (n != "0px" && this.isFull) {
        this.isHideBar = false
        this.clearTimeout()
        return
      }
      this.changeBar()
    },
    onloading() {
      this.loadinging = true
    },
    // 分享链接
    async __ag__onShare__() {
      this.isShare = true
      let qrUrl = this.qrUrl
      let liveUrl = this.liveUrl
      let joinMap = this.matchInfo && this.matchInfo.joinMap
      let beginTime = util.dateFormat(this.matchInfo.beginTime)
      let name = joinMap.match && joinMap.match.name
      let time = util.formatTime(this.matchInfo.beginTime)
      let teamNamea = this.matchInfo.teamNamea || ""
      let teamNameb = this.matchInfo.teamNameb || ""
      let teamFlaga = this.matchInfo.teamFlaga || ""
      let teamFlagb = this.matchInfo.teamFlagb || ""
      let matchThumbImg = (joinMap.room && joinMap.room.thumb) || ""
      let amount = (joinMap.room && joinMap.room.amount) || 0
      let avatar = (joinMap.streamer && joinMap.streamer.avatar) || ""
      let userNicename =
        (joinMap.streamer && joinMap.streamer.userNicename) || ""

      console.log("util---", liveUrl)

      this.url =
        "./share.html?qrUrl=" +
        qrUrl +
        "&liveUrl=" +
        liveUrl +
        "&beginTime=" +
        beginTime +
        "&name=" +
        name +
        "&time=" +
        time +
        "&teamNamea=" +
        teamNamea +
        "&teamNameb=" +
        teamNameb +
        "&teamFlaga=" +
        teamFlaga +
        "&teamFlagb=" +
        teamFlagb +
        "&matchThumbImg=" +
        matchThumbImg +
        "&amount=" +
        amount +
        "&avatar=" +
        avatar +
        "&userNicename=" +
        userNicename +
        "&download=" +
        env.download
    },
    // 分享链接
    async __ag__onShares__() {
      if (this.liveUrl) {
        util.clipboard(this.liveUrl, () => {
          util.message("已复制链接，快去粘贴吧")
        })
        return
      }
      try {
        let resp = await api.listMetaData({ label: "domain" })
        if (resp.data && resp.data.length) {
          let url = resp.data[0].value
          this.liveUrl = url + "/pages/live/live?from=index&uid=" + this.uid
          util.clipboard(this.liveUrl, () => {
            util.message("已复制链接，快去粘贴吧")
          })
        }
      } catch (error) {
        util.message(error.message)
      }
    },
    __ag__handleDanmu__(item) {
      let dan = this.$refs.danmu
      if (dan) {
        dan.add(item)
      }
    },
    onCloseShare() {
      this.isShare = false
    },
    __ag__onVote__() {
      this.$emit("onVote")
    },
    __ag__endMessageVote__(item) {
      this.$emit("endMessageVote", item)
    },
    addMessageVote(item) {
      this.$emit("addMessageVote", item)
    },
    voteClose() {
      this.$emit("voteClose")
    },
    resultVote() {
      this.$emit("resultVote")
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__nvideo-main__ {
  flex: 1;
  position: relative;
  background-color: @black;
  z-index: 1001;
}
.__ag__video-box__ {
  flex: 1;
}
.__ag__video__ {
  // width: 750px;
  // height: 421.875px;
}
.__hdmi_popup__ {
  position: fixed;
  top: 630.875px;
  width: 630px;
  height: 264px;
  background-color: @white;
  border-radius: 8wx;
  left: 60px;
  align-items: center;
  padding-top: 10px;
  box-shadow: 5px 10px 10px @black40;
}
.__hdmi_text__ {
  width: 630px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}
.__hdmi_btn__ {
  width: 256px;
  height: 80px;
  line-height: 80px;
  border-radius: 8wx;
  text-align: center;
  font-weight: 600;
  font-size: 17wx;
  color: @white;
  background-color: @primary;
  margin-top: 42px;
}
.__hdmi_rotate__ {
  top: 243px;
}
.__hdmi_rotate_ivx__ {
  top: 685.875px;
}
.__video_close__ {
  font-size: 55px;
  padding: 15px;
  font-weight: bold;
  color: @white;
}
.__ag__video_loading__ {
  position: absolute;
  width: 750px;
  top: 0px;
  bottom: 0px;
  background-color: @black;
  align-items: center;
  justify-content: center;
}
.__video_loading_text__ {
  font-size: 24px;
  color: @white;
  text-align: center;
}
.__video_loading_image__ {
  width: 650px;
  height: 4px;
  margin-top: 20px;
}
.__ag__logo__ {
  width: 180px;
  height: 88px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.wl-logo {
  width: 200px;
  height: 60px;
}
.__ag__top_control__ {
  width: 750px;
  height: 80px;
  position: absolute;
  top: 0;
  /* background-color: rgba(0, 0, 0, 0.5); */
  /* transform: translateY(0px); */
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
}
.__ag__top_control_lf__ {
  flex: 1;
  flex-direction: row;
  align-items: center;
}
.__ag__top_title__ {
  flex-direction: row;
  align-items: center;
}
.__ag__title_text__ {
  font-style: normal;
  font-weight: 500;
  font-size: 12wx;
  color: @white;
}
.__ag__title_text_vs__ {
  margin-left: 10px;
  margin-right: 10px;
}

.__ag__top_control_rg__ {
  height: 80px;
  flex: 0.7;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 15px;
}
.__ag__control_rg_image__ {
  width: 80px;
  height: 80px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__rg_image__ {
  width: 30px;
  height: 30px;
}
.__ag__control_rg_line__ {
  width: 20px;
  height: 20px;
  border-radius: 50wx;
  background-color: @red2;
  margin-right: 10px;
}
.__ag__control_rg_text__ {
  font-style: normal;
  font-weight: 500;
  font-size: 12wx;
  letter-spacing: 0.05em;
  color: @white;
}
.full__lf_content {
  padding-left: 30wx;
}
.full__rg_content {
  padding-right: 30wx;
}
.__ag__video_error__ {
  position: absolute;
  width: 80px;
  height: 80px;
  top: 170px;
  bottom: 100px;
  background-color: @black40;
  align-items: center;
  justify-content: center;
}
.__video_error__ {
  font-size: 55px;
  color: @white;
  text-align: center;
}
.__ag__toupiao_img__ {
  width: 118px;
  height: 118px;
  position: absolute;
  right: 30px;
  bottom: 160px;
}
</style>
