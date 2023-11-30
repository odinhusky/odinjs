<template>
  <div class="__ag__newdetails__">
    <ag-hbtitle :isback="true"></ag-hbtitle>
    <div class="__ag__newdetails__content__" :class="[ipx ? 'ipx' : '']">
      <scroller class="scroller">
        <div class="newdetails-title-box">
          <text
            class="newdetails-title"
            :class="[!newDetails.thumb ? 'newdetails-text' : '']"
            >{{ newDetails.title }}</text
          >
        </div>
        <div class="__ag__newdetails__top__">
          <image
            resize="contain"
            v-if="newDetails.thumb"
            class="newdetails-image"
            :src="__ag__url__(newDetails.thumb)"
          ></image>
        </div>
        <div class="__ag__newdetails__box__">
          <div class="__ag__box__top__">
            <text
              class="__ag__box__title__"
              v-if="
                newDetails.joinMap &&
                newDetails.joinMap.match &&
                newDetails.joinMap.match.nameAbbr
              "
              >{{ newDetails.joinMap.match.nameAbbr }}</text
            >
            <text class="__ag__box__title__" v-if="newDetails.addTime">{{
              formatToDate(newDetails.addTime)
            }}</text>
          </div>
          <div class="__ag__box__content__">
            <ag-richText :inner="newDetails.content"></ag-richText>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import agMinix from "./components/__ag__minix__.js"
import agMinUrl from "./components/__ag__minurl__.js"
import agUtil from "./components/util.js"
import agRichText from "./components/__ag__richText__.vue"
import hbtitle from "./components/__ag__headTop__.vue"
export default {
  mixins: [agMinix, agMinUrl],
  components: {
    agRichText,
    "ag-hbtitle": hbtitle,
  },
  data() {
    return {
      newDetails: {},
      agUtil,
    }
  },
  methods: {
    formatToDate(date) {
      try {
        if (!date) return ""

        if (typeof date == "string") {
          date = date.replace(/-/g, "/")
        }
        //一小时
        const hour = 3600000
        //一天
        const days = 86400000
        const nowDate = new Date().getTime()
        const addTime = new Date(date).getTime()
        const diffTimeStamp = nowDate - addTime

        let result = ""

        if (diffTimeStamp <= 0) {
          result = "未来时间"
        } else if (diffTimeStamp < hour) {
          //一小时内的
          result = Math.floor(diffTimeStamp / 1000 / 60) + "分钟前"
        } else if (diffTimeStamp < days) {
          result = Math.floor(diffTimeStamp / hour) + "小时前"
        } else {
          result = Math.floor(diffTimeStamp / days) + "天前"
        }
        return result
      } catch (e) {
        console.log("odinTime error=>", JSON.stringify(e))
      }
      // return agUtil.formatToDate(newDate)
    },
    async __ag__loadData__() {
      let data = agUtil.getUrlParam(weex.config.bundleUrl)
      await this.__ag__pageArticleById__(data)
      // agUtil.message(this.a__ag__pageArticleById__)
      this.newDetails = this.a__ag__pageArticleById__.data.list[0]
    },
  },
}
</script>

<style scoped lang="less">
@import "./style/default.less";

.__ag__newdetails__content__ {
  width: @fullWidth;
  position: fixed;
  top: @contentOriginalPositionTop;
  bottom: 0px;
  background-color: @white;
}
.ipx {
  top: @ipxPositionTop;
}
.__ag__newdetails__top__ {
  width: @fullWidth;
  height: 400px;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.newdetails-image {
  width: @fullWidth;
  height: 400px;
}
.newdetails-title-box {
  width: @fullWidth;
  /* position: absolute;
    top: 100px; */
  height: 120px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 32px;
  padding-bottom: 0px;
  padding-top: 0px;
  margin-bottom: 30px;
  margin-top: 30px;
}
.newdetails-title {
  flex: 1;
  lines: 2;
  font-weight: 900;
  font-size: 20wx;
  color: @black;
  text-indent: 1em;
}
.newdetails-text {
  color: @black;
}
.__ag__box__top__ {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}
.__ag__newdetails__box__ {
  padding: 16wx;
  padding-top: 42px;
}
.__ag__box__title__ {
  font-size: 26px;
  color: rgba(0, 0, 0, 0.5);
}
.__ag__box__text__ {
  line-height: 40px;
}
</style>
