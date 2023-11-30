<template>
  <scroller class="__ag__upinfo_scroller__" :show-scrollbar="false">
    <div class="__ag__upinfo_top__">
      <div class="__ag__upinfotitle__">
        <div class="__ag__upinfo_lf__">
          <div class="__ag__upinfo_avatodr__">
            <ag-userimg
              class="__ag__upinfotitleimg__"
              :fontSize="true"
              :name="item.userNicename"
              :islive="true"
              :avatar="item.avatar"
              @itemtap="clickAutor"
            ></ag-userimg>
            <div class="__ag__live_statue__" v-if="isDetail">
              <text
                class="__ag__live_statue_text__"
                v-if="
                  item &&
                  item.joinMap &&
                  item.joinMap.live &&
                  item.joinMap.live.scheduleId
                "
                >直播中</text
              >
              <text class="__ag__nolive_statue_text__" v-else>不在家</text>
            </div>
          </div>
          <div class="__ag__upinfoname__">
            <div class="__ag__upinfo_top_item__">
              <text class="__ag__upinfonametext__">{{
                item.userNicename
              }}</text>
              <div class="__ag__report_item__" @click="__ag_report__">
                <text class="agiconfont __ag__iconlh__">&#xe6a0;</text>
                <text class="report-text">举报</text>
              </div>
            </div>
            <div class="__ag__upinfo_bottom__">
              <text class="_rg_t_text">已推荐 {{ total }}</text>
              <text class="_rg_t_text">准确率 {{ rate }}%</text>
            </div>
          </div>
        </div>

        <div class="__ag__upinfo_rg__">
          <div
            v-if="!isFollow"
            class="__ag__upinfobottomfo__"
            :class="[!isFollow ? '__ag__follow-no__' : '']"
            @click="__ag__followTap__"
          >
            <text class="agiconfont __ag__vector__">&#xe66d;</text>
            <text class="__ag__upinfobottomtext__">订阅</text>
          </div>
          <div
            v-else
            class="__ag__upinfobottomfo__"
            :class="[isFollow ? '__ag__follow-yes__' : '']"
            @click="__ag__cancelFollow__"
          >
            <text
              class="agiconfont __ag__vector__"
              :class="[isFollow ? 'yes-icon' : '']"
              >&#xe700;</text
            >
            <text
              class="__ag__upinfobottomtext__"
              :class="[isFollow ? 'yes-text' : '']"
              >已订阅</text
            >
          </div>
          <div class="__ag__upinfofollow__">
            <text class="__ag__upinfofollowtext__">{{
              util.numberReadable(item.score)
            }}</text>
            <text class="__ag__like__">已订阅</text>
          </div>
        </div>
      </div>
      <div class="__ag__upinfobody__">
        <text class="__ag__upinfotext__">{{ item.bio }}</text>
      </div>
      <div class="__ag__upinfobottom__">
        <!-- <div class="__ag__upinfobottomlh__ __ag__upinfobottomba__" @click="__ag_black__">
						<text class="agiconfont __ag__iconlh__">&#xe6fb;</text>
						<text class="report-text" >拉黑</text>
					</div> -->
      </div>
    </div>
    <div
      class="__ag__upinfo_match__"
      v-if="listSchedule3 && listSchedule3.length"
    >
      <text class="__ag__upinfo_match_text__">主播赛程</text>
      <scroller
        scroll-direction="horizontal"
        :show-scrollbar="false"
        class="__ag__matchscroll__"
      >
        <ag-matchitem
          v-for="item in listSchedule3"
          :key="item.id"
          :teamitem="item"
        ></ag-matchitem>
      </scroller>
    </div>

    <div class="__ag__upinfo_info__">
      <div class="info-top">
        <!-- <text
          class="info-tab-item info-border"
          :class="[infoTab == 1 ? 'tab-select' : '']"
          @click="changeTab(1)"
          >直播推荐</text
        > -->
        <text
          class="info-tab-item info-border"
          :class="[infoTab == 1 ? 'tab-select' : '']"
          >直播推荐</text
        >
        <!-- <text
          class="info-tab-item"
          :class="[infoTab == 2 ? 'tab-select' : '']"
          @click="changeTab(2)"
          >主播推荐</text
        > -->
      </div>
      <ag-liveuplist
        class="__ag__upinfo_content__"
        v-if="infoTab == 1"
        :list="listUsersLive"
      ></ag-liveuplist>
      <ag-info-recomed-list
        v-if="infoTab == 2"
        :list1="list1"
        :list2="list2"
        :anchor="item"
        :user="user"
      ></ag-info-recomed-list>
    </div>
    <div class="__ag__upinforeport__" v-if="isreport">
      <ag-report
        :isreport="isreport"
        @onclose="onclose"
        :roomId="roomId"
      ></ag-report>
    </div>

    <ag-popup
      class="__ag__imgpopup__"
      v-if="imgPopup"
      @closePopup="
        imgPopup = false
        imgPopupUrl = ''
      "
      :isAnimate="imgPopup"
    >
      <image
        ref="imageref"
        resize="contain"
        :src="__ag__url__(imgPopupUrl)"
        class="__ag__imgpopupurl__"
      ></image>
    </ag-popup>
  </scroller>
</template>

<script>
import util from "./util.js"
import bc from "./__ag__bc__.js"
import agMinix from "./__ag__minix__.js"
import agMinUrl from "./__ag__minurl__.js"
import userImg from "./__ag__userImg__.vue"
import __ag__sportApi__ from "./__ag__sport_api__.js"
import report from "./__ag__report__.vue"
import liveUpList from "./__ag__liveUpList__.vue"
import infoRecomedList from "./__ag__infoRecomedList__.vue"
import agPopup from "./__ag__popup__.vue"
import matchitem from "./__ag__indexMatchItem__.vue"
export default {
  mixins: [agMinix, agMinUrl],
  components: {
    "ag-userimg": userImg,
    "ag-report": report,
    "ag-popup": agPopup,
    "ag-info-recomed-list": infoRecomedList,
    "ag-liveuplist": liveUpList,
    "ag-matchitem": matchitem,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    roomId: {
      type: Number,
      default: 0,
    },
    uid: {
      type: String,
      default: undefined,
    },
    listFollowMap: {
      type: Object,
      default() {
        return {}
      },
    },
    tab: {
      type: Number,
      default: 0,
    },
    user: {
      type: Object,
      default() {
        return {}
      },
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      util,
      id: 0,
      isreport: false,
      infoTab: 1,
      scheduleRecommend: [],
      pageRecommend: [],
      upScheList: [],
      tabtime: 0,
      schetime: 0,
      imgPopup: false,
      imgPopupUrl: "",
      listUsersLive: [],
      listSchedule: [],
    }
  },

  watch: {
    tab(n) {
      if (n == 3) {
        let time = new Date().getTime()
        if (this.tabtime + 30000 < time) {
          this.tabtime = time
          this.getData()
        }
      }
    },
  },
  computed: {
    isFollow() {
      if (!this.listFollowMap) {
        return false
      }
      let r = this.listFollowMap[this.item.id]
      return r
    },
    list1() {
      return this.scheduleRecommend.sort((a, b) => {
        if (a.uid == this.uid) {
          return -1
        }
        return 1
      })
    },
    list2() {
      return this.pageRecommend.filter((r) => {
        return true
      })
    },
    goodLevel() {
      if (!this.item) {
        return ""
      }
      let rate = this.rate
      if (!rate) {
        return ""
      }
      if (rate >= 70) {
        return 1
      }
      if (rate >= 40) {
        return 2
      }
      if (rate > 0) {
        return 3
      }
      return ""
    },
    total() {
      if (!this.item) {
        return 0
      }
      let r = this.item.redCount || 0
      let b = this.item.blackCount || 0
      let total = r + b
      if (!total) {
        return 0
      }
      return total
    },
    rate() {
      if (!this.total) {
        return 0
      }
      let rate = (this.item.redCount * 100) / this.total
      //console.log('rate',rate,this.total)
      rate = Math.floor(rate)
      return rate
    },
    listSchedule3() {
      if (!this.item || !this.item.id) return []
      let list = this.listSchedule.filter(
        (r) => r.joinMap && r.joinMap.u && r.joinMap.u.id == this.item.id
      )
      return list
    },
  },
  methods: {
    async __ag__loadData__() {
      let that = this
      const Steve = new BroadcastChannel("onlogin")
      Steve.onmessage = async function (event) {
        await that.__ag__getPageRecommend__()
      }
      bc.onmessage("afreshData", this.__ag__getPageRecommend__)
      bc.onmessage("changeData", this.switchAnthor)

      if (this.isDetail) {
        this.getData()
      }
    },
    getData() {
      this.__ag__getPageRecommend__()
      this.__ag__getlistUsersLive__()
      this.__ag__getlistRequestLive__()
    },
    async __ag__getlistUsersLive__() {
      try {
        let resp = await this.__ag__listUsersLive__()
        if (resp && resp.data && resp.data.length) {
          this.listUsersLive = resp.data.splice(0, 8)
        }
      } catch (error) {}
    },
    async __ag__getlistRequestLive__() {
      try {
        let resp = await this.__ag__listRequestSchedule__()
        if (resp && resp.data && resp.data.length) {
          this.listSchedule = resp.data
        }
      } catch (error) {}
    },
    async switchAnthor() {
      this.tabtime = 0
      this.schetime = 0
      await this.__ag__getPageRecommend__()
    },
    changeTab(t) {
      this.infoTab = t
      if (t == 2) {
        let time = new Date().getTime()
        if (this.schetime + 30000 < time) {
          this.schetime = time
          this.__ag__getScheduleMatch__()
        }
      }
    },
    async __ag__getPageRecommend__() {
      let scheduleId =
        this.item &&
        this.item.joinMap &&
        this.item.joinMap.live &&
        this.item.joinMap.live.scheduleId
      let uid = this.item && this.item.id
      try {
        let resp = await this.__ag__pageRecommed__({ scheduleId })
        if (resp.success) {
          if (resp.data && resp.data.list && resp.data.list.length > 0) {
            this.scheduleRecommend = resp.data.list
          } else {
            this.scheduleRecommend = []
          }
          let res = await this.__ag__pageRecommed__({ uid })
          if (res.success) {
            if (res.data && res.data.list && res.data.list.length > 0) {
              this.pageRecommend = res.data.list
            } else {
              this.pageRecommend = []
            }
          }
        }
      } catch (err) {}
    },
    async __ag__getScheduleMatch__() {
      try {
        let uid = this.uid
        let resp = await this.__ag__pageUpSche__({ uid })
        if (resp.success) {
          if (resp && resp.data && resp.data.list) {
            this.upScheList = resp.data.list
          }
        }
      } catch (err) {}
    },
    onclose() {
      this.isreport = false
    },
    __ag_black__() {
      util.message("已拉黑，主播将不能对您私信")
    },
    __ag_report__() {
      this.isreport = true
    },
    __ag__cancelFollow__() {
      this.$emit("cancelFollow", this.item)
    },
    __ag__followTap__() {
      this.$emit("followTap", this.item)
    },
    clickAutor(img) {
      if (this.isDetail) {
        if (img) {
          this.imgPopupUrl = img
          this.imgPopup = true
        }

        return
      }

      let params = {
        uid: this.uid,
      }
      util.getPush("__ag__anchorDetails__", params)
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__upinfo_scroller__ {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding-bottom: 16wx;
}
.__ag__upinfo_top__ {
  padding: 16wx;
  border-top-style: solid;
  background-color: @white;
  border-top-width: 1wx;
  border-top-color: @gray5;
  padding-bottom: 20wx;
}
.__ag__upinfotitle__ {
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
}
.__ag__upinfo_lf__ {
  flex: 1;
  flex-direction: row;
  align-items: center;
}
.__ag__upinfotitleimg__ {
  width: 100px;
  height: 100px;
  font-size: 50px;
}
.__ag__upinfo_avatodr__ {
  width: 100px;
  font-size: 50px;
  margin-right: 22px;
  border-radius: 50wx;
  position: relative;
}
.__ag__live_statue__ {
  width: 56px;
  height: 22px;
  position: absolute;
  bottom: -2px;
  left: 22px;
  right: 22px;
}
.__ag__live_statue_text__ {
  line-height: 22px;
  font-size: 8wx;
  color: @white;
  background-color: @primary;
  text-align: center;
  border-radius: 4px;
}
.__ag__nolive_statue_text__ {
  line-height: 22px;
  font-size: 8wx;
  color: @white;
  background-color: @gray39;
  border-radius: 4px;
}
.__ag__upinfoname__ {
  flex: 1;
}
.__ag__upinfo_top_item__ {
  flex: 1;
  flex-direction: row;
  align-items: center;
}
.__ag__upinfonametext__ {
  text-align: center;
  font-weight: 600;
  font-size: 30px;
  color: @black;
}
.__ag__report_item__ {
  padding-left: 10px;
  padding-right: 10px;
  height: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-style: solid;
  border-width: 1px;
  border-color: @gray40;
  border-radius: 30px;
  margin-left: 15px;
  padding-bottom: 2px;
}
.__ag__upinfofollow__ {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5wx;
}
.__ag__like__ {
  color: @gray39;
  font-size: 13wx;
}
.__ag__upinfofollowtext__ {
  color: @gray39;
  font-size: 13wx;
}
.__ag__upinfo_rg__ {
  flex: 0.6;
  padding-left: 35wx;
  align-items: flex-end;
}
.__upinfo_rg_time__ {
  font-style: normal;
  font-weight: 400;
  font-size: 11wx;
  color: rgba(0, 0, 0, 0.4);
}
.__upinfo_rg_icon__ {
  margin-top: 10wx;
}
.good-level {
  font-size: 20wx;
}
.__upinfo_rg_t__ {
  flex-direction: row;
  padding-left: 5wx;
  padding-right: 5wx;
  justify-content: space-between;
  padding-top: -5wx;
}
.__ag__upinfo_bottom__ {
  flex: 1;
  flex-direction: row;
  align-items: center;
}
._rg_t_text {
  text-align: center;
  font-style: normal;
  font-weight: 400;
  font-size: 13wx;
  color: @gray39;
  margin-top: 5wx;
  margin-right: 15px;
}
.__ag__upinfobody__ {
  display: -webkit-inline-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  margin-bottom: 32px;
  margin-top: 34px;
}
.__ag__upinfotext__ {
  font-size: 26px;
  color: @black;
  line-height: 40px;
}
.__ag__upinfobottom__ {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.__ag__upinfobottomlh__.isfollow {
  border-radius: 4px;
  border-style: solid;
  border-width: 0px;
  border-color: @primary;
}
.__ag__upinfobottomfo__ {
  width: 160px;
  border-style: solid;
  border-width: 1px;
  border-radius: 40px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__follow-no__ {
  background-color: @primary;
  border-color: @primary;
}
.__ag__follow-yes__ {
  background-color: @button-bg-color;
  border-color: @button-bg-color;
}
.__ag__upinfobottomba__ {
  margin-left: 10px;
}
.__ag__upinfobottomlh__ {
  flex: 1;
  border-style: solid;
  border-width: 1px;
  border-color: @primary;
  box-sizing: border-box;
  border-radius: 4px;
  height: 68px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__upinfobottomtext__ {
  font-weight: 500;
  font-size: 26px;
  line-height: 36px;
  color: @white;
}
.yes-text {
  color: @primary;
}
.__ag__vector__ {
  font-size: 20wx;
  color: @white;
  margin-right: 8px;
  font-weight: 500;
}
.yes-icon {
  color: @primary;
  font-size: 15wx;
}
.report-text {
  color: @gray57;
  font-size: 12wx;
}
.__ag__iconlh__ {
  font-size: 16wx;
  color: @gray57;
  margin-right: 4px;
}
.__ag__upinforeport__ {
  position: fixed;
  width: 750px;
  top: 380.875px;
  bottom: 0px;
  /* background-color: red; */
}
.__ag__upinfo_match__ {
  width: 750px;
  margin-bottom: 40px;
  margin-top: 32px;
}
.__ag__upinfo_match_text__ {
  flex: 1;
  line-height: 40px;
  color: @black;
  font-size: 14wx;
  font-weight: 600;
  padding-left: 32px;
  padding-right: 32px;
  margin-bottom: 15px;
}
.__ag__matchscroll__ {
  display: flex;
  flex-direction: row;
  height: 200px;
  padding-left: 32px;
  padding-right: 32px;
}
.__ag__upinfo_info__ {
  width: 750px;
}
.info-top {
  height: 37wx;
  background-color: @white;
  border-style: solid;
  border-width: 1wx;
  border-color: @gray5;
  display: flex;
  flex-direction: row;
}
.info-tab-item {
  flex: 1;
  height: 35wx;
  line-height: 35wx;
  font-style: normal;
  font-weight: 500;
  font-size: 14wx;
  text-align: center;
  letter-spacing: 0.05em;
  color: @black;
}
.info-border {
  border-right-style: solid;
  border-right-width: 1wx;
  border-right-color: @gray5;
}
.tab-select {
  color: @primary;
  border-bottom-style: solid;
  border-bottom-width: 2wx;
  border-bottom-color: @primary;
}
.__ag__upinfo_content__ {
  width: 750px;
  padding-left: 32px;
  padding-right: 32px;
  margin-top: 30px;
}
.__ag__upinfo_text__ {
  flex: 0.6;
  font-size: 14wx;
  color: @gray17;
  font-weight: 500;
  text-align: center;
  padding: 20wx;
}
.__ag__imgpopup__ {
  width: 750px;
  background-color: @black20;
  position: fixed;
  top: 0px;
  bottom: 0px;
  align-items: center;
  justify-content: center;
}
.__ag__imgpopupurl__ {
  width: 750px;
  height: 500px;
}
</style>
