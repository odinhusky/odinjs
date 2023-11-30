<template>
  <div
    class="__ag__newsitem__"
    @click="__ag__onnewsDetail__(isindex)"
    :class="[
      index == length - 1 ? 'last-news-item' : '',
      !isindex ? '__ag__newsitem-index__' : '',
    ]"
  >
    <div class="__ag__newsitem-rg__">
      <image
        class="new-poster-img"
        resize="cover"
        v-if="item.thumb"
        :src="__ag__url__(item.thumb)"
      />
    </div>
    <div class="__ag__newsitem-lf__">
      <div class="__ag__newsitemtitle__">
        <text class="__ag__newsitemtitletext__">{{ item.title }}</text>
      </div>
      <div class="__ag__newsitemdate__">
        <text
          class="__ag__newstext__"
          v-if="item.joinMap && item.joinMap.cls && item.joinMap.cls.name"
          >{{ item.joinMap && item.joinMap.cls && item.joinMap.cls.name }}</text
        >
        <text class="__ag__newsitemtext__" v-if="item.addTime">{{
          __ag__formatToDate__(item.addTime)
        }}</text>
      </div>
    </div>
  </div>
</template>

<script>
import util from "./util.js"
import agMinUrl from "@/components/__ag__minurl__.js"
export default {
  name: "ag-newsitem",
  mixins: [agMinUrl],
  data() {
    return {
      date: new Date(),
    }
  },
  props: {
    item: {
      type: Object,
      default: {},
    },
    isindex: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
    length: {
      type: Number,
      default: 0,
    },
  },

  methods: {
    __ag__formatToDate__(date) {
      return util.formatToDate(date)
    },
    __ag__onnewsDetail__(isindex) {
      if (this.item.id <= 0) {
        return
      }
      let data = {
        id: this.item.id,
      }
      if (isindex) {
        util.getPush("__ag__newdetails__", data)
        return
      }
      util.getPush("__ag__newdetails__", data)
      // uni.navigateTo({
      // 	url:'/pages/__ag__newsDetail__?id='+this.item.id
      // })
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__text__ {
  overflow: hidden;
  text-overflow: hidden;
}
.__ag__nowrap__ {
  overflow: hidden;
  text-overflow: hidden;
  white-space: nowrap;
  word-break: break-all;
  text-overflow: ellipsis;
}
.__ag__newsitem__ {
  flex: 1;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  background-color: @white;
  box-shadow: 0px 1px 3px @black30;
  border-radius: 8px;
}
.last-news-item {
  border-bottom-width: 0px;
}
.__ag__newsitem-lf__ {
  flex: 1;
  padding: 16px;
}
.__ag__newsitemtitle__ {
  flex: 1;
  height: 40wx;
}
.__ag__newsitemtitletext__ {
  font-style: normal;
  font-weight: 500;
  font-size: 15wx;
  line-height: 20wx;
  color: @black;
  lines: 2;
  text-overflow: ellipsis;
}
.__ag__newsitemdate__ {
  height: 30wx;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
}
.__ag__newstext__ {
  height: 34px;
  line-height: 34px;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;
  border-radius: 24px;
  background-color: @primary;
  color: @white;
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
}
.__ag__newsitemtext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 13wx;
  line-height: 34px;
  color: @black50;
  overflow: unset;
}
.__ag__newsitem-rg__ {
  width: 130wx;
  border-radius: 4wx;
  overflow: hidden;
}
.new-poster-img {
  width: 130wx;
  height: 90wx;
  border-radius: 4wx;
}
</style>
