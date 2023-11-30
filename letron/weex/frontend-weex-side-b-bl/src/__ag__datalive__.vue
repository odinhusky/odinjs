<template>
  <div class="__ag__datalive__">
    <ag-ipx bg="#000000"></ag-ipx>
    <div class="__ag__datalivevideo__">
      <ag-incomeLive :info="info" :user="a__ag__user__"></ag-incomeLive>
      <text class="agiconfont __ag__back__" @click="onclose">&#xe61d;</text>
    </div>
    <div class="__ag__livechathead__" @swipe="handleSwipe">
      <div class="__ag__livechattab__" @click="changeHandler({ index: 0 })">
        <text
          class="__ag__livechattabtext__"
          :class="[tab == 0 ? 'selected' : '']"
          >战绩</text
        >
      </div>
      <div class="__ag__livechattab__" @click="changeHandler({ index: 1 })">
        <text
          :class="[tab == 1 ? 'selected' : '']"
          class="__ag__livechattabtext__"
          >赛况</text
        >
      </div>
      <div class="__ag__livechattab__" @click="changeHandler({ index: 2 })">
        <text
          :class="[tab == 2 ? 'selected' : '']"
          class="__ag__livechattabtext__"
          >阵容</text
        >
      </div>
      <div class="__ag__livechattab__" @click="changeHandler({ index: 3 })">
        <text
          :class="[tab == 3 ? 'selected' : '']"
          class="__ag__livechattabtext__"
          >推荐</text
        >
      </div>
    </div>
    <slider
      class="__ag__datalivecontent__"
      interval="10"
      offset-x-accuracy="200"
      auto-play="false"
      infinite="false"
      @change="changeHandler"
      :index="tab"
      @swipe="handleSwipe"
    >
      <scroller
        class="__ag__datalivechatcontent__"
        :class="[ipx ? '__ag__datalivecontentipx__' : '']"
        show-scrollbar="false"
        v-for="item in tabList"
        :key="item.id"
      >
        <!-- 战绩 -->
        <ag-record
          v-if="item.id == 0"
          :info="info"
          :tab="tab"
          :incomeLive="dataincomeLive"
          :scheduleClass="info.scheduleClass"
          :status="info.status"
          :matchId="sid"
        >
        </ag-record>

        <!-- 赛况 -->
        <ag-race
          v-if="item.id == 1"
          :tab="tab"
          :incomeLive="dataincomeLive"
          :scheduleClass="info.scheduleClass"
          :matchId="sid"
        ></ag-race>

        <!-- 阵容 -->
        <ag-lineup
          v-if="item.id == 2"
          :matchId="sid"
          :tab="tab"
          :scheduleClass="info.scheduleClass"
          :status="info.status"
          :incomeLive="dataincomeLive"
        ></ag-lineup>

        <!-- 推荐 -->
        <div v-if="item.id == 3" class="__ag__dataliverecd__">
          <div
            class="__ag__dataliverecddiv__"
            v-if="recommedNewList && recommedNewList.length > 0"
          >
            <ag-recommed-new-item
              class="__ag__dataliverecditem__"
              v-for="item in recommedNewList"
              :item="item"
              :key="item.id"
              @jumpRecommed="jumpRecommed"
              :user="a__ag__user__"
            ></ag-recommed-new-item>
          </div>
          <text v-else class="__ag__dataliverecdtext__">暂无数据</text>
        </div>
      </scroller>
    </slider>
  </div>
</template>

<script>
import ipx from "./components/__ag__ipx__.vue"
import incomeLive from "./components/__ag__incomeLive__.vue"
import util from "./components/util.js"
import bc from "./components/__ag__bc__.js"
import sport from "./components/__ag__sport__.js"

import minix from "./components/__ag__minix__.js"
import record from "./components/__ag__record__.vue"
import lineup from "./components/__ag__lineup__.vue"
import race from "./components/__ag__dataRace__.vue"
import agRecommedNewItem from "./components/__ag__recommedNewItem__.vue"
export default {
  mixins: [minix],
  components: {
    "ag-ipx": ipx,
    "ag-incomeLive": incomeLive,
    "ag-record": record,
    "ag-lineup": lineup,
    "ag-recommed-new-item": agRecommedNewItem,
    "ag-race": race,
  },
  data() {
    return {
      info: {},
      tab: 0,
      tabList: [
        { id: 0, name: "战绩" },
        { id: 1, name: "赛况" },
        { id: 2, name: "阵容" },
        { id: 3, name: "推荐" },
      ],
      sid: "",
      dataincomeLive: {},
      a__ag__user__: {},
    }
  },
  computed: {
    recommedNewList() {
      let resp = this.a__ag__pageRecommed__
      if (!resp || !resp.data || !resp.data.list) {
        return []
      }
      let list = resp.data.list
      return list
    },
  },
  methods: {
    onclose() {
      // this.$router.back()
      util.pop()
    },
    async __ag__loadData__() {
      let that = this
      that.a__ag__user__ = util.getItem("user")
      const Steve = new BroadcastChannel("onlogin")
      Steve.onmessage = async function (event) {
        // that.__ag__login__(event.data)
        that.a__ag__user__ = event.data
        if (event.data && event.data.userType < 3) {
          that.__ag__onpageRecommed__()
        }
      }

      let data = util.getUrlParam(weex.config.bundleUrl)
      this.sid = data.id
      let f = {
        scheduleId: data.id,
      }
      try {
        await this.__ag__listMatchScheduleById__(f)
        if (
          this.a__ag__listMatchScheduleById__.data &&
          this.a__ag__listMatchScheduleById__.data.length > 0
        ) {
          this.info = this.a__ag__listMatchScheduleById__.data[0]
          this.dataincomeLive = sport.hasIncomeLive(
            this.a__ag__listMatchScheduleById__.data,
            true
          )
        }
      } catch (error) {}
    },
    async __ag__onpageRecommed__() {
      await this.__ag__pageRecommed__({ scheduleId: this.sid })
    },
    async changeHandler(e) {
      let id = this.tabList[e.index].id
      this.tab = id
      if (id == 3) {
        await this.__ag__onpageRecommed__()
      }
    },
    handleSwipe(e) {
      if (e.direction == "right") {
        if (this.tab == 0) {
          util.pop()
        }
      }
    },
  },
}
</script>

<style lang="less">
@import "./style/theme.less";
.__ag__datalive__ {
  background-color: #ffffff;
}
.__ag__datalivevideo__ {
  width: 750px;
  /* height: 421.875px; */
  /* background-color: #000; */
  position: relative;
}
.__ag__back__ {
  font-size: 25wx;
  margin-right: 15px;
  color: #fff;
  position: absolute;
  top: 15px;
  left: 18px;
}
.__ag__livechathead__ {
  width: 750px;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #f8f8f8;
}
.__ag__livechattab__ {
  flex: 1;
  height: 80px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}
.__ag__livechattabtext__ {
  height: 80px;
  line-height: 80px;
  font-weight: 500;
  font-size: 25px;
  letter-spacing: 0.05em;
  transition: color 0.5s;
  transition: border-bottom-color 0.5s;
  display: flex;
  align-items: center;
  color: #000;
  border-bottom-style: solid;
  border-bottom-color: #f8f8f8;
  border-bottom-width: 3wx;
}
.selected {
  color: @main-color;
  border-bottom-color: @main-color;
}
.__ag__datalivecontent__ {
  flex: 1;
  background-color: #fff;
}
.__ag__datalivechatcontent__ {
  width: 750px;
  flex: 1;
}
.__ag__dataliverecd__ {
  width: 750px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.__ag__dataliverecddiv__ {
  width: 690px;
  margin-left: 30px;
  margin-right: 30px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.__ag__dataliverecdtext__ {
  width: 750px;
  text-align: center;
  padding-top: 30wx;
  padding-bottom: 30wx;
  font-size: 15wx;
  color: rgba(0, 0, 0, 0.3);
}
.__ag__dataliverecditem__ {
  border-style: solid;
  border-width: 1wx;
  border-color: #f2f3f4;
}
.__ag__datalivecontentipx__ {
  padding-bottom: 34px;
}
</style>
