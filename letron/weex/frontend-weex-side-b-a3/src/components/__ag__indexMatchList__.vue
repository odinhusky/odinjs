<template>
  <div
    class="__ag__matchlist__"
    v-if="listSchedule3 && listSchedule3.length > 0"
  >
    <scroller
      scroll-direction="horizontal"
      :show-scrollbar="false"
      class="__ag__matchscroll__"
    >
      <ag-matchitem
        v-for="item in listSchedule3"
        :key="item.id"
        :teamitem="item"
        :userMatchMap="userMatchMap"
        :user="user"
        :switchWorldcup="switchWorldcup"
      ></ag-matchitem>
      <div class="__ag__matchlistgd__" @click="gomatch">
        <text class="__ag__matchlistgdtext__">看更多精彩赛事</text>
      </div>
    </scroller>
  </div>
</template>

<script>
import matchitem from "./__ag__indexMatchItem__.vue"
import util from "./util.js"
import agMinix from "./__ag__minix__.js"
import sport from "./__ag__sport__.js"
export default {
  mixins: [agMinix],
  props: {
    netmatch: {
      type: Number,
      default: 0,
    },
    listHot: {
      type: Array,
      default: function () {
        return []
      },
    },
    matchList: {
      type: Array,
      default: function () {
        return []
      },
    },
    liveList: {
      type: Array,
      default: function () {
        return []
      },
    },
    requestList: {
      type: Array,
      default: function () {
        return []
      },
    },
    userMatchMap: {
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
    switchWorldcup: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    "ag-matchitem": matchitem,
  },
  data() {
    return {}
  },
  watch: {},
  computed: {
    listSchedule() {
      return this.listHot
    },
    userMatchList() {
      return this.matchList
    },
    userLiveList() {
      if (!this.liveList || !this.liveList.length) {
        return []
      }
      return this.liveList
    },
    userRequestList() {
      return this.requestList
    },
    listSchedule3() {
      // 用户已预约的比赛
      let userMatchList = this.userMatchList || []
      // 所有正在直播的比赛
      let allLiveMatches = this.userLiveList || []
      // 申请未上播的比赛
      let allRequestMatches = this.userRequestList || []
      // 热门比赛
      let allHotMatchs = this.listSchedule || []
      // 正在直播和申请未上播的比赛
      let allLiveAndScheduledMatches = this.__ag__formattedMatchList__(
        allLiveMatches,
        allRequestMatches
      )
      //从已预约的比赛 帅选直播中的比赛
      let userSubscribedLiveMatch = userMatchList.filter(
        (match) =>
          match.joinMap && match.joinMap.sche && match.joinMap.sche.islive === 1
      )
      // 从正在直播和申请未上播的比赛 帅选直播中的比赛
      const liveFormattedMatchesList = allLiveAndScheduledMatches.filter(
        (match) => match.islive === 1
      )
      // 从正在直播和申请未上播的比赛 帅选未直播的比赛
      const notLiveScheduledMatchList = allLiveAndScheduledMatches.filter(
        (match) => match.islive === 0
      )
      // 从所有直播中的比赛和已预约正在直播的比赛筛选出同一场的比赛
      const liveMatchUserSubscribed = liveFormattedMatchesList.filter((m1) =>
        userSubscribedLiveMatch.some(
          (m2) => m1.uid.toString() === m2.joinMap.sche.uid
        )
      )
      // 筛选已推荐的比赛
      const backendRecommendedMatches = allHotMatchs.filter(
        (m) => m.joinMap.hot_match.status == 1
      )
      // 从已推荐的比赛筛选正在直播的比赛
      const backendRecommendedMatches_live = backendRecommendedMatches.filter(
        (m) => m.islive === 1
      )
      // 筛选出同一个主播直播中的比赛
      const formattedBackendRecommendedMatches_live = liveFormattedMatchesList
        .filter((m1) =>
          backendRecommendedMatches_live.some(
            (m2) => m2.uid.split(",").indexOf(m1.uid.toString()) !== -1
          )
        )
        .filter(
          (m3) => !liveMatchUserSubscribed.some((m4) => m3.uid === m4.uid)
        )
      // 从已推荐的比赛筛选未直播的比赛
      const backendRecommendedMatches_not_live =
        backendRecommendedMatches.filter((m) => m.islive !== 1)
      // 从预约未上播和已推荐未上播的比赛筛选同一场比赛
      const formattedBackendRecommendedMatches_not_live_with_streamer =
        notLiveScheduledMatchList.filter((m1) =>
          backendRecommendedMatches_not_live.some(
            (m2) => m1.scheduleId.toString() === m2.id.toString()
          )
        )
      // 从已推荐的比赛筛选未直播的比赛筛选同一场比赛
      const formattedBackendRecommendedMatches_not_live_without_streamer =
        backendRecommendedMatches_not_live.filter(
          (m1) =>
            !formattedBackendRecommendedMatches_not_live_with_streamer.some(
              (m2) => m1.id === m2.id
            )
        )
      // 筛选一场比赛多个主播的比赛
      const allOtherLiveMatches = liveFormattedMatchesList
        .filter(
          (m1) => !liveMatchUserSubscribed.some((m2) => m1.uid === m2.uid)
        )
        .filter(
          (m1) =>
            !formattedBackendRecommendedMatches_live.some(
              (m2) => m1.uid === m2.uid
            )
        )
      // 筛选预约未直播的比赛
      const userSubscribedNotLiveMatch = userMatchList.filter(
        (match) =>
          match.joinMap && match.joinMap.sche && match.joinMap.sche.islive === 0
      )
      // 从所有直播中的比赛和已预约正在直播的比赛筛选出同一场的比赛排序
      const sortedUserSubscribedLiveMatches = this.getSortedMatchList(
        liveMatchUserSubscribed
      )
      // 筛选出同一个主播直播中的比赛排序
      const sortedBackendRecommendLiveMatches = this.getSortedMatchList(
        formattedBackendRecommendedMatches_live
      )
      // 筛选一场比赛多个主播的比赛排序
      const sortedOtherLiveMatches =
        this.getSortedMatchList(allOtherLiveMatches)
      // 筛选预约未直播的比赛排序
      const sortedNotLiveMatchUserSubscribed = this.getSortedMatchList(
        this.xxformattedMatchList(userSubscribedNotLiveMatch)
      )
      // 从已推荐的比赛筛选未直播的比赛排序
      const sortedNotLiveBackendRecommendedMatches = this.getSortedMatchList(
        this.getSortedMatchList(
          this.__ag__formattedMatchList__(
            [],
            backendRecommendedMatches_not_live
          )
        )
      )
      // 从预约未上播和已推荐未上播的比赛筛选同一场比赛排序
      const sortedNotLiveBackendRecommendedMatchesWithStreamer =
        this.getSortedMatchList(
          formattedBackendRecommendedMatches_not_live_with_streamer
        )
      // 从已推荐的比赛筛选未直播的比赛筛选同一场比赛排序
      const sortedNotLiveBackendRecommendedMatchesWithoutStreamer =
        this.getSortedMatchList(
          this.__ag__formattedMatchList__(
            [],
            formattedBackendRecommendedMatches_not_live_without_streamer
          )
        )
      // 筛选出所有未开始的比赛
      const allOtherNotLiveMatchList = notLiveScheduledMatchList
        .filter(
          (m1) =>
            !sortedNotLiveBackendRecommendedMatches.some(
              (m2) => m1.id === m2.id
            )
        )
        .filter(
          (m3) =>
            !sortedNotLiveMatchUserSubscribed.some((m4) => m3.id === m4.id)
        )
      // 未开始的比赛排序
      const sortedAllOtherNotLiveMatches = this.getSortedMatchList(
        allOtherNotLiveMatchList
      )

      const finalShowMatchList = [
        ...sortedUserSubscribedLiveMatches, // subscribed live matches
        ...sortedBackendRecommendLiveMatches, // backend recommend live matches
        ...sortedOtherLiveMatches, // other that subscribed and recommend live matches

        ...sortedNotLiveMatchUserSubscribed, // subscribed not live matches
        ...sortedNotLiveBackendRecommendedMatchesWithStreamer, // recommend not live matches with streamer
        ...sortedNotLiveBackendRecommendedMatchesWithoutStreamer, // recommend not live matches without streamer
        ...sortedAllOtherNotLiveMatches, // all other not live matches
      ]

      return finalShowMatchList.length > 12
        ? finalShowMatchList.slice(0, 12)
        : finalShowMatchList
    },
    listSchedule1() {
      if (!this.listSchedule || !this.listSchedule.length) {
        return []
      }
      let list = this.listSchedule
      if (list.length > 12) {
        return list.slice(0, 12)
      }
      return list
    },
    listSchedule2() {
      if (!this.listSchedule || !this.listSchedule.length) {
        return []
      }

      let t10 = new Date().getTime() - 10 * 60 * 1000
      let list = this.listSchedule
        .sort((a, b) => {
          if (!!a.uid == !!b.uid) {
            return a.beginTime > b.beginTime ? 1 : -1
          }
          return b.uid ? 1 : -1
        })
        .filter((a) => {
          if (a.uid) {
            return true
          }
          let t = util.parseDate(a.beginTime).getTime()
          if (t < t10) {
            return false
          }
          return true
        })
      if (list.length > 12) {
        return list.slice(0, 12)
      }
      return list
    },
  },
  mounted() {},
  methods: {
    getSortedMatchList(matchList) {
      let sortedList = []
      if (matchList && matchList.length > 0) {
        // 1. sorted by number of streamer
        sortedList = matchList.sort(
          (m1, m2) => m2.lives.length - m1.lives.length
        )

        // 2. if number of streamer same, then sort by match begin time
        sortedList.sort((m1, m2) => {
          if (m1.lives.length === m2.lives.length) {
            return (
              util.parseDate(m1.beginTime).getTime() -
              util.parseDate(m2.beginTime).getTime()
            )
          }
        })

        // 3. if number of streamer same && match begin time is same, sort by matcId
        sortedList.sort((m1, m2) => {
          if (
            m1.lives.length === m2.lives.length &&
            util.parseDate(m1.beginTime).getTime() ===
              util.parseDate(m2.beginTime).getTime()
          ) {
            return m1.matchId - m2.matchId
          }
        })

        return sortedList
      }

      return sortedList
    },
    xxformattedMatchList(scheduledMatchesList) {
      const liveTabRawList = []

      if (scheduledMatchesList.length > 0) {
        for (let i = 0; i < [...scheduledMatchesList, ...[]].length; i++) {
          const item = [...scheduledMatchesList, ...[]][i]
          item.islive = 0
          let match = item && item.joinMap && item.joinMap.match
          let u = item && item.joinMap && item.joinMap.u
          let sche = item && item.joinMap && item.joinMap.sche
          const object = {
            title: item && item.joinMap && item.joinMap.matchName,
            beginTime: item.beginTime,
            id: item.scheduleId,
            scheduleId: item.scheduleId,
            joinMap: {
              cls: {},
              ip_country: {},
              match: {
                name: match && match.name,
                nameAbbr: match && match.nameAbbr,
                thumb: match && match.thumb,
              },
              u: {
                avatar: u && u.avatar,
                userNicename: u && u.userNicename,
              },
            },
            lives: [],
            matchName: sche && sche.matchName,
            scheduleClass: item.scheduleClass,
            scorea: sche && sche.scorea,
            scoreb: sche && sche.scoreb,
            season: sche && sche.season,
            source: sche && source,
            status: sche && status,
            teamFlaga: sche && teamFlaga,
            teamFlagb: sche && teamFlagb,
            teamIda: sche && teamIda,
            teamIdb: sche && teamIdb,
            teamNamea: sche && teamNamea,
            teamNameb: sche && teamNameb,
          }
          liveTabRawList.push(object)
        }
      }

      const groupedMatches = liveTabRawList.reduce((arr, match) => {
        const existMatch = arr.find(
          (m) =>
            m.matchId === match.matchId &&
            m.beginTime === match.beginTime &&
            m.scheduleId === match.scheduleId
        )
        if (existMatch) existMatch.lives = [...existMatch.lives, ...match.lives]
        else arr.push(match)
        return arr
      }, [])

      return groupedMatches
    },
    __ag__formattedMatchList__(liveMatchesList, requesetMatchesList) {
      const liveTabRawList = []
      if (liveMatchesList && liveMatchesList.length) {
        for (let i in liveMatchesList) {
          const liveObj = liveMatchesList[i]
          let match = liveObj && liveObj.joinMap && liveObj.joinMap.match
          let schedule = liveObj && liveObj.joinMap && liveObj.joinMap.schedule
          let users = liveObj && liveObj.joinMap && liveObj.joinMap.user
          const obj = {
            title: liveObj.title,
            isRecommended:
              liveObj &&
              liveObj.joinMap &&
              liveObj.joinMap.hot_match &&
              liveObj.joinMap.hot_match.status,
            beginTime: schedule && schedule.beginTime,
            id: liveObj.id,
            ignoreUpdate: 0,
            islive: liveObj.islive,
            joinMap: {
              ip_country: {},
              match: {
                hot: match && match.hot,
                name: match && match.name,
                nameAbbr: match && match.nameAbbr,
                thumb: match && match.thumb,
              },
              user: {
                app: users && users.app,
                avatar: users && users.avatar,
                blackCount: users && users.blackCount,
                redCount: users && users.redCount,
                score: users && users.score,
                socketIndex: users && users.socketIndex,
                userNicename: users && users.userNicename,
              },
            },
            lives: [],
            matchId: liveObj.matchId,
            matchName: match && match.name,
            scheduleClass: liveObj.matchClassId,
            scorea: schedule && schedule.scorea,
            scoreb: schedule && schedule.scoreb,
            status: schedule && schedule.status,
            teamFlaga: schedule && schedule.teamFlaga,
            teamFlagb: schedule && schedule.teamFlagb,
            teamNamea: schedule && schedule.teamNamea,
            teamNameb: schedule && schedule.teamNameb,
            uid: liveObj.uid,
            scheduleId: liveObj.scheduleId,
          }
          obj.lives.push(liveObj)
          liveTabRawList.push(obj)
        }
      }
      if (requesetMatchesList && requesetMatchesList.length) {
        for (let i = 0; i < [...requesetMatchesList, ...[]].length; i++) {
          const item = [...requesetMatchesList, ...[]][i]
          item.islive = 0
          let match = item && item.joinMap && item.joinMap.match
          let cls = item && item.joinMap && item.joinMap.cls
          let u = item && item.joinMap && item.joinMap.u
          const object = {
            title: item.title,
            isRecommended:
              item &&
              item.joinMap &&
              item.joinMap.hot_match &&
              item.joinMap.hot_match.status,
            beginTime: item.beginTime,
            fid: item.fid,
            groupName: item.groupName,
            id: item.id,
            scheduleId: item.id,
            ignoreUpdate: item.ignoreUpdate,
            islive: item.islive,
            joinMap: {
              cls: {
                name: cls && cls.name,
                thumb: (cls && cls.thumb) || "",
              },
              ip_country: {},
              match: {
                hot: match && match.hot,
                name: match && match.name,
                nameAbbr: match && match.nameAbbr,
                thumb: match && match.thumb,
              },
              u: {
                avatar: u && u.avatar,
                userNicename: u && u.userNicename,
              },
            },
            lives: [item],
            matchId: item.matchId,
            matchName: item.matchName,
            scheduleClass: item.scheduleClass,
            scorea: item.scorea,
            scoreb: item.scoreb,
            season: item.season,
            source: item.source,
            status: item.status,
            teamFlaga: item.teamFlaga,
            teamFlagb: item.teamFlagb,
            teamIda: item.teamIda,
            teamIdb: item.teamIdb,
            teamNamea: item.teamNamea,
            teamNameb: item.teamNameb,
            ts: item.ts,
            uid: item.uid,
          }
          liveTabRawList.push(object)
        }
      }
      const groupedMatches = liveTabRawList.reduce((arr, match) => {
        const existMatch = arr.find(
          (m) =>
            m.matchId === match.matchId &&
            m.beginTime === match.beginTime &&
            m.scheduleId === match.scheduleId
        )
        if (existMatch) {
          existMatch.lives = [...existMatch.lives, ...match.lives]
        } else {
          arr.push(match)
        }
        return arr
      }, [])
      return groupedMatches
    },
    async __ag__hotpageSchedules__() {
      let f = {}
      f.page = 1
      f.size = 40
      f.hot = 1
      f.done = "0"
      f.time = util.formatDateTime(new Date())
      try {
        let resp = await this.__ag__pageSchedule__(f)
        if (resp && resp.data && resp.data.list) {
          this.listSchedule = resp.data.list
        }
      } catch (error) {
        util.message(error.message)
      }
    },
    gomatch() {
      this.$emit("gomatch")
    },
  },
}
</script>

<style lang="less">
@import "../style/theme.less";

.__ag__matchlist__ {
  width: 750px;
  height: 200px;
  margin-bottom: 20px;
}
.__ag__matchscroll__ {
  display: flex;
  flex-direction: row;
  height: 200px;
}
.__ag__matchlistgd__ {
  width: 300px;
  height: 200px;
  background-color: @white;
  border-radius: 8px;
  box-shadow: 0px 1px 3px @black10;
  flex-direction: column;
  padding: 16px;
  padding-right: 20px;
  padding-left: 20px;
  align-items: center;
  justify-content: center;
}
.__ag__matchlistgdtext__ {
  color: @primary;
  font-size: 13wx;
}
</style>
