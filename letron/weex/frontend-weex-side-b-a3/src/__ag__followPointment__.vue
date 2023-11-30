<template>
  <div class="__ag__follow-main__">
    <ag-hbtitle :isback="true" title="关注和预约"></ag-hbtitle>
    <div class="__ag__follow-tab__">
      <div
        class="__ag__follow-tab-item__ tab-item-one"
        :class="[tab == 1 ? 'tab-select' : '']"
        @click="onTab(1)"
      >
        <text :class="[tab == 1 ? 'tab-select-text' : '']" class="tab-item-text"
          >关注主播</text
        >
      </div>
      <div
        class="__ag__follow-tab-item__ tab-item-two"
        :class="[tab == 2 ? 'tab-select' : '']"
        @click="onTab(2)"
      >
        <text :class="[tab == 2 ? 'tab-select-text' : '']" class="tab-item-text"
          >预约比赛</text
        >
      </div>
    </div>
    <div class="__ag__follow-content__">
      <div class="__ag__follow-title" v-if="tab == 1">
        <text class="title-item-text">主播</text>
        <text class="title-item-text title-item-cent">直播中比赛</text>
        <text class="title-item-rg">操作</text>
      </div>
      <scroller
        class="__ag__follow-body-scroll__"
        :show-scrollbar="false"
        v-if="tab == 1"
      >
        <div
          class="__ag__follow-no-data__"
          v-if="!a__ag__listFollowList || !a__ag__listFollowList.length"
        >
          <text class="no-data-text">暂无订阅信息</text>
        </div>
        <div
          class="__ag__follow-list-item__"
          v-for="(item, index) in a__ag__listFollowList"
          :key="'follow-' + item.id"
          @click="__ag__goLive__(item)"
        >
          <div class="list-item-streamer">
            <div class="streamer-avatar">
              <image
                class="streamer-image"
                v-if="
                  item.joinMap &&
                  item.joinMap.streamer &&
                  item.joinMap.streamer.avatar
                "
                :src="__ag__url__(item.joinMap.streamer.avatar)"
              ></image>
              <text class="streamer-text" v-else>{{ charName(item) }}</text>
            </div>
            <text class="streamer-name">{{
              item.joinMap &&
              item.joinMap.streamer &&
              item.joinMap.streamer.userNicename
            }}</text>
          </div>
          <div
            class="list-item-team"
            v-if="item.joinMap && item.joinMap.live && item.joinMap.live.islive"
          >
            <div class="list-team">
              <div class="team-flag">
                <div class="flag-pic">
                  <!-- <image class="streamer-image" v-if="item.joinMap && item.joinMap.sche && item.joinMap.sche.teamFlaga" :src="__ag__url__(item.joinMap.sche.teamFlaga)"></image>
									<text class="streamer-text" v-else>{{item.joinMap && item.joinMap.sche && item.joinMap.sche.teamNamea.charAt(0) }}</text> -->
                  <team-logo
                    teamType="1"
                    :teamFlag="
                      item.joinMap &&
                      item.joinMap.sche &&
                      item.joinMap.sche.teamFlaga
                    "
                    :teamName="
                      item.joinMap &&
                      item.joinMap.sche &&
                      item.joinMap.sche.teamNamea
                    "
                    class="__ag__team__"
                  ></team-logo>
                </div>
              </div>
              <text class="team-name">{{
                item.joinMap && item.joinMap.sche && item.joinMap.sche.teamNamea
              }}</text>
              <text class="team-score">{{
                item.joinMap && item.joinMap.sche && item.joinMap.sche.scorea
              }}</text>
            </div>
            <div class="list-team list-team2">
              <div class="team-flag">
                <div class="flag-pic">
                  <!-- <image class="streamer-image" v-if="item.joinMap && item.joinMap.sche && item.joinMap.sche.teamFlagb" :src="__ag__url__(item.joinMap.sche.teamFlagb)"></image>
									<text class="streamer-text" v-else>{{item.joinMap && item.joinMap.sche && item.joinMap.sche.teamNameb.charAt(0) }}</text> -->
                  <team-logo
                    teamType="2"
                    :teamFlag="
                      item.joinMap &&
                      item.joinMap.sche &&
                      item.joinMap.sche.teamFlagb
                    "
                    :teamName="
                      item.joinMap &&
                      item.joinMap.sche &&
                      item.joinMap.sche.teamNameb
                    "
                    class="__ag__team__"
                  ></team-logo>
                </div>
              </div>
              <text class="team-name">{{
                item.joinMap && item.joinMap.sche && item.joinMap.sche.teamNameb
              }}</text>
              <text class="team-score score2">{{
                item.joinMap && item.joinMap.sche && item.joinMap.sche.scoreb
              }}</text>
            </div>
          </div>

          <div
            class="list-item-status"
            v-if="item.joinMap && item.joinMap.live && item.joinMap.live.islive"
          >
            <div class="list-playing">
              <div class="playing-status"></div>
              <text class="playing-text">正在直播</text>
            </div>
            <div class="list-cancel">
              <div class="cancel-box" @click.stop="cancelFollow(item, index)">
                <text class="list-cancel-text">取消订阅</text>
              </div>
            </div>
          </div>
          <!-- 主播不在家 -->
          <div
            class="__ag__follow-noplaying__"
            v-if="
              item.joinMap && item.joinMap.live && !item.joinMap.live.islive
            "
            @click="__ag__goLive__(item)"
          >
            <div class="list-item-notAtHome">
              <text class="list-item-notAtHome-text">主播现在不在家</text>
            </div>
          </div>
          <div
            class="list-item-status"
            v-if="
              item.joinMap && item.joinMap.live && !item.joinMap.live.islive
            "
          ></div>
          <!-- 主播不在家 -->
        </div>
      </scroller>

      <scroller
        class="__ag__follow2-body-scroll__"
        :show-scrollbar="false"
        v-if="tab == 2"
      >
        <div
          class="__ag__follow-no-data__"
          v-if="!pageUserMatchList2 || !pageUserMatchList2.length"
        >
          <text class="no-data-text">暂无预约比赛信息</text>
        </div>
        <div
          class="__ag__follow-list-box__"
          v-for="(item, index) in pageUserMatchList2"
          :key="'follow-' + item.id"
        >
          <div class="match-date" v-if="item.date">
            <text class="datetext">{{ date(item) }}</text>
            <text class="datetext">{{ week(item) }}</text>
          </div>
          <div
            class="__ag__follow-box-item__"
            @click="__ag__onMatchDetails__(item)"
          >
            <div class="list-item-match">
              <text class="match-time">{{
                util.formatTime(item.beginTime)
              }}</text>
              <text class="match-name">{{
                item.sche && item.sche.matchName
              }}</text>
            </div>
            <div class="list-item-team">
              <div class="list-team">
                <div class="team-flag">
                  <div class="flag-pic">
                    <!-- <image class="streamer-image" v-if="item.sche && item.sche.teamFlaga" :src="__ag__url__(item.sche.teamFlaga)"></image>
										<text class="streamer-text" v-else>{{ item.sche && item.sche.teamNamea && item.sche.teamNamea.charAt(0)}}</text> -->
                    <team-logo
                      teamType="1"
                      :teamFlag="item.sche && item.sche.teamFlaga"
                      :teamName="item.sche && item.sche.teamNamea"
                      class="__ag__team__"
                    ></team-logo>
                  </div>
                </div>
                <text class="team-name">{{
                  item.sche && item.sche.teamNamea
                }}</text>
                <text class="team-score">{{
                  item.sche && item.sche.status == 0
                    ? "-"
                    : item.sche && item.sche.scorea
                }}</text>
              </div>
              <div class="list-team list-team2">
                <div class="team-flag">
                  <div class="flag-pic">
                    <!-- <image class="streamer-image" v-if="item.sche && item.sche.teamFlagb" :src="__ag__url__(item.sche.teamFlagb)"></image>
										<text class="streamer-text" v-else>{{ item.sche && item.sche.teamNameb && item.sche.teamNameb.charAt(0)}}</text> -->
                    <team-logo
                      teamType="2"
                      :teamFlag="item.sche && item.sche.teamFlagb"
                      :teamName="item.sche && item.sche.teamNameb"
                      class="__ag__team__"
                    ></team-logo>
                  </div>
                </div>
                <text class="team-name">{{
                  item.sche && item.sche.teamNameb
                }}</text>
                <text class="team-score score2">{{
                  item.sche && item.sche.status == 0
                    ? "-"
                    : item.sche && item.sche.scoreb
                }}</text>
              </div>
            </div>
            <div class="list-item-status follow2-style">
              <!-- {{ item }} -->
              <div
                class="list-playing"
                v-if="
                  item.joinMap && item.joinMap.sche && item.joinMap.sche.islive
                "
              >
                <div class="playing-status"></div>
                <text class="playing-text">正在直播</text>
              </div>
              <div class="list-playing" v-else>
                <text class="not-start">{{ status[item.sche.status] }}</text>
              </div>

              <div class="list-cancel" v-if="handleIsShowCancelBtn(item)">
                <div class="cancel-box" @click="removeUserMatch(item, index)">
                  <text class="list-cancel-text">取消预约</text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
import agMinix from "./components/__ag__minix__.js"
import HbTitle from "./components/__ag__headTop__.vue"
import agMinUrl from "./components/__ag__minurl__.js"
import __ag__sport__ from "./components/__ag__sport__.js"
import bc from "./components/__ag__bc__.js"
import __ag__sportApi__ from "./components/__ag__sport_api__.js"
import userImg from "./components/__ag__userImg__.vue"
import util from "./components/util.js"
import teamLogo from "./components/__ag__teamLogo__.vue"
export default {
  mixins: [agMinix, agMinUrl],
  components: {
    "ag-hbtitle": HbTitle,
    userImg,
    "team-logo": teamLogo,
  },
  data() {
    return {
      tab: 1,
      a__ag__listFollowList: [],
      pageUserMatchList: [],
      status: [
        "未开始",
        "已开始",
        "已结束",
        "已取消",
        "待定",
        "中断",
        "已推迟",
        "腰斩",
      ],
      util,
    }
  },
  computed: {
    pageUserMatchList2() {
      if (!this.pageUserMatchList || !this.pageUserMatchList.length) {
        return []
      }
      let last = ""
      let list = this.pageUserMatchList
      list.forEach((r) => {
        let now = util.formatDate(r.beginTime)
        if (last == now) {
          r.date = ""
        } else {
          last = now
          r.date = r.beginTime
        }
      })
      return list
    },
  },
  methods: {
    charName(item) {
      if (item.joinMap && item.joinMap.streamer) {
        let name = item.joinMap.streamer.userNicename
        if (!name) {
          return ""
        }
        return name.charAt(0)
      }
    },
    __ag__goLive__(item) {
      let uid = item.streamerId
      if (item.joinMap && item.joinMap.live && item.joinMap.live.islive) {
        util.getPush("__ag__live__", { uid })
        return
      }
      util.getPush("__ag__anchorDetails__", { uid })
    },
    __ag__onMatchDetails__(item) {
      let id = item.scheduleId
      util.getPush("__ag__datalive__", { id })
    },
    date(item) {
      let date = item && item.date
      return util.formatDate(date, "MM月dd日")
    },
    week(item) {
      let date = item && item.date
      return util.formatWeek(date)
    },
    async onTab(t) {
      this.tab = t
      if (t == 1) {
        await this.__ag__loadData__()
        return
      }
      await this.pageUserMatch()
    },
    async __ag__loadData__() {
      try {
        await this.__ag__listFollow__({ status: 1 })
      } catch (err) {
        util.message(err.message)
      }

      bc.onmessage("cancelAppoint", this.cancelAppoint)
      bc.onmessage("makeAppoint", this.pageUserMatch)
    },
    async __ag__listFollow__(form) {
      try {
        let resp = await __ag__sportApi__.listFollow(form)
        let list = resp.data

        if (list && list.length > 0) {
          list.sort((a, b) => {
            return a.joinMap && a.joinMap.live && a.joinMap.live.islive ? -1 : 1
          })
          this.a__ag__listFollowList = list
          for (let i in list) {
            let r = list[i]
            this.$set(this.a__ag__listFollowMap__, r.streamerId, r)
          }
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    async pageUserMatch() {
      try {
        let resp = await this.__ag__getUserMatch__({ size: 100 })
        if (resp.success) {
          if (resp.data && resp.data.list && resp.data.list.length > 0) {
            let list = resp.data.list
            util.mergeJoin(list)
            console.log(list)
            this.pageUserMatchList = list
          }
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    async cancelFollow(item, index) {
      try {
        let resp = await this.__ag__editFollowCancel__({ id: item.id })
        if (resp.success) {
          bc.postMessage("cancelFollow", item)
          this.a__ag__listFollowList.splice(index, 1)
          util.message(resp.message)
          this.$delete(this.a__ag__listFollowMap__, item.id)
        }
      } catch (e) {
        util.message(e.message)
      }
    },
    cancelAppoint(event) {
      let index = this.pageUserMatchList.findIndex(
        (d) => d.scheduleId == event.data.scheduleId
      )
      if (index > -1) {
        this.pageUserMatchList.splice(index, 1)
      }
    },
    async removeUserMatch(item, index) {
      try {
        let resp = await this.__ag__removeUserMatch__({ id: item.id })
        if (resp.success) {
          this.pageUserMatchList.splice(index, 1)
          bc.postMessage("cancelAppoint", item)
          util.message(resp.message)
        }
      } catch (e) {
        util.message(e.message)
      }
    },
    handleIsShowCancelBtn(item) {
      // 只要預定的開始時間還沒開始，就必須要出現。
      if (!item || !item.beginTime) return false
      const nowTimeStamp = new Date().getTime()
      const beginTimeStamp = new Date(item.beginTime).getTime()
      const isRaceBegin = nowTimeStamp > beginTimeStamp

      return !isRaceBegin
    },
  },
}
</script>
<style scoped lang="less">
@import "./style/theme.less";
.title-item-text {
  flex: 0.6;
  font-size: 14wx;
  color: @black;
  font-weight: 500;
}
.title-item-cent {
  flex: 1;
  padding-left: 10wx;
}
.title-item-rg {
  width: 70wx;
  font-size: 14wx;
  color: @black;
  font-weight: 500;
  text-align: right;
}
.__ag__follow-main__ {
  width: 750px;
  background-color: @gray20;
  flex-direction: column;
}
.__ag__follow-tab__ {
  width: 750px;
  position: fixed;
  top: 103wx;
  padding: 16wx;

  flex-direction: row;
  justify-content: space-between;
}
.__ag__follow-tab-item__ {
  height: 68px;
  flex: 1;
  background-color: @white;
  border-style: solid;
  border-width: 1px;
  border-color: @primary;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.tab-select {
  background-color: @primary;
}
.tab-select-text {
  color: @white;
}
.tab-item-one {
  border-bottom-left-radius: 4wx;
  border-top-left-radius: 4wx;
}
.tab-item-two {
  border-bottom-right-radius: 4wx;
  border-top-right-radius: 4wx;
}
.tab-item-text {
  font-style: normal;
  font-weight: normal;
  font-size: 13wx;
  color: @primary;
}
.__ag__follow-content__ {
  width: 750px;
  flex: 1;
  position: absolute;
  top: 162wx;
  bottom: 0;
}
.__ag__follow-body-scroll__ {
  width: 750px;
  position: absolute;
  top: 45wx;
  bottom: 0;
  padding-bottom: 34px;
  background-color: @white;
}
.__ag__follow2-body-scroll__ {
  width: 750px;
  position: absolute;
  top: 45wx;
  top: 0px;
  bottom: 0;
  padding-bottom: 34px;
}
.__ag__follow-title {
  width: 750px;
  height: 45wx;
  padding-left: 16wx;
  padding-right: 16wx;
  flex-direction: row;
  background-color: @white;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: @gray22;
  border-bottom-style: solid;
}
/*    .__ag__follow-list__ {
        width: 750px;

        padding-left: 16wx;
        padding-right: 16wx;
    } */
.__ag__follow-list-item__ {
  width: 750px;
  padding: 16wx;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1wx;
  border-bottom-color: @gray22;
  border-bottom-style: solid;
}
.__ag__follow-noplaying__ {
  flex: 1;
  background-color: @white;
  padding-left: 20wx;
}
.__ag__follow-body2 {
  margin-bottom: 10wx;
}
.list-date {
  height: 30wx;
  border-bottom-style: solid;
  border-bottom-color: @black40;
  border-bottom-width: 1px;
}
.list-date-text {
  font-size: 14wx;
  color: @black;
  font-weight: 600;
  line-height: 30wx;
  padding-left: 28px;
}
.list-item-streamer {
  flex: 0.6;
  flex-direction: row;
  height: 48px;
  align-items: center;
}
.list-item-notAtHome {
  flex: 1;
}
.list-item-notAtHome-text {
  line-height: 24wx;
  font-size: 13wx;
  color: @black50;
}
.list-item-match {
  flex: 0.7;
  flex-direction: column;
  padding-top: 2wx;
}
.match-lf {
  flex: 0.4;
}
.not-start {
  font-size: 10wx;
  color: @black40;
  line-height: 48px;
}
.match-name {
  margin-top: 10wx;
  font-size: 13wx;
  color: @black;
}
.match-time {
  display: block;
  font-size: 14wx;
  color: @black50;
}

.flag-pic,
.streamer-avatar {
  width: 48px;
  height: 48px;
  font-size: 24wx;
  text-align: center;
  background-color: @gray22;
  border-radius: 12wx;
  vertical-align: center;
  margin-right: 4wx;
}
.streamer-image {
  width: 48px;
  height: 48px;
  border-radius: 12wx;
}
.streamer-text {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  text-align: center;
  line-height: 48px;
  background-color: @gray20;
  font-size: 18wx;
}
.streamer-name {
  flex: 1;
  lines: 1;
  font-size: 13wx;
  font-weight: 400;
  line-height: 48px;
}
.list-item-team {
  flex: 1;
  padding-left: 10wx;
  padding-right: 10wx;
}
.list-playing {
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.playing-status {
  width: 8wx;
  height: 8wx;
  background-color: @redHot;
  border-radius: 4wx;
  margin-right: 5wx;
}
.list-team {
  height: 48px;
  flex-direction: row;
  justify-content: space-between;
}
.list-team2 {
  margin-top: 5wx;
}

.team-flag {
  width: 48px;
}
.team-name {
  flex: 1;
  lines: 1;
  padding-left: 5wx;
  font-size: 13wx;
  font-weight: 400;
  line-height: 48px;
}
.playing-text {
  font-size: 12wx;
  font-weight: 400;
  line-height: 48px;
}
.team-score {
  width: 30wx;
  line-height: 48px;
  margin-left: 5wx;
  font-size: 15wx;
  color: @black40;
}
.list-item-status {
  width: 70wx;
  text-align: right;
}

.list-cancel {
  align-items: flex-end;
  margin-top: 2wx;
}
.cancel-box {
  width: 66wx;
  height: 25wx;
  border-width: 1wx;
  border-radius: 3wx;
  border-color: @black40;
}
.list-cancel-text {
  font-size: 12wx;
  text-align: center;
  color: @black40;
  line-height: 25wx;
}
.match-date {
  width: 750px;
  height: 30wx;
  background-color: @white;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16wx;
  border-bottom-style: solid;
  border-bottom-width: 1wx;
  border-bottom-color: @gray22;
}
.datetext {
  font-style: normal;
  font-weight: 600;
  font-size: 13wx;
  letter-spacing: 0.05em;
  color: @black;
}
.__ag__follow-list-box__ {
  width: 750px;
  background-color: @white;
  margin-bottom: 10wx;
}
.__ag__follow-box-item__ {
  flex: 1;
  padding-left: 16wx;
  padding-right: 16wx;
  padding-top: 10wx;
  padding-bottom: 10wx;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.__ag__follow-no-data__ {
  width: 750px;
  padding-top: 35wx;
  padding-bottom: 35wx;
}
.no-data-text {
  text-align: center;
  font-size: 14wx;
  color: @gray17;
}
</style>
