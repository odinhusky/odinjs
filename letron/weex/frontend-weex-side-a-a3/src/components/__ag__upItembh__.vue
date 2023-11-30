<template>
  <div
    v-if="item && item.id"
    class="__ag__liveupItem__"
    @click.stop="__ag__onlive__"
  >
    <div class="__ag__liveuptop__">
      <div
        class="__ag__matchupimgdiv__"
        :class="[
          item &&
          item.joinMap &&
          item.joinMap.live &&
          item.joinMap.live.scheduleId
            ? ''
            : '__ag__matchupimgdiv__not_online',
        ]"
      >
        <ag-userimg
          class="__ag__liveupimg__"
          :avatar="item.avatar"
          @islive="__ag__onlive__"
          :uid="item.id"
          :name="item.userNicename"
        ></ag-userimg>
      </div>
      <div
        class="__ag__matchupimglive__"
        v-if="
          item &&
          item.joinMap &&
          item.joinMap.live &&
          item.joinMap.live.scheduleId
        "
      >
        <text class="__ag__matchupimgtext__">直播中</text>
      </div>

      <div class="__ag__matchupimglive__not_online" v-else>
        <text class="__ag__matchupimgtext__not_online">不在家</text>
      </div>
    </div>
    <text class="__ag__liveuptext__">{{ item.userNicename }}</text>
  </div>
</template>

<script>
import agMinix from "./__ag__minix__.js"
import util from "./util.js"
import userImg from "@/components/__ag__userImg__.vue"
export default {
  name: "ag-liveUp",
  mixins: [agMinix],
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
  data() {
    return {}
  },
  computed: {
    score1() {
      return util.numberReadable(this.item.score)
    },
  },
  methods: {
    __ag__onlive__() {
      if (!this.item || !this.item.id) {
        return
      }
      if (
        !(
          this.item &&
          this.item.joinMap &&
          this.item.joinMap.live &&
          this.item.joinMap.live.scheduleId
        )
      ) {
        util.message("主播不在家")
        return
      }
      let uid = this.item.id
      // console.log(uid)
      this.__ag__itemtap__(uid)
      // this.__ag__itemtap__(uid)
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/default.less";
.iconfont {
  font-family: iconfont;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.flexdisplay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text {
  overflow: hidden;
  text-overflow: hidden;
}
.nowrap {
  white-space: nowrap;
  word-break: break-all;
  text-overflow: ellipsis;
}
.__ag__liveupItem__ {
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__liveuptop__ {
  width: 120px;
  position: relative;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.__ag__matchupimgdiv__ {
  width: 120px;
  height: 120px;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-width: 2wx;
  border-color: @primary;
  border-radius: 50wx;
}

.__ag__matchupimgdiv__not_online {
  border-color: @gray3;
}
.__ag__liveupimg__ {
  width: 102px;
  height: 102px;
  border-radius: 50%;
  background-color: @white;
  line-height: 50px;
  font-size: 30px;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
}
.__ag__matchupimglive__ {
  position: absolute;
  bottom: -4px;
  padding: 4px;
  background-color: @white;
  border-radius: 4px;
  padding: 3px;
}
.__ag__matchupimgtext__ {
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 8px;
  font-style: normal;
  font-weight: 500;
  font-size: 8wx;
  color: @white;
  background-color: @primary;
  // background-image: linear-gradient(to right, #fdc401, #f99727);
}

.__ag__matchupimglive__not_online {
  position: absolute;
  bottom: -4px;
  padding: 4px;
  background-color: @gray3;
  border-radius: 4px;
  padding: 3px;
}
.__ag__matchupimgtext__not_online {
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 8px;
  font-style: normal;
  font-weight: 500;
  font-size: 8wx;
  color: @white;
  background-color: @gray3;
  // background-image: linear-gradient(to right, #fdc401, #f99727);
}

.__ag__liveupname__ {
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: 10px;
}
.__ag__liveuptext__ {
  flex: 1;
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  color: @black;
  margin-top: 16px;
  lines: 1;
  text-overflow: ellipsis;
}
</style>
