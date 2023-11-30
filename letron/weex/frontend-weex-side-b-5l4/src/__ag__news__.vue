<template>
  <div class="__ag__news__" :class="[ipx ? 'ipx' : '']" @swipe="handleSwipe">
    <ag-hbtitle :isback="true" title="新闻"></ag-hbtitle>
    <div class="__ag__news-tabs">
      <div
        class="__ag__news-tabs-item__"
        v-for="item in tabList"
        :key="item.id"
        @click="change(item)"
      >
        <text
          class="__ag__tabs-text"
          :class="[tab == item.id ? 'tab-select-text' : '']"
          >{{ item.name }}</text
        >
      </div>
    </div>
    <slider
      class="__ag__slider__"
      interval="10"
      offset-x-accuracy="200"
      auto-play="false"
      infinite="false"
      @change="changeHandler"
      :index="tab"
    >
      <div class="__ag__news-content__" v-for="item in tabList" :key="item.id">
        <scroller class="__ag__uplivecontent__" :show-scrollbar="false">
          <refresh
            class="__ag__refresh__"
            @refresh="onrefresh"
            @pullingdown="onpullingdown"
            :display="a__ag__refreshing__ ? 'show' : 'hide'"
          >
            <loading-indicator class="__ag__loading__"></loading-indicator>
            <text class="__ag__refreshtext__">{{ a__ag__freshText__ }}</text>
          </refresh>
          <div class="__ag__newslist__" v-if="list.length > 0">
            <ag-news-item
              v-for="(item, index) in list"
              :item="item"
              :index="index"
              :length="list.length"
              :isindex="false"
              :key="item.id"
            ></ag-news-item>
          </div>
          <div
            class="__ag__newsnotlist__"
            v-if="list.length <= 0"
            @click="change({ id: 0 })"
          >
            <image class="__ag__liveupnotimg__" :src="__ag__url__(url)"></image>
            <text class="__ag__liveupnottext__">目前没有内容，点我看更多</text>
          </div>
        </scroller>
      </div>
    </slider>
  </div>
</template>

<script>
import agMinix from "./components/__ag__minix__.js"
import hbtitle from "./components/__ag__headTop__.vue"
import newItem from "./components/__ag__newsItem__.vue"
import __ag__util from "./components/util.js"
import module from "./components/__ag__module__.js"
import minurl from "./components/__ag__minurl__.js"

export default {
  mixins: [agMinix, minurl],
  components: {
    "ag-hbtitle": hbtitle,
    "ag-news-item": newItem,
  },
  data() {
    return {
      a__ag__freshText__: "释放更新",
      a__ag__refreshing__: false,
      tabList: [
        { id: 0, name: "全部" },
        { id: 1, name: "篮球" },
        { id: 2, name: "足球" },
        { id: 3, name: "其他" },
      ],
      tab: 0,
      sliderIndex: 0,
      url: "static/frame.png",
    }
  },
  computed: {
    list() {
      if (!this.a__ag__pageArticle__ || !this.a__ag__pageArticle__.data) {
        return {}
      }
      let l = this.a__ag__pageArticle__.data.list
      return l.filter((r) => {
        if (this.tab == 0) {
          return true
        }
        if (this.tab == 1 && r.classId == 4) {
          return true
        }
        if (this.tab == 2 && r.classId == 5) {
          return true
        }
        if (this.tab == 3 && r.classId == 6) {
          return true
        }
        return false
      })
    },
  },
  methods: {
    async __ag__loadData__() {
      await this.__ag__pageArticle__()
    },
    async onrefresh() {
      this.a__ag__refreshing__ = true
      this.a__ag__freshText__ = "加载中..."
      await this.refresh()
      setTimeout(() => {
        this.a__ag__refreshing__ = false
      }, 2000)
    },
    async refresh() {
      return await this.__ag__pageArticle__()
    },
    onpullingdown() {
      this.a__ag__freshText__ = "释放更新"
    },
    change(item) {
      this.tab = item.id
      this.sliderIndex = item.id
    },
    changeHandler(e) {
      this.tab = this.tabList[e.index].id
    },
    handleSwipe(e) {
      if (e.direction == "right") {
        if (this.tab == 0) {
          __ag__util.pop()
        }
      }
    },
  },
}
</script>

<style lang="less">
@import "./style/theme.less";
.__ag__news__ {
  background-color: #f2f3f4;
  width: 750px;
  position: fixed;
  top: 128px;
  bottom: 0px;
}
.ipx {
  top: 166px;
}
.__ag__news-tabs {
  width: 750px;
  height: 45wx;
  display: flex;
  background-color: #f8f8f8;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #f2f3f4;
}
.__ag__news-tabs-item__ {
  height: 45wx;
  line-height: 45wx;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: 10wx;
  padding-right: 10wx;
}
.__ag__tabs-text {
  height: 45wx;
  line-height: 45wx;
  font-style: normal;
  font-weight: normal;
  font-size: 13wx;
  color: #000000;
  border-bottom-style: solid;
  border-bottom-width: 3wx;
  border-bottom-color: #f8f8f8;
}
.tab-select-text {
  border-bottom-style: solid;
  border-bottom-width: 3wx;
  border-bottom-color: @main-color;
  color: @main-color;
}
.__ag__slider__ {
  flex: 1;
  padding-bottom: 170px;
  background-color: #fff;
}
.__ag__news-content__ {
  width: 750px;
  flex: 1;
}
.__ag__uplivecontent__ {
  width: 750px;
}
.__ag__newslist__ {
  background-color: #fff;
}
.__ag__newsnotlist__ {
  background-color: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__liveupnotimg__ {
  width: 100px;
  height: 70px;
}
.__ag__liveupnottext__ {
  margin-top: 20px;
  color: #8c97a5;
  font-style: normal;
  font-weight: normal;
  font-size: 14wx;
}
.__ag__refresh__ {
  width: 750px;
  padding: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.__ag__loading__ {
  color: #000000;
  margin-right: 15wx;
}
</style>
