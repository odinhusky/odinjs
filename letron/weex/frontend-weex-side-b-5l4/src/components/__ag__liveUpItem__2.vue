<template>
  <div v-if="item1 && item1.id" class="__ag__liveupitem__">
    <div class="__ag__liveupitemimgview__">
      <image
        v-if="
          item1 &&
          item1.joinMap &&
          item1.joinMap.room &&
          item1.joinMap.room.thumb
        "
        :src="__ag__url__(item1.joinMap.room.thumb)"
        mode="aspectFill"
        class="__ag__liveupitemimg__"
      ></image>
      <image
        v-else-if="item1.thumb"
        @load="imgError"
        :src="__ag__url__(item1.thumb)"
        mode="aspectFill"
        class="__ag__liveupitemimg__"
      ></image>
      <image v-else mode="aspectFill" class="__ag__liveupitemimg__"></image>
      <div
        class="__ag__liveupitemmatch__"
        v-if="
          item1.joinMap && item1.joinMap.match && item1.joinMap.match.nameAbbr
        "
      >
        <text class="__ag__liveupitemtext__">{{
          item1.joinMap && item1.joinMap.match && item1.joinMap.match.nameAbbr
        }}</text>
      </div>
    </div>
    <div class="__ag__liveupitemcontent__">
      <div class="__ag__liveupitemup__">
        <ag-userimg
          class="__ag__liveupitemupimg__"
          :avatar="item1.avatar"
          :uid="item1.id"
          :name="item1.upName"
        ></ag-userimg>
        <div class="__ag__liveupitemupview__">
          <text class="__ag__liveupitemuptext__">{{ item1.upName }}</text>
        </div>
      </div>
      <div class="__ag__liveupitemtitle__">
        <text class="__ag__liveupitemtitletext__">{{ item1.title }}</text>
      </div>
      <div class="__ag__liveupitembottom__">
        <text class="agiconfont __ag__fire__">&#xe6a5;</text>
        <!-- <image src="../static/__ag__fire__.png" mode="aspectFit" class="__ag__fire__"></image> -->
        <text class="__ag__liveupitembottomtext__">{{
          item1.joinMap && item1.joinMap.room && item1.joinMap.room.amount
        }}</text>
      </div>
    </div>
  </div>
</template>

<script>
import agMinix from "./__ag__minix__.js"
import agMinUrl from "./__ag__minurl__.js"
import __ag__env from "./env.js"
import userImg from "./__ag__userImg__.vue"
export default {
  name: "ag-liveUpitem",
  components: {
    "ag-userimg": userImg,
  },
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  mixins: [agMinix, agMinUrl],
  data() {
    return {
      item1: {},
      __ag__env,
      download: __ag__env.download,
    }
  },
  watch: {
    item(n) {
      this.item1 = n
    },
  },
  mounted() {
    this.item1 = this.item
  },
  methods: {
    imgError(event) {
      if (!event.success) {
        this.item1.thumb = null
      }
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__liveupitem__ {
  flex-direction: row;
  height: 189px;
  margin-bottom: 16px;
}
.__ag__liveupitem__:last-child {
  margin-bottom: 0px;
}
.__ag__liveupitemimgview__ {
  width: 310px;
  height: 189px;
  /* border-radius: 16px; */
  position: relative;
  margin-right: 32px;
}
.__ag__liveupitemimg__ {
  height: 189px;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: #e2e5ea;
}
.__ag__liveupitemmatch__ {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  /* border-radius: 0px 0px 4px 4px; */
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  /* width: 70px; */
  height: 40px;
  top: 0px;
  right: 16px;
  text-align: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
}
.__ag__liveupitemtext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  color: #ffffff;
  overflow: auto;
}
.__ag__liveupitemcontent__ {
  flex-direction: column;
  width: 390px;
  height: 189px;
}
.__ag__liveupitemup__ {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 48px;
  margin-bottom: 16px;
}
.__ag__liveupitemupimg__ {
  width: 48px;
  height: 48px;
  margin-right: 8px;
}
.__ag__liveupitemupview__ {
  width: calc(100% - 8px - 24px);
  overflow: hidden;
  text-overflow: hidden;
  white-space: nowrap;
  word-break: break-all;
  text-overflow: ellipsis;
}
.__ag__liveupitemuptext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: rgba(0, 0, 0, 0.5);
}
.__ag__liveupitemtitle__ {
  width: 360px;
  height: 84px;
  margin-bottom: 14px;
}
.__ag__liveupitemtitletext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  letter-spacing: 0.02em;
  color: #000000;
  margin-right: 8px;
  lines: 2;
}
.__ag__liveupitembottom__ {
  height: 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.__ag__fire__ {
  color: #ffa001;
  width: 30px;
  height: 30px;
  font-size: 25px;
}
.__ag__liveupitembottomtext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: rgba(0, 0, 0, 0.5);
}
</style>
