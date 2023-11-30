<template>
  <div class="__ag__luck_main__">
    <image :src="handleImgPath('lbg.png')" class="__ag__bg_image__" />
    <scroller class="scroller" :show-scrollbar="false">
      <div class="__ag__luck_content__" :class="[ipx ? 'luck-ipx' : '']">
        <div class="__ag__luck_title__">
          <div class="__ag__luck_lf__" @click="onNavback">
            <text class="agiconfont __ag__back__">&#xe61d;</text>
          </div>
          <div class="__ag__luck_cen__">
            <text class="__ag__cen_text__">抽奖</text>
          </div>
          <div class="__ag__luck_rg__" @click="onLuckRecord">
            <text class="agiconfont __ag__rg_text__" v-if="env.code == 'xg'"
              >&#xe6fc;</text
            >
            <text class="agiconfont __ag__rg_text__" v-else>&#xe6fa;</text>
            <text class="__ag__rg_text__">中奖记录</text>
          </div>
        </div>
        <image
          :src="handleImgPath('title.png')"
          class="__ag__fl_image__"
        ></image>
        <div class="__ag__win_box__" v-if="resultList && resultList.length > 0">
          <image
            :src="handleImgPath('zjbg.png')"
            class="__ag__zj_image__"
          ></image>
          <!-- <scroller class="__ag__box_list__" :show-scrollbar="false" scrollToBegin="false">
                        <div class="__ag__box_item__" v-for="(item) in resultList" :key="item.id" :ref="'luck-' + item.id">
                            <text class="__ag__item_text__">恭喜</text>
                            <text class="win-tips" v-if="item.userName">[{{item.userName}}]</text>
                            <text class="__ag__item_text__">抽中</text>
                            <text class="win-tips" v-if="item.awardName">[{{item.awardName}}]</text>
                            <text class="__ag__item_text__ win-time" v-if="item.winningTime">{{item.winningTime}}分钟前</text>
                        </div>
                    </scroller> -->
          <slider
            class="__ag__box_list__"
            show-indicators="true"
            interval="5000"
            auto-play="true"
          >
            <div
              class="__ag__box_item__"
              v-for="item in resultList"
              :key="item.id"
              :ref="'luck-' + item.id"
            >
              <text class="__ag__item_text__">恭喜</text>
              <text
                class="win-tips"
                v-if="item.userName"
                :class="[item.userName.length > 10 ? 'win-tips-name' : '']"
                >[{{ item.userName }}]</text
              >
              <text class="__ag__item_text__">抽中</text>
              <text
                class="win-tips"
                v-if="item.awardName"
                :class="[item.awardName.length > 10 ? 'win-tips-name' : '']"
                >[{{ item.awardName }}]</text
              >
              <text class="__ag__item_text__ win-time" v-if="item.winningTime"
                >{{ item.winningTime }}分钟前</text
              >
            </div>
          </slider>
        </div>
        <div
          class="__ag__luck_turntable__"
          :class="[
            !listAward || !listAward.length
              ? '__ag__luck_turntable_none__'
              : '',
          ]"
        >
          <div
            class="__ag__turntable_box__"
            v-if="listAward && listAward.length"
          >
            <div
              class="__ag__turntable_item__"
              v-for="(item, index) in list2"
              :key="item.id"
              :class="[
                index == 1 || index == 4 || index == 7
                  ? '__ag__turntable_maring__'
                  : '',
                index == 6 || index == 7 || index == 8
                  ? '__ag__turntable_bot__'
                  : '',
              ]"
            >
              <div
                class="__ag__items_box__"
                v-if="item.id"
                :class="[activeIndex == item.index ? 'active' : '']"
              >
                <image
                  v-if="item.name != '谢谢参与'"
                  :src="__ag__url__(item.logo)"
                  class="turntable-image"
                ></image>
                <image
                  v-else
                  :src="handleImgPath('xxhg.png')"
                  class="turntable-image"
                ></image>
                <text
                  class="turntable-text"
                  :class="[item.name.length > 6 ? 'turntable-text-tow' : '']"
                  >{{ item.name }}</text
                >
                <!-- <div v-else class="turntable-box">
                                    <lamp :id="item.id" :item="item"></lamp>
                                </div> -->
              </div>
              <div class="__ag__items_box__ box-btn" v-else @click="onLuck">
                <text class="btn-text text-font">{{ item.text }}</text>
                <text class="btn-text">剩余{{ luckNumber }}次</text>
              </div>
            </div>
          </div>
        </div>
        <div class="__ag__luck_bottom__">
          <text class="__bot_btn__" @click="onTasks">做任务</text>
          <div class="__bot_btn_cen__" @click="onLuck">
            <image
              class="__btn_image__"
              :src="handleImgPath('cj-btn.png')"
            ></image>
          </div>
          <text class="__bot_btn__" @click="onActivity">活动规则</text>
        </div>
        <div
          class="__invitation__box__"
          :class="[isShare ? 'invitation-box-end' : '']"
          @click="onInvitation"
        >
          <text
            class="__invitation__text__"
            :class="[isShare ? '__invitation__text__end__' : '']"
            >{{ shareText }}</text
          >
        </div>
      </div>
    </scroller>

    <!-- 助手 -->
    <div
      class="assistant-box"
      :style="assistStyle"
      @click.stop="onAssistant"
      @touchstart="handleStart"
      @touchend="handleEnd"
      @touchmove="handleMove"
    >
      <image
        class="assistant-image"
        :src="__ag__url__(`static/a3/${env.brand}-zs.png`)"
      ></image>
    </div>

    <!-- 抽奖结果 -->
    <ag-popup
      class="__ag__lives_popup__"
      v-if="luckModal"
      :isAnimate="luckModal"
    >
      <div class="luck-modal">
        <image class="modal-bg" :src="handleImgPath('bg.png')"></image>
        <text class="__receive__text" v-if="receive.awardId"
          >恭喜您 中奖了！</text
        >
        <text class="__receive__text" v-else>很遗憾 未中奖</text>
        <image
          v-if="receive.awardId"
          ref="receive"
          class="receive-image"
          style="
            width: 400px;
            height: 392px;
            margin-top: 40px;
            margin-bottom: 40px;
          "
          :src="__ag__url__(receive.logo)"
        ></image>

        <image
          v-if="!receive.awardId && this.luckNumber != 0"
          ref="receive"
          class="receive-image"
          style="width: 422px; height: 412px"
          :src="handleImgPath('nozj1.png')"
        ></image>

        <image
          v-if="!receive.awardId && this.luckNumber == 0"
          style="width: 422px; height: 412px"
          :src="handleImgPath('nozj2.png')"
        ></image>

        <text class="receive-btn" @click.stop="onReceive">{{
          receiveText
        }}</text>
      </div>
      <image
        class="__close__image__"
        @click="luckModal = false"
        :src="handleImgPath('popup-close.png')"
      ></image>
    </ag-popup>

    <!-- 抽奖次数用完弹窗 -->
    <ag-popup
      class="__ag__lives_popup__"
      v-if="signModal"
      :isAnimate="signModal"
    >
      <div class="luck-modal">
        <image class="modal-bg" :src="handleImgPath('bg.png')"></image>
        <text class="__receive__text">很遗憾</text>
        <text class="__receive__text">您已经没有抽奖次数</text>
        <image
          style="width: 430px; height: 426px"
          :src="handleImgPath('jsrw.png')"
        ></image>

        <text class="receive-btn" @click.stop="onTasks">去做任务</text>
      </div>
      <image
        class="__close__image__"
        @click="signModal = false"
        :src="handleImgPath('popup-close.png')"
      ></image>
    </ag-popup>

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

    <!-- 分享弹窗 -->
    <ag-activite-share
      :url="url"
      v-if="showShare"
      @close="onCloseShare"
    ></ag-activite-share>
  </div>
</template>

<script>
import sport from "./components/__ag__sport__.js"
import env from "./components/env.js"
import __ag__sport_api__ from "./components/__ag__sport_api__.js"
import util from "./components/util.js"
import agMinUrl from "./components/__ag__minurl__.js"
import agMinix from "./components/__ag__minix__.js"
import lamp from "./components/__ag__lamp__.vue"
import agPopup from "./components/__ag__popup__.vue"
import agActiviteShare from "./components/__ag__activiteShare__.vue"
const animation = weex.requireModule("animation")
export default {
  mixins: [agMinix, agMinUrl], // 使用mixin
  components: {
    lamp,
    agPopup,
    "ag-activite-share": agActiviteShare,
  },
  data() {
    return {
      env,
      winMove: false,
      resultList2: [],
      resultList: [],
      currentIndex: 0,
      listAward: [],
      activeIndex: null,
      receive: {},
      isShare: false,
      luckNumber: 0,
      loading: false,
      user: {},
      luckModal: false,
      signModal: false,
      timer: false,
      assistantModal: false,
      qrUrl: "",
      url: "",
      showShare: false,
      interTimer: false,
      tmpName: "",
      move: {
        x: 10,
        y: undefined,
      },
      isPress: false,
    }
  },
  computed: {
    list2() {
      let list = this.listAward.reverse()
      let ary = list.map((item, index) => {
        switch (index) {
          case 3:
            return {
              ...this.listAward[7],
              index: 7,
            }
          case 4:
            return {
              ...this.listAward[3],
              index: 3,
            }
          case 5:
            return {
              ...this.listAward[6],
              index: 6,
            }
          case 6:
            return {
              ...this.listAward[5],
              index: 5,
            }
          case 7:
            return {
              ...this.listAward[4],
              index: 4,
            }

          default:
            return {
              ...item,
              index: index,
            }
        }
      })
      return ary
        .slice(0, 4)
        .concat({ id: undefined, text: "抽奖" })
        .concat(ary.slice(4))
    },
    shareText() {
      if (this.isShare) {
        return "今日次数已经用完了 明天继续"
      }
      return "邀请好友，赢取3次抽奖机会"
    },
    receiveText() {
      if (this.receive && this.receive.awardId) {
        return "联络助理，加速提现"
      }
      if (this.receive && !this.receive.awardId) {
        if (this.luckNumber) {
          return "再抽一次"
        }
        return "领取抽奖次数"
      }
      return ""
    },
    assistStyle() {
      let style = {}
      if (this.move.y) {
        style.top = this.move.y.toFixed(0) + "px"
        style.left = this.move.x.toFixed(0) + "px"
      }
      return style
    },
  },
  mounted() {},
  created() {
    // setInterval(()=> {
    //     let length = this.resultList.length
    //     this.currentIndex ++
    //     if (this.currentIndex == length) {
    //         this.currentIndex = 0
    //     }
    //     let id = this.resultList[this.currentIndex].id
    //     this.__ag__goLuckScroll__(id)
    // },1000)
  },
  destroyed() {
    if (this.timer) {
      this.timer = null
      clearTimeout(this.timer)
    }
    clearInterval(this.resultTimer)
    clearInterval(this.interTimer)
  },

  methods: {
    async __ag__loadData__() {
      let that = this
      // 获取用户信息
      this.user = util.getItem("user")

      // 用户登录
      const Steve = new BroadcastChannel("onlogin")
      Steve.onmessage = async function (event) {
        that.__ag__login__(event.data)
        // 获取抽奖次数
        that.getInfoUserStat()
        // 获取用户做任务进度
        that.getPageUserActivity()
      }
      // 获取中奖的用户
      this.getPageAwardResultList()
      // 获取奖品
      this.getPageAward()
      // 获取抽奖次数
      this.getInfoUserStat()
      // 获取用户做任务进度
      this.getPageUserActivity()
      // 获取分享的二维码地址
      this.getQrUrl()
    },
    async __ag__login__(data) {
      this.user = data
    },
    async getPageAwardResultList() {
      try {
        let resp = await __ag__sport_api__.pageAwardResultList({ size: 10 })
        if (!resp.data || !resp.data.list || !resp.data.list.length) {
          this.resultList = []
          this.resultList2 = []
          return
        }

        resp.data.list.forEach((item) => {
          let randNum = Math.floor(Math.random() * 15) + 1
          item.winningTime = randNum
        })

        this.resultList = resp.data.list
      } catch (error) {
        util.message(error.message)
      }
    },
    async getPageAward() {
      try {
        let resp = await __ag__sport_api__.pageAward()
        if (!resp.data || !resp.data.list || !resp.data.list.length) {
          this.listAward = []
          return
        }
        let list = resp.data.list
        let length = resp.data.list.length
        if (list && list.length > 7) {
          list = list.splice(0, 7)
        }
        let len = 8 - list.length

        for (let i = 1; i <= len; i++) {
          let f = {}
          let id = length + i
          f.id = id
          f.name = "谢谢参与"
          f.logo = "../static/a3/xxhg.png"
          list.unshift(f)
        }
        this.listAward = list
      } catch (error) {
        util.message(error.message)
      }
    },
    async getInfoUserStat() {
      try {
        let resp = await __ag__sport_api__.infoUserStat()
        if (!resp.data || !resp.data.awardAmount) {
          this.luckNumber = 0
          return
        }
        this.luckNumber = resp.data.awardAmount
      } catch (error) {}
    },
    async getPageUserActivity() {
      try {
        let resp = await __ag__sport_api__.pageUserActivity()
        if (!resp.data || !resp.data.list || !resp.data.list.length) {
          this.isShare = false
          return
        }
        let list = resp.data.list
        for (let i in list) {
          let r = list[i]
          if (r.type == 2) {
            if (r && r.joinMap && r.joinMap.stat && r.joinMap.stat.amount) {
              this.isShare = true
            }
          }
        }
      } catch (error) {}
    },
    getQrUrl() {
      __ag__sport_api__
        .listMetaData({ label: "downUrl" })
        .then((resp) => {
          if (resp.data && resp.data.length) {
            let ref = sport.getRef()
            let value = resp.data[0].value
            let q = value.indexOf("?") == -1 ? "?" : "&"
            let url = value + q + "From=" + ref
            this.qrUrl = url
          }
        })
        .catch((res) => {})
    },
    __ag__goLuckScroll__(id) {
      let dom = undefined
      if (!dom) {
        dom = weex.requireModule("dom")
      }
      let currentId = "luck-" + id
      let indicator = this.$refs[currentId][0]
      // 滚动正在直播
      if (indicator) {
        let el = indicator
        dom.scrollToElement(el, {})
      }
    },
    onNavback() {
      util.pop()
    },
    onLuckRecord() {
      util.getPush("__ag__wodejiangpin__")
    },
    async onLuck() {
      if (this.loading) {
        return
      }
      if (!this.user || !this.user.userType || this.user.userType == 3) {
        util.getPush("__ag__login__")
        return
      }
      if (!this.luckNumber) {
        this.signModal = true
        return
      }
      this.receive = {}
      this.luckModal = false
      this.tmpName = ""
      this.loading = true
      this.activeIndex = 0
      let interval = setInterval(() => {
        this.startView()
      }, 100)
      this.timer = setTimeout(async () => {
        try {
          let resp = await __ag__sport_api__.editUserAward()
          this.luckNumber--
          if (resp.data) {
            this.receive = resp.data
            if (resp.data.status == 1 && resp.data.awardId) {
              this.tmpName = resp.data.awardName
            } else {
              this.tmpName = "谢谢参与"
            }
            clearInterval(interval)
            this.interTimer = setInterval(() => {
              this.startView()
            }, 300)
          } else {
            this.receive = {}
            this.tmpName = "谢谢参与"
            clearInterval(interval)
            this.interTimer = setInterval(() => {
              this.startView()
            }, 300)
          }
        } catch (error) {
          clearInterval(interval)
          this.loading = false
          util.message(error.message)
        }
      }, 2000)
    },
    startView() {
      let n = this.activeIndex + 1
      this.activeIndex = n % 8
      if (this.tmpName) {
        if (this.listAward[this.activeIndex].name == this.tmpName) {
          clearInterval(this.interTimer)
          this.loading = false
          this.luckModal = true
          setTimeout(() => {
            let el = this.$refs.receive
            if (el) {
              animation.transition(el, {
                styles: {
                  transform: "scale(1)",
                  transformOrigin: "center center",
                },
                duration: 300, //ms
                timingFunction: "linear",
                delay: 0, //ms
              })
            }
          }, 250)
        }
      }
    },
    onReceive() {
      if (this.receive && this.receive.awardId) {
        this.liaisonAssistant()
      } else {
        if (this.luckNumber) {
          // 再抽一次
          this.onLuck()
          return
        } else {
          this.luckModal = false
          util.getPush("__ag__renwuzhongxin__")
        }
      }
    },
    onTasks() {
      this.signModal = false
      util.getPush("__ag__renwuzhongxin__")
    },
    onActivity() {
      util.getPush("__ag__activityRules__")
    },
    onInvitation() {
      if (!this.user || !this.user.userType || this.user.userType == 3) {
        util.getPush("__ag__login__")
        return
      }
      if (this.isShare) {
        return
      }
      this.showShare = true
      this.url =
        "./activiteShare.html?qrUrl=" + this.qrUrl + "&download=" + env.download
    },
    liaisonAssistant() {
      this.luckModal = false
      this.onAssistant()
    },
    async onAssistant() {
      if (!this.user || !this.user.userType || this.user.userType == 3) {
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
      f.uid = this.user.id
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
    onCloseShare() {
      this.showShare = false
    },
    handleStart(e) {
      setTimeout(() => {
        this.isPress = true
      }, 200)
    },
    handleEnd(e) {
      this.isPress = false
    },
    handleMove(e) {
      if (!this.isPress) {
        return
      }
      this.setInfo(e)
    },
    setInfo(e) {
      let move = {}
      if (Array.isArray(e.changedTouches)) {
        e.changedTouches.forEach((item) => {
          move.x = item.pageX - 70
          move.y = item.pageY - 70
        })
      }
      this.move = move
    },
  },
}
</script>

<style lang="less" scoped>
@import "./style/theme.less";

.__ag__luck_main__ {
  width: 750px;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: @white;
}
.scroller {
  flex: 1;
  overflow: hidden;
  margin-top: 78px;
}
.__ag__bg_image__ {
  width: 750px;
  position: absolute;
  top: 78px;
  right: 0;
  bottom: 0;
  left: 0;
}
.__ag__luck_content__ {
  width: 750px;
  padding-left: 16px;
  padding-right: 16px;
  align-items: center;
  padding-bottom: 68px;
  overflow: hidden;
}
.__ag__luck_title__ {
  width: 700px;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: @white;
  margin-top: 17px;
  padding-left: 9px;
  padding-right: 9px;
}
.__ag__luck_lf__ {
  width: 120px;
  height: 80px;
  display: flex;
  justify-content: center;
}
.__ag__back__ {
  font-size: 25wx;
  color: @white;
}
.__ag__luck_cen__ {
  flex: 1;
}
.__ag__cen_text__ {
  font-style: normal;
  font-weight: 600;
  font-size: 25wx;
  letter-spacing: 0.7px;
  text-align: center;
  color: @white;
}
.__ag__luck_rg__ {
  width: 120px;
  flex-direction: row;
  justify-content: flex-end;
}
.__ag__rg_text__ {
  font-style: normal;
  font-weight: 500;
  font-size: 14wx;
  letter-spacing: 0.7px;
  color: @white;
  margin-left: 3px;
}
.__ag__fl_image__ {
  width: 680px;
  height: 276px;
  margin-top: 15px;
}
.__ag__win_box__ {
  height: 56px;
  width: 718px;
  margin-top: 20px;
  position: relative;
  // overflow: hidden;
}
.__ag__zj_image__ {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.__ag__box_list__ {
  width: 718px;
  height: 56px;
  line-height: 56px;
}
.__ag__box_item__ {
  width: 718px;
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__item_text__ {
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  letter-spacing: 1px;
  color: @white;
  margin-left: 2px;
  margin-right: 2px;
}
.win-tips {
  color: @yellow21;
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  letter-spacing: 1px;
  margin-left: 2px;
  margin-right: 2px;
  overflow: hidden;
  lines: 1;
  text-overflow: ellipsis;
}
.win-tips-name {
  width: 200px;
}
.win-time {
  margin-left: 30px;
}
.__ag__luck_turntable__ {
  width: 718px;
  margin-top: 26px;
  background-image: linear-gradient(to top, @yellow16, @yellow17);
  border-radius: 40px;
  padding: 14px;
}
.__ag__luck_turntable_none__ {
  height: 684px;
}
.__ag__turntable_box__ {
  background-color: @red6;
  border-radius: 40px;
  padding: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.__ag__turntable_item__ {
  width: 203px;
  height: 203px;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
}
.__ag__turntable_maring__ {
  margin-left: 20px;
  margin-right: 20px;
}
.__ag__turntable_bot__ {
  margin-bottom: 5px;
}
.__ag__items_box__ {
  width: 203px;
  height: 203px;
  background-color: @white;
  box-shadow: 0px 2.5px 0px @gray44;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box-btn {
  background-image: linear-gradient(to top, @primary, @primaryLinearEnd);
  box-shadow: 0px 7px 0px @orange7;
  border-radius: 32px;
  justify-content: center;
}
.btn-text {
  font-style: normal;
  font-weight: 400;
  font-size: 14wx;
  text-align: center;
  letter-spacing: 2px;
  color: @red28;
}
.text-font {
  font-size: 32wx;
  font-weight: bold;
  margin-bottom: 5px;
}
.turntable-image {
  width: 122px;
  height: 122px;
  margin-top: 12px;
}
.turntable-text {
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
  font-style: normal;
  font-weight: 500;
  font-size: 13wx;
  letter-spacing: 0.02em;
  color: @red6;
  line-height: 60px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.turntable-text-tow {
  line-height: 30px;
  lines: 2;
  text-overflow: ellipsis;
}
.turntable-box {
  width: 185px;
  padding-left: 10px;
  padding-right: 10px;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
}
.__ag__luck_bottom__ {
  width: 686px;
  padding-left: 32px;
  padding-right: 32px;
  margin-top: 32px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
}
.__bot_btn__ {
  width: 170px;
  height: 72px;
  line-height: 72px;
  background-image: linear-gradient(to bottom, @red29, @red30);
  box-shadow: 2px 5px 8px @red31;
  border-radius: 16px;
  font-style: normal;
  font-weight: 400;
  font-size: 16wx;
  text-align: center;
  letter-spacing: 2px;
  color: @white;
  text-shadow: 2px 2px 0px @black25;
  margin-bottom: 12px;
}
.__bot_btn_cen__ {
  height: 130px;
  width: 196px;
  margin-left: 50px;
  margin-right: 40px;
}
.__btn_image__ {
  width: 196px;
  height: 130px;
}
.__invitation__box__ {
  width: 600px;
  padding-left: 75px;
  padding-right: 75px;
  height: 81px;
  background-color: @red32;
  box-shadow: 4px 4px 8px @black15;
  border-radius: 40px;
  border-style: solid;
  border-width: 2px;
  border-color: @yellow20;
  text-align: center;
  margin-top: 50px;
}
.__invitation__text__ {
  font-style: normal;
  font-weight: 400;
  font-size: 16wx;
  text-align: center;
  letter-spacing: 0.7px;
  color: @white;
  line-height: 81px;
}
.invitation-box-end {
  background: @gray52;
  box-shadow: 4px 4px 8px @black15;
  border-radius: 40px;
}
.__invitation__text__end__ {
  color: @gray17;
}
.active {
  background-color: @yellow18;
  box-shadow: 0px 2.5px 0px @yellow18;
}
.awardActive {
  background-color: @yellow18;
  box-shadow: 0px 2.5px 0px @yellow18;
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
.modal-bg {
  width: 750px;
  position: absolute;
  top: 0px;
  bottom: -100px;
}
.__receive__text {
  font-style: normal;
  font-weight: 400;
  font-size: 18wx;
  text-align: center;
  letter-spacing: 0.02em;
  color: @white;
  line-height: 50px;
}
.receive-btn {
  height: 82px;
  margin-top: 20px;
  background-image: linear-gradient(to right, @primary, @primaryLinearEnd);
  box-shadow: 6px 6px 8px @black25, 0px 2.5px 0px @red27;
  border-radius: 40px;
  font-style: normal;
  font-weight: 400;
  font-size: 20wx;
  line-height: 82px;
  text-align: center;
  letter-spacing: 2px;
  color: @white;
  text-shadow: 1px 1px 0px @red25;
  padding-left: 40px;
  padding-right: 40px;
}
.__close__image__ {
  width: 60px;
  height: 60px;
  margin-top: 30px;
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
  height: 168px;
}
.receive-image {
  transform: scale(0.1);
}
</style>
