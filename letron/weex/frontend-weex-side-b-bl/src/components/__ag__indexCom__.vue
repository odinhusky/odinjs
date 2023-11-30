<template>
  <div class="__ag__indexcom_main__">
    <ag-ipx bg="#000000"></ag-ipx>
    <scroller class="__ag__indexcom__" :show-scrollbar="false">
      <refresh
        class="__ag__refresh__"
        @refresh="onrefresh"
        @pullingdown="onpullingdown"
        :display="a__ag__refreshing__ ? 'show' : 'hide'"
      >
        <loading-indicator class="__ag__loading__"></loading-indicator>
        <text class="__ag__refreshtext__">{{ a__ag__freshText__ }}</text>
      </refresh>
      <div class="__ag__indexhbcontent__">
        <!-- 轮播图 -->
        <ag-swiper
          :swipers="swiperlist"
          :listLive="listLive"
          :userLiveList="userLiveList"
        ></ag-swiper>

        <!-- 倒计时banner -->
        <div class="__ag__timer__" @click="onLuckDraw" v-if="switchWorldcup">
          <image
            :src="__ag__url__('static/shijiebei/djsx1.png')"
            class="__ag__activite_image__"
          ></image>
          <div class="count-box" v-if="countDown.min > 0">
            <text class="count-text">倒计时</text>
            <text class="count-text">{{ countDown.day }}天</text>
            <text class="count-text">{{ countDown.hour }}时</text>
            <text class="count-text">{{ countDown.min }}分</text>
          </div>
        </div>

        <!-- 热门比赛 -->
        <div class="__ag__indexhblive__">
          <div class="__ag__indexhbtitle__">
            <ag-title
              class="__ag__indexagtitle__"
              name="热门比赛"
              id="1"
              :isgd="true"
              @onclick="__ag__gomatch__"
              :switchWorldcup="switchWorldcup"
            ></ag-title>
          </div>
          <ag-matchlist
            @gomatch="__ag__gomatch__"
            :listHot="listSchedule"
            :matchList="userMatchList"
            :liveList="userLiveList"
            :requestList="userRequestList"
            :userMatchMap="userMatchMap"
            :user="user"
            :switchWorldcup="switchWorldcup"
          ></ag-matchlist>
        </div>
        <div class="__ag__indexagup__">
          <!-- 热门直播 -->
          <div class="__ag__indexhbtitle__">
            <ag-title
              class="__ag__indexagtitle__"
              name="热门直播"
              id="2"
              :isgd="true"
              :switchWorldcup="switchWorldcup"
              @onclick="__ag__onUpLive__"
            ></ag-title>
          </div>
          <ag-liveuplist
            class="__ag__liveuplist__"
            :list="list"
          ></ag-liveuplist>

          <!-- 热门主播 -->
          <div class="__ag__indexhbtitle__ __ag__index_anchor__">
            <ag-title
              class="__ag__indexagtitle__"
              name="热门主播"
              id="3"
              :isgd="true"
              :switchWorldcup="switchWorldcup"
              @onclick="__ag__onAnchor__"
            ></ag-title>
          </div>
          <ag-uplist
            :isRefresh="a__ag__refreshing__"
            :liveList="userLiveList"
            :requestList="userRequestList"
          ></ag-uplist>
        </div>

        <!-- 推荐 -->
        <div class="__ag__recommend__">
          <ag-title
            class="__ag__indexnewtitle__"
            @onclick="__ag__recommed__"
            name="推荐"
            id="4"
            :isgd="true"
            :switchWorldcup="switchWorldcup"
          ></ag-title>
          <ag-recommend :isindex="true" :list="recommedList"></ag-recommend>
        </div>

        <!-- 新闻 -->
        <div class="__ag__livenew__">
          <ag-title
            class="__ag__indexnewtitle__"
            @onclick="__ag__news__"
            name="新闻"
            id="5"
            :isgd="true"
            :switchWorldcup="switchWorldcup"
          ></ag-title>
          <ag-newslist class="__ag__newslist__" :isindex="true"></ag-newslist>
        </div>
      </div>
    </scroller>
    <!-- 抽奖 -->
    <div class="luck-body" :style="luckStyle" v-if="switchWorldcup">
      <image
        class="nonet-jiang"
        :src="__ag__url__('static/shijiebei/jiang.png')"
        @click="onLuckDraw"
      ></image>
      <image
        class="nonet-qian"
        :src="__ag__url__('static/shijiebei/qd.png')"
        @click="onLuckSign"
      ></image>
    </div>
  </div>
</template>

<script>
import agMinix from "./__ag__minix__.js"
import agMinUrl from "./__ag__minurl__.js"
import sport from "./__ag__sport__.js"
import agMatchuplist from "./__ag__matchUpList__.vue"
import aguplist from "./__ag__upList__.vue"
import title from "./__ag__title__.vue"
import newsList from "./__ag__newsList__.vue"
import recommedList from "./__ag__recommedList__.vue"
import liveUpList from "./__ag__liveUpList__.vue"
import swiper from "./__ag__swiper__.vue"
import indexMatchList from "./__ag__indexMatchList__.vue"
import ipx from "./__ag__ipx__.vue"
import bc from "./__ag__bc__.js"

import util from "./util.js"
let a = undefined
let _resolve = undefined,
  _reject = undefined
export default {
  props: {
    topTab: {
      type: String,
      default: "1",
    },
  },
  mixins: [agMinix, agMinUrl],
  components: {
    agMatchuplist,
    "ag-uplist": aguplist,
    "ag-title": title,
    "ag-newslist": newsList,
    "ag-liveuplist": liveUpList,
    "ag-swiper": swiper,
    "ag-recommend": recommedList,
    "ag-matchlist": indexMatchList,
    "ag-ipx": ipx,
  },
  data() {
    return {
      a__ag__isFreshing__: false,
      a__ag__freshing__: false,
      a__ag__triggered__: false,
      a__ag__freshText__: "释放更新",
      a__ag__refreshing__: false,
      isnet: false,
      tab: "1",
      tabtime: 0,
      listSchedule: [],
      userMatchList: [],
      listUsersLive: [],
      userRequestList: [],
      switchWorldcup: false,
      countDown: {
        day: "--",
        hour: "--",
        min: "--",
      },
      userMatchMap: {},
      user: {},
    }
  },
  watch: {
    topTab(n) {
      if (this.tab == n) {
        let time = new Date().getTime()
        if (this.tabtime + 30000 < time) {
          this.tabtime = time
          this.__ag__onBackPress__()
        }
      }
    },
    switchWorldcup(n) {
      if (n) {
        this.__ag__countDownDate__()
      }
    },
  },
  computed: {
    swiperlist() {
      if (
        !this.a__ag__listSwiper__.data ||
        !this.a__ag__listSwiper__.data.length
      ) {
        return []
      }
      let l = this.a__ag__listSwiper__.data

      return l
    },
    list() {
      if (!this.a__ag__listUsersLive__ || !this.a__ag__listUsersLive__.data) {
        return []
      }
      let list = this.a__ag__listUsersLive__.data
      let l = list
      if (l && l.length > 16) {
        return l.slice(0, 16)
      }
      return l
    },
    userLiveList() {
      if (!this.listUsersLive || !this.listUsersLive.length) {
        return []
      }
      let list = this.listUsersLive
      return list
    },
    item() {
      if (!this.a__ag__listUsersLive__ || !this.a__ag__listUsersLive__.data) {
        return {}
      }
      let l = this.a__ag__listUsersLive__.data[0]
      return l
    },
    recommedList() {
      if (!this.a__ag__pageRecommed__ || !this.a__ag__pageRecommed__.data) {
        return {}
      }
      let resp = this.a__ag__pageRecommed__
      let list = resp.data.list
      let l = list
      if (list && list.length > 5) {
        l = l.slice(0, 5)
      }
      return l
    },
    luckStyle() {
      let style = {}
      let dh = weex.config.env.deviceHeight
      if (this.ipx) {
        dh = weex.config.env.deviceWidth
        style.top = dh / 2 + 300 + "px"
      } else {
        style.top = dh / 2 + "px"
      }
      return style
    },
  },
  async created() {
    setTimeout(async () => {
      let map = util.getItem("metaDataMap")
      if (map) {
        this.getMetaDataMap()
      } else {
        await sport.getListMetaData()
        this.getMetaDataMap()
      }
    }, 1000)
  },
  methods: {
    getMetaDataMap() {
      let map = util.getItem("metaDataMap")
      let switchWorldcup = map["switchWorldcup"]
      this.switchWorldcup = switchWorldcup == 1 ? true : false
    },
    __ag__gomatch__() {
      this.$emit("gomatch", 2)
    },
    __ag__recommed__() {
      util.getPush("__ag__recommeds__")
    },
    __ag__news__() {
      util.getPush("__ag__news__")
    },
    __ag__onUpLive__() {
      util.getPush("__ag__uplive__")
    },
    __ag__onAnchor__() {
      util.getPush("__ag__anchor__")
    },
    async __ag__loadData__() {
      let that = this
      const login = new BroadcastChannel("onlogin")
      login.onmessage = function (event) {
        that.onlogin(event.data)
      }

      bc.onmessage("afreshMetaData", this.getMetaDataMap)
      bc.onmessage("cancelAppoint", this.cancelAppointTap)
      bc.onmessage("makeAppoint", this.makeAppointTap)

      this.isnet = util.isnet()
      await this.__ag__onBackPress__()
    },
    onlogin(user) {
      this.user = user
      if (user && user.userType < 3) {
        this.__ag__getUserMatchList__()
      }
    },
    async __ag__getUserMatchList__() {
      try {
        let resp = await this.__ag__getListUserMatch__()
        if (resp && resp.data && resp.data.length) {
          this.userMatchMap = {}
          this.userMatchList = resp.data
          let list = resp.data
          let map = {}
          for (let i in list) {
            let r = list[i]
            this.$set(this.userMatchMap, r.scheduleId, {
              scheduleId: r.scheduleId,
              id: r.id,
            })
            map[r.scheduleId] = { scheduleId: r.scheduleId, id: r.id }
          }
          util.setItem("userMatchMap", map)
          util.setStorageItem("userMatchMap", map)
        }
      } catch (error) {
        this.userMatchMap = {}
      }
    },
    async onrefresh() {
      this.a__ag__refreshing__ = true
      this.a__ag__freshText__ = "加载中..."
      this.__ag__onRefresh__()
    },
    onpullingdown() {
      this.a__ag__freshText__ = "释放更新"
    },
    async __ag__onRefresh__() {
      if (this.a__ag__freshing__) return
      this.a__ag__freshing__ = true
      this.a__ag__isFreshing__ = true
      if (!this.a__ag__triggered__) {
        this.a__ag__triggered__ = true
      }
      await this.__ag__onBackPress__()
    },
    async __ag__onBackPress__() {
      setTimeout(() => {
        this.a__ag__refreshing__ = false
        this.a__ag__freshing__ = false
        this.a__ag__triggered__ = false
        this.a__ag__isFreshing__ = false
      }, 700)
      this.__ag__listSwiper__()
      this.__ag__hotpageSchedule__()
      this.__ag__listUsersLive__()
      if (this.user && this.user.userType < 3) {
        this.__ag__getUserMatchList__()
      }
      await this.__ag__getHotMatchList__()
      await this.__ag__pageRecommed__()
      await this.__ag__pageArticle__()
      await sport.getListMetaData()
    },
    async __ag__getHotMatchList__() {
      try {
        let liveResp = await this.__ag__listUsersLive__()
        if (liveResp && liveResp.data && liveResp.data.length > 0) {
          this.listUsersLive = liveResp.data
        }
        let requestResp = await this.__ag__listRequestSchedule__()
        if (requestResp && requestResp.data && requestResp.data.length > 0) {
          this.userRequestList = requestResp.data
          util.setItem("listUsersRequest", this.userRequestList)
        }
      } catch (error) {}
    },

    async __ag__hotpageSchedule__() {
      try {
        let resp = await this.__ag__listHotMatch__()
        if (resp && resp.data) {
          this.listSchedule = resp.data
        }
      } catch (error) {
        util.message(error.message)
      }
    },

    onLuckDraw() {
      util.getPush("__ag__luckDraw__")
    },

    onLuckSign() {
      util.getPush("__ag__renwuzhongxin__")
    },

    __ag__goWorld__() {
      util.getPush("__ag__worldSpecial__")
    },

    __ag__countDownDate__() {
      let sec = 1000
      let min = 60 * sec
      let hour = 60 * min
      let day = 24 * hour
      let targetTime = new Date("2022-11-20").getTime() + 3600000 * 11
      let nowTime = new Date().getTime()
      let times = targetTime - nowTime
      if (times > 0) {
        let _day = util.formatNumber(Math.floor(times / day))
        let _hour = util.formatNumber(Math.floor((times % day) / hour))
        let _min = util.formatNumber(Math.floor((times % hour) / min))
        this.countDown.day = _day
        this.countDown.hour = _hour
        this.countDown.min = _min
        setInterval(() => {
          nowTime = new Date().getTime()
          times = targetTime - nowTime
          _day = util.formatNumber(Math.floor(times / day))
          _hour = util.formatNumber(Math.floor((times % day) / hour))
          _min = util.formatNumber(Math.floor((times % hour) / min))
          this.countDown.day = _day
          this.countDown.hour = _hour
          this.countDown.min = _min
        }, 60000)
      }
    },

    cancelAppointTap(item) {
      let r = this.userMatchMap[item.data.scheduleId]
      if (r) {
        this.$delete(this.userMatchMap, item.data.scheduleId)
      }

      let userMatchMap = util.getItem("userMatchMap")
      if (userMatchMap) {
        let ur = userMatchMap[item.data.scheduleId]
        if (ur) {
          this.$delete(userMatchMap, item.data.scheduleId)
        }
        util.setItem("userMatchMap", userMatchMap)
      } else {
        util.getStorageItem("userMatchMap").then((res) => {
          userMatchMap = res
          if (userMatchMap) {
            let ur = userMatchMap[item.data.scheduleId]
            if (ur) {
              this.$delete(userMatchMap, item.data.scheduleId)
            }
            util.setStorageItem("userMatchMap", userMatchMap)
          }
        })
      }
    },
    makeAppointTap(item) {
      this.$set(this.userMatchMap, item.data.scheduleId, {
        scheduleId: item.data.scheduleId,
        id: item.data.id,
      })
      let userMatchMap = util.getItem("userMatchMap")
      if (userMatchMap) {
        userMatchMap[item.data.scheduleId] = {
          scheduleId: item.data.scheduleId,
          id: item.data.id,
        }
        util.setItem("userMatchMap", userMatchMap)
      } else {
        util.getStorageItem("userMatchMap").then((res) => {
          userMatchMap = res
          if (userMatchMap) {
            userMatchMap[item.data.scheduleId] = {
              scheduleId: item.data.scheduleId,
              id: item.data.id,
            }
            util.setStorageItem("userMatchMap", userMatchMap)
          }
        })
      }
    },

    __ag__testAsync__() {
      a = new Promise((resolve, reject) => {
        _resolve = resolve
        _reject = reject
        setTimeout(() => {
          // resolve(10)
          reject(10)
        }, 10000)
      })

      a.then((sec) => {}).catch((err) => {
        console.error("rej", err)
      })

      setTimeout(() => {
        _reject("4")
      }, 4000)

      setTimeout(() => {
        _resolve("5")
      }, 5000)

      setTimeout(() => {}, 11000)
    },
  },
}
</script>

<style>
.__ag__indexcom_main__ {
  background-color: #f2f3f4;
  width: 750px;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0px;
  bottom: 66wx;
  padding-bottom: 10wx;
}
.__ag__indexcom__ {
  width: 750px;
  flex-direction: column;
  align-items: center;
  /* position: fixed;
		top: 0px;
		bottom: 66wx; */
  padding-bottom: 10wx;
}
.ipx {
  padding-top: 35wx;
  /* top: 168px; */
  /* bottom: 100wx; */
  /* padding-bottom: 34px; */
}
.__ag__indexhbcontent__ {
  background-color: #f2f3f4;
  /* padding-top: 50px; */
  width: 750px;
  flex-direction: column;
  align-items: center;
}
.__ag__liveuplist__ {
  /* width: 710px; */
  flex: 1;
}
.__ag__swiper__ {
  width: 100vw;
  height: 46.67vw;
}
.__ag__indexhblive__ {
  width: 750px;
  padding-left: 16wx;
  padding-right: 16wx;
  padding-top: 20wx;
  padding-bottom: 0px;
  margin-bottom: 32px;
}
.__ag__indexagup__ {
  width: 750px;
  padding-left: 16wx;
  padding-right: 16wx;
  margin-bottom: 16px;
}
.__ag__refresh__ {
  width: 750px;
  padding: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__refreshtext__ {
  margin-left: 30px;
}
.__ag__loading__ {
  color: #000000;
}
.__ag__index_anchor__ {
  margin-top: 16px;
}
.__ag__indexhbtitle__ {
  width: 685px;
  margin-bottom: 16px;
}
.__ag__recommend__ {
  width: 750px;
  padding-right: 16wx;
  padding-left: 16wx;
  margin-bottom: 20wx;
}
.__ag__livenew__ {
  width: 750px;
  padding-right: 16wx;
  padding-left: 16wx;
}
.__ag__indexnewtitle__ {
  width: 685px;
  padding-top: 20px;
  margin-bottom: 16px;
}
.__ag__newslist__ {
  flex: 1;
}
.luck-body {
  position: absolute;
  right: 16px;
  align-items: center;
  justify-content: center;
}
.nonet-jiang {
  width: 120px;
  height: 120px;
}
.nonet-qian {
  width: 145px;
  height: 44px;
  margin-top: -20px;
}
.__ag__timer__ {
  width: 750px;
  height: 118px;
  position: relative;
}
.__ag__activite_image__ {
  width: 750px;
  height: 118px;
}
.count-box {
  position: absolute;
  top: 8px;
  left: 185px;
  flex-direction: row;
  align-items: center;
}
.count-text {
  font-family: wcnum;
  font-style: normal;
  font-size: 16wx;
  line-height: 46px;
  background-clip: text;
  color: #fff;
  margin-right: 10px;
}
</style>
