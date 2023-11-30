<template>
  <div
    class="daily-container"
    :class="[complete == 1 ? 'task-com' : '']"
    @click="signClick"
  >
    <text class="draw-num" :class="[complete == 1 ? 'text-com' : '']"
      >+{{ times }}</text
    >
    <image
      :src="__ag__url__(logo)"
      class="gold-pic"
      :class="[complete == 1 ? 'completed' : '']"
    />
    <text class="draw-day" :class="[complete == 1 ? 'text-com' : '']">{{
      today == 1 && complete == 0
        ? "签到"
        : today == 1 && complete == 1
        ? "已签"
        : day
    }}</text>
  </div>
</template>

<script>
import agMinUrl from "./__ag__minurl__.js"

export default {
  name: "dailyTask",
  mixins: [agMinUrl],
  props: {
    logo: {
      type: String,
      default: "",
    },
    times: {
      type: Number,
      default: 0,
    },
    complete: {
      type: Number,
      default: 0,
    },
    day: "",
    today: {
      type: Number,
      default: 0,
    },
    // user:{},
  },
  created() {},
  data() {
    return {
      signObj: { today: this.today, complete: this.complete },
    }
  },
  methods: {
    signClick() {
      this.$emit("clickSign", this.signObj)
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";

.daily-container {
  width: 82px;
  height: 152px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: 6px;
  background-color: @gray12;
}
.task-com {
  background-color: @orange1;
}

.draw-num {
  color: @gray13;
  font-family: "PingFang HK";
  font-style: normal;
  font-weight: 400;
  font-size: 8wx;
  line-height: 11wx;
}
.gold-pic {
  width: 56px;
  height: 56px;
}
.draw-day {
  font-size: 8wx;
  color: @red3;
}
.completed {
  opacity: 0.4;
}
.text-com {
  color: @red4;
}
</style>
