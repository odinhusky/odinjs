<template>
  <div class="__ag__basketball__main__">
    <div class="__basketball_top__">
      <text class="__ball_text__ __ball_team_name__">球队</text>
      <text class="__ball_text__">Q1</text>
      <text class="__ball_text__">Q2</text>
      <text class="__ball_text__">Q3</text>
      <text class="__ball_text__">Q4</text>
      <text class="__ball_text__">总分</text>
    </div>
    <div class="__basketball_content__" v-if="scoreList && scoreList.length">
      <div
        class="__ball_item__"
        v-for="(item, index) in list"
        :key="'p' + index"
      >
        <div class="__ball_item_team__" v-if="index == 0">
          <div class="__team_flaga___">
            <!-- <image class="__flaga_image__" v-if="incomeLive && incomeLive.teamFlaga" :src="__ag__url__(incomeLive.teamFlaga)" resize="contain"></image>
                        <text v-else class="__flaga_text">{{ incomeLive && incomeLive.teamNamea && incomeLive.teamNamea.charAt(0)}}</text> -->
            <team-logo
              teamType="1"
              :teamFlag="incomeLive.teamFlaga"
              :teamName="incomeLive.teamNamea"
            ></team-logo>
          </div>
          <text class="__tema_name__">{{ incomeLive.teamNamea }}</text>
        </div>
        <div class="__ball_item_team__" v-if="index == 1">
          <div class="__team_flaga___">
            <!-- <image class="__flaga_image__" v-if="incomeLive && incomeLive.teamFlagb" :src="__ag__url__(incomeLive.teamFlagb)" resize="contain"></image>
                        <text v-else class="__flaga_text">{{ incomeLive && incomeLive.teamNameb && incomeLive.teamNameb.charAt(0)}}</text> -->
            <team-logo
              teamType="2"
              :teamFlag="incomeLive.teamFlagb"
              :teamName="incomeLive.teamNameb"
            ></team-logo>
          </div>
          <text class="__tema_name__">{{ incomeLive.teamNameb }}</text>
        </div>
        <text class="__team_text__">{{ item.q1 }}</text>
        <text class="__team_text__">{{ item.q2 }}</text>
        <text class="__team_text__">{{ item.q3 }}</text>
        <text class="__team_text__">{{ item.q4 }}</text>
        <text class="__team_text__ __team_score__">{{ item.score }}</text>
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
    scoreList: {
      type: Array,
      default: function () {
        return []
      },
    },
    incomeLive: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      list: [],
    }
  },
  watch: {
    scoreList(l) {
      this.list = l
    },
  },
  mounted() {
    this.list = this.scoreList
  },
}
</script>
<style scoped lang="less">
@import "../style/theme.less";
.__ag__basketball__main__ {
  width: 750px;
}
.__basketball_top__ {
  width: 750px;
  height: 36wx;
  flex-direction: row;
  align-items: center;
  padding-left: 10wx;
  padding-right: 10wx;
  border-bottom-style: solid;
  border-bottom-width: 1wx;
  border-bottom-color: @black50;
}
.__ball_text__ {
  flex: 0.4;
  font-style: normal;
  font-weight: 700;
  font-size: 13wx;
  display: flex;
  align-items: center;
  color: @blue4;
  text-align: center;
}
.__ball_team_name__ {
  flex: 1;
  text-align: left;
  padding-left: 18wx;
}
.__basketball_content__ {
  width: 750px;
  padding-left: 10wx;
  padding-right: 10wx;
}
.__ball_item__ {
  flex: 1;
  height: 36wx;
  flex-direction: row;
  align-items: center;
  border-bottom-style: solid;
  border-bottom-width: 1wx;
  border-bottom-color: @black10;
}
.__ball_item_team__ {
  flex: 1;
  flex-direction: row;
  align-items: center;
}
.__team_flaga___ {
  width: 47px;
  height: 47px;
}
.__flaga_image__ {
  width: 21wx;
  height: 21wx;
  border-radius: 50wx;
}
.__flaga_text {
  width: 21wx;
  height: 21wx;
  border-radius: 50wx;
  font-size: 12wx;
  background-color: @gray5;
  text-align: center;
  line-height: 21wx;
}
.__tema_name__ {
  flex: 1;
  lines: 1;
  text-overflow: ellipsis;
  margin-left: 5wx;
  font-style: normal;
  font-weight: 400;
  font-size: 13wx;
  color: @black;
}
.__team_text__ {
  flex: 0.4;
  font-style: normal;
  font-weight: 400;
  font-size: 14wx;
  color: @black;
  text-align: center;
}
.__team_score__ {
  color: @green4;
}
</style>
