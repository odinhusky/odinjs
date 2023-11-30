<template>
  <div class="__ag__uptime__">
    <image class="__ag__uptimebackimg__" :src="handleImgPath(url)"></image>
    <div class="__ag__uptimebkcolor__"></div>
    <div class="__ag__uptime_content__">
      <div
        class="__ag__uptimecontetn__"
        v-if="info && info.id"
        @swipe="handleSwipe"
      >
        <div class="__ag__uptimesaishi__">
          <div class="__ag__uptimeteam__">
            <!-- <image resize="contain" class="__ag__uptimeteamimg__" v-if="info && info.teamFlaga" :src="__ag__url__(info.teamFlaga)" ></image>
						<text class="__ag__uptimeteamimg__ __ag__uptimenoteamimg__" v-else>{{info && info.teamNamea && info.teamNamea.charAt(0)}}</text> -->
            <team-logo
              teamType="1"
              :teamFlag="info.teamFlaga"
              :teamName="info.teamNamea"
              resize="medium"
            ></team-logo>
            <text class="__ag__uptimeteamtext__">{{ info.teamNamea }}</text>
          </div>
          <div class="__ag__upteamdate__">
            <text class="__ag__upteamdatename__">{{ info.matchName }}</text>
            <text class="__ag__upteamdatetext__">{{
              formatDateTime(info.beginTime)
            }}</text>
          </div>
          <div class="__ag__uptimeteam__">
            <!-- <image resize="contain" class="__ag__uptimeteamimg__" v-if="info && info.teamFlagb" :src="__ag__url__(info.teamFlagb)" ></image>
						<text class="__ag__uptimeteamimg__ __ag__uptimenoteamimg__" v-else>{{info && info.teamNameb && info.teamNameb.charAt(0)}}</text> -->
            <team-logo
              teamType="2"
              :teamFlag="info.teamFlagb"
              :teamName="info.teamNameb"
              resize="medium"
            ></team-logo>
            <text class="__ag__uptimeteamtext__">{{ info.teamNameb }}</text>
          </div>
        </div>
        <div
          class="__ag__uporder__"
          v-if="info.status == 0 && !isAppoint"
          @click="onMakeAppointment"
        >
          <text class="agiconfont __ag__uporderappoint__">&#xe705;</text>
          <text class="__ag__upordertext__">预约</text>
        </div>
        <div
          class="__ag__uporder__ __ag__cg__"
          v-if="info.status == 0 && isAppoint"
          @click="cancelAppointment"
        >
          <text class="agiconfont __ag__uporderappoint__">&#xe705;</text>
          <text class="__ag__upordertext__">已预约</text>
        </div>
        <div class="__ag__uptimedata__" v-if="info.status == 0 && iscountTimer">
          <text class="__ag__uptimedatatext__">距离开赛时间还有</text>
          <text class="__ag__uptimedatashi__">{{ day }}</text>
          <text class="__ag__uptimedatatext__">天</text>
          <text class="__ag__uptimedatashi__">{{ hour }}</text>
          <text class="__ag__uptimedatatext__">时</text>
          <text class="__ag__uptimedatashi__">{{ min }}</text>
          <text class="__ag__uptimedatatext__">分钟</text>
          <text class="__ag__uptimedatashi__">{{ second }}</text>
          <text class="__ag__uptimedatatext__">秒</text>
        </div>
        <div class="__ag__upteamstatus__" v-if="info.status == 1">
          <text class="__ag__upteamstatustext__">已开始</text>
        </div>
      </div>
      <div class="__ag__incomelive_content__" v-if="list && list.length">
        <text class="__ag__incomelive_text__">更多精彩直播推荐</text>
        <scroller
          scroll-direction="horizontal"
          :show-scrollbar="false"
          class="__ag__matchscroll__"
        >
          <ag-income-live-item
            v-for="item in list"
            :key="item.id"
            :item="item"
          ></ag-income-live-item>
        </scroller>
      </div>
    </div>
  </div>
</template>

<script>
import agMinUrl from "./__ag__minurl__.js"
import minix from "./__ag__minix__.js"
import util from "./util.js"
import bc from "./__ag__bc__.js"
import incomeLiveItem from "./__ag__incomeLiveItem__.vue"
import teamLogo from "./__ag__teamLogo__.vue"
import env from "../components/env"

let countTimer = false
export default {
  components: {
    "ag-income-live-item": incomeLiveItem,
    "team-logo": teamLogo,
  },
  mixins: [agMinUrl, minix],
  props: {
    info: {
      type: Object,
      default: function () {
        return {}
      },
    },
    user: {
      type: Object,
      default: function () {
        return {}
      },
    },
    list: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data() {
    return {
      url: "streaming.png",
      day: "00",
      hour: "00",
      min: "00",
      second: "00",
      iscountTimer: false,
      loading: false,
      isAppoint: false,
      userMatchMap: {},
    }
  },
  watch: {
    info() {
      this.startCountTime()
    },
  },
  computed: {},
  mounted() {
    this.startCountTime()
    this.getUserMatchMap()
  },
  methods: {
    handleSwipe(e) {
      if (e.direction == "right") {
        util.pop()
      }
    },
    __ag__loadData__() {
      // this.getUserMatchMap()
    },
    async getUserMatchMap() {
      let userMatchMap = util.getItem("userMatchMap")
      if (userMatchMap) {
        this.userMatchMap = userMatchMap
        let r = userMatchMap[this.info.id]
        if (this.info.status == 0 && r) {
          this.isAppoint = true
        } else {
          this.isAppoint = false
        }
      } else {
        util
          .getStorageItem("userMatchMap")
          .then((res) => {
            userMatchMap = res
            if (userMatchMap) {
              this.userMatchMap = userMatchMap
              let r = userMatchMap[this.info.id]

              if (this.info.status == 0 && r) {
                this.isAppoint = true
              } else {
                this.isAppoint = false
              }
            }
          })
          .catch((err) => {})
      }
    },
    async onMakeAppointment() {
      if (!this.user || !this.user.userType || this.user.userType == 3) {
        util.getPush("__ag__login__")
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true
      let id = this.info.id
      try {
        let resp = await this.__ag__editUserMatch__({ scheId: id })
        this.loading = false
        if (resp.success) {
          this.loading = false
          this.isAppoint = true
          this.$set(this.userMatchMap, resp.data.scheduleId, {
            scheduleId: resp.data.scheduleId,
            id: resp.data.id,
          })
          bc.postMessage("makeAppoint", resp.data)
          util.message("预约成功")
        }
      } catch (err) {
        this.loading = false
        util.message(err.message)
      }
    },
    async cancelAppointment() {
      if (this.loading) {
        return
      }
      this.loading = true

      let match = this.userMatchMap[this.info.id]
      let id = match ? match.id : 0
      try {
        let resp = await this.__ag__removeUserMatch__({ id: id })
        this.loading = false
        if (resp.success) {
          this.loading = false
          this.isAppoint = false
          bc.postMessage("cancelAppoint", { scheduleId: this.info.id })
          if (match) {
            this.$delete(this.userMatchMap, this.info.id)
          }
          util.message("已取消预约")
        }
      } catch (err) {
        this.loading = false
        util.message(err.message)
      }
    },

    startCountTime() {
      this.stopCountTime()
      this.countTime()
      countTimer = setInterval(this.countTime, 1000)
    },
    stopCountTime() {
      if (countTimer) {
        clearInterval(countTimer)
        countTimer = false
      }
      this.iscountTimer = false
    },
    countTime() {
      if (!this.info || !this.info.id) {
        return
      }
      let infobeginTime = this.info && this.info.beginTime
      let beginTime = util.parseDate(infobeginTime)
      if (!beginTime || !beginTime.getTime()) {
        this.stopCountTime()
        return
      }
      // 获取当前时间
      let date = new Date()
      let now = date.getTime()
      // 设置截止时间
      let end = beginTime.getTime()
      // 时间差
      let leftTime = end - now
      if (leftTime > 86400000) {
        this.stopCountTime()
        return
      }
      // 定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        this.iscountTimer = true
        // 天
        this.day = Math.floor(leftTime / 1000 / 60 / 60 / 24)
        // 时
        let h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
        this.hour = h < 10 ? "0" + h : h
        // 分
        let m = Math.floor((leftTime / 1000 / 60) % 60)
        this.min = m < 10 ? "0" + m : m
        // 秒
        let s = Math.floor((leftTime / 1000) % 60)
        this.second = s < 10 ? "0" + s : s
      } else {
        this.day = "00"
        this.hour = "00"
        this.min = "00"
        this.second = "00"
        this.stopCountTime()
      }
    },
    formatDateTime(date) {
      let time = util.formatTime(date)
      let matDate = util.formatDate(date)

      return `${matDate} ${time}`
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__uptime__ {
  width: 750px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: @black;
}
.__ag__uptimebackimg__ {
  width: 750px;
  position: absolute;
  top: 0px;
  bottom: 0px;
}
.__ag__uptimebkcolor__ {
  width: 750px;
  position: absolute;
  top: 0px;
  bottom: 0px;
  // background-color: @green8;
  /* mix-blend-mode: multiply; */
  opacity: 0.3;
}
.__ag__uptime_content__ {
  width: 750px;
  /* position: absolute;
		top: 0px;
		bottom: 0px; */
  padding-top: 50px;
  padding-bottom: 20px;
}
.__ag__uptimecontetn__ {
  width: 750px;
  /* position: absolute;
		top: 0px;
		bottom: 0px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__uptimesaishi__ {
  width: 652px;
  height: 140px;
  margin-left: 49px;
  margin-right: 49px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.__ag__uptimedata__ {
  margin-top: 30px;
  width: 554px;
  height: 42px;
  margin-left: 98px;
  margin-right: 98px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.__ag__uptimeteam__ {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__uptimeteamimg__ {
  width: 68px;
  height: 68px;
  line-height: 68px;
  text-align: center;
  color: @black60;
  font-size: 14wx;
  border-radius: 50wx;
}
.__ag__uptimenoteamimg__ {
  background-color: @gray2;
}
.__ag__uptimeteamtext__ {
  margin-top: 12px;
  height: 28px;
  width: 140px;
  lines: 1;
  text-overflow: ellipsis;
  font-style: normal;
  font-weight: normal;
  font-size: 12wx;
  color: @white;
  text-align: center;
}
.__ag__upteamdate__ {
  width: 250px;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.__ag__upteamdatename__ {
  font-style: normal;
  font-weight: normal;
  font-size: 12wx;
  color: @white;
}
.__ag__upteamdatetext__ {
  /* width: 184px; */
  font-style: normal;
  font-weight: bold;
  font-size: 14wx;
  color: @white;
}
.__ag__uptimedatatext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 11wx;
  color: @white;
}
.__ag__uptimedatashi__ {
  font-style: normal;
  font-weight: bold;
  font-size: 15wx;
  color: @primary;
}
.__ag__uporder__ {
  width: 158px;
  height: 68px;
  background-color: @primary;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 4wx;
  margin-top: 16px;
}
.__ag__cg__ {
  background-color: @blue4;
}
.__ag__uporderappoint__ {
  color: @white;
  font-size: 15wx;
  margin-right: 5px;
}
.__ag__upordertext__ {
  font-style: normal;
  font-weight: 500;
  font-size: 13wx;
  color: @white;
}
.__ag__upteamstatus__ {
  height: 36px;
  width: 554px;
  margin-left: 49px;
  margin-right: 49px;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__upteamstatustext__ {
  font-style: normal;
  font-weight: 400;
  font-size: 14wx;
  letter-spacing: 0.05em;
  color: @blue4;
}
.__ag__incomelive_content__ {
  width: 750px;
  padding-bottom: 20px;
  padding-top: 15px;
}
.__ag__incomelive_text__ {
  line-height: 35px;
  font-size: 12wx;
  color: @white;
  padding-left: 32px;
  margin-bottom: 15px;
}
.__ag__matchscroll__ {
  display: flex;
  flex-direction: row;
  padding-left: 32px;
  padding-right: 32px;
}
</style>
