<template>
  <div class="__ag__match-screen__">
    <div class="__ag__screen-date__">
      <text class="__ag__screen-date-text__" v-if="day">{{ day }}</text>
      <text class="__ag__screen-date-text__">{{ date }}</text>
      <text class="__ag__screen-date-text__">{{ week }}</text>
    </div>
    <div class="__ag__screen-content__">
      <div
        class="__ag__screen-body__"
        :class="[screen == 0 ? '__ag__select__' : '']"
        @click="onscreen(0)"
      >
        <text
          class="__ag__screen-body-text__"
          :class="[screen == 0 ? '__ag__select-status__' : '']"
          >赛事</text
        >
      </div>
      <div
        class="__ag__screen-body__"
        :class="[screen == 1 ? '__ag__select__' : '']"
        @click="onscreen(1)"
      >
        <text
          class="__ag__screen-body-text__"
          :class="[screen == 1 ? '__ag__select-status__' : '']"
          >赛果</text
        >
      </div>
    </div>
  </div>
</template>

<script>
import a__ag__util__ from "./util.js"
export default {
  name: "ag-matchScreen",
  props: {
    screen: {
      type: Number,
      default: 0,
    },
    datetime: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      a__ag__util__,
    }
  },
  computed: {
    day() {
      try {
        let date = a__ag__util__.formatDate(this.datetime)
        let newDate = a__ag__util__.formatDateTime(new Date())
        if (a__ag__util__.formatDate(newDate) == date) {
          return "今天"
        }
      } catch (e) {
        console.error("scheduleList", e)
      }
      return ""
    },
    date() {
      return a__ag__util__.formatDate(this.datetime, "MM月dd日")
    },
    week() {
      return a__ag__util__.formatWeeks(this.datetime)
    },
  },
  methods: {
    onscreen(ty) {
      this.$emit("onscreen", ty)
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/default.less";
.__ag__match-screen__ {
  width: 750px;
  padding-left: 16wx;
  padding-right: 16wx;
  height: 40wx;
  background-color: @primaryLighterSolid;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.__ag__screen-content__ {
  display: flex;
  flex-direction: row;
}
.__ag__screen-date__ {
  display: flex;
  flex-direction: row;
}
.__ag__screen-body__ {
  width: 41wx;
  height: 25wx;
  border-style: solid;
  border-width: 1px;
  border-color: @primary;
  box-sizing: border-box;
  border-radius: 4px;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: 5wx;
  margin-right: 5wx;
}
.__ag__select__ {
  background-color: @primary;
}
.__ag__screen-body-text__ {
  font-size: 15wx;
  color: @primary;
}
.__ag__select-status__ {
  color: @white;
}
.__ag__screen-date-text__ {
  font-size: 15wx;
  color: @primaryDark;
  margin-right: 8px;
  font-weight: 600;
}
</style>
