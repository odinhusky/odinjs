<template>
  <div
    v-if="item && item.id"
    class="__ag__liveupItem__"
    @click.stop="__ag__onlive__"
  >
    <div class="__ag__liveuptop__">
      <ag-userimg
        class="__ag__liveupimg__"
        :avatar="item.avatar"
        @islive="__ag__onlive__"
        :uid="item.id"
        :name="item.userNicename"
      ></ag-userimg>
    </div>
    <div class="__ag__liveupname__">
      <text class="__ag__liveuptext__">{{ item.userNicename }}</text>
    </div>
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
  width: 60wx;
  height: 79wx;
  margin-bottom: 5px;
}
.__ag__liveuptop__ {
  width: 60wx;
  height: 60wx;
  border-radius: 30wx;
  border-style: solid;
  border-width: 2px;
  border-color: #00c452;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.__ag__liveupimg__ {
  width: 52wx;
  height: 52wx;
  border-radius: 50%;
  background-color: @white;
  line-height: 50px;
  font-size: 30px;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
}
.__ag__liveupname__ {
  width: 65wx;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  lines: 1;
  margin-top: 10px;
}
.__ag__liveuptext__ {
  lines: 1;
  text-overflow: ellipsis;
  width: 65wx;
  height: 26px;
  font-style: normal;
  font-weight: normal;
  font-size: 11wx;
  color: @black;
  text-align: center;
}
</style>
