<template>
  <div
    class="__ag__recommeds-details-main__"
    :class="[ipx ? 'ipx' : '']"
    v-if="item && item.id"
  >
    <ag-hbtitle :isback="true" title="推荐详情"></ag-hbtitle>
    <div class="__ag__recommeds-details-constent__">
      <scroller class="__ag__recommeds-list" show-scrollbar="false">
        <div class="recommeds-details-top">
          <text class="details-title">{{ item.title }}</text>
          <div class="details-info">
            <div class="info-lf">
              <user-img
                class="__ag__recom-img__"
                :avatar="
                  item &&
                  item.joinMap &&
                  item.joinMap.u &&
                  item.joinMap.u.avatar
                "
                :fontSize="true"
                :uid="item.uid"
                :name="
                  item &&
                  item.joinMap &&
                  item.joinMap.u &&
                  item.joinMap.u.userNicename
                "
              ></user-img>
              <text class="__ag__user-name__">{{
                item &&
                item.joinMap &&
                item.joinMap.u &&
                item.joinMap.u.userNicename
              }}</text>
            </div>
            <div class="info-rg">
              <!-- <text v-if="!isGood" class="agiconfont thumbs thumbs-icon" @click="editGood(1)">&#xe694;</text>
                            <text v-else class="agiconfont goodcolor thumbs-icon"  @click="editGoodCancel">&#xec63;</text>
                            <text class="thumbs-text thumbs-one" :class="[isGood?'goodcolor':'']">{{item.goods}}</text>
                            <text v-if="!isBad" class="agiconfont thumbs-copy thumbs-icon"  @click="editGood(-1)">&#xec60;</text>
                            <text v-else class="agiconfont goodcolor thumbs-icon"  @click="editGoodCancel">&#xe69d;</text>
                            <text class="thumbs-text" :class="[isBad?'goodcolor':'']">{{item.bads}}</text> -->
            </div>
          </div>
        </div>
        <div class="recommeds-details-middle">
          <text class="__item-text">推荐比赛：</text>
          <div class="item-cell middle-cell">
            <text class="__item-span middle-span">{{
              status[item.joinMap.sche.status]
            }}</text>
            <text class="__item-span middle-span"
              >{{ forTypeDate(item.createTime) }}
              {{ formatTime(item.createTime) }}</text
            >
          </div>
          <div class="middle-team">
            <div class="__ag__match-team-a-text__">
              <text class="__ag__match-team-teamName__ teama-teamName">{{
                item.joinMap && item.joinMap.sche && item.joinMap.sche.teamNamea
              }}</text>
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
            <text class="vs-text">VS</text>
            <div class="__ag__match-team-a-text__ __ag__match-team-b-text__">
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
              <text class="__ag__match-team-teamName__ teamb-teamName">{{
                item.joinMap && item.joinMap.sche && item.joinMap.sche.teamNameb
              }}</text>
            </div>
          </div>
        </div>
        <div class="recommeds-item-box">
          <div class="item-cell">
            <text class="__item-text">推荐标的：</text>
            <text class="__item-span">{{ item.target }}</text>
          </div>
          <div class="item-cell-box">
            <text class="__item-text">推荐理由：</text>
            <text class="__item-span span-text">{{ item.reason }}</text>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import agMinix from "./components/__ag__minix__.js"
import hbtitle from "./components/__ag__headTop__.vue"
import util from "./components/util.js"
import bc from "./components/__ag__bc__.js"
import userImg from "./components/__ag__userImg__.vue"
import teamLogo from "./components/__ag__teamLogo__.vue"
export default {
  mixins: [agMinix],
  components: {
    "ag-hbtitle": hbtitle,
    "user-img": userImg,
    "team-logo": teamLogo,
  },
  data() {
    return {
      status: [
        "比赛未开始",
        "比赛进行中",
        "比赛已结束",
        "已取消",
        "待定",
        "中断",
        "已推迟",
        "腰斩",
      ],
      a__ag__user__: {},
      loading: false,
    }
  },
  computed: {
    item() {
      let resp = this.a__ag__pageRecommed__
      if (!resp || !resp.data || !resp.data.list) {
        return []
      }
      let list = resp.data.list[0]
      return list
    },
    isGood() {
      if (!this.item) {
        return false
      }
      return (
        this.item.good ||
        (this.item.joinMap &&
          this.item.joinMap.good &&
          this.item.joinMap.good.good == 1)
      )
    },
    isBad() {
      if (!this.item) {
        return false
      }
      return (
        this.item.bad ||
        (this.item.joinMap &&
          this.item.joinMap.good &&
          this.item.joinMap.good.good == -1)
      )
    },
  },
  destroyed() {
    bc.postMessage("afreshData")
  },
  methods: {
    async __ag__loadData__() {
      let data = util.getUrlParam(weex.config.bundleUrl)
      let f = {
        id: data.id,
      }
      let that = this
      that.a__ag__user__ = util.getItem("user")
      const Steve = new BroadcastChannel("onlogin")
      Steve.onmessage = async function (event) {
        that.a__ag__user__ = event.data
        await that.__ag__pageRecommed__(f)
      }
      await this.__ag__pageRecommed__(f)
    },
    formatTime(date) {
      return util.formatTime(date)
    },
    forTypeDate(date) {
      let dateDay = util.forTypeDate(date)
      if (dateDay.split(0, 1) == 0) {
        return dateDay.substr(1, dateDay.length - 1)
      }
      return dateDay
    },
    async editGood(good) {
      if (!this.a__ag__user__ || this.a__ag__user__.userType == 3) {
        util.getPush("__ag__login__")
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true
      let item = this.item
      let f = { type: 2, refId: item.id, good }
      try {
        let resp = await this.__ag__editGood__(f)
        if (resp && resp.success) {
          this.loading = false
          util.message(resp.message)
          this.item.joinMap.good = resp.data
          if (good == 1) {
            this.$set(item, "good", true)
            this.$set(item, "bad", false)
            item.goods++
          } else {
            this.$set(item, "good", false)
            this.$set(item, "bad", true)
            item.bads++
          }
        }
      } catch (err) {
        this.loading = false
        util.message(err.message)
      }
    },
    async editGoodCancel() {
      if (!this.a__ag__user__ || this.a__ag__user__.userType == 3) {
        util.getPush("__ag__login__")
        return
      }
      if (this.loading) {
        return
      }
      let item = this.item
      let id = this.item.joinMap.good.id
      try {
        let resp = await this.__ag__editGoodCancel__(id)
        if (resp && resp.success) {
          this.loading = false
          util.message(resp.message)
          if (this.isGood) {
            this.$set(item, "good", false)
            this.item.goods -= 1
          }
          if (this.isBad) {
            this.$set(item, "bad", false)
            this.item.bads -= 1
          }
          this.item.joinMap.good = []
        }
      } catch (err) {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import "./style/theme.less";
.__ag__recommeds-details-main__ {
  width: 750px;
  position: fixed;
  top: 128px;
  bottom: 0px;
}
.ipx {
  top: 166px;
}
.__ag__recommeds-details-constent__ {
  flex: 1;
  padding: 16wx;
  background-color: @white;
  padding-bottom: 160px;
}
.__ag__recommeds-list {
  flex: 1;
}
.recommeds-details-top {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: @green6;
  padding-bottom: 20wx;
}
.details-title {
  font-style: normal;
  font-weight: 500;
  font-size: 24wx;
  line-height: 28wx;
  color: @black;
}
.details-info {
  height: 28wx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20wx;
  align-items: center;
}
.info-lf {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.__ag__recom-img__ {
  width: 28wx;
  height: 28wx;
  border-radius: 50wx;
}
.__ag__user-name__ {
  font-style: normal;
  font-weight: 500;
  font-size: 16wx;
  line-height: 19wx;
  color: @black;
  margin-left: 8wx;
}
.info-rg {
  height: 25wx;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.goodcolor {
  color: @yellow8;
}
.thumbs-icon {
  font-size: 20wx;
}
.thumbs-text {
  margin-left: 5wx;
}
.thumbs-one {
  margin-right: 20wx;
}
.recommeds-item-box {
  padding-top: 20wx;
}
.item-cell {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10wx;
}
.middle-cell {
  justify-content: flex-start;
  padding-top: 20px;
  padding-bottom: 20px;
}
.__item-text {
  font-style: normal;
  font-weight: 900;
  font-size: 16wx;
  color: @primary;
}
.__item-span {
  font-style: normal;
  font-weight: normal;
  font-size: 16wx;
  color: @black50;
}
.middle-span {
  flex: 1;
}
.span-text {
  margin-top: 10wx;
  line-height: 28wx;
}
.recommeds-details-middle {
  padding-top: 40px;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: @green6;
  padding-bottom: 56px;
}
.middle-team {
  flex-direction: row;
  align-items: center;
}
.__ag__match-team-a-text__ {
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.__ag__match-team-b-text__ {
  justify-content: flex-start;
}
.vs-text {
  font-style: normal;
  font-weight: 600;
  font-size: 20wx;
  color: @black;
  margin-left: 40px;
  margin-right: 40px;
}
.__ag__match-team-teamName__ {
  flex: 1;
  font-style: normal;
  font-weight: 600;
  font-size: 16wx;
  color: @black;
  lines: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.teama-teamName {
  margin-right: 15px;
  text-align: right;
}
.teamb-teamName {
  margin-left: 15px;
  text-align: left;
}
</style>
