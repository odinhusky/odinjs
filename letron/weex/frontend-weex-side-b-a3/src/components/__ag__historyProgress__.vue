<template>
  <div class="__ag__historyprogress__">
    <div class="__ag__progressteama__" :style="{ flex: win1 }">
      <text class="__ag__progresstext__">{{ win.win }}胜</text>
    </div>
    <div class="__ag__progressteamp__" :style="{ flex: ping1 }">
      <text class="__ag__progresstext__">{{ win.ping }}平</text>
    </div>
    <div class="__ag__progressteamb__" :style="{ flex: fu1 }">
      <text class="__ag__progresstext__">{{ win.fu }}胜</text>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    win: {
      type: Object,
      default: function () {
        return {
          win: 0,
          ping: 0,
          fu: 0,
          awin: 0,
          bwin: 0,
          afu: 0,
          bfu: 0,
          sl: 0,
          ping6: 0,
          win6: 0,
          fu6: 0,
          jq: 0,
          sq: 0,
        }
      },
    },
  },
  computed: {
    total() {
      return this.win.ping + this.win.win + this.win.fu
    },
    win1() {
      if (!this.total) {
        return 1
      }
      return this.win.win
    },
    ping1() {
      if (!this.total) {
        return 1
      }
      return this.win.ping
    },
    fu1() {
      if (!this.total) {
        return 1
      }
      return this.win.fu
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__historyprogress__ {
  width: 750px;
  height: 124px;
  padding-left: 19px;
  padding-right: 19px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__progressteama__ {
  flex: 1;
  height: 60px;
  background-color: @primary;
  // border-radius: 20px 0px 0px 20px;
  border-top-left-radius: 20wx;
  border-bottom-left-radius: 20wx;
  margin-right: 4px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__progresstext__ {
  flex: 1;
  height: 60px;
  font-style: normal;
  font-weight: 400;
  font-size: 14wx;
  color: @white;
  line-height: 60px;
}
.__ag__progressteamb__ {
  flex: 1;
  height: 60px;
  background-color: @yellow3;
  // border-radius: 20px 0px 0px 20px;
  border-top-right-radius: 20wx;
  border-bottom-right-radius: 20wx;
  margin-left: 4px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__progressteamp__ {
  flex: 1;
  height: 60px;
  background-color: @blue4;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
