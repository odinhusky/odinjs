<template>
  <div class="__ag__renwu-container__">
    <ag-hbtitle :isback="true" title="任务中心"></ag-hbtitle>

    <div class="__ag__daily-box__">
      <div class="__ag__daily-title-box__">
        <text class="__ag__daliy-title__">每日签到 赢抽奖次数</text>
      </div>
      <div class="__ag__sign-box__">
        <ag-dailyTask
          v-for="item in daySignList"
          :logo="item.logo"
          :times="item.award"
          :day="item.day"
          :today="item.today"
          :complete="item.complete"
          :key="item.day"
          @clickSign="toSign"
        ></ag-dailyTask>
      </div>
    </div>
    <scroller class="__ag__task-scroller__" show-scrollbar="false">
      <div
        class="__ag__task-box__"
        @touchstart="touchStart"
        @touchend="touchEnd"
      >
        <div class="__ag__task-tab__">
          <div class="__ag__daily-title__" @click="tab = 1">
            <text
              class="__ag__daily-text__"
              :class="[tab == 1 ? 'task-active' : '']"
              >每日任务</text
            >
            <div :class="[tab == 1 ? 'active-bar' : '']"></div>
          </div>
          <div class="__ag__system-title__" @click="tab = 2">
            <text
              class="__ag__system-text__"
              :class="[tab == 2 ? 'task-active' : '']"
              >系统任务</text
            >
            <div :class="[tab == 2 ? 'active-bar' : '']"></div>
          </div>
        </div>
        <!-- 圆形进度条 -->

        <div
          class="__ag__task-circle__"
          :class="[tab == 2 ? '__ag__not-show__' : '__ag__show__']"
        >
          <div class="__ag__left__">
            <div
              class="__ag__circle-left__"
              :style="{ transform: `rotate(${ldeg}deg)` }"
            ></div>
          </div>
          <div class="__ag__right__">
            <div
              class="__ag__circle-right__"
              :style="{ transform: `rotate(${rdeg}deg)` }"
            ></div>
          </div>
          <div class="__ag__circle-inner__">
            <div class="__ag__inner-img__">
              <image
                :src="__ag__url__('static/shijiebei/playicon.png')"
                class="__ag__inner-icon__"
              ></image>
            </div>
            <div class="__ag__inner-text__">
              <text class="__ag__inner-text-watch__">已连续观看直播</text>
              <text class="__ag__inner-text-time__">{{ watchTime }}分钟</text>
            </div>
          </div>
        </div>
        <!-- 任务列表 -->

        <div class="__ag__task-list__" v-if="tab == 1">
          <ag-taskItem
            v-for="(item, index) in dailyList"
            :icons="item.logo"
            :times="item.award ? item.award : 1"
            :title="item.name"
            :des="item.remark"
            :done="
              item.joinMap.stat && item.joinMap.stat.status
                ? item.joinMap.stat.status
                : 0
            "
            :everyAmount="item.everyAmount"
            :amount="item.joinMap.stat ? item.joinMap.stat.amount : 0"
            :border="index == dailyList.length - 1 ? 1 : 0"
            :activityType="item.type"
            :id="item.id"
            :key="item.id"
            :postId="item.joinMap.stat ? item.joinMap.stat.id : ''"
            :user="user"
            :daily="1"
            @click="myClick"
          ></ag-taskItem>
        </div>
        <div
          class="__ag__task-list__"
          v-if="tab == 2 && systemList.length != 0"
        >
          <ag-taskItem
            v-for="(item, index) in systemList"
            :icons="item.logo"
            :times="item.award ? item.award : 1"
            :title="item.name"
            :des="item.remark"
            :done="
              item.joinMap.stat && item.joinMap.stat.status
                ? item.joinMap.stat.status
                : 0
            "
            :everyAmount="item.everyAmount"
            :amount="item.joinMap.stat ? item.joinMap.stat.amount : 0"
            :border="index == systemList.length - 1 ? 1 : 0"
            :activityType="item.type"
            :postId="item.joinMap.stat ? item.joinMap.stat.id : ''"
            :key="item.id"
            :user="user"
            :daily="0"
            :type="item.type"
            :status="item.joinMap.stat ? item.joinMap.stat.status : ''"
            @click="myClick"
          >
          </ag-taskItem>
        </div>
      </div>
      <div class="__ag__registed-box__" v-if="tab == 2 && regItem.id">
        <ag-taskItem
          :icons="regItem.logo"
          :title="regItem.name"
          :des="regItem.remark"
          :done="regItem.status"
          :border="1"
          :activityType="regItem.type"
          :daily="0"
          :type="regItem.type"
          :status="regItem.status"
        >
        </ag-taskItem>
      </div>
    </scroller>

    <ag-popup class="__ag__lives_popup__" v-if="showDraw" :isAnimate="showDraw">
      <div class="luck-modal">
        <image
          class="modal-bg"
          :src="__ag__url__('static/shijiebei/bg.png')"
        ></image>
        <text class="__receive__text">恭喜您</text>
        <text class="__receive__text">获得额外{{ drawTimes }}次抽奖机会</text>
        <image
          style="
            width: 400px;
            height: 392px;
            margin-top: 40px;
            margin-bottom: 40px;
          "
          :src="__ag__url__('static/shijiebei/zp.png')"
        ></image>

        <text class="receive-btn" @click="choujiang">立即抽奖</text>
      </div>
      <image
        class="__close__image__"
        @click="showDraw = false"
        :src="__ag__url__('static/shijiebei/popup-close.png')"
      ></image>
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
import HbTitle from "./components/__ag__headTop__.vue"
import dailyTask from "./components/__ag__dailyTask__.vue"
import taskItem from "./components/__ag__taskItem__.vue"
import util from "./components/util.js"
import env from "./components/env.js"
import bc from "./components/__ag__bc__.js"
import __ag__sportApi__ from "./components/__ag__sport_api__.js"
import sport from "./components/__ag__sport__.js"
import agMinix from "./components/__ag__minix__.js"
import minurl from "./components/__ag__minurl__.js"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import agActiviteShare from "./components/__ag__activiteShare__.vue"
import agPopup from "./components/__ag__popup__.vue"
export default {
  mixins: [agMinix, minurl],
  components: {
    "ag-hbtitle": HbTitle,
    "ag-dailyTask": dailyTask,
    "ag-taskItem": taskItem,
    "ag-activite-share": agActiviteShare,
    agPopup,
  },
  data() {
    return {
      env,
      tab: 1,
      login: false,
      user: {},
      name: "任务中心",
      loading: false,
      platform: "android",
      showDraw: false,
      drawTimes: 1,
      watchTime: 0,
      dailyList: [],
      systemList: [],
      daySignList: [],
      signed: 0,
      dailySignItem: {},
      serial: 0,
      regItem: { id: 0 },
      startX: 0,
      endX: 0,
      isLoading: false,
      realHeight:
        (weex.config.env.deviceHeight / weex.config.env.deviceWidth) * 750,
      liveId: 0,
      showShare: false,
      url: "",
      todayCode: 0,
    }
  },
  created() {
    bc.onmessage("onPause", this.onPause)
    this.user = util.getItem("user")
    this.listUserActivity()
  },

  computed: {
    slide() {
      return this.endX - this.startX
    },
    rdeg() {
      if (this.watchTime <= 75) {
        return this.watchTime * 2.4
      } else {
        return 180
      }
    },
    ldeg() {
      if (this.watchTime < 75) {
        return 0
      } else if (this.watchTime <= 120) {
        return (this.watchTime - 75) * 2.4
      } else {
        return 180
      }
    },
  },

  mounted() {
    this.listUserActivity()
    // if (this.signed == 1) {
    // 	this.dailyList.some(it => {
    // 		if (it.type == 1) {
    // 			it.joinMap.stat.status = 1
    // 			it.joinMap.stat.amount = 1
    // 			return true
    // 		}
    // 	})
    // }
  },
  methods: {
    onPause() {
      this.listUserActivity()
    },
    myClick(obj) {
      this.user = util.getItem("user")
      if (!this.user || this.user.userType == 3) {
        util.getPush("__ag__login__")
        return
      }
      if (obj.status == 2) {
        return
      }
      if (obj.status == 0) {
        if (obj.type == 2) {
          this.onInvitation()
          return
        }
        if (obj.type == 3 || obj.type == 4 || obj.type == 7 || obj.type == 9) {
          __ag__sportApi__
            .listUsersLive()
            .then((res) => {
              res.data.sort((a, b) => {
                return a.id - b.id
              })
              let liveId = res.data[0].uid
              util.getPush("__ag__live__", { uid: liveId })
            })
            .catch((err) => {
              util.message(err.message)
            })
          return
        }
        if (obj.type == 5) {
          util.pop()
          bc.postMessage("switchTab", { tab: 2, index: 1 })
        }
        if (obj.type == 6) {
          util.getPush("__ag__login__")
          return
        }
        if (obj.type == 8) {
          util.getPush("__ag__anchor__")

          return
        }
        if (obj.type == 1 && obj.status == 0) {
          this.toSign({ today: 1, complete: 0 })
          return
        }
      }
      if (obj.status == 1) {
        __ag__sportApi__
          .editUserActivity({ id: obj.id })
          .then((res) => {
            if (obj.daily) {
              this.dailyList.some((item) => {
                if (item.joinMap.stat.id == obj.id) {
                  item.joinMap.stat.status = 2
                }
              })
            } else {
              this.systemList.some((item) => {
                if (item.joinMap.stat.id == obj.id) {
                  item.joinMap.stat.status = 2
                }
              })
            }
            this.showDraw = true
            this.listUserActivity()
          })
          .catch((err) => {
            util.message(err.message)
          })
      }
    },
    touchStart(e) {
      this.startX = e.changedTouches[0].screenX
    },
    touchEnd(e) {
      this.endX = e.changedTouches[0].screenX

      if (this.slide >= 200) {
        this.tab = 1
      }

      if (this.slide <= -200) {
        this.tab = 2
      }
    },

    toSign(obj) {
      if (!obj.today || obj.complete) {
        return
      }
      let user = util.getItem("user")
      if (!user || user.userType == 3) {
        util.getPush("__ag__login__")
        return
      }
      __ag__sportApi__
        .editActivityLog({ id: 1 })
        .then((res) => {
          this.signed = 1
          this.daySignList.find((item) => {
            if (item.today == 1) {
              item.complete = 1
              return true
            }
          })
          this.dailyList.find((item) => {
            if (item.type == 1) {
              item.joinMap.stat.status = 1
              item.joinMap.stat.amount = 1
              return true
            }
          })
          util.message("签到中")
          setTimeout(() => {
            this.listUserActivity()
          }, 3000)
        })
        .catch((err) => {
          util.message(err.message)
        })
    },
    choujiang() {
      util.getPush("__ag__luckDraw__")
      this.showDraw = false
    },

    async listUserActivity() {
      if (this.isLoading) {
        return
      }
      dayjs.extend(utc)
      dayjs.extend(timezone)
      this.isLoading = true

      try {
        let data = await __ag__sportApi__.pageUserActivity()
        this.todayCode = data.code
        let day = new Date(data.code)
        let ttime = day.getTime()
        let yday = new Date(ttime - 60 * 60 * 24 * 1000)
        let dayString = dayjs(ttime).tz("Asia/Shanghai").format("YYYY-MM-DD")
        let ydayString = dayjs(yday.getTime())
          .tz("Asia/Shanghai")
          .format("YYYY-MM-DD")
        // let res = data

        this.dailyList = data.data.list.filter((item) => {
          return item.daily == 1
        })
        this.dailyList.forEach((item) => {
          if (item.joinMap.stat.date != dayString) {
            item.joinMap.stat.status = 0
          }
        })

        this.systemList = data.data.list.filter((item) => {
          return item.daily == 0
        })
        this.systemList.forEach((item) => {
          if (item.type == 6 && this.user.userType == 2) {
            if (!item.joinMap.stat || !item.joinMap.stat.status) {
              item.joinMap.stat.status = 2
              item.joinMap.stat.amount = 1
            }
            // this.regItem = item
            // if(!item.joinMap.stat.status){
            // 	this.regItem.status =2
            // }else{
            // 	this.regItem.status  = item.joinMap.stat.status
            // }
          }
        })
        data.data.list.forEach((item) => {
          if (
            item.type == 3 &&
            item.everyAmount == 150 &&
            item.joinMap.stat.amount
          ) {
            this.watchTime = item.joinMap.stat.amount
          }
          // if(item.type==6 && this.user.userType==2 && (!item.joinMap.stat.status ||item.joinMap.stat.status ==2)){

          // 	this.regItem = item

          // 	if(!item.joinMap.stat.status){
          // 		this.regItem.status =2
          // 	}else{
          // 		this.regItem.status  = item.joinMap.stat.status
          // 	}
          // }
          if (item.type == 1) {
            this.dailySignItem = item
            this.signTimes = item.joinMap.stat.amount

            this.dayAward = item.award
            if (item.joinMap.stat.date && item.joinMap.stat.date == dayString) {
              this.signed = item.joinMap.stat.status
              this.serial = 1
            } else if (
              item.joinMap.stat.date &&
              item.joinMap.stat.date == ydayString
            ) {
              this.signed = 0
              this.serial = 1
            } else {
              this.signed = 0
              this.serial = 0
            }
          }
        })

        this.daySignList = sport.getSevenDays(
          this.dailySignItem,
          this.signed,
          this.serial,
          this.todayCode
        )
        this.isLoading = false
      } catch (err) {
        uni.showToast({
          title: "获取任务失败",
          icon: "error",
        })
        return
      }
    },
    async onInvitation() {
      let map = util.getItem("metaDataMap")
      if (!map) {
        await sport.getListMetaData()
      }
      let value = map["downUrl"]
      let ref = sport.getRef()
      let q = value.indexOf("?") == -1 ? "?" : "&"
      let qrUrl = value + q + "From=" + ref
      this.showShare = true
      this.url =
        "./activiteShare.html?qrUrl=" + qrUrl + "&download=" + env.download
    },
    onCloseShare() {
      this.showShare = false
    },
  },
}
</script>

<style lang="less">
@import "./style/theme.less";

.__ag__renwu-container__ {
  width: 750px;
  background-color: #f2f2f2;
}

.__ag__daily-box__ {
  margin-top: 198px;
  margin-left: 16wx;
  margin-right: 16wx;
  width: 686px;
  height: 143wx;
  align-items: center;
  padding-top: 22px;
  padding-bottom: 22px;
  background-color: #fff;
  // box-sizing: border-box;
}
.__ag__daliy-title__ {
  font-size: 16wx;
  color: #000;
  font-weight: 600;
}
.__ag__sign-box__ {
  width: 686px;
  margin-top: 34px;

  flex-direction: row;
  justify-content: space-around;
}
.__ag__task-box__ {
  width: 686px;
  background-color: #fff;
  margin-top: 34px;
  border-radius: 5wx;
}
.__ag__task-tab__ {
  width: 686px;
  height: 50wx;
  flex-direction: row;
  padding-top: 17wx;
  justify-content: space-between;
  padding-left: 98wx;
  padding-right: 98wx;
}
.__ag__system-title__,
.__ag__daily-title__ {
  justify-content: center;
  align-items: center;
}
.__ag__system-text__,
.__ag__daily-text__ {
  font-size: 16wx;
  font-weight: 600;
  line-height: 21wx;
}
.task-active {
  color: @main-color;
}
.active-bar {
  background-color: @main-color;
  width: 60wx;
  height: 4px;
  margin-top: 15px;
}
.__ag__inner-icon__ {
  width: 40wx;
  height: 40wx;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.15));
}
.__ag__task-circle__ {
  position: relative;
  width: 150wx;
  height: 150wx;
  background-color: #d9435c;
  align-self: center;
  margin-top: 26wx;
  border-radius: 75wx;
}
.__ag__right__,
.__ag__left__ {
  position: absolute;
  width: 75wx;
  height: 150wx;
  overflow: hidden;
}
.__ag__left__ {
  left: 0;
}
.__ag__right__ {
  right: 0;
}
.__ag__circle-left__ {
  width: 75wx;
  height: 150wx;
  border-top-left-radius: 75wx;
  border-bottom-left-radius: 75wx;
  transform-origin: right center;
  // transform: rotate(230deg);
  background-color: #e1e9f8;
}
.__ag__circle-right__ {
  background-color: #e1e9f8;
  width: 75wx;
  height: 150wx;
  border-top-right-radius: 75wx;
  border-bottom-right-radius: 75wx;
  transform-origin: left center;
}
.__ag__circle-inner__ {
  width: 130wx;
  height: 130wx;
  border-radius: 65wx;
  margin: 10wx;
  background-color: #fff;

  align-items: center;
  padding-top: 52px;
}
.__ag__inner-text__ {
  align-items: center;
  justify-content: space-between;
}
.__ag__inner-text-watch__ {
  margin-top: 14px;
  font-family: "PingFang SC";
  font-weight: 500;
  font-size: 9wx;
  line-height: 13wx;
  color: #808080;
}
.__ag__inner-text-time__ {
  font-family: "PingFang HK";
  font-style: normal;
  font-weight: 600;
  font-size: 14wx;
  line-height: 20wx;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ec1b50;
}
.__ag__task-scroller__ {
  position: fixed;
  top: 257wx;
  bottom: 0;
  margin-left: 16wx;
  margin-right: 16wx;
}
.__ag__not-show__ {
  height: 0;
  opacity: 0;
}
.__ag__show__ {
  opacity: 1;
}
.__ag__task-list__ {
  margin-top: 10wx;
}
.__ag__registed-box__ {
  min-height: 94px;
  width: 526px;
  margin-top: 10wx;
}
.__ag__draw-box__ {
  position: fixed;
  top: 0;
  left: 0;
  flex: 1;
  width: 750px;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  justify-content: center;
}
.__ag__img-box__ {
  position: relative;
  justify-content: center;
  align-items: center;
}
.__ag__draw-img__ {
  width: 332wx;
  height: 440wx;
}
.__ag__draw-close-img__ {
  width: 30wx;
  height: 30wx;
}
.__ag__lives_popup__ {
  width: 750px;
  background-color: rgba(0, 0, 0, 0.76);
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
  text-align: center;
  letter-spacing: 0.02em;
  color: #ffffff;
  line-height: 50px;
  font-family: "Tensentype JiaLiZhunCuYuanJ";
  font-style: normal;
  font-size: 25wx;
  margin-bottom: 30px;
}
.receive-btn {
  height: 82px;
  margin-top: 20px;
  background-image: linear-gradient(to right, #f48983, #ed425a);
  box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.25), 0px 2.5px 0px #ca2461;
  border-radius: 40px;
  font-style: normal;
  font-weight: 400;
  font-size: 20wx;
  line-height: 82px;
  text-align: center;
  letter-spacing: 2px;
  color: #ffffff;
  text-shadow: 1px 1px 0px #bd3141;
  padding-left: 40px;
  padding-right: 40px;
}
.__close__image__ {
  width: 60px;
  height: 60px;
  margin-top: 30px;
}
</style>
