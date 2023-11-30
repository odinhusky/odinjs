<template>
  <div class="__ag__jiangpin-container__">
    <ag-hbtitle :isback="true" title="中奖记录"></ag-hbtitle>

    <scroller
      class="__ag__prize-record__"
      show-scrollbar="false"
      :style="{ height: `${realHeight}px` }"
      v-if="prizeList.length > 0"
    >
      <ag-prizeItem
        v-for="item in prizeList"
        :key="item.id"
        :icons="item.logo"
        :done="item.status"
        :title="item.awardName"
        :des="item.status == 1 ? '请联系主播或助理领取！' : '您的奖品已发放'"
        :time="item.addTime"
        @getPrize="toGet"
      ></ag-prizeItem>

      <div class="__ag__helper__" @click="getDraw">
        <image class="__ag__helperimg__" :src="handleImgPath('zs.png')"></image>
      </div>
    </scroller>
    <div class="__ag__show-nopic__" v-if="showPic">
      <div class="norecord-box">
        <image :src="handleImgPath('norecord3.png')" class="no-record-img" />
        <text class="norecord-text">暂时还没奖品</text>
      </div>

      <div class="kbs-box" @click="goWatch">
        <text class="kbs-text">看比赛 赢大奖</text>
      </div>
    </div>

    <!-- 转接小助手弹窗 -->
    <ag-popup
      class="__ag__lives_popup__"
      v-if="assistantModal"
      :isAnimate="assistantModal"
    >
      <div class="luck-modal">
        <div class="logo-box" v-if="env.brand == '5'">
          <image
            style="width: 154px; height: 154px; margin-top: -30px"
            :src="handleImgPath('5l3-logo.png')"
          ></image>
        </div>
        <!-- 找不到這張圖QAQ -->
        <image
          v-if="env.brand == 'bl'"
          style="width: 154px; height: 168px; margin-top: -30px"
          :src="handleImgPath('bl-zs.png')"
        ></image>

        <div class="assistant-tips">
          <text
            class="agiconfont assistant-icon"
            ref="loading"
            v-if="env.code == 'xg'"
            >&#xe631;</text
          >
          <text class="agiconfont assistant-icon" ref="loading" v-else
            >&#xe7f1;</text
          >
          <text class="assistant-text">正在为您转接</text>
        </div>
      </div>
    </ag-popup>
  </div>
</template>

<script>
import HbTitle from "./components/__ag__headTop__.vue"
import util from "./components/util.js"
import env from "./components/env.js"
import __ag__sportApi__ from "./components/__ag__sport_api__.js"
import prizeItem from "./components/__ag__prizeItem__.vue"
import minurl from "./components/__ag__minurl__.js"
import agMinix from "./components/__ag__minix__.js"
import agPopup from "./components/__ag__popup__.vue"
const animation = weex.requireModule("animation")
export default {
  mixins: [minurl, agMinix],
  components: {
    "ag-hbtitle": HbTitle,
    "ag-prizeItem": prizeItem,
    agPopup,
  },
  data() {
    return {
      env,
      name: "中奖记录",
      hasPrize: true,
      talk: false,
      prizeList: [],
      loading: false,
      showPic: false,
      realHeight:
        (weex.config.env.deviceHeight / weex.config.env.deviceWidth) * 750 -
        198,
      assistantModal: false,
      user: {},
    }
  },
  created() {
    this.user = util.getItem("user")
    this.listMyPrizes()
  },
  methods: {
    async getDraw() {
      if (!this.user || this.user.userType == 3) {
        util.getPush("__ag__login__")
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true
      this.assistantModal = true
      this.__ag__animation__()
      let f = {}
      f.friendId = "-1"
      f.uid = this.user && this.user.id
      f.remark = env.hard + "小助手"

      try {
        let resp = await this.__ag__editFriend__(f)
        if (resp && resp.success) {
          this.loading = false
          let n = resp.data
          let params = {
            type: 3,
            friendId: n.id,
            uid: n.friendId,
          }
          util.getPush("__ag__chat__", params)
          this.assistantModal = false
        }
      } catch (err) {
        this.loading = false
        this.assistantModal = false
        util.message(err.message)
      }
    },
    toGet() {
      this.getDraw()
    },
    listMyPrizes() {
      __ag__sportApi__
        .pageAwardResult()
        .then((res) => {
          this.prizeList = res.data.list

          this.prizeList = this.prizeList.filter((item) => {
            return item.status && item.status != 0
          })
          if (this.prizeList.length <= 0) {
            this.showPic = true
          }
        })
        .catch((err) => {
          this.showPic = true
          util.message(err.message)
        })

      // this.prizeList = res.list.filter(item=>{
      // 	return item.status!=0
    },
    goWatch() {
      if (!this.user || this.user.userType == 3) {
        util.getPush("__ag__login__")
        return
      }
      util.getPush("__ag__luckDraw__")
      // __ag__sportApi__.listUsersLive().then(res=>{
      //     // let liveId = res.data[0].uid
      //     util.getPush('luckDraw')
      //   }).catch(err=>{
      //     util.message(err.message)
      //   })
    },
    __ag__animation__() {
      setTimeout(() => {
        let el = this.$refs.loading
        if (el) {
          animation.transition(el, {
            styles: {
              transform: "rotate(7200deg)",
              transformOrigin: "center center",
            },
            duration: 10000, //ms
            timingFunction: "linear",
            delay: 100, //ms
          })
        }
      }, 100)
    },
  },
}
</script>

<style lang="less" scoped>
@import "./style/theme.less";
.__ag__jiangpin-container__ {
  position: relative;
  width: 750px;
  background-color: @gray12;
}
.__ag__show-nopic__ {
  position: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 198px;
  width: 750px;
  height: 628px;
}
.no-record-img {
  width: 81wx;
  height: 81wx;
}
.__ag__prize-record__ {
  position: fixed;
  width: 750px;
  top: 198px;
  background-color: @gray12;
  margin-left: 16wx;
  margin-right: 16wx;
}
.__ag__helper__ {
  position: fixed;
  top: 451wx;
  left: 16wx;
}
.__ag__helperimg__ {
  width: 62wx;
  height: 69wx;
  z-index: 99999;
}
.__ag__lives_popup__ {
  width: 750px;
  background-color: @black75;
  position: fixed;
  top: 0px;
  bottom: 0px;
  align-items: center;
  justify-content: center;
}
.luck-modal {
  width: 635px;
  padding-top: 40px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding-bottom: 20px;
}
.logo-box {
  width: 154px;
  height: 154px;
  background-color: @white;
  border-radius: 50wx;
  border-style: solid;
  border-width: 5px;
  border-color: @gray53;
  align-items: center;
}
.assistant-tips {
  width: 500px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
}
.assistant-text {
  font-style: normal;
  font-weight: 500;
  font-size: 17wx;
  line-height: 48px;
  color: @white;
  text-shadow: 0px 2px 4px @black50;
}
.assistant-icon {
  color: @white;
  font-size: 20wx;
  margin-right: 15px;
}
.assistant-box {
  width: 154px;
  height: 154px;
  position: fixed;
  bottom: 306px;
  left: 10px;
}
.assistant-image {
  width: 154px;
  height: 154px;
}
.kbs-box {
  width: 686px;
  height: 80px;
  margin-top: 86px;
  border-radius: 72px;
  border-style: solid;
  border-width: 1wx;
  border-color: @primary;
  justify-content: center;
  align-items: center;
}
.kbs-text {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 600;
  font-size: 17wx;
  line-height: 24wx;
  color: @primary;
}
.norecord-box {
  justify-content: cneter;
  align-items: center;
}
.norecord-text {
  font-style: normal;
  font-weight: 500;
  font-size: 14wx;
  line-height: 20wx;
  color: @gray56;
  font-family: "PingFang SC";
}
</style>
