<template>
  <div
    class="__ag__quality-main__"
    v-if="showQuality"
    :style="videoStyle"
    @click.stop=""
  >
    <div class="quality-mask" :style="videoStyle"></div>
    <div class="__ag__quality-content__">
      <div class="quality-close" :class="[isFull ? 'full-close' : '']">
        <div class="close-text">
          <text class="text-font">倒数</text>
          <text class="text-font text-time">{{ qualityTime }}</text>
          <text class="text-font">秒后关闭</text>
        </div>
        <div class="close-icon" @click.stop="close">
          <text class="agiconfont icon-close2">&#xe64e;</text>
        </div>
      </div>
      <div class="quality-box" :class="[isFull ? 'full-box' : '']">
        <text class="text-title">登录畅享超高清画质</text>
        <div class="quality-btn" :class="[isFull ? 'full-btn' : '']">
          <div class="btn-q btn-b" @click.stop="close">
            <text class="qu-t">标清</text>
          </div>
          <div class="btn-q btn-g" @click.stop="__ag__onLogin__">
            <text class="qu-t qu-s">高清</text>
          </div>
          <!-- <div class="quality-login">
						<div class="login-btn"><text class="btn-text">登录APP</text></div>
						<image class="logo-img" :src="__ag__url__('static/logo-5L.png')" mode="aspectFit"></image>
					</div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from "./util.js"
import agMinUrl from "./__ag__minurl__.js"
import agMinix from "./__ag__minix__.js"
import sport from "./__ag__sport__.js"
export default {
  mixins: [agMinUrl, agMinix],
  props: {
    fullDevice: {
      type: Object,
      default: function () {
        return { width: 0, height: 0 }
      },
    },
    isFull: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showQuality: false,
      qualityTime: 5,
      qualityInterval: 0,
      setIntervaling: 0,
      isOpen: false,
      userInfo: {},
    }
  },
  computed: {
    videoStyle() {
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
  },
  destroyed() {
    clearInterval(this.qualityInterval)
    clearInterval(this.setIntervaling)
  },
  methods: {
    __ag__loadData__() {
      let that = this
      this.userInfo = util.getItem("user")
      this.__ag__getCompute__()
      const Steve = new BroadcastChannel("onlogin")
      Steve.onmessage = function (event) {
        that.userInfo = event.data
        if (that.userInfo && that.userInfo.userType < 3) {
          that.showQuality = false
          clearInterval(that.qualityInterval)
          clearInterval(that.setIntervaling)
        }
        that.__ag__getCompute__()
      }
    },
    __ag__getCompute__() {
      if (!this.userInfo || this.userInfo.userType == 3) {
        this.isOpen = sport.showAppDownDate(this)
        if (this.isOpen) {
          this.computeTime()
          this.openInterval()
        } else {
          this.openInterval()
          if (this.qualityInterval) {
            clearInterval(this.qualityInterval)
            this.qualityInterval = 0
          }
        }
      }
    },
    openInterval() {
      let time = 10 * 60 * 1000
      // let time = 10 * 1000
      if (this.setIntervaling) {
        clearInterval(this.setIntervaling)
        this.setIntervaling = 0
      }
      this.setIntervaling = setInterval(() => {
        this.computeTime()
      }, time)
    },
    close() {
      this.showQuality = false
      this.qualityTime = 0
      clearInterval(this.qualityInterval)
      this.openInterval()
    },
    __ag__onLogin__() {
      this.showQuality = false
      this.$emit("full", 0)
      util.setLandscape(0)
      clearInterval(this.qualityInterval)
      clearInterval(this.setIntervaling)
      util.getPush("__ag__login__")
    },
    computeTime() {
      this.showQuality = true
      this.qualityTime = 5
      this.qualityInterval = setInterval(() => {
        this.qualityTime--
        if (this.qualityTime <= 0) {
          this.qualityTime = 0
          this.showQuality = false
          clearInterval(this.qualityInterval)
          this.openInterval()
        }
      }, 1000)
    },
  },
}
</script>
<style scoped lang="less">
@import "../style/theme.less";
.__ag__quality-main__ {
  width: 750px;
  height: 421.875px;
  position: absolute;
  top: 0;
  bottom: 0;
}
.__ag__quality-content__ {
  flex: 1;
  justify-content: center;
  align-items: center;
}
.quality-close {
  position: absolute;
  top: 20wx;
  right: 20wx;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.full-close {
  top: 50wx;
  right: 100wx;
}
.close-text {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.text-font {
  font-style: normal;
  font-weight: normal;
  font-size: 13wx;
  letter-spacing: 0.05em;
  color: @white;
}
.text-time {
  font-size: 20wx;
  font-weight: bold;
}
.close-icon {
  width: 24wx;
  height: 24wx;
  background-color: @white;
  border-radius: 50%;
  line-height: 24wx;
  margin-left: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-close2 {
  text-align: center;
  font-size: 24wx;
}
.quality-box {
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 40wx;
}
.full-box {
  margin-top: 25wx;
}
.quality-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 30wx;
}
.full-btn {
  margin-top: 50wx;
}
.text-title {
  font-style: normal;
  font-weight: 500;
  font-size: 15wx;
  line-height: 21wx;
  letter-spacing: 0.05em;
  color: @white;
}
.btn-q {
  width: 128wx;
  height: 40wx;
  border-radius: 4wx;
}
.btn-b {
  border-style: solid;
  border-width: 1px;
  border-color: @white;
  margin-right: 15wx;
}
.btn-g {
  border-style: solid;
  border-width: 1px;
  border-color: @primary;
  background-color: @primary;
  margin-left: 15wx;
}
.qu-t {
  font-style: normal;
  font-weight: 600;
  font-size: 17wx;
  line-height: 40wx;
  text-align: center;
  color: @white;
}
.quality-login {
  position: absolute;
  right: -34wx;
  top: -13wx;
}
.login-btn {
  width: 68wx;
  height: 25wx;
  background-color: @white;
  border-radius: 26wx;
}
.btn-text {
  flex: 1;
  font-size: 12wx;
  font-weight: 500;
  line-height: 25wx;
  text-align: center;
  color: @primary;
}
.logo-img {
  width: 24wx;
  height: 24wx;
  position: absolute;
  right: 60wx;
  top: -10wx;
}
.quality-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 750px;
  height: 421.875px;
  background-color: @black;
  opacity: 0.6;
}
.show {
  left: 0;
}
.hide {
  left: 750px;
}
</style>
