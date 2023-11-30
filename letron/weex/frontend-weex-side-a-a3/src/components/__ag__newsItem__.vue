<template>
  <div class="__ag__newsitem__" @click="__ag__onnewsDetail__(isindex)">
    <div class="__ag__newsitemtitle__">
      <div
        class="__ag__newsmatch__"
        v-if="item.joinMap && item.joinMap.cls && item.joinMap.cls.name"
      >
        <text class="__ag__newsmatchtext__">{{
          item.joinMap && item.joinMap.cls && item.joinMap.cls.name
        }}</text>
      </div>
      <text
        v-if="item.joinMap && item.joinMap.cls && item.joinMap.cls.name"
        class="__ag__newsitemtitletext__"
      >
        {{ item.title }}</text
      >
      <text v-else class="__ag__newsitemtitletext__">{{ item.title }}</text>
    </div>
    <div class="__ag__newsitemdate__">
      <!-- <text class="eurnew-content-date" style="width: 40px;"></text> -->
      <text class="__ag__newsitemtext__">{{
        __ag__formatToDate__(item.addTime)
      }}</text>
    </div>
  </div>
</template>

<script>
import util from "./util.js"
export default {
  name: "ag-newsitem",
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

<style lang="less">
@import "../style/default.less";

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
  height: 85wx;
  padding: 16px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: @border;
  padding-bottom: 10px;
  margin-top: 32px;
}
.__ag__newsitemtitle__ {
  height: 50wx;
  margin-bottom: 10px;
  position: relative;
}
.__ag__newsmatch__ {
  position: absolute;
  top: 0px;
  width: 60px;
  height: 30px;
  background-color: @primary;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__newsmatchtext__ {
  flex: 1;
  lines: 2;
  text-overflow: ellipsis;
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  color: @white;
}
.__ag__newsitemtitletext__ {
  text-indent: 2em;
  font-style: normal;
  font-weight: 500;
  font-size: 15wx;
}
.__ag__newsitemdate__ {
  height: 30wx;
  display: flex;
  flex-direction: row;
}
.__ag__newsitemtext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 13wx;
  line-height: 15wx;
  color: @halfBlack;
  overflow: unset;
}
</style>
