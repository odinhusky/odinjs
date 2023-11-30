<template>
  <div class="__ag__news__">
    <div class="__ag__uplive_title__" :class="[ipx ? 'title-ipx' : '']">
      <div class="__ag__back__" @click="__ag__onBackPress__">
        <image :src="staticPath('back.png')" class="__ag__back_image__"></image>
      </div>
      <div class="__ag__text__">
        <text class="__ag__titile_text__">每日新闻</text>
      </div>
      <image
        class="__ag__uplive_image__"
        :src="__ag__url__('static/a3/xw.png')"
      />
    </div>

    <scroller
      class="__ag__uplivecontent__"
      :class="[ipx ? 'ipx' : '']"
      :show-scrollbar="false"
    >
      <refresh
        class="__ag__refresh__"
        @refresh="onrefresh"
        @pullingdown="onpullingdown"
        :display="a__ag__refreshing__ ? 'show' : 'hide'"
      >
        <loading-indicator class="__ag__loading__"></loading-indicator>
        <text class="__ag__refreshtext__">{{ a__ag__freshText__ }}</text>
      </refresh>
      <ag-newslist :list="newsArticle"></ag-newslist>
    </scroller>
  </div>
</template>

<script>
import agMinix from "./components/__ag__minix__.js"
import newsList from "./components/__ag__newsList__.vue"
import __ag__util from "./components/util.js"
import agMinUrl from "./components/__ag__minurl__.js"
import __ag__sportApi__ from "./components/__ag__sport_api__.js"

const backHomeBroadcast = new BroadcastChannel("backHomeBroadcast")

export default {
  mixins: [agMinix, agMinUrl],
  components: {
    "ag-newslist": newsList,
  },
  data() {
    return {
      a__ag__isFreshing__: false,
      a__ag__freshing__: false,
      a__ag__triggered__: false,
      a__ag__freshText__: "释放更新",
      a__ag__refreshing__: false,
      paramsDic: {},
      newsArticle: [],
    }
  },
  computed: {
    list() {
      if (!this.a__ag__listUsersLive__ || !this.a__ag__listUsersLive__.data) {
        return []
      }
      let l = this.a__ag__listUsersLive__.data
      if (l && l.length > 3) {
        return l.slice(1, l.length)
      }
      return l
    },
  },
  methods: {
    __ag__onBackPress__() {
      backHomeBroadcast.postMessage({ type: "backHomeTrigger" })
      __ag__util.pop()
    },
    async __ag__loadData__() {
      try {
        await this.getNewsArticle()
      } catch (error) {
        __ag__util.message(error.message)
      }
    },
    async getNewsArticle() {
      try {
        const resp = await __ag__sportApi__.pageArticle()

        if (!this.newsArticle && !this.newsArticle.data) return

        this.newsArticle = resp.data.list
      } catch (error) {
        console.log("getNewsArticle", error.message)
      }
    },
    async onrefresh() {
      this.a__ag__refreshing__ = true
      this.a__ag__freshText__ = "加载中..."
      await this.refresh()
      // setTimeout(()=>{
      this.a__ag__refreshing__ = false
      // },2000)
    },
    async refresh() {
      return await this.__ag__pageArticle__()
    },
    onpullingdown() {
      this.a__ag__freshText__ = "释放更新"
    },
  },
  destroyed() {
    backHomeBroadcast.close()
  },
}
</script>

<style lang="less" scoped>
@import "./style/default.less";
.__ag__news__ {
  background-color: @white;
  width: @fullWidth;
  flex-direction: column;
  align-items: center;
}
.__ag__uplive_title__ {
  width: @fullWidth;
  height: @upliveTitleHeight;
  padding-left: 32px;
  padding-right: 32px;
  background-color: @primary;
  position: relative;
  padding-top: 44px;
  overflow: hidden;
}
.title-ipx {
  padding-top: @titleIpxPaddingTop;
}
.__ag__back__ {
  width: @backImgWidth;
  height: @backImgHeight;
  margin-top: 20px;
}
.__ag__back_image__ {
  width: 24px;
  height: 45px;
}
.__ag__text__ {
  flex: 1;
  justify-content: center;
  padding-bottom: 20px;
}
.__ag__titile_text__ {
  font-style: normal;
  font-weight: 500;
  font-size: 24wx;
  color: @white;
  padding-left: 16px;
}
.__ag__uplive_image__ {
  width: 208px;
  height: 212px;
  position: absolute;
  right: 78px;
  bottom: 0px;
}
.__ag__uplivecontent__ {
  width: @fullWidth;
  padding: 32px;
  padding-bottom: 0;
  padding-top: 16px;
  position: fixed;
  top: 320px;
  bottom: 0px;
  flex-direction: column;
  align-items: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: @white;
}
.ipx {
  bottom: 0px;
  padding-bottom: 34px;
}
.__ag__refresh__ {
  padding: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__loading__ {
  color: @black;
  margin-right: 20wx;
}
</style>
