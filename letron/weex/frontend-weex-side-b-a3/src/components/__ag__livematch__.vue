<template>
  <div class="__ag__livematch__" v-if="roomData && roomData.id">
    <div class="__ag__livematchtitle__">
      <text class="__ag__livematchdate__">{{ roomData.beginTime }}</text>
      <text class="__ag__livematchtext__">{{ roomData.matchName }}</text>
    </div>
    <div class="__ag__livematchschedule__">
      <div class="__ag__livescheduleteam__">
        <!-- <image :src="__ag__url__(roomData.teamFlaga)" mode="aspectFill" class="__ag__livescheduleteamimg__"></image> -->
        <team-logo
          teamType="1"
          :teamFlag="roomData.teamFlaga"
          :teamName="roomData.teamNamea"
          resize="medium"
        ></team-logo>
        <text class="__ag__livescheduleteamtext__">{{
          roomData.teamNamea
        }}</text>
      </div>
      <div class="__ag__liveschedulevs__">
        <text class="__ag__liveschedulevstexts__"> {{ roomData.scorea }}</text>
        <text class="__ag__liveschedulevsline__">:</text>
        <text class="__ag__liveschedulevstext__">{{ roomData.scoreb }}</text>
      </div>
      <div class="__ag__livescheduleteam__">
        <!-- <image :src="__ag__url__(roomData.teamFlagb)" mode="aspectFill" class="__ag__livescheduleteamimg__"></image> -->
        <team-logo
          teamType="2"
          :teamFlag="roomData.teamFlagb"
          :teamName="roomData.teamNameb"
          resize="medium"
        ></team-logo>
        <text class="__ag__livescheduleteamtext__">{{
          roomData.teamNameb
        }}</text>
      </div>
    </div>
  </div>
</template>

<script>
import agMinUrl from "./__ag__minurl__.js"
import teamLogo from "./__ag__teamLogo__.vue"
export default {
  components: {
    "team-logo": teamLogo,
  },
  mixins: [agMinUrl],
  props: {
    roomData: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      date: new Date(),
    }
  },
  methods: {},
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__livematch__ {
  padding-top: 10px;
  padding-bottom: 20px;
}
.__ag__livematchtitle__ {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}
.__ag__livematchdate__ {
  font-size: 24px;
  letter-spacing: 2px;
  color: @black;
}
.__ag__livematchtext__ {
  font-size: 24px;
  text-align: right;
  letter-spacing: 2px;
  color: @black;
}
.__ag__livematchschedule__ {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}
.__ag__livescheduleteam__ {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__livescheduleteamimg__ {
  width: 76px;
  height: 76px;
  border-radius: 50%;
}
.__ag__livescheduleteamtext__ {
  margin-top: 28px;
  font-size: 26px;
  line-height: 36px;
  color: @black;
}
.__ag__liveschedulevs__ {
  width: 253.5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.__ag__liveschedulevstext__ {
  font-weight: bold;
  font-size: 48px;
  line-height: 58px;
  color: @black;
  display: flex;
}
.__ag__liveschedulevstexts__ {
  font-weight: bold;
  font-size: 48px;
  line-height: 58px;
  color: @black;
  display: flex;
}
.__ag__liveschedulevsline__ {
  font-weight: bold;
  font-size: 48px;
  line-height: 58px;
  color: @black;
}
</style>
